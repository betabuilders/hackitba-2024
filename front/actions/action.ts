"use server";

import { Account, Expense, URL_API } from "@/lib/constants";
import exp from "constants";
import { cookies } from "next/headers";

const fetching = async (data) => {

    const response = await fetch(`${URL_API}/auth/login/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
    });
    const content = await response.json();
    return content;

}


export async function login(data) {
    const response = await fetching(data);
    if (!response) {
        return false;
    }
    const cookieStore = cookies();
    cookieStore.set('id', response.member.id);
    cookieStore.set('first_name', response.member.first_name);
    cookieStore.set('last_name', response.member.last_name);
    cookieStore.set('organization', response.member.organization);
    cookieStore.set('role', response.member.role);
    cookieStore.set('avatar', response.member.avatar);
    cookieStore.set('email', response.member.email);

    return true;
}

export async function isAdmin() {
    const cookieStore = cookies();
    return cookieStore.get('role')?.value == 'admin';
}

export async function getAvatar() {
    const cookieStore = cookies();
    return cookieStore.get('avatar')?.value;
}

export async function getNames() {
    const cookieStore = cookies();
    return `${cookieStore.get('first_name')?.value} ${cookieStore.get('last_name')?.value}`;
}

export async function getID() {
    const cookieStore = cookies();
    return cookieStore.get('id')?.value;
}

export async function getOrganization() {
    const cookieStore = cookies();
    const id = cookieStore.get('organization')?.value;
    const response = await fetch(`${URL_API}/api/organizations/${id}`).then(res => res.json()).then(res => res.data);
    return response;
}

export async function getExpenses() {
    const cookieStore = cookies();
    const organization = cookieStore.get('organization');
    const response = await fetch(`${URL_API}/api/expenses?organization=${organization?.value}`).then(res => res.json());
    return response;
}

export async function createPayment(member,expense,amount,cbu,description) {
    const response = await fetch(`${URL_API}/api/transactions/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            member: member,
            expense: expense,
            amount: amount,
            supplier: cbu,
            description: description,
        }),
    }).then(res => res.json());
    console.log(response);
    return response;
    
}

export async function getExpense(id: string) {
    const response = await fetch(`${URL_API}/api/expenses/${id}`).then(res => res.json());
    return response.data as Expense;
}

export async function accountInfo(cbu: string | number){
    const response = await fetch(`${URL_API}/bank/account_info?cbu=${cbu}`).then(res => res.json());
    return response as Account;
}
