# Generated by Django 4.1.2 on 2022-12-03 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hwsapp', '0009_remove_userdetails_mobile'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdetails',
            name='mobile',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='prescriptions',
            name='name',
            field=models.CharField(max_length=60),
        ),
        migrations.AlterField(
            model_name='prescriptions',
            name='pres',
            field=models.CharField(max_length=60),
        ),
        migrations.AlterField(
            model_name='prescriptions',
            name='pro',
            field=models.CharField(max_length=60),
        ),
    ]
