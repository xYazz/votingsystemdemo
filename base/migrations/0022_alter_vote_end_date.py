# Generated by Django 4.0.1 on 2022-05-23 14:05

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0021_alter_vote_end_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vote',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime(2022, 5, 24, 14, 5, 44, 38264)),
        ),
    ]
