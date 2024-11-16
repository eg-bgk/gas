import { getSession } from "next-auth/react";

import Login from "@/components/login";

export default async function Home() {
  const session = await getSession();

  console.log("Session", session);

  return <Login />;
}
