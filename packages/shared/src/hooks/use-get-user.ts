import { useSession } from "next-auth/react";

export default function useGetUser() {
  const { data } = useSession();
  return data?.user ?? null;
}
