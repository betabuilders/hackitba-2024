from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.forms.models import model_to_dict
# User model
from django.contrib.auth.models import User

import json

# Create your views here.

@require_http_methods(['POST'])
def login(request):
    # print(request.POST.dict())
    # data = json.loads(request.body)
    # print(data)

    email = request.POST.get('email')
    password = request.POST.get('password')

    print(email, password)

    user = User.objects.filter(email=email).first()
    if user is None:
        return JsonResponse({'message': 'Invalid credentials :('}, status=401)
    member = user.member_of.all().first()
    user_dict = model_to_dict(user)
    del user_dict['username']
    del user_dict['password']
    del user_dict['last_login']
    del user_dict['is_superuser']
    del user_dict['is_staff']
    del user_dict['is_active']
    del user_dict['date_joined']
    del user_dict['groups']
    del user_dict['user_permissions']

    if member:
        member = model_to_dict(member)
        user_dict['id'] = member['id']
        user_dict['role'] = member['role']
        user_dict['organization'] = member['organization']
        user_dict['avatar'] = member['avatar']

    if user and user.check_password(password):
        return JsonResponse({'message': 'Login successful', 'member':
            user_dict}, status=200)
    return JsonResponse({'message': 'Invalid credentials :('}, status=401)
