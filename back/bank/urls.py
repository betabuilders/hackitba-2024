from django.urls import path

from . import views

urlpatterns = [
    path('new_account/', views.new_account, name='new_account'),
    path('transfer/', views.transfer, name='transfer'),
    path('account_info/', views.account_info, name='account_info'),
] 