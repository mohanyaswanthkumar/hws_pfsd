from django.contrib import *
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import *
from django.contrib.auth import *
from django.contrib.auth.models import *
from . import models
from .models import *
import os
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt,csrf_protect,requires_csrf_token
from .views import *
from django.http import *

def loginpage(request):
    if request.method=='POST':
        name=request.POST.get('fullname')
        pasw=request.POST.get('pass')
        user = auth.authenticate(username=name,password=pasw)
        if user is not None:
            auth.login(request,user)
        #v = userdetails.objects.get(fullname=request.user)
        #if pasw==v.passw:
            print('success')
            y='Hello '+name
            print(request.user.id)
            return render(request,'homepage.html',{'x':y})
        else:
            return render(request,'loginpage.html',"invalid credentials--")
    else:
        return render(request,'loginpage.html')

def signuppage(request):
    if request.method=="POST":
        username=request.POST.get('fullname')
        age=request.POST.get('age')
        mail=request.POST.get('mail')
        pass1=request.POST.get('pass')
        pass2=request.POST.get('paas')
        newuser=userdetails(fullname=username,age=age,mail=mail,passw=pass1)
        user=User.objects.create_user(username,mail,pass1)
        newuser.save()
        user.save()
        messages.success(request,"your account is created")
        return redirect('loginpage')

    return render(request,'Register.html')

@login_required(login_url='loginpage')
def logout(request):
    content={'user':request.user}
    return render(request,'loginpage.html',content)

@login_required(login_url='loginpage')
def homepage(request):
    return render(request,'homepage.html')

@login_required(login_url='loginpage')
def appointments(request):
    if request.method=="POST":
        #name=request.POST.get('pname')
        obj1 = userdetails.objects.get(fullname=request.user)
        con = {'name': obj1.fullname, 'mobile': obj1.mobile, 'mail': obj1.mail}
        gender=request.POST.get('gender')
        #mobile=request.POST.get('pmob')
        prob=request.POST.get('prob')
        #addr=request.POST.get('address')
        #email=request.POST.get('email')
        date=request.POST.get('time')
        status='pending'
        patient=Appointments(name=obj1.fullname,gender=gender,mobile=obj1.mobile,mail=obj1.mail,problem=prob,address=obj1.addr,doa=date,status=status)
        patient.save()
        print(patient.name)
        return render(request,'appointments.html',con)
    else:
        obj=Appointments.objects.filter(name=request.user)
        obj1=userdetails.objects.get(fullname=request.user)
        #con = {'name': obj1.name, 'mobile': obj1.mobile, 'mail': obj1.mail}
        x={'obj':obj,'obj1':obj1}
        return render(request,'appointments.html',x)

@login_required(login_url='loginpage')
def contactus(request):
    return render(request,'contactus.html')

@login_required(login_url='loginpage')
def profile(request):
    obj=userdetails.objects.get(fullname=request.user)
    x={'id':obj.id,'name':obj.fullname,'mail':obj.mail,'age':obj.age,'image':obj.img,'mob':obj.mobile,'addr':obj.addr,'insta':obj.insta,'fb':obj.fb}
    return render(request,'profile.html',x)

@login_required(login_url='loginpage')
def updatepro(request,id):
    if request.method=="POST":
        #print(id)
        obj=userdetails.objects.get(pk=id)
        fullname=request.POST.get('fullname')
        age=request.POST.get('age')
        mail=request.POST.get('mail')
        mob=request.POST.get('mob')
        addr=request.POST.get('addr')
        imag=request.POST.get('img')
        insta = request.POST.get('insta')
        fb = request.POST.get('fb')
        obj=userdetails.objects.filter(id=id).update(fullname=fullname,age=age,mail=mail,img=imag,mobile=mob,addr=addr,insta=insta,fb=fb)
        return render(request,'profile.html')
    else:
        obj = userdetails.objects.get(fullname=request.user)
        x = {'id':obj.id,'name': obj.fullname, 'mail': obj.mail, 'age': obj.age, 'image': obj.img,'pass':obj.passw,'mob':obj.mobile,'addr':obj.addr,'insta':obj.insta,'fb':obj.fb}
        return render(request,'updatepro.html',x)

@login_required(login_url='loginpage')
def prescriptions(request):
    obj=Prescriptions.objects.filter(patientname=request.user)
    x={'obj':obj}
    return render(request,'prescriptions.html',x)

def myappointments(request):
    obj=Appointments.objects.all()
    con={'obj':obj}
    return render(request,'myappointments.html',con)

def patientprescriptions(request,id):
    if request.method=='POST':
        name=request.POST.get('name')
        prob=request.POST.get('prob')
        pres=request.POST.get('pres')
        obj=Prescriptions(patientname=name,prob=prob,pres=pres)
        obj.save()
        return render(request,'myappointments.html')
    else:
        obj1=Appointments.objects.get(pk=id)
        obj1.status="Approved"
        obj1.save()
        print(obj1.status)
        con={'name':obj1.name,'prob':obj1.problem}
        return render(request,'patientprescriptions.html',con)