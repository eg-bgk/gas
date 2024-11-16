import { NextAuthOptions, getServerSession } from "next-auth";

import { env } from "@/env.mjs";
import { createClient } from "@/lib/supabase/admin";

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: env.NEXT_PUBLIC_WORLD_APP_ID,
      clientSecret: env.NEXT_PUBLIC_WORLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        console.log("Profile", profile);

        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel: profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        // Check if user already exists in Supabase
        const supabase = createClient();
        const { data: existingUser } = await supabase
          .from("users")
          .select()
          .eq("id", user.id)
          .single();

        if (!existingUser) {
          // Create new user in Supabase
          const { error } = await supabase.from("users").insert({
            id: user.id,
            username: user.id,
            address: user.id,
          });

          if (error) {
            console.error("Error creating user in Supabase:", error);
            return false; // Prevent sign in if user creation fails
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    jwt({ token, user }) {
      if (user) {
        return { ...token, id: user.id }; // Save id to token as docs says: https://next-auth.js.org/configuration/callbacks
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          // id: user.id, // This is copied from official docs which find user is undefined
          id: token.id, // Get id from token instead
        },
      };
    },
  },
  debug: true,
};

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
