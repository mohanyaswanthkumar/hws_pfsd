from django.urls import path
from . import views

urlpatterns = [
    # User Endpoints
    path('users/', views.user_list, name='user_list'),
    path('users/<int:pk>/', views.user_detail, name='user_detail'),
    path('users/<int:pk>/update_profile/', views.user_update_profile, name='user_update_profile'),
    
    # Hospital Endpoints
    path('hospitals/', views.hospital_list, name='hospital_list'),
    path('hospitals/create/', views.hospital_create, name='hospital_create'),
    path('hospitals/<int:pk>/', views.hospital_detail, name='hospital_detail'),
    
    # Doctor Endpoints
    path('doctors/', views.doctor_list, name='doctor_list'),
    path('doctors/create/', views.doctor_create, name='doctor_create'),
    path('doctors/<int:pk>/', views.doctor_detail, name='doctor_detail'),
    
    # Appointment Endpoints
    path('appointments/', views.appointment_list, name='appointment_list'),
    path('appointments/create/', views.appointment_create, name='appointment_create'),
    path('appointments/<int:pk>/', views.appointment_detail, name='appointment_detail'),
    
    # Prescription Endpoints
    path('prescriptions/', views.prescription_list, name='prescription_list'),
    path('prescriptions/create/', views.prescription_create, name='prescription_create'),
    path('prescriptions/<int:pk>/', views.prescription_detail, name='prescription_detail'),
    
    # Health Record Endpoints
    path('health-records/', views.health_record_list, name='health_record_list'),
    path('health-records/create/', views.health_record_create, name='health_record_create'),
    path('health-records/<int:pk>/', views.health_record_detail, name='health_record_detail'),
    
    # Leave Endpoints
    path('leaves/', views.leave_list, name='leave_list'),
    path('leaves/create/', views.leave_create, name='leave_create'),
    path('leaves/<int:pk>/', views.leave_detail, name='leave_detail'),
]