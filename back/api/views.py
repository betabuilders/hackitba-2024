from django.views import View
from django.http import JsonResponse

from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from django.http import QueryDict

import json
import requests
import os

from .models import Organization, Member, Expense, Supplier, Category, Transaction, AssignedFunds, BankAccount

# Create your views here.

def getOrganizationBalance(organization):
    last_assigned_funds = AssignedFunds.objects.filter(Q(organization=organization)).last()
    last_assigned_funds = 0 if last_assigned_funds is None else last_assigned_funds.balance_in_cents
    last_transaction = Transaction.objects.filter(Q(organization=organization)).last()
    last_transaction =  0 if last_transaction is None else last_transaction.balance_in_cents
    
    return last_transaction - last_assigned_funds

def getExpenseBalance(expense):
    last_assigned_funds = AssignedFunds.objects.filter(Q(expense=expense)).last()
    return 0 if last_assigned_funds is None else last_assigned_funds.expense_balance_in_cents

def getAssignedFunds(organization):
    last_assigned_funds = AssignedFunds.objects.filter(Q(organization=organization)).last()
    return 0 if last_assigned_funds is None else last_assigned_funds.balance_in_cents

def getTotalFunds(organization):
    last_transaction = Transaction.objects.filter(Q(organization=organization)).last()
    return 0 if last_transaction is None else last_transaction.balance_in_cents

# retorna True o False según se hayan podido asignar los fondos
# el miembro es quien asigna los fondos, la cantidad indica los fondos que se asignarán a la expensa
def assignFund(member, amount, expense):
    organization = member.organization
    balance = getOrganizationBalance(organization) 

    # no hay fondos suficientes
    if balance - amount < 0:
        return False
    
    new_balance = getAssignedFunds(organization) + amount
    expense_balance = getExpenseBalance(expense) + amount
    assgined_funds = AssignedFunds(organization=organization, expense=expense, member=member, amount_in_cents=amount, 
                                   balance_in_cents = new_balance, expense_balance_in_cents=expense_balance)

    assgined_funds.save()
    return True

def generateTransaction(member, expense, amount, supplier, description='', invoice='', status='A'):
    totalBalance = getTotalFunds(member.organization)
    newBalance = totalBalance + amount
    if newBalance < 0:
        return False

    # crea un elemento en la tabla de transacciones con los datos que recibe
    transaction = Transaction(description=description, organization=member.organization, 
                              member=member, expense=expense, amount_in_cents=amount, balance_in_cents=newBalance, 
                              invoice=invoice, status=status, supplier=supplier)
    transaction.save()
    return True


# gestiona la creación de pagos, devuelve la response de django
# el monto debe ser negativo para que sea un pago
def createPayment(member, expense, amount, supplier, description='', invoice=''):
    bankAccount = member.organization.bank_account

    if amount > 0:
        return JsonResponse({'message': 'Amount debe ser negativo (sale de la cuenta, no ingresa)'}, status=400) 
    if getExpenseBalance(expense) + amount < 0:
        return JsonResponse({'message': 'Error: Insufficient funds'}, status=400)
    
    # verificar que el supplier tenga un cbu esté en alguna category de la expensa
    if not supplier.categories.filter(id__in=expense.categories.all()).exists():
        return JsonResponse({'message': 'Error: Supplier not allowed'}, status=400)

    # hace el request a la api de bancos para transferir x monto de bankAcount a supplier (cbu)
    # url = os.getenv('HACKITBA_HOST')
    url = 'http://localhost:8000/bank/transfer/'
    data = {
        'amount': amount,
        'account_id': bankAccount.account_id,
        'account_to': supplier.cbu
    }
    response = requests.post(url, data=data)
    if not response.status_code == 201:
        generateTransaction(member, expense, amount, supplier, description, invoice, status='R') # transacción guardada como no exitosa
        return JsonResponse({'message': 'Error: Payment failed but registred'}, status=400)
    
    assignFund(member, amount, expense) # resto el dinero de la cuenta corriente de la expensa
    generateTransaction(member, expense, amount, supplier, description, invoice, status='A') # guardo la transacción ya que se realizó con éxito
    return JsonResponse({'message': 'Payment created successfully'}, status=201)


