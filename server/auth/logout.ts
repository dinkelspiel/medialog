'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const logout = () => {
  cookies().delete('mlSessionToken');
  revalidatePath('/dashboard');
};
