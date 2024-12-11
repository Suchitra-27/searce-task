from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from .models import User

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None  # No authentication header, let DRF handle

        token = auth_header.split(' ')[1]
        try:
            validated_token = AccessToken(token)
            user_id = validated_token['user_id']  # Adjust key based on your token payload
            user = User.objects.get(id=user_id)
        except Exception as e:
            raise AuthenticationFailed('Invalid or expired token')

        return (user, None)
