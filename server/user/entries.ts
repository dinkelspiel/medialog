'use server';

import z from 'zod';
import { validateSessionToken } from '../auth/validateSession';
import prisma from '../db';

export const saveUserEntry = async (
  prevState: any,
  formData: FormData
): Promise<{ error?: string; message?: string }> => {
  const schema = z.object({
    userEntryId: z.number(),
    notes: z.string().optional(),
    rating: z.number().min(0).max(100),
  });

  const user = await validateSessionToken();

  if (!user) {
    return {
      error: 'You are not logged in',
    };
  }

  const validatedFields = schema.safeParse({
    userEntryId: Number(formData.get('userEntryId')),
    notes: formData.get('notes')! as string,
    rating: Number(formData.get('rating')),
  });

  if (!validatedFields.success) {
    return {
      error: Object.entries(validatedFields.error.flatten().fieldErrors)
        .map(entry => entry[0] + ' ' + entry[1].map(error => error).join(' '))
        .join(' '),
    };
  }

  const userEntryId = validatedFields.data.userEntryId;
  const notes = validatedFields.data.notes;
  const rating = validatedFields.data.rating;

  await prisma.userEntry.update({
    where: {
      id: userEntryId,
      userId: user.id,
    },
    data: {
      notes: notes ?? '',
      rating,
    },
  });

  return {
    message: 'Saved successfully',
  };
};
