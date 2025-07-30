'use server';

import { z } from 'zod';
import prisma from '../db';
import bcrypt from 'bcrypt';
import { addMonths } from '@/lib/addMonths';
import { cookies, headers } from 'next/headers';
import { generateToken } from '@/lib/generateToken';

const genericLoginError = 'Invalid email or password';

export const login = async (
  prevState: any,
  formData: FormData
): Promise<{ error?: string; message?: string }> => {
  const schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: Object.entries(validatedFields.error.flatten().fieldErrors)
        .map(entry => entry[1].map(error => error).join(' '))
        .join(' '),
    };
  }

  const email = validatedFields.data.email;
  const password = validatedFields.data.password;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      error: genericLoginError,
    };
  }

  if (!bcrypt.compareSync(password, user.password.replace(/^\$2y/, '$2a'))) {
    return {
      error: genericLoginError,
    };
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiry: addMonths(new Date(), 6),
      ipAddress: (
        (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
      ).split(',')[0]!,
      userAgent: (await headers()).get('User-Agent') ?? 'No user agent found',
      token: generateToken(64),
    },
  });

  (await cookies()).set('mlSessionToken', session.token, {
    expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 31 * 6,
  });

  return {
    message: 'Login successfull',
  };
};
