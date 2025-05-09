import prisma from '@/server/db';
import { redirect } from 'next/navigation';
import Client from './client';

const Page = async ({ searchParams }: { searchParams: { id: string } }) => {
  const forgotPassword = await prisma.userForgotPassword.findFirst({
    where: {
      id: searchParams.id,
      used: false,
    },
    include: {
      user: true,
    },
  });

  if (!forgotPassword) {
    return redirect('/');
  }

  return (
    <main className="bg-base-100 grid h-[100dvh] w-full items-center justify-center">
      <Client forgotPassword={forgotPassword} />
    </main>
  );
};

export default Page;
