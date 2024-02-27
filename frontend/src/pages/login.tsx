import Logo from "@/components/icons/logo";
import Spinner from "@/components/icons/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginResponse } from "@/interfaces/authInterfaces";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { type FormEvent, useEffect, useState } from "react";

const Login = () => {
  const [pendingLoginResult, setPendingLoginResult] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_API_URL + "/auth/login");
  }, []);

  const attemptLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPendingLoginResult(true);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      },
    );

    response
      .json()
      .then((data: LoginResponse) => {
        if (response.status === 200) {
          if (data.sessionToken === undefined) {
            return;
          }

          localStorage.setItem("sessionToken", data.sessionToken);
          router.push("/dashboard");
        } else if (response.status === 401) {
          setError(data.error);
        }
      })
      .catch((e: string) => setError(e));
    setPendingLoginResult(false);
  };

  return (
    <main className="grid h-[100dvh] w-[100dvw] grid-cols-2">
      <div className="relative bg-primary">
        <div className="absolute left-8 top-8 flex items-center">
          <Logo className="mr-2 h-6 w-6 fill-white" />
          <div className=" text-lg font-medium text-white">Medialog</div>
        </div>
      </div>
      <div className="relative flex items-center">
        <Link href="/signup">
          <Button className="absolute right-8 top-8" variant="ghost">
            Sign up
          </Button>
        </Link>
        <form
          className="mx-auto flex w-[350px] flex-col items-center justify-center gap-3"
          onSubmit={(e) => attemptLogin(e)}
        >
          <h2 className="pb-1.5 text-2xl font-semibold tracking-tight">
            Login to your account
          </h2>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <Button className="w-full" disabled={pendingLoginResult}>
            {pendingLoginResult && <Spinner />}
            Sign in with email
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Login;
