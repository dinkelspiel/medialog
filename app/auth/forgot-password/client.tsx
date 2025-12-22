'use client';
import Logo from '@/components/icons/logo';
import SubmitButton from '@/components/submitButton';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import { User, UserForgotPassword } from '@/prisma/generated/client';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

const Client = ({
  forgotPassword,
}: {
  forgotPassword: UserForgotPassword & { user: User };
}) => {
  const router = useRouter();
  const apiForgotPassword = api.auth.forgotPassword.useMutation({
    onSuccess() {
      router.push('/auth/login');
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <form
      className="grid w-[350px] gap-8"
      onSubmit={e => {
        e.preventDefault();
        apiForgotPassword.mutate({
          password,
          confirmPassword,
          forgotPasswordId: forgotPassword.id,
        });
      }}
    >
      <div className="grid gap-2">
        <Logo className="mb-2" />
        <h3 className="text-[22px] font-bold leading-7 tracking-[-0.02em]">
          Reset password for {forgotPassword.user.username}
        </h3>
        <p className="text-sm text-base-500">
          Here you can reset the password for your account
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Input
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            name="password"
          />
          <Input
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
          />
        </div>
        <SubmitButton isPending={apiForgotPassword.isPending}>
          Reset Password
        </SubmitButton>
      </div>
    </form>
  );
};

export default Client;
