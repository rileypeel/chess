# Generated by Django 3.0.8 on 2020-09-01 00:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_auto_20200831_2225'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gameinvite',
            name='game_url',
        ),
        migrations.AddField(
            model_name='user',
            name='channel_name',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
