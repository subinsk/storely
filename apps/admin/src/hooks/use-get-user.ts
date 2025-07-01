import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function useGetUser() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      setUser(user);
    };

    getUser();
  }, [supabase.auth]);

  return user;
}
