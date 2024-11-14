# Generated by Django 5.0.6 on 2024-11-13 16:35

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feedbacks', '0009_alter_feedback_e_signature'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PrivateKeyPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feedback', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feedbacks.feedback')),
                ('granted_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='permissions_granted', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('feedback', 'user')},
            },
        ),
    ]
