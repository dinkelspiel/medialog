"use client";
import { User } from "@/interfaces/user";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

type UserContextType = {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
});

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/auth/validate?sessionToken=" +
          localStorage.getItem("sessionToken"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status == 401) {
        router.push("/login");
        return;
      }

      response
        .json()
        .then((data: User) => {
          setUser(data);
        })
        .catch((e: any) => {
          console.log(e);
        });
    };

    fetchUser();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
