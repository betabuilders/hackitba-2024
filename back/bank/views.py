from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

import random
# Create your views here.
def new_account(request):
    # Create new account in database...
    new_account_id = random.randint(1000000000, 9999999999)
    return JsonResponse({'status': 'ok', 'account_id': new_account_id}, status=201)

@require_http_methods(['POST'])
def transfer(request):
    data = request.POST
    amount = data.get('amount')
    account_id = data.get('account_id')
    account_to = data.get('account_to')
    account = get_account_info(account_to)
    # Transfer amount from account_id to account_to...    

    print(f'>>>Transferring ${amount} from #{account_id} to #{account_to} ({account["name"]})...')
    return JsonResponse({'status': 'ok'}, status=201)

@require_http_methods(['GET'])
def account_info(request):
    account_id = request.GET.get('account_id')
    # Get account info from database...
    account = get_account_info(account_id)
    return JsonResponse({'status': 'ok',
     'account': account
    }, status=200)

def get_account_info(account_id):
    # Get account info from database...
    accounts = [
        {
        'name': 'JOHN DOE',
        'CBU': '0000000000000000000000',
        'alias': 'john.doe',
    },
    {
        'name': 'JANE DOE',
        'CBU': '1111111111111111111111',
        'alias': 'jane.doe',
    },
    {
        'name': 'ALICE SMITH',
        'CBU': '2222222222222222222222',
        'alias': 'alice.smith',
    },
    {
        'name': 'BOB JOHNSON',
        'CBU': '3333333333333333333333',
        'alias': 'bob.johnson',
    },
    {
        'name': 'EMMA WILSON',
        'CBU': '4444444444444444444444',
        'alias': 'emma.wilson',
    },
    {
        'name': 'MICHAEL BROWN',
        'CBU': '5555555555555555555555',
        'alias': 'michael.brown',
    },
    {
        'name': 'SOPHIA LEE',
        'CBU': '6666666666666666666666',
        'alias': 'sophia.lee',
    },
    {
        'name': 'LUCAS MARTIN',
        'CBU': '7777777777777777777777',
        'alias': 'lucas.martin',
    },
    {
        'name': 'OLIVIA ANDERSON',
        'CBU': '8888888888888888888888',
        'alias': 'olivia.anderson',
    },
    {
        'name': 'LIAM THOMPSON',
        'CBU': '9999999999999999999999',
        'alias': 'liam.thompson',
    },
    {
        'name': 'AVA GARCIA',
        'CBU': '1010101010101010101010',
        'alias': 'ava.garcia',
    },
    {
        'name': 'NOAH HERNANDEZ',
        'CBU': '1212121212121212121212',
        'alias': 'noah.hernandez',
    },
    {
        'name': 'ISABELLA LOPEZ',
        'CBU': '1313131313131313131313',
        'alias': 'isabella.lopez',
    },
    {
        'name': 'JAMES WANG',
        'CBU': '1414141414141414141414',
        'alias': 'james.wang',
    },
    {
        'name': 'MIA LEE',
        'CBU': '1515151515151515151515',
        'alias': 'mia.lee',
    }
    ]
    account = random.choice(accounts)
    return account    