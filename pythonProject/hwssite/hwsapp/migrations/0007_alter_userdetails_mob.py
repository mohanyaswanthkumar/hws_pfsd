# Generated by Django 4.1.2 on 2022-12-03 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hwsapp', '0006_alter_userdetails_mob'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdetails',
            name='mob',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
