"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def api_root(request):
    """Root endpoint to verify API is running"""
    return JsonResponse({
        'message': 'Ananthom Backend API',
        'status': 'running',
        'endpoints': {
            'auth': '/api/auth/',
            'admin': '/admin/',
        }
    })

def api_info(request):
    """API information endpoint"""
    return JsonResponse({
        'message': 'Ananthom API',
        'version': '1.0',
        'available_endpoints': {
            'auth': {
                'csrf': '/api/auth/csrf/',
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
                'check': '/api/auth/check/',
                'profile': '/api/auth/profile/',
                'profile_update': '/api/auth/profile/update/',
                'subscriptions': '/api/auth/subscriptions/',
                'create_subscription': '/api/auth/subscriptions/create/',
                'create_payment_order': '/api/auth/payment/create-order/',
                'verify_payment': '/api/auth/payment/verify/',
            }
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', api_info, name='api-info'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
]
