"use server";

import { URL_API } from "@/lib/constants";
import { cookies } from "next/headers";

const fetching = async (data) => {

    const response = await fetch(`http://10.2.64.18:8000/auth/login/`, {
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
    console.log(">>>>>" + organization?.value);
    const response = await fetch(`http://10.2.64.18:8000/api/expenses?organization=${organization?.value}`).then(res => res.json());
    console.log("++++++++++++++++++++++++++++++++++",response);
    return response;
}

