# Generated by Django 4.1.2 on 2022-12-01 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hwsapp', '0003_appointments_userdetails_img_delete_profile'),
    ]

    operations = [
        migrations.CreateModel(
            name='Prescriptions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pres', models.CharField(max_length=60)),
            ],
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='img',
            field=models.ImageField(blank=True, default='static/yash.jpg', null=True, upload_to=''),
        ),
    ]
