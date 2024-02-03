import Logo from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

interface LoginResponse {
  user?: {
    username: string;
    email: string;
  };
  session_token?: string;
  error?: string;
}

const Login = () => {
  let [pendingLoginResult, setPendingLoginResult] = useState<boolean>(false);
  let [error, setError] = useState<string | undefined>(undefined);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const router = useRouter();

  const attemptLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPendingLoginResult(true);

    const response = await fetch("http://localhost/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    response.json().then((data: LoginResponse) => {
      if (response.status === 200) {
        if (data.session_token === undefined) {
          return;
        }

        localStorage.setItem("session_token", data.session_token);
        router.push("/");
      } else if (response.status === 401) {
        setError(data.error);
      }
    });
    setPendingLoginResult(false);
  };

  return (
    <main className="grid h-[100dvh] w-[100dvw] grid-cols-2">
      <div className="bg-primary relative">
        <div className="absolute left-8 top-8 flex items-center">
          <Logo className="mr-2 h-6 w-6 fill-white" />
          <div className=" text-lg font-medium text-white">Medialog</div>
        </div>
      </div>
      <div className="relative flex items-center">
        <Button className="absolute right-8 top-8" variant="ghost">
          Sign up
        </Button>
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
            {pendingLoginResult && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4 animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
            )}
            Sign in with email
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Login;
