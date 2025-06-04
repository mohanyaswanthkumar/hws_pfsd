from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import User, Hospital, Doctor, Appointment, Prescription, HealthRecord, Leave
from .serializers import UserSerializer, HospitalSerializer, DoctorSerializer, AppointmentSerializer, PrescriptionSerializer, HealthRecordSerializer, LeaveSerializer
from .permissions import IsPatient, IsDoctor, IsAdmin, IsPatientOrDoctor,IsDoctorOrAdmin
from rest_framework.permissions import IsAuthenticated
from django.http import Http404
from math import radians, sin, cos, sqrt, atan2
from authentication.models import User
from authentication.serializers import RegisterSerializer
# User Views
@api_view(['GET'])
@permission_classes([IsAdmin])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Allow authenticated users to view their own details
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id != user.id and request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def user_update_profile(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id != user.id and request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Hospital Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Allow patients and doctors to list hospitals
def hospital_list(request):
    latitude = request.query_params.get('latitude')
    longitude = request.query_params.get('longitude')
    if latitude and longitude:
        R = 6371  # Earth's radius in km
        lat1, lon1 = float(latitude), float(longitude)
        hospitals = Hospital.objects.all()
        nearby = []
        for hospital in hospitals:
            lat2, lon2 = hospital.latitude, hospital.longitude
            dlat = radians(lat2 - lat1)
            dlon = radians(lon2 - lon1)
            a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
            c = 2 * atan2(sqrt(a), sqrt(1-a))
            distance = R * c
            if distance <= 10:  # 10km radius
                nearby.append(hospital)
        serializer = HospitalSerializer(nearby, many=True)
    else:
        serializer = HospitalSerializer(Hospital.objects.all(), many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdmin])
def hospital_create(request):
    serializer = HospitalSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdmin])
