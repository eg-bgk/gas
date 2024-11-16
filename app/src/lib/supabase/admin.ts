import { createClient as createBaseClient } from "@supabase/supabase-js";

import { env } from "@/env.mjs";
import { Database } from "@/lib/supabase/database";

export function createClient() {
  return createBaseClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
