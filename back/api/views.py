from django.views import View
from django.http import JsonResponse

from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from django.http import QueryDict

from .models import Organization, Member, Expense, Supplier, Category, Transaction, AssignedFunds, BankAccount

# Create your views here.

class OrganizationView(View):
    def get(self, request, id=None):
        if id is None:
            organizations = Organization.objects.all()
            organizations = list(organizations.values())
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
                return JsonResponse({'message': 'OK', 'data': expenses}, status=200)
            expenses = Expense.objects.all()
            expenses = list(expenses.values())
            return JsonResponse({'message': 'OK', 'data': expenses}, status=200)
        else:
            expense = Expense.objects.filter(Q(id=id))
            if len(expense) == 0:
                return JsonResponse({'message': 'Error: expense not found'}, status=404)
            
            expense = list(expense.values())[0]
            return JsonResponse({'message': 'OK', 'data': expense}, status=200)
    
    @csrf_exempt
    def post(self, request):
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
        
        expense = Expense(name=name, organization=organization, category=category, amount=amount, status=status)
        expense.save()
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
            info = request.POST.get('info')
            return JsonResponse({'message': 'OK', 'data': 'Create a category', 'info': info}, status=200)
        
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