# agrega fondos a la organización. Solo si sos admin, retorna True si se pudo agregar los fondos, False si no
def addFund(member, amount, description='Funds added'):
    if member.role != 'admin' or amount <= 0:
        return False

    organization = member.organization

    transaction = Transaction(description=description, organization=organization, member=member, amount_in_cents=amount, balance_in_cents = getTotalFunds(organization) + amount)
    transaction.save()

    return True
    

class OrganizationView(View):
    def get(self, request, id=None):
        if id is None:
            organizations = Organization.objects.all()
            organizations = list(organizations.values())
            for organization in organizations:
                organizationObject = get_object_or_404(Organization, id=organization['id'])
                organization['availableBalance'] = getOrganizationBalance(organizationObject)
                organization['totalFunds'] = getTotalFunds(organizationObject)

            return JsonResponse({'message': 'OK', 'data': organizations}, status=200)
        else:

            organization = get_object_or_404(Organization, id=id)

            organization_dict = model_to_dict(organization)
            organization_dict['availableBalance'] = getOrganizationBalance(organization)
            organization_dict['totalFunds'] = getTotalFunds(organization)


            return JsonResponse({'message': 'OK', 'data': organization_dict}, status=200)
    
    @csrf_exempt
    def post(self, request):
        name = request.POST.get('name')
        description = request.POST.get('description')
        if name is None:
            return JsonResponse({'message': 'Error: name is required'}, status=400)
        if description is None:
            return JsonResponse({'message': 'Error: description is required'}, status=400)
        
        organization = Organization(name=name, description=description)
        organization.save()
        return JsonResponse({'message': 'Organization created successfully', 'id': organization.id}, status=201)
    
    @csrf_exempt
    def put(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error: id is required'}, status=400)

        request.PUT = QueryDict(request.body)

        name = request.PUT.get('name')
        description = request.PUT.get('description')
        if name is None:
            return JsonResponse({'message': 'Error: name is required', 'id': id}, status=400)
        if description is None:
            return JsonResponse({'message': 'Error: description is required', 'id': id}, status=400)
        
        organization = get_object_or_404(Organization, id=id)
        organization.name = name
        organization.description = description
        organization.save()
        return JsonResponse({'message': 'Organization updated successfully', 'id': organization.id}, status=200)

    @csrf_exempt
    def delete(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error: id is required'}, status=400)
        organization = get_object_or_404(Organization, id=id)
        organization.delete()
        return JsonResponse({'message': 'Organization deleted successfully'}, status=200)
    

class ExpenseView(View):
    def get(self, request, id=None):
        if id is None:
            organization = request.GET.get('organization')
            member = request.GET.get('member')
            if member is not None:
                member = get_object_or_404(Member, id=member)

                expenses_list = []
                for expense in member.expenses.all():
                    members = []
                    for member in expense.members.all():
                        member_dict = model_to_dict(member)
                        members.append(member_dict)
                    categories = []
                    for category in expense.categories.all():
                        category_dict = model_to_dict(category)
                        categories.append(category_dict)
                    
                    expense_dict = model_to_dict(expense)
                    expense_dict['balance'] = getExpenseBalance(get_object_or_404(Expense, id=expense_dict['id']))
                    expense_dict['members'] = members
                    expense_dict['categories'] = categories
                    expenses_list.append(expense_dict)

                    
                return JsonResponse({'message': 'OK', 'data': expenses_list}, status=200)
            elif organization is not None:
                expenses = Expense.objects.filter(Q(organization=organization))
                expenses_list = []
                for expense in expenses:
                    members = []
                    for member in expense.members.all():
                        member_dict = model_to_dict(member)
                        members.append(member_dict)
                    categories = []
                    for category in expense.categories.all():
                        category_dict = model_to_dict(category)
                        categories.append(category_dict)
                    
                    expense_dict = model_to_dict(expense)
                    expense_dict['balance'] = getExpenseBalance(get_object_or_404(Expense, id=expense_dict['id']))
                    expense_dict['members'] = members
                    expense_dict['categories'] = categories
                    expenses_list.append(expense_dict)
                    
                return JsonResponse({'message': 'OK', 'data': expenses_list}, status=200)
            else:
                expenses = Expense.objects.all()
                # expenses = list(expenses.values())
                expenses_list = []
                for expense in expenses:
                    members = []
                    for member in expense.members.all():
                        member_dict = model_to_dict(member)
                        members.append(member_dict)
                    categories = []
                    for category in expense.categories.all():
                        category_dict = model_to_dict(category)
                        categories.append(category_dict)
                    
                    expense_dict = model_to_dict(expense)
                    expense_dict['balance'] = getExpenseBalance(get_object_or_404(Expense, id=expense_dict['id']))
                    expense_dict['members'] = members
                    expense_dict['categories'] = categories
                    expenses_list.append(expense_dict)

                return JsonResponse({'message': 'OK', 'data': expenses_list}, status=200)
        else:
            expense = get_object_or_404(Expense, id=id)

            members = []
            for member in expense.members.all():
                member_dict = model_to_dict(member)
                members.append(member_dict)
            
            categories = []
            for category in expense.categories.all():
                category_dict = model_to_dict(category)
                categories.append(category_dict)


            expense_dict = model_to_dict(expense)
            expense_dict['balance'] = getExpenseBalance(expense)
            expense_dict['members'] = members
            expense_dict['categories'] = categories

            return JsonResponse({'message': 'OK', 'data': expense_dict}, status=200)
            # return JsonResponse({'message': 'OK', 'data': expense}, status=200)
    
    @csrf_exempt
    def post(self, request):
        title = request.POST.get('title')
        description = request.POST.get('description')
        organization = request.POST.get('organization')
        members = request.POST.get('members')
        created_by = request.POST.get('created_by')
        categories = request.POST.get('categories')
        amount = request.POST.get('amount')

        if title is None:
            return JsonResponse({'message': 'Error: title is required'}, status=400)
        if description is None:
            return JsonResponse({'message': 'Error: description is required'}, status=400)
        if organization is None:
            return JsonResponse({'message': 'Error: organization is required'}, status=400)
        if members is None:
            return JsonResponse({'message': 'Error: members are required'}, status=400)
        if created_by is None:
            return JsonResponse({'message': 'Error: created_by is required'}, status=400)
        if categories is None:
            return JsonResponse({'message': 'Error: categories are required'}, status=400)
        if amount is None:
            amount = 0

        member = get_object_or_404(Member, id=created_by)

        if member.role != 'admin':
            return JsonResponse({'message': 'Error: permission denied'}, status=403)
    
        amount = int(amount) # Positivo para añadir fondos a la expensa

        organization = get_object_or_404(Organization, id=organization)
        expense = Expense(title=title, description=description, organization=organization)
        expense.save()

        members = json.loads(members)
        for member in members:
            expense.members.add(get_object_or_404(Member, id=member))
        
        categories = json.loads(categories)
        for category in categories:
            expense.categories.add(get_object_or_404(Category, id=category))

        created_by = get_object_or_404(Member, id=created_by)
        
        if not assignFund(created_by, amount, expense):
            return JsonResponse({'message': 'Error: Insufficient funds', 'id': expense.id}, status=400)

        return JsonResponse({'message': 'Expense created successfully', 'id': expense.id}, status=201)
    
    @csrf_exempt
    def put(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error: id is required'}, status=400)
        title = request.POST.get('title')
        description = request.POST.get('description')
        organization = request.POST.get('organization')
        members = request.POST.get('members')
        created_by = request.POST.get('created_by')
        categories = request.POST.get('categories')
        status = request.POST.get('status')
        
        # if name is None:
        #     return JsonResponse({'message': 'Error: name is required', 'id': id}, status=400)
        # if organization is None:
        #     return JsonResponse({'message': 'Error: organization is required', 'id': id}, status=400)
        # if category is None:
        #     return JsonResponse({'message': 'Error: category is required', 'id': id}, status=400)
        # if amount is None:
        #     return JsonResponse({'message': 'Error: amount is required', 'id': id}, status=400)
        # if status is None:
        #     return JsonResponse({'message': 'Error: status is required', 'id': id}, status=400)
        
        expense = get_object_or_404(Expense, id=id)
        expense.title = title
        expense.organization = organization
        expense.categories = categories
        expense.status = status
        expense.save()
        return JsonResponse({'message': 'Expense updated successfully', 'id': id}, status=200)

def getMemberJson(member):
    member_dict = model_to_dict(member)
    user = member.user
    member_dict['first_name'] = user.first_name
    member_dict['last_name'] = user.last_name
    member_dict['email'] = user.email
    del member_dict['user']
    del member_dict['is_active']
    
    return member_dict
    

class MemberView(View):
    def get(self, request, id=None):
        if id is None:
            organization = request.GET.get('organization')
            if organization is not None:
                members = Member.objects.filter(Q(organization=organization))
                if len(members) == 0:
                    return JsonResponse({'message': 'Error: members not found'}, status=404)
                members_list = []
                for member in members:
                    member_dict = getMemberJson(member)
                    members_list.append(member_dict)
                return JsonResponse({'message': 'OK', 'data': members_list}, status=200)
                
            members = Member.objects.all()
            members_list = []
            for member in members:
                member_dict = getMemberJson(member)
                members_list.append(member_dict)
            return JsonResponse({'message': 'OK', 'data': members_list}, status=200)
        else:
            member = Member.objects.filter(Q(id=id)).first()
            if member is None:
                return JsonResponse({'message': 'Error: member not found'}, status=404)
            
            
            member = getMemberJson(member)
            return JsonResponse({'message': 'OK', 'data': member}, status=200)

    @csrf_exempt
    def post(self, request):
        name = request.POST.get('name')
        organization = request.POST.get('organization')
        member = request.POST.get('member')
        expense = request.POST.get('expense')
        supplier = request.POST.get('supplier')
        amount = request.POST.get('amount')
        status = request.POST.get('status')

        if name is None:
            return JsonResponse({'message': 'Error: name is required'}, status=400)
        if organization is None:
            return JsonResponse({'message': 'Error: organization is required'}, status=400)
        if member is None:
            return JsonResponse({'message': 'Error: member is required'}, status=400)
        if expense is None:
            return JsonResponse({'message': 'Error: expense is required'}, status=400)
        if supplier is None:
            return JsonResponse({'message': 'Error: supplier is required'}, status=400)
        if amount is None:
            return JsonResponse({'message': 'Error: amount is required'}, status=400)
        if status is None:
            return JsonResponse({'message': 'Error: status is required'}, status=400)
        
        member = Member(name=name, organization=organization, member=member, expense=expense, supplier=supplier, amount=amount, status=status)
        member.save()
        return JsonResponse({'message': 'Member created successfully'}, status=201)
    
class SupplierView(View):
    def get(self, request, id=None):
        if id is None:
            organization = request.GET.get('organization')
            if organization is not None:
                suppliers = Supplier.objects.filter(Q(organization=organization))
                suppliers = list(suppliers.values())
                return JsonResponse({'message': 'OK', 'data': suppliers}, status=200)
            else:
                return JsonResponse({'message': 'Error: id is required'}, status=400)
        else:
            supplier = get_object_or_404(Supplier, id=id)
            supplier = model_to_dict(supplier)
            return JsonResponse({'message': 'OK', 'data': supplier}, status=200)
    
    @csrf_exempt
    def post(self, request):
        info = request.POST.get('info')
        return JsonResponse({'message': 'OK', 'data': 'Create a supplier', 'info': info}, status=200)
    
    @csrf_exempt
    def put(self, request, id=None):
        info = request.POST.get('info')
        if id is None:
            return JsonResponse({'message': 'Error: id is required'}, status=400)
        return JsonResponse({'message': 'OK', 'data': f'Update supplier with id: {id}', 'info': info}, status=200)
    
    @csrf_exempt
    def delete(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error: id is required'}, status=400)
        return JsonResponse({'message': 'OK', 'data': f'Delete supplier with id: {id}'}, status=200)

class CategoryView(View):
    def get(self, request, id=None):
        if id is None:
            organization = request.GET.get('organization')
            if organization is not None:
                categories = Category.objects.filter(Q(organization=organization))
                categories = list(categories.values())
                return JsonResponse({'message': 'OK', 'data': categories}, status=200)
            categories = Category.objects.all()
            categories = list(categories.values())
            return JsonResponse({'message': 'OK', 'data': categories}, status=200)
        else:
            category = Category.objects.filter(Q(id=id))
            if len(category) == 0:
                return JsonResponse({'message': 'Error: category not found'}, status=404)
            
            category = list(category.values())[0]
            return JsonResponse({'message': 'OK', 'data': category}, status=200)
    
    @csrf_exempt
    def post(self, request):
        name = request.POST.get('name')
        description = request.POST.get('description')
        organization = request.POST.get('organization')
        if name is None:
            return JsonResponse({'message': 'Error: name is required'}, status=400)
        if organization is None:
            return JsonResponse({'message': 'Error: organization is required'}, status=400)
        
        organization = get_object_or_404(Organization, id=organization)
        category = Category(name=name, description=description, organization=organization)
        category.save()
        return JsonResponse({'message': 'Category created successfully'}, status=201)
    
    @csrf_exempt
    def put(self, request, id=None):
        info = request.POST.get('info')
        if id is None:
            return JsonResponse({'message': 'Error', 'data': 'No id provided for update'}, status=400)
        return JsonResponse({'message': 'OK', 'data': f'Update category with id: {id}', 'info': info}, status=200)
    
    @csrf_exempt
    def delete(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error', 'data': 'No id provided for deletion'}, status=400)
        return JsonResponse({'message': 'OK', 'data': f'Delete category with id: {id}'}, status=200)

class TransactionView(View):
    def get(self, request, id=None):
        if id is None:
            organization = request.GET.get('organization')
            expense = request.GET.get('expense')
            if expense is not None:
                transactions = Transaction.objects.filter(Q(expense=expense))
                transactions = list(transactions.values())
                return JsonResponse({'message': 'OK', 'data': transactions}, status=200)
            elif organization is not None:
                transactions = Transaction.objects.filter(Q(organization=organization))
                transactions = list(transactions.values())
                return JsonResponse({'message': 'OK', 'data': transactions}, status=200)
            else:
                transactions = Transaction.objects.all()
                transactions = list(transactions.values())
                return JsonResponse({'message': 'OK', 'data': transactions}, status=200)
        else:
            transaction = Transaction.objects.filter(Q(id=id))
            if len(transaction) == 0:
                return JsonResponse({'message': 'Error: transaction not found'}, status=404)
            
            transaction = list(transaction.values())[0]
            return JsonResponse({'message': 'OK', 'data': transaction}, status=200)

    # puede crear un pago o agregar fondos a la organización según el signo de amount
    @csrf_exempt
    def post(self, request):
        print(request.POST)
        
        member = request.POST.get('member')
        expense = request.POST.get('expense')
        amount = request.POST.get('amount')
        supplier = request.POST.get('supplier')
        description = request.POST.get('description')
        invoice = request.POST.get('invoice')
        
        if member is None:
            return JsonResponse({'message': 'Error: member is required'}, status=400)
        if amount is None:
            return JsonResponse({'message': 'Error: non zero amount is required'}, status=400)

        amount = int(amount)
        member = get_object_or_404(Member, id=member)

        # si el monto es positivo, lo que se está haciendo es cargar plata a la cuenta
        if amount > 0:
            if description is None:
                description = 'Funds added'

            if addFund(member, amount, description):
                return JsonResponse({'message': 'Funds added successfully'}, status=201)
            else:
                return JsonResponse({'message': 'Error: permission denied'}, status=403)

        if expense is None:
            return JsonResponse({'message': 'Error: expense is required'}, status=400)
        if supplier is None:
            return JsonResponse({'message': 'Error: supplier is required'}, status=400)

        if description is None:
            description = ''
        if invoice is None:
            invoice = ''

        expense = get_object_or_404(Expense, id=expense)
        supplier = get_object_or_404(Supplier, cbu=supplier)

        # si el monto es negativo, tengo que crear un pago TODO: ver description
        return createPayment(member, expense, amount, supplier, description, invoice)

       
    @csrf_exempt
    def put(self, request, id=None):
        info = request.PUT.get('info')
        if id is None:
            return JsonResponse({'message': 'Error', 'data': 'No id provided for update'}, status=400)
        return JsonResponse({'message': 'OK', 'data': f'Update transaction with id: {id}', 'info': info}, status=200)

    @csrf_exempt
    def delete(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error', 'data': 'No id provided for deletion'}, status=400)
        return JsonResponse({'message': 'OK', 'data': f'Delete transaction with id: {id}'}, status=200)

class AssignedFundsView(View):
    def get(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'OK', 'data': 'Show all assigned funds'}, status=200)
        else:
            organization = request.GET.get('organization')
            if organization is not None:
                return JsonResponse({'message': 'OK', 'data': f'Show all assigned funds for organization with id: {organization}'}, status=200)
            return JsonResponse({'message': 'OK', 'data': f'Show assigned fund with id: {id}'}, status=200)
    
    # agrega o remueve fondos de una expensa dada
    @csrf_exempt
    def post(self, request):
        member = request.POST.get('member') # created_by (qué admin asigna los fondos)
        expense = request.POST.get('expense')
        amount = request.POST.get('amount')

        if member is None:
            return JsonResponse({'message': 'Error: member is required'}, status=400)
        if expense is None:
            return JsonResponse({'message': 'Error: expense is required'}, status=400)
        if amount is None:
            return JsonResponse({'message': 'Error: amount is required'}, status=400)

        member = get_object_or_404(Member, id=member)
        expense = get_object_or_404(Expense, id=expense)

        if assignFund(member, int(amount), expense):
            return JsonResponse({'message': 'Assigned funds successfully'}, status=201)
        return JsonResponse({'message': 'Error: Insufficient funds'}, status=400)
    
    @csrf_exempt
    def put(self, request, id=None):
        info = request.PUT.get('info')
        if id is None:
            return JsonResponse({'message': 'Error', 'data': 'No id provided'}, status=400)
        return JsonResponse({'message': 'OK', 'data': f'Update assigned fund with id: {id}', 'info': info}, status=200)
    
    @csrf_exempt
    def delete(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error', 'data': 'No id provided'}, status=400)
        return JsonResponse({'message': 'OK', 'data': f'Delete assigned fund with id: {id}'}, status=200)

class BankAccountView(View):
    def get(self, request, id=None):
        if id is None:
            organization = request.GET.get('organization')
            if organization is not None:
                back_account = BankAccount.objects.filter(Q(organization=organization))
                back_account = list(back_account.values())
                return JsonResponse({'message': 'OK', 'data': back_account}, status=200)
            back_account = BankAccount.objects.all()
            back_account = list(back_account.values())
            return JsonResponse({'message': 'OK', 'data': back_account}, status=200)
        else:
            back_account = BankAccount.objects.filter(Q(id=id))
            if len(back_account) == 0:
                return JsonResponse({'message': 'Error: bank account not found'}, status=404)
            
            back_account = list(back_account.values())[0]
            return JsonResponse({'message': 'OK', 'data': back_account}, status=200)
    
    @csrf_exempt
    def post(self, request):
        organization = request.POST.get('organization')
        host = os.getenv('HACKITBA_HOST')
        host= 'http://localhost:8000'
        response = requests.get(host + '/bank/new_account')
        account_id = response.json()['account_id']
        if organization is None:
            return JsonResponse({'message': 'Error: organization is required'}, status=400)

        organization = get_object_or_404(Organization, id=organization)
        bank_account = BankAccount(account_id=account_id, organization=organization)
        bank_account.save()
        return JsonResponse({'message': 'Bank account created successfully', 'id': bank_account.account_id}, status=201)
    
    @csrf_exempt
    def put(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error', 'data': 'No id provided for update'}, status=400)
        bank_account = get_object_or_404(BankAccount, id=id)
        account_id = request.PUT.get('account_id')
        organization = request.PUT.get('organization')
        if account_id is None:
            return JsonResponse({'message': 'Error', 'data': 'account_id is required'}, status=400)
        if organization is None:
            return JsonResponse({'message': 'Error', 'data': 'organization is required'}, status=400)
        bank_account.account_id = account_id
        bank_account.organization = organization
        bank_account.save()
        return JsonResponse({'message': 'OK', 'data': f'Update bank account with id: {id}'}, status=200)
    
    
    @csrf_exempt
    def delete(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error', 'data': 'No id provided'}, status=400)
        return JsonResponse({'message': 'OK', 'data': f'Delete bank account with id: {id}'}, status=200)
