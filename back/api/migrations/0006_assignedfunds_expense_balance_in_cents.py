# Generated by Django 5.0.4 on 2024-04-06 19:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_transaction_expense_alter_transaction_supplier'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignedfunds',
            name='expense_balance_in_cents',
            field=models.IntegerField(default=0),
        ),
    ]
