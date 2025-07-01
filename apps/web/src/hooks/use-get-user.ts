import { useSession } from "next-auth/react";

export default function useGetUser() {
  const { data: session } = useSession();
  return session?.user || null;
}
