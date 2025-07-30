'use client';

import Logo from '@/components/icons/logo';
import SubmitButton from '@/components/submitButton';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

const Page = () => {
  const router = useRouter();
  const signUp = api.auth.signUp.useMutation({
    onSuccess(data) {
      toast.success(data.message);
      router.push('/dashboard');
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="grid h-[100dvh] w-full items-center justify-center bg-base-100">
      <form
        className="grid w-[350px] gap-8"
        onSubmit={e => {
          e.preventDefault();
          signUp.mutate({
            username,
            email,
            password,
          });
        }}
      >
        <div className="grid gap-2">
          <Logo className="mb-2" />
          <h3 className="text-[22px] font-bold leading-7 tracking-[-0.02em]">
            Sign up to Medialog
          </h3>
          <p className="text-sm text-base-500">
            Welcome to <i>your</i> website for rating Movies, Books, and TV
            Shows
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              name="username"
            />
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              name="email"
            />
            <Input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              name="password"
            />
          </div>
          <SubmitButton isPending={signUp.isPending}>
            Create my account
          </SubmitButton>
          <p className="text-sm text-base-500">
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
