# Generated by Django 4.0.1 on 2022-05-20 12:22

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0019_alter_vote_end_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vote',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime(2022, 5, 21, 12, 22, 53, 250494)),
        ),
    ]
