# Generated by Django 4.0.1 on 2022-05-20 12:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sitting', '0005_rename_type_room_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='current_question',
            field=models.IntegerField(default=0),
        ),
    ]
