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
  userError: boolean;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
  userError: false,
});

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const [userError, setUserError] = useState(false);
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
        setUserError(true);
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
    <UserContext.Provider value={{ user, setUser, userError }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
