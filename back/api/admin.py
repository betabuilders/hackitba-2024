from django.contrib import admin
from .models import Member, Organization, Expense, Supplier, Category, Transaction, AssignedFunds, BankAccount

# Register your models here.
admin.site.register(Member)
admin.site.register(Organization)
admin.site.register(Expense)
admin.site.register(Supplier)
admin.site.register(Category)
admin.site.register(Transaction)
admin.site.register(AssignedFunds)
admin.site.register(BankAccount)