from django.db import models
import datetime

class userdetails(models.Model):
    fullname=models.CharField(max_length=50)
    age=models.IntegerField(default=None)
    mail=models.EmailField(max_length=40)
    passw=models.CharField(max_length=30)
    img=models.ImageField(default='avatar.png',null=True,blank=True,upload_to='static')
    mobile=models.IntegerField(default=00000000000,null=True,blank=True)
    addr=models.CharField(max_length=30,null=True,blank=True)
    insta=models.EmailField(max_length=40)
    fb=models.EmailField(max_length=40)

class Meta:
    db_table = "userdetails"

class Appointments(models.Model):
    name=models.CharField(max_length=50,null=True,blank=True)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    mail=models.EmailField(max_length=60)
    mobile=models.BigIntegerField()
    address=models.CharField(max_length=80)
    doa=models.DateTimeField()
    problem = models.CharField(max_length=200)
    status=models.CharField(default='pending',max_length=20)


class Prescriptions(models.Model):
    patientname=models.CharField(max_length=50,null=True)
    prob=models.CharField(max_length=60,null=True)
    pres=models.CharField(max_length=60,null=True)