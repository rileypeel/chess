# Generated by Django 3.0.8 on 2020-09-26 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0032_auto_20200926_1744'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='time',
            field=models.DecimalField(decimal_places=2, default=180.0, max_digits=6),
        ),
    ]
