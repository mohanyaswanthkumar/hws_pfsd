from rest_framework import serializers
from .models import User, Hospital, Doctor, Appointment, Prescription, HealthRecord, Leave

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'address', 'profile_photo']

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    hospital = HospitalSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='doctor'), source='user', write_only=True)
    hospital_id = serializers.PrimaryKeyRelatedField(queryset=Hospital.objects.all(), source='hospital', write_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'user_id', 'hospital', 'hospital_id', 'specialization', 'qualifications', 'experience', 'availability']

class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    hospital = HospitalSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='patient'), source='patient', write_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), source='doctor', write_only=True)
    hospital_id = serializers.PrimaryKeyRelatedField(queryset=Hospital.objects.all(), source='hospital', write_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'patient_id', 'doctor', 'doctor_id', 'hospital', 'hospital_id', 'date', 'time', 'status']

class PrescriptionSerializer(serializers.ModelSerializer):
    appointment = AppointmentSerializer(read_only=True)
    appointment_id = serializers.PrimaryKeyRelatedField(queryset=Appointment.objects.all(), source='appointment', write_only=True)

    class Meta:
        model = Prescription
        fields = ['id', 'appointment', 'appointment_id', 'medication', 'dosage', 'instructions', 'created_at']

class HealthRecordSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    appointment = AppointmentSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='patient'), source='patient', write_only=True)
    appointment_id = serializers.PrimaryKeyRelatedField(queryset=Appointment.objects.all(), source='appointment', write_only=True)

    class Meta:
        model = HealthRecord
        fields = ['id', 'patient', 'patient_id', 'appointment', 'appointment_id', 'diagnosis', 'treatment', 'created_at']

class LeaveSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    admin = UserSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), source='doctor', write_only=True)
    admin_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='admin'), source='admin', write_only=True, allow_null=True)

    class Meta:
        model = Leave
        fields = ['id', 'doctor', 'doctor_id', 'start_date', 'end_date', 'reason', 'status', 'admin', 'admin_id']