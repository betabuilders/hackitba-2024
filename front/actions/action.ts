"use server";

import { Account, Expense, URL_API } from "@/lib/constants";
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
    cookieStore.set('organization', response.member.organization);
    cookieStore.set('role', response.member.role);
    return true;
}

export async function isAdmin() {
    const cookieStore = cookies();
    return cookieStore.get('role')?.value == 'admin';
}

export async function getExpenses() {
    const cookieStore = cookies();
    const organization = cookieStore.get('organization');
    const response = await fetch(`${URL_API}/api/expenses?organization=${organization?.value}`).then(res => res.json());
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
