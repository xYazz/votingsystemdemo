# Generated by Django 4.0.1 on 2022-05-12 10:56

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('sitting', '0002_remove_answer_question_answer_question'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
