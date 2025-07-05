import { useSession } from "next-auth/react";
import { User } from "@/types/user";

export default function useGetUser() {
  const { data: session } = useSession();

  const user = session?.user as User;
  
  return user;
}
