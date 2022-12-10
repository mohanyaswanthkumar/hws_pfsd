from django.urls import path
from .import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('',views.loginpage,name="loginpage"),
    path('signuppage',views.signuppage,name="signuppage"),
    path('homepage',views.homepage,name="homepage"),
    path('logout',views.logout,name='logout'),
    path('profile',views.profile,name='profile'),
    path('appointments',views.appointments,name='appointments'),
    path('contactus',views.contactus,name='contactus'),
    path('prescriptions',views.prescriptions,name='prescriptions'),
    path('updatepro/<int:id>',views.updatepro,name="updatepro"),
path('myappointments',views.myappointments,name='myappointments'),
path('patientprescriptions/<int:id>',views.patientprescriptions,name='patientprescriptions'),
]
if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)