def hospital_detail(request, pk):
    try:
        hospital = Hospital.objects.get(pk=pk)
    except Hospital.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        print("GET method"+hospital)
        serializer = HospitalSerializer(hospital)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = HospitalSerializer(hospital, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        hospital.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Doctor Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Fixed: Use only IsPatientOrDoctor
def doctor_list(request):
    serializer = DoctorSerializer(Doctor.objects.all(), many=True)
    return Response(serializer.data)


import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAdmin])
def doctor_create(request):
    logger.info(f"Received doctor create request: {request.data}")
    # Extract user data from request
    user_data = request.data.get('user')
    if not user_data:
        logger.error("Missing 'user' field in request data")
        return Response({"user": ["This field is required"]}, status=status.HTTP_400_BAD_REQUEST)
    # Create user using RegisterSerializer
    user_serializer = RegisterSerializer(data=user_data)
    if not user_serializer.is_valid():
        logger.error(f"User creation failed: {user_serializer.errors}")
        return Response({"user": user_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    user = user_serializer.save()
    # Prepare data for DoctorSerializer
    doctor_data = {
        "user_id": user.id,
        "hospital_id": request.data.get("hospital_id"),
        "specialization": request.data.get("specialization"),
        "qualifications": request.data.get("qualifications"),
        "experience": request.data.get("experience")
    }
    # Create doctor using DoctorSerializer
    serializer = DoctorSerializer(data=doctor_data)
    if serializer.is_valid():
        serializer.save()
        logger.info(f"Doctor created successfully: {serializer.data}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    logger.error(f"Doctor creation failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def doctor_detail(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        logger.error(f"Doctor with pk={pk} not found")
        return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = DoctorSerializer(doctor)
        logger.info(f"Retrieved doctor {pk}: {serializer.data}")
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        if not request.user.role == 'admin':
            logger.warning(f"Unauthorized PUT attempt by user {request.user.id}")
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        logger.info(f"Received PUT request for doctor {pk}: {request.data}")
        
        # Handle nested user data
        user_data = request.data.get('user')
        user_id = request.data.get('user_id')
        
        if user_data:
            # Check if user exists or create new
            email = user_data.get('email')
            username = user_data.get('username')
            existing_user = User.objects.filter(email=email).first() if email else None
            
            if existing_user:
                # Update existing user
                user_serializer = RegisterSerializer(existing_user, data=user_data, partial=True)
            else:
                # Create new user (requires password)
                if not user_data.get('password'):
                    logger.error("Password missing for new user creation")
                    return Response({"user": {"password": ["This field is required for new user"]}}, 
                                  status=status.HTTP_400_BAD_REQUEST)
                user_serializer = RegisterSerializer(data=user_data)
            
            if not user_serializer.is_valid():
                logger.error(f"User validation failed: {user_serializer.errors}")
                return Response({"user": user_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
            user = user_serializer.save()
            user_id = user.id
        elif not user_id:
            logger.error("Neither user data nor user_id provided")
            return Response({"error": "Either user data or user_id must be provided"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Prepare doctor data with default availability if not provided
        doctor_data = {
            "user_id": user_id,
            "hospital_id": request.data.get("hospital_id"),
            "specialization": request.data.get("specialization"),
            "qualifications": request.data.get("qualifications"),
            "experience": request.data.get("experience"),
            "availability": request.data.get("availability", {})  # Default to empty dict
        }
        
        serializer = DoctorSerializer(doctor, data=doctor_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Doctor {pk} updated successfully: {serializer.data}")
            return Response(serializer.data)
        
        logger.error(f"Doctor update failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if not request.user.role == 'admin':
            logger.warning(f"Unauthorized DELETE attempt by user {request.user.id}")
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        doctor.delete()
        logger.info(f"Doctor {pk} deleted successfully")
        return Response(status=status.HTTP_204_NO_CONTENT)

# Appointment Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def appointment_list(request):
    if request.user.role == 'patient':
        appointments = Appointment.objects.filter(patient=request.user)
    elif request.user.role == 'doctor':
        appointments = Appointment.objects.filter(doctor__user=request.user)
    else:  # admin
        appointments = Appointment.objects.all()
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsPatient])
def appointment_create(request):
    data = request.data.copy()
    data['patient_id'] = request.user.id
    print(data)
    try:
        doctor = Doctor.objects.get(id=data['doctor_id'])
        data['hospital_id'] = doctor.hospital.id
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def appointment_detail(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.user.role == 'patient' and appointment.patient != request.user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    if request.user.role == 'doctor' and appointment.doctor.user != request.user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Prescription Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def prescription_list(request):
    if request.user.role == 'patient':
        prescriptions = Prescription.objects.filter(appointment__patient=request.user)
    elif request.user.role == 'doctor':
        prescriptions = Prescription.objects.filter(appointment__doctor__user=request.user)
    else:  # admin
        prescriptions = Prescription.objects.all()
    serializer = PrescriptionSerializer(prescriptions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsDoctor])
def prescription_create(request):
    serializer = PrescriptionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def prescription_detail(request, pk):
    try:
        prescription = Prescription.objects.get(pk=pk)
    except Prescription.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.user.role == 'patient' and prescription.appointment.patient != request.user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    if request.user.role == 'doctor' and prescription.appointment.doctor.user != request.user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = PrescriptionSerializer(prescription)
        return Response(serializer.data)
    
    elif request.method == 'PUT' and request.user.role == 'doctor':
        serializer = PrescriptionSerializer(prescription, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE' and request.user.role == 'doctor':
        prescription.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Health Record Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_record_list(request):
    if request.user.role == 'patient':
        records = HealthRecord.objects.filter(patient=request.user)
    elif request.user.role == 'doctor':
        records = HealthRecord.objects.filter(appointment__doctor__user=request.user)
    else:  # admin
        records = HealthRecord.objects.all()
    serializer = HealthRecordSerializer(records, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsDoctor])
def health_record_create(request):
    serializer = HealthRecordSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def health_record_detail(request, pk):
    try:
        record = HealthRecord.objects.get(pk=pk)
    except HealthRecord.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.user.role == 'patient' and record.patient != request.user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    if request.user.role == 'doctor' and record.appointment.doctor.user != request.user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = HealthRecordSerializer(record)
        return Response(serializer.data)
    
    elif request.method == 'PUT' and request.user.role == 'doctor':
        serializer = HealthRecordSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE' and request.user.role == 'doctor':
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Leave Views
@api_view(['GET'])
@permission_classes([IsDoctorOrAdmin])
def leave_list(request):
    if request.user.role == 'doctor':
        leaves = Leave.objects.filter(doctor__user=request.user)
    else:  # admin
        leaves = Leave.objects.all()
    serializer = LeaveSerializer(leaves, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsDoctor])
def leave_create(request):
    data = request.data.copy()
    print(data)
    try:
        doctor = Doctor.objects.get(user=request.user)
        print(doctor.user.email)
        data['doctor_id'] = doctor.id
        data['role']=doctor.user.role
        data['doctor']=doctor
        data['admin_id']=5
        admin=User.objects.get(role="admin")
        data['admin']=admin
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor profile not found'}, status=status.HTTP_400_BAD_REQUEST)
    serializer = LeaveSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsDoctorOrAdmin])
def leave_detail(request, pk):
    try:
        leave = Leave.objects.get(pk=pk)
    except Leave.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.user.role == 'doctor' and leave.doctor.user != request.user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = LeaveSerializer(leave)
        return Response(serializer.data)
    
    elif request.method == 'PUT' and request.user.role == 'admin':
        data = request.data.copy()
        data['admin'] = request.user.id
        serializer = LeaveSerializer(leave, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE' and request.user.role == 'admin':
        leave.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)