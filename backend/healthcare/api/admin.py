from django.contrib import admin
from .models import Hospital, Doctor, Appointment, Prescription, HealthRecord, Leave

admin.site.register(Hospital)
admin.site.register(Doctor)
admin.site.register(Appointment)
admin.site.register(Prescription)
admin.site.register(HealthRecord)
admin.site.register(Leave)