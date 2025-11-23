from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings
from datetime import datetime, timedelta
import razorpay
import hmac
import hashlib
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    UserProfileSerializer, SubscriptionSerializer
)
from .models import UserProfile, Subscription


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_view(request):
    """
    Get CSRF token
    """
    return Response({'csrfToken': get_token(request)})


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Create user profile
        UserProfile.objects.create(user=user)
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login user
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            profile, created = UserProfile.objects.get_or_create(user=user)
            has_address = bool(profile.address_line1 and profile.city and profile.postal_code)
            
            return Response({
                'user': UserSerializer(user).data,
                'hasAddress': has_address,
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout user
    """
    logout(request)
    return Response({
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    Get current user profile
    """
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    return Response({
        'user': UserSerializer(request.user).data,
        'profile': UserProfileSerializer(profile).data
    }, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    """
    Update user profile and address
    """
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'profile': serializer.data,
            'message': 'Profile updated successfully'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth_view(request):
    """
    Check if user is authenticated
    """
    if request.user.is_authenticated:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        has_address = bool(profile.address_line1 and profile.city and profile.postal_code)
        
        return Response({
            'isAuthenticated': True,
            'user': UserSerializer(request.user).data,
            'hasAddress': has_address
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'isAuthenticated': False,
            'hasAddress': False
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subscription_view(request):
    """
    Create a new subscription
    """
    duration_input = request.data.get('duration', '').strip()
    
    # Map duration from months to internal format
    duration_map = {
        '1': '1_month',
        '3': '3_months',
        '6': '6_months',
        '9': '9_months',
        '12': '12_months',
    }
    
    duration = duration_map.get(duration_input)
    
    # Pricing logic
    pricing = {
        '1_month': 1800,
        '3_months': 5130,  # 5% discount
        '6_months': 9720,  # 10% discount
        '9_months': 13770, # 15% discount
        '12_months': 17280, # 20% discount
    }
    
    # Duration in days
    duration_days = {
        '1_month': 30,
        '3_months': 90,
        '6_months': 180,
        '9_months': 270,
        '12_months': 365,
    }
    
    if not duration or duration not in pricing:
        return Response({
            'error': 'Invalid duration. Please choose 1, 3, 6, 9, or 12 months.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user has address
    profile = UserProfile.objects.get(user=request.user)
    if not (profile.address_line1 and profile.city and profile.postal_code):
        return Response({
            'error': 'Please add your address before subscribing'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create subscription
    end_date = datetime.now() + timedelta(days=duration_days[duration])
    
    subscription = Subscription.objects.create(
        user=request.user,
        duration=duration,
        price=pricing[duration],
        end_date=end_date
    )
    
    return Response({
        'subscription': SubscriptionSerializer(subscription).data,
        'message': 'Subscription created successfully'
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_subscriptions_view(request):
    """
    Get user's subscriptions
    """
    subscriptions = Subscription.objects.filter(user=request.user)
    return Response({
        'subscriptions': SubscriptionSerializer(subscriptions, many=True).data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    """
    Create Razorpay order for subscription payment
    """
    duration_input = request.data.get('duration', '').strip()
    
    # Map duration from months to internal format
    duration_map = {
        '1': '1_month',
        '3': '3_months',
        '6': '6_months',
        '9': '9_months',
        '12': '12_months',
    }
    
    duration = duration_map.get(duration_input)
    
    # Pricing logic
    pricing = {
        '1_month': 1800,
        '3_months': 5130,
        '6_months': 9720,
        '9_months': 13770,
        '12_months': 17280,
    }
    
    if not duration or duration not in pricing:
        return Response({
            'error': 'Invalid duration'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user has address
    profile = UserProfile.objects.get(user=request.user)
    if not (profile.address_line1 and profile.city and profile.postal_code):
        return Response({
            'error': 'Please add your address before subscribing'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Initialize Razorpay client
        razorpay_key = getattr(settings, 'RAZORPAY_KEY_ID', '')
        razorpay_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')
        
        if not razorpay_key or not razorpay_secret:
            return Response({
                'error': 'Payment gateway not configured'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
        
        # Create order
        amount = pricing[duration] * 100  # Convert to paise
        order_data = {
            'amount': amount,
            'currency': 'INR',
            'payment_capture': 1
        }
        
        order = client.order.create(data=order_data)
        
        return Response({
            'order_id': order['id'],
            'amount': amount,
            'currency': 'INR',
            'razorpay_key': razorpay_key,
            'user_name': request.user.username,
            'user_email': request.user.email,
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to create order: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Verify Razorpay payment and create subscription
    """
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')
    duration_input = request.data.get('duration', '').strip()
    
    # Map duration
    duration_map = {
        '1': '1_month',
        '3': '3_months',
        '6': '6_months',
        '9': '9_months',
        '12': '12_months',
    }
    
    duration = duration_map.get(duration_input)
    
    if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, duration]):
        return Response({
            'error': 'Missing payment details'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify signature
        razorpay_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')
        
        generated_signature = hmac.new(
            razorpay_secret.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != razorpay_signature:
            return Response({
                'error': 'Invalid payment signature'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Payment verified, create subscription
        pricing = {
            '1_month': 1800,
            '3_months': 5130,
            '6_months': 9720,
            '9_months': 13770,
            '12_months': 17280,
        }
        
        duration_days = {
            '1_month': 30,
            '3_months': 90,
            '6_months': 180,
            '9_months': 270,
            '12_months': 365,
        }
        
        end_date = datetime.now() + timedelta(days=duration_days[duration])
        
        subscription = Subscription.objects.create(
            user=request.user,
            duration=duration,
            price=pricing[duration],
            end_date=end_date
        )
        
        return Response({
            'subscription': SubscriptionSerializer(subscription).data,
            'message': 'Payment verified and subscription created successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Payment verification failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({
        'subscriptions': SubscriptionSerializer(subscriptions, many=True).data
    }, status=status.HTTP_200_OK)
