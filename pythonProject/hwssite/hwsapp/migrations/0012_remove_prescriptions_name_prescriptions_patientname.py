# Generated by Django 4.1.2 on 2022-12-03 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hwsapp', '0011_appointments_status_alter_prescriptions_pres_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='prescriptions',
            name='name',
        ),
        migrations.AddField(
            model_name='prescriptions',
            name='patientname',
            field=models.CharField(max_length=60, null=True),
        ),
    ]
