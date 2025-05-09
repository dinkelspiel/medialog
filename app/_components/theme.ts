import { validateSessionToken } from '@/server/auth/validateSession';

export const getTheme = async () => {
  const user = await validateSessionToken();
  return user ? user.theme : 'neutral';
};
