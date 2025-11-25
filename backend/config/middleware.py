"""
Custom middleware for handling CSRF exemptions
"""

class DisableCSRFMiddleware:
    """
    Middleware to disable CSRF check for specific endpoints
    """
    def __init__(self, get_response):
        self.get_response = get_response
        # Endpoints that should be exempt from CSRF
        self.exempt_paths = [
            '/api/auth/register/',
            '/api/auth/login/',
        ]

    def __call__(self, request):
        # Check if the request path should be exempt from CSRF
        if any(request.path.startswith(path) for path in self.exempt_paths):
            setattr(request, '_dont_enforce_csrf_checks', True)
        
        response = self.get_response(request)
        return response
