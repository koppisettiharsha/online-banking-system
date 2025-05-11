from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import CustomUser, Role, UserProfile
from ..permissions import IsAdminUser, IsStaffUser, IsOwnerOrAdmin

class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        # Required fields - only basic information
        required_fields = {
            'username': request.data.get('username'),
            'email': request.data.get('email'),
            'password': request.data.get('password')
        }

        # Check for missing required fields
        missing_fields = [field for field, value in required_fields.items() if not value]
        if missing_fields:
            return Response({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if username or email already exists
        if CustomUser.objects.filter(username=required_fields['username']).exists():
            return Response({
                'error': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=required_fields['email']).exists():
            return Response({
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create user with only basic information
        user = CustomUser.objects.create_user(
            username=required_fields['username'],
            email=required_fields['email'],
            password=required_fields['password'],
            role=Role.objects.get_or_create(name=Role.USER)[0]  # Default to regular user
        )

        # Create basic user profile
        UserProfile.objects.create(user=user)

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': 'customer'  # All new registrations are customers
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, IsOwnerOrAdmin)

    def get(self, request, *args, **kwargs):
        user = request.user
        profile = user.profile
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.name if user.role else None,
            'user_type': 'admin' if user.is_admin else 'staff' if user.is_staff_member else 'customer',
            'profile': {
                'bio': profile.bio,
                'profile_picture': profile.profile_picture.url if profile.profile_picture else None
            }
        })

    def put(self, request, *args, **kwargs):
        user = request.user
        profile = user.profile
        data = request.data

        # Update user fields
        if 'email' in data and data['email'] != user.email:
            if CustomUser.objects.filter(email=data['email']).exists():
                return Response({
                    'error': 'Email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            user.email = data['email']

        for field in ['first_name', 'last_name', 'phone_number', 'address', 'date_of_birth']:
            if field in data:
                setattr(user, field, data[field])

        user.save()

        # Update profile fields
        if 'bio' in data:
            profile.bio = data['bio']
        if 'profile_picture' in data:
            profile.profile_picture = data['profile_picture']
        profile.save()

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.name if user.role else None,
            'user_type': 'admin' if user.is_admin else 'staff' if user.is_staff_member else 'customer',
            'profile': {
                'bio': profile.bio,
                'profile_picture': profile.profile_picture.url if profile.profile_picture else None
            }
        })

class UserListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdminUser)
    queryset = CustomUser.objects.all()

    def get(self, request, *args, **kwargs):
        users = self.get_queryset()
        return Response([{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.name if user.role else None,
            'user_type': 'admin' if user.is_admin else 'staff' if user.is_staff_member else 'customer',
            'is_active': user.is_active,
            'created_at': user.created_at
        } for user in users])

class StaffListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdminUser)
    
    def get_queryset(self):
        return CustomUser.objects.filter(role__name__in=[Role.ADMIN, Role.STAFF])

    def get(self, request, *args, **kwargs):
        users = self.get_queryset()
        return Response([{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.name if user.role else None,
            'user_type': 'admin' if user.is_admin else 'staff',
            'is_active': user.is_active,
            'created_at': user.created_at
        } for user in users])

class CustomerListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsStaffUser)
    
    def get_queryset(self):
        return CustomUser.objects.filter(role__name=Role.USER)

    def get(self, request, *args, **kwargs):
        users = self.get_queryset()
        return Response([{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_active': user.is_active,
            'created_at': user.created_at
        } for user in users]) 