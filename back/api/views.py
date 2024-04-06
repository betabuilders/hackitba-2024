from django.views import View
from django.http import JsonResponse

from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from django.http import QueryDict

import json

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


# retorna True o False según se hayan podido asignar los fondos
# el miembro es quien asigna los fondos, la cantidad indica los fondos que se asignarán a la expensa
def assignFund(member, organization, amount, expense):
    balance = getOrganizationBalance(organization) 

    # no hay fondos suficientes
    if balance - amount < 0:
        return False
    
    new_balance = balance - amount
    assgined_funds = AssignedFunds(organization=organization, expense=expense, member=member, amount_in_cents=amount, balance_in_cents = new_balance)

    assgined_funds.save()
    return True


def addFund(member, organization, amount):
    if amount <= 0:
        return False

    last_transaction = Transaction.objects.filter(Q(organization=organization)).last()
    new_balance_tran = last_transaction.balance_in_cents + amount
    transaction = Transaction(description='Funds added', organization=organization, member=member, amount_in_cents=amount, balance_in_cents=new_balance_tran)
    transaction.save()

    return True
    

class OrganizationView(View):
    def get(self, request, id=None):
        if id is None:
            organizations = Organization.objects.all()
            organizations = list(organizations.values())
            for organization in organizations:
                organization['balance'] = getOrganizationBalance(get_object_or_404(Organization, id=organization['id']))
            return JsonResponse({'message': 'OK', 'data': organizations}, status=200)
        else:
            organization = Organization.objects.filter(Q(id=id))
            if len(organization) == 0:
                return JsonResponse({'message': 'Error: organization not found'}, status=404)
            
            organization = list(organization.values())[0]
            return JsonResponse({'message': 'OK', 'data': organization}, status=200)
    
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
        return JsonResponse({'message': 'Organization created successfully'}, status=201)
    
    @csrf_exempt
    def put(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error: id is required'}, status=400)

        request.PUT = QueryDict(request.body)

        name = request.PUT.get('name')
        description = request.PUT.get('description')
        if name is None:
            return JsonResponse({'message': 'Error: name is required'}, status=400)
        if description is None:
            return JsonResponse({'message': 'Error: description is required'}, status=400)
        
        organization = get_object_or_404(Organization, id=id)
        organization.name = name
        organization.description = description
        organization.save()
        return JsonResponse({'message': 'Organization updated successfully'}, status=200)

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
            if organization is not None:
                expenses = Expense.objects.filter(Q(organization=organization))
                expenses = list(expenses.values())
                for expense in expenses:
                    expense['balance'] = getExpenseBalance(get_object_or_404(Expense, id=expense['id']))
                return JsonResponse({'message': 'OK', 'data': expenses}, status=200)
            else:
                expenses = Expense.objects.all()
                expenses = list(expenses.values())
                for expense in expenses:
                    expense['balance'] = getExpenseBalance(get_object_or_404(Expense, id=expense['id']))
                return JsonResponse({'message': 'OK', 'data': expenses}, status=200)
        else:
            expense = get_object_or_404(Expense, id=id)

            expense_dict = model_to_dict(expense)
            expense_dict['balance'] = getExpenseBalance(expense)

            # no se pueden serializar los campos ManyToMany, ver qué se hace...
            del expense_dict['members']
            del expense_dict['categories']

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
        
        if not assignFund(created_by, organization, amount, expense):
            return JsonResponse({'message': 'Error: Insufficient funds'}, status=400)

        return JsonResponse({'message': 'Expense created successfully'}, status=201)
    
    @csrf_exempt
    def put(self, request, id=None):
        if id is None:
            return JsonResponse({'message': 'Error: id is required'}, status=400)
        name = request.POST.get('name')
        organization = request.POST.get('organization')
        category = request.POST.get('category')
        amount = request.POST.get('amount')
        status = request.POST.get('status')
        if name is None:
            return JsonResponse({'message': 'Error: name is required'}, status=400)
        if organization is None:
            return JsonResponse({'message': 'Error: organization is required'}, status=400)
        if category is None:
            return JsonResponse({'message': 'Error: category is required'}, status=400)
        if amount is None:
            return JsonResponse({'message': 'Error: amount is required'}, status=400)
        if status is None:
            return JsonResponse({'message': 'Error: status is required'}, status=400)
        
        expense = get_object_or_404(Expense, id=id)
        expense.name = name
        expense.organization = organization
        expense.category = category
        expense.status = status
        expense.save()
        return JsonResponse({'message': 'Expense updated successfully'}, status=200)

class MemberView(View):
    def get(self, request, id=None):
        if id is None:
            organization = request.GET.get('organization')
            if organization is not None:
                members = Member.objects.filter(Q(organization=organization))
                members = list(members.values())
                return JsonResponse({'message': 'OK', 'data': members}, status=200)
                
            members = Member.objects.all()
            members = list(members.values())
            return JsonResponse({'message': 'OK', 'data': members}, status=200)
        else:
            member = Member.objects.filter(Q(id=id))
            if len(member) == 0:
                return JsonResponse({'message': 'Error: member not found'}, status=404)
            
            member = list(member.values())[0]
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
    class SupplierView(View):
        def get(self, request, id=None):
            if id is None:
                return JsonResponse({'message': 'OK', 'data': 'Show all suppliers'}, status=200)
            else:
                organization = request.GET.get('organization')
                if organization is not None:
                    return JsonResponse({'message': 'OK', 'data': f'Show all suppliers for organization with id: {organization}'}, status=200)
                return JsonResponse({'message': 'OK', 'data': f'Show supplier with id: {id}'}, status=200)
        
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
            if organization is not None:
                transactions = Transaction.objects.filter(Q(organization=organization))
                transactions = list(transactions.values())
                return JsonResponse({'message': 'OK', 'data': transactions}, status=200)
            transactions = Transaction.objects.all()
            transactions = list(transactions.values())
            return JsonResponse({'message': 'OK', 'data': transactions}, status=200)
        else:
            transaction = Transaction.objects.filter(Q(id=id))
            if len(transaction) == 0:
                return JsonResponse({'message': 'Error: transaction not found'}, status=404)
            
            transaction = list(transaction.values())[0]
            return JsonResponse({'message': 'OK', 'data': transaction}, status=200)

    @csrf_exempt
    def post(self, request):
        description = request.POST.get('description')
        organization = request.POST.get('organization')
        member = request.POST.get('member')
        expense = request.POST.get('expense')
        supplier = request.POST.get('supplier')
        amount = request.POST.get('amount')
        status = request.POST.get('status')
        if description is None:
            return JsonResponse({'message': 'Error: description is required'}, status=400)
        
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
    
    @csrf_exempt
    def post(self, request):
        info = request.POST.get('info')
        return JsonResponse({'message': 'OK', 'data': 'Create an assigned fund', 'info': info}, status=200)
    
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
        account_id = request.POST.get('account_id')
        organization = request.POST.get('organization')

        if account_id is None:
            return JsonResponse({'message': 'Error: account_id is required'}, status=400)
        if organization is None:
            return JsonResponse({'message': 'Error: organization is required'}, status=400)

        bank_account = BankAccount(account_id=account_id, organization=organization)
        bank_account.save()
        return JsonResponse({'message': 'Bank account created successfully'}, status=201)
    
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
