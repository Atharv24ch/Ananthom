from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.csrf_view, name='csrf'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.user_profile_view, name='profile'),
    path('profile/update/', views.update_profile_view, name='update-profile'),
    path('check/', views.check_auth_view, name='check-auth'),
    path('subscriptions/', views.user_subscriptions_view, name='user-subscriptions'),
    path('subscriptions/create/', views.create_subscription_view, name='create-subscription'),
    path('payment/create-order/', views.create_payment_order, name='create-payment-order'),
    path('payment/verify/', views.verify_payment, name='verify-payment'),
]
