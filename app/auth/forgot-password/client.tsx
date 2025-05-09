'use client';
import Logo from '@/components/icons/logo';
import SubmitButton from '@/components/submitButton';
import { Input } from '@/components/ui/input';
import { forgotPassword as origFormAction } from '@/server/auth/forgotPassword';
import { User, UserForgotPassword } from '@prisma/client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

const Client = ({
  forgotPassword,
}: {
  forgotPassword: UserForgotPassword & { user: User };
}) => {
  const [state, formAction] = useFormState(origFormAction, {});

  useEffect(() => {
    if (state.message) {
      return redirect('/auth/login');
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form className="grid w-[350px] gap-8" action={formAction}>
      <input type="hidden" name="forgotPasswordId" value={forgotPassword.id} />
      <div className="grid gap-2">
        <Logo className="mb-2" />
        <h3 className="text-[22px] font-bold leading-7 tracking-[-0.02em]">
          Reset password for {forgotPassword.user.username}
        </h3>
        <p className="text-base-500 text-sm">
          Here you can reset the password for your account
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Input placeholder="Password" type="password" name="password" />
          <Input
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
          />
        </div>
        <SubmitButton>Reset Password</SubmitButton>
      </div>
    </form>
  );
};

export default Client;
