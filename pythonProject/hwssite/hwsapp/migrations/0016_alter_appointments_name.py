# Generated by Django 4.1.2 on 2022-12-03 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hwsapp', '0015_alter_prescriptions_patientname'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointments',
            name='name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]