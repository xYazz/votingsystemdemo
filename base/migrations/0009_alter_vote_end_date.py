# Generated by Django 4.0.1 on 2022-05-07 04:08

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_alter_vote_end_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vote',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime(2022, 5, 8, 4, 8, 5, 962792)),
        ),
    ]