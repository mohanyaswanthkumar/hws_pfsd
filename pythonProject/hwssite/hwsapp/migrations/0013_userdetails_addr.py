# Generated by Django 4.1.2 on 2022-12-03 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hwsapp', '0012_remove_prescriptions_name_prescriptions_patientname'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdetails',
            name='addr',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]
