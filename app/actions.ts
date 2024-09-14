'use server';

import {redirect} from "next/navigation";

export async function navigateToPropertiesPage(data: FormData) {
    redirect(`/properties/${data.get('location')}`);
}