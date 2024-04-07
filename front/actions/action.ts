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
    console.log(response.status);
    const content = await response.json();
    console.log(content);
    return content;

}


export async function login(data) {
    const response = await fetching(data);
    if (!response) {
        return false;
    }
    const cookieStore = cookies();
    cookieStore.set('organization', response.member.organization);
    return true;
}

export async function getExpenses() {
    const cookieStore = cookies();
    const organization = cookieStore.get('organization');
    const response = await fetch(`${URL_API}/api/expenses?organization=${organization?.value}`).then(res => res.json());
    return response;
}

export async function getExpense(id) {
    const response = await fetch(`${URL_API}/api/expenses/${id}`).then(res => res.json());
    return response.data as Expense;
}

export async function accountInfo(cbu){
    const response = await fetch(`${URL_API}/bank/account_info`).then(res => res.json());
    return response as Account;
}
