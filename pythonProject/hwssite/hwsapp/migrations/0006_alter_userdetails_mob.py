# Generated by Django 4.1.2 on 2022-12-03 09:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hwsapp', '0005_prescriptions_name_prescriptions_pro_userdetails_mob_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdetails',
            name='mob',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]