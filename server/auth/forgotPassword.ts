'use server';

import { z } from 'zod';
import prisma from '../db';
import bcrypt from 'bcrypt';
import { addMonths } from '@/lib/addMonths';
import { cookies, headers } from 'next/headers';
import { generateToken } from '@/lib/generateToken';

export const forgotPassword = async (
  prevState: any,
  formData: FormData
): Promise<{ error?: string; message?: string }> => {
  const schema = z.object({
    password: z.string(),
    confirmPassword: z.string(),
    forgotPasswordId: z.string(),
  });

  const validatedFields = schema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    forgotPasswordId: formData.get('forgotPasswordId'),
  });

  if (!validatedFields.success) {
    return {
      error: Object.entries(validatedFields.error.flatten().fieldErrors)
        .map(entry => `${entry[0]}: ${entry[1].map(error => error).join(' ')},`)
        .join(' '),
    };
  }

  const forgotPasswordId = validatedFields.data.forgotPasswordId;
  const password = validatedFields.data.password;
  const confirmPassword = validatedFields.data.confirmPassword;

  if (password != confirmPassword) {
    return {
      error: "Passwords don't match",
    };
  }

  const forgotPassword = await prisma.userForgotPassword.findFirst({
    where: {
      id: forgotPasswordId,
      used: false,
    },
  });

  if (!forgotPassword) {
    return {
      error: 'Invalid forgot password',
    };
  }

  await prisma.userForgotPassword.update({
    where: {
      id: forgotPasswordId,
    },
    data: {
      used: true,
    },
  });

  await prisma.user.update({
    where: {
      id: forgotPassword.userId,
    },
    data: {
      password: bcrypt.hashSync(password, 10),
    },
  });

  await cookies().delete('mlSessionToken');

  return {
    message: 'Updated password',
  };
};
