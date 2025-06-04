from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer,UserProfileSerializer
from django.contrib.auth import authenticate
import jwt
import datetime
from api.models import Doctor
from api.serializers import DoctorSerializer
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    print(request.data)
    print("register section")
    if serializer.is_valid():
        user=serializer.save()
        send_mail(
            subject='Welcome to Healthcare System',
            message=f"Hi {request.data.username}, thank you for registering with us!",
            from_email="bitramohanyaswanthkumar@gmail.com",
            recipient_list=[request.data.email],
            fail_silently=False,
        )
        print(user.username,user.email)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            refresh = RefreshToken.for_user(user)
            send_mail(
                subject='Login Notification',
                message=f"Hi {user.username}, you have successfully logged in.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': user.role
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user

    if request.method == 'GET':
        # If the user is a doctor, return extended info
        if user.role == 'doctor':
            try:
                doctor = Doctor.objects.get(user=user)
                serializer = DoctorSerializer(doctor)
                logger.info(f"Retrieved doctor profile for user {user.id}: {serializer.data}")
                return Response(serializer.data)
            except Doctor.DoesNotExist:
                logger.error(f"Doctor profile not found for user {user.id}")
                return Response({"detail": "Doctor profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # For admin or other roles, return basic user profile
        serializer = UserProfileSerializer(user)
        logger.info(f"Retrieved user profile for user {user.id} (role: {user.role}): {serializer.data}")
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        logger.info(f"Received PUT request for profile update by user {user.id} (role: {user.role}): {request.data}")

        # Handle user data update
        user_data = request.data.get('user', request.data)  # Support nested or flat user data
        
        # Prevent role changes
        if 'role' in user_data and user_data['role'] != user.role:
            logger.error(f"User {user.id} attempted to change role from {user.role} to {user_data['role']}")
            return Response({"user": {"role": ["Role cannot be changed"]}}, status=status.HTTP_400_BAD_REQUEST)

        user_serializer = UserProfileSerializer(user, data=user_data, partial=True)
        
        if not user_serializer.is_valid():
            logger.error(f"User profile update failed for user {user.id}: {user_serializer.errors}")
            return Response({"user": user_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        user_serializer.save()
        send_mail(
        subject='Profile Updated Successfully',
        message=f"Hi {request.user.username}, your profile was successfully updated.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[request.user.email],
        fail_silently=False,
                )


        # If user is a doctor, update doctor-specific fields
        if user.role == 'doctor':
            try:
                doctor = Doctor.objects.get(user=user)
                doctor_data = {
                    "user_id": user.id,
                    "hospital_id": request.data.get("hospital_id", doctor.hospital.id),
                    "specialization": request.data.get("specialization", doctor.specialization),
                    "qualifications": request.data.get("qualifications", doctor.qualifications),
                    "experience": request.data.get("experience", doctor.experience),
                    "availability": request.data.get("availability", doctor.availability or {})
                }
                doctor_serializer = DoctorSerializer(doctor, data=doctor_data, partial=True)
                
                if not doctor_serializer.is_valid():
                    logger.error(f"Doctor profile update failed for user {user.id}: {doctor_serializer.errors}")
                    return Response({"doctor": doctor_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                
                doctor_serializer.save()
                logger.info(f"Doctor profile updated for user {user.id}: {doctor_serializer.data}")
                return Response(doctor_serializer.data)
            
            except Doctor.DoesNotExist:
                logger.error(f"Doctor profile not found for user {user.id} during update")
                return Response({"detail": "Doctor profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # For admin or other roles, return updated user profile
        logger.info(f"User profile updated for user {user.id} (role: {user.role}): {user_serializer.data}")
        return Response(user_serializer.data)