# Generated by Django 5.0.4 on 2024-04-06 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name_plural': 'Categories'},
        ),
        migrations.AddField(
            model_name='transaction',
            name='invoice',
            field=models.FileField(blank=True, null=True, upload_to='invoices/'),
        ),
    ]
