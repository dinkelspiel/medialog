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
    <main className="grid h-[100dvh] w-full items-center justify-center bg-neutral-100">
      <Client forgotPassword={forgotPassword} />
    </main>
  );
};

export default Page;
