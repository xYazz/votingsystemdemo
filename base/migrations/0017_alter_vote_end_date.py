# Generated by Django 4.0.1 on 2022-05-12 10:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0016_alter_vote_end_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vote',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime(2022, 5, 13, 10, 57, 1, 501143)),
        ),
    ]