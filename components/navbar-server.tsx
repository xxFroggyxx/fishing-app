import NavbarClient from "@/components/navbar-client";
import { createClient } from "@/utils/supabase/server";

export default async function NavbarServer() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <NavbarClient user={user} />;
}
