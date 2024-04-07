# urls.py

from django.contrib import admin
from django.urls import path
from django.http import HttpResponse

from .views import OrganizationView, MemberView, ExpenseView, SupplierView, CategoryView, TransactionView, AssignedFundsView, BankAccountView


urlpatterns = [
    path('', lambda request: HttpResponse('Hello, world!')),
    path('organizations/', OrganizationView.as_view(), name='organizations'),
    path('organizations/<int:id>/', OrganizationView.as_view(), name='organization'),
    path('members/', MemberView.as_view(), name='members'),
    path('members/<int:id>/', MemberView.as_view(), name='member'),
    path('expenses/', ExpenseView.as_view(), name='expenses'),
    path('expenses/<int:id>/', ExpenseView.as_view(), name='expense'),
    path('suppliers/', SupplierView.as_view(), name='suppliers'),
    path('suppliers/<int:id>/', SupplierView.as_view(), name='supplier'),
    path('categories/', CategoryView.as_view(), name='categories'),
    path('categories/<int:id>/', CategoryView.as_view(), name='category'),
    path('transactions/', TransactionView.as_view(), name='transactions'),
    path('transactions/<int:id>/', TransactionView.as_view(), name='transaction'),
    path('assignedfunds/', AssignedFundsView.as_view(), name='assignedfunds'),
    path('assignedfunds/<int:id>/', AssignedFundsView.as_view(), name='assignedfund'),
    path('bankaccounts/', BankAccountView.as_view(), name='bankaccounts'),
    path('bankaccounts/<int:id>/', BankAccountView.as_view(), name='bankaccount'),
]
