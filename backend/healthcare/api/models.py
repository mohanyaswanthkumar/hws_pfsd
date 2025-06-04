from django.db import models
from authentication.models import User
from django.core.mail import send_mail

class Hospital(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    contact = models.CharField(max_length=15)

    def __str__(self):
        return self.name

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=50)
    qualifications = models.TextField()
    experience = models.IntegerField()
    availability = models.JSONField(default=dict)  # e.g., {"2025-05-27": ["09:00", "10:00"]}

    def __str__(self):
        return f"{self.user.username} - {self.specialization}"

class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, default='booked')

    def __str__(self):
        return f"{self.patient.username} with {self.doctor.user.username} on {self.date}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        send_mail(
            'Appointment Confirmation',
            f'Your appointment with {self.doctor.user.username} on {self.date} at {self.time} is confirmed.',
            'from@example.com',
            [self.patient.email],
            fail_silently=True,
        )

class Prescription(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    medication = models.TextField()
    dosage = models.CharField(max_length=100)
    instructions = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription for {self.appointment.patient.username}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        send_mail(
            'New Prescription',
            f'A new prescription has been issued for your appointment on {self.appointment.date}.',
            'from@example.com',
            [self.appointment.patient.email],
            fail_silently=True,
        )

class HealthRecord(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    diagnosis = models.TextField()
    treatment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Record for {self.patient.username}"

class Leave(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, default='pending')
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='admin_leaves')

    def __str__(self):
        return f"Leave for {self.doctor.user.username} from {self.start_date}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.status in ['approved', 'rejected']:
            send_mail(
                f'Leave Request {self.status.capitalize()}',
                f'Your leave request from {self.start_date} to {self.end_date} has been {self.status}.',
                'from@example.com',
                [self.doctor.user.email],
                fail_silently=True,
            )