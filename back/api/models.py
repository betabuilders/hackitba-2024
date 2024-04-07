from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Member(models.Model):
    user = models.ForeignKey(User, related_name='member_of', on_delete=models.CASCADE)
    role = models.CharField(max_length=100) # ? Deberia ser un choice? Una tabla aparte?
    organization = models.ForeignKey('Organization', related_name='members', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    avatar = models.CharField(max_length=100, default='avatar-default.jpg')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username  


class Organization(models.Model):
    name = models.CharField(max_length=100, default='Organization')
    # owner = models.OneToOneField('User', related_name='organization')m
    description = models.TextField(default='', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Expense(models.Model):
    title = models.CharField(max_length=100, default='Expense', unique=True)
    description = models.TextField(default='', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organization = models.ForeignKey('Organization', related_name='expenses', on_delete=models.CASCADE)
    members = models.ManyToManyField('Member', related_name='expenses')
    categories = models.ManyToManyField('Category', related_name='expenses')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
    
    def get_amount(self):
        return self.amount_in_cents / 100
    
class Supplier(models.Model):
    name = models.CharField(max_length=100, default='Supplier')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organization = models.ForeignKey('Organization', related_name='suppliers', on_delete=models.CASCADE)
    cbu = models.CharField(max_length=22, default='0000000000000000000000', unique=True)
    cuit = models.CharField(max_length=11, default='00000000000', unique=True)
    categories = models.ManyToManyField('Category', related_name='suppliers')
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100, default='Category', unique=True)
    description = models.TextField(default='', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organization = models.ForeignKey('Organization', related_name='categories', on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"
    
class Transaction(models.Model):

    STATES = (
        ('A', 'Approved'),
        ('R', 'Rejected'),
    )
    
    description = models.TextField(default='Generic Transaction', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # No se puede borrar nada de una transacción, solo se puede rechazar
    member = models.ForeignKey('Member', related_name='transactions', on_delete=models.PROTECT)
    expense = models.ForeignKey('Expense', related_name='transactions', on_delete=models.PROTECT, blank=True, null=True)
    supplier = models.ForeignKey('Supplier', related_name='transactions', on_delete=models.PROTECT, blank=True, null=True)
    organization = models.ForeignKey('Organization', related_name='transactions', on_delete=models.CASCADE)
    amount_in_cents = models.IntegerField(default=0) # Monto de la transacción en centavos
    balance_in_cents = models.IntegerField(default=0) # Balance de la cuenta después de la transacción
    invoice = models.FileField(upload_to='invoices/', blank=True, null=True)
    status = models.CharField(max_length=1, choices=STATES, default='A')


    def __str__(self):
        return str(self.get_balance()) + ' - ' + self.description

    def get_amount(self):
        return self.amount_in_cents / 100
    
    def get_balance(self):
        return self.balance_in_cents / 100
    
    def get_state(self):
        return self.state

# Se pueden crear Expenses que son virtuales, es decir, no se realizan en el banco
class AssignedFunds(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    member = models.ForeignKey('Member', related_name='assigned_funds', on_delete=models.PROTECT) # miembro que asigna el fondo (jefe)
    expense = models.ForeignKey('Expense', related_name='assigned_funds',on_delete=models.PROTECT, blank=True, null=True)
     # a qué expensa se asigna el fondo
    organization = models.ForeignKey('Organization', related_name='assignedFunds', on_delete=models.CASCADE)
    amount_in_cents = models.IntegerField(default=0) # Monto de la transacción en centavos
    balance_in_cents = models.IntegerField(default=0) # Balance de la cuenta después de la transacción
    expense_balance_in_cents = models.IntegerField(default=0) # el balance de la expensa a la que pertenece la asignación

    def __str__(self):
        return self.organization.name + ' - ' + str(self.get_amount())
    
    def get_amount(self):
        return self.amount_in_cents / 100
    
class BankAccount(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    account_id = models.CharField(max_length=22, default='0000000000000000000000')
    organization = models.OneToOneField('Organization', related_name='bank_account', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.organization.name + ' - ' + self.account_id

