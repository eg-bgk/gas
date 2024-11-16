import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/env.mjs";
import { Database } from "@/lib/supabase/database";

export function createClient() {
  return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_KEY);
}
