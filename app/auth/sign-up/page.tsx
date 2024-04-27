'use client';

import Logo from '@/components/icons/logo';
import SubmitButton from '@/components/submitButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/server/auth/signUp';
import Link from 'next/link';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

const Page = () => {
  const [state, formAction] = useFormState(signUp, {});

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <main className="grid items-center justify-center w-full bg-neutral-100 h-[100dvh]">
      <form className="grid gap-8 w-[350px]" action={formAction}>
        <div className="grid gap-2">
          <Logo className="mb-2" />
          <h3 className="font-bold text-[22px] leading-7 tracking-[-0.02em]">
            Sign up to Medialog
          </h3>
          <p className="text-sm text-muted-foreground">
            Welcome to <i>your</i> website for rating Movies, Books, and TV
            Shows
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Input placeholder="Username" name="username" />
            <Input placeholder="Email" name="email" />
            <Input placeholder="Password" type="password" name="password" />
          </div>
          <SubmitButton>Create my account</SubmitButton>
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default Page;
