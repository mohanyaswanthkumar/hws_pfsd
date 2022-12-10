from django.contrib import admin

from .models import userdetails,Appointments,Prescriptions

admin.site.register(userdetails)
admin.site.register(Appointments)
admin.site.register(Prescriptions)