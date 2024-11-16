import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_KEY: z.string().min(1),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_WORLD_APP_ID: z.string().min(1),
    // NEXT_PUBLIC_WORLD_API_KEY: z.string().min(1),
    NEXT_PUBLIC_WORLD_CLIENT_SECRET: z.string().min(1),
    NEXT_PUBLIC_SIGNER: z.string().startsWith("0x", "Must start with 0x"),
  },
  // Only need to destructure client variables
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_WORLD_APP_ID: process.env.NEXT_PUBLIC_WORLD_APP_ID,
    // NEXT_PUBLIC_WORLD_API_KEY: process.env.NEXT_PUBLIC_WORLD_API_KEY,
    NEXT_PUBLIC_WORLD_CLIENT_SECRET: process.env.NEXT_PUBLIC_WORLD_CLIENT_SECRET,
    NEXT_PUBLIC_SIGNER: process.env.NEXT_PUBLIC_SIGNER,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
