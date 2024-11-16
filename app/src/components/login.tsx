"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { usePay } from "@/lib/worldcoin/use-pay";
import { useVerify } from "@/lib/worldcoin/use-verify";

export default function Login() {
  const { data: session } = useSession();
  const user = session?.user;

  console.log("Client session: ", session?.user);

  const [isVerified, setIsVerified] = useState(false);

  const { mutate: verify } = useVerify({
    onSuccess() {
      setIsVerified(true);
    },
  });

  const { mutate: pay } = usePay({
    onSuccess(data) {
      console.log("Payment success", data);
    },
  });

  return (
    <div>
      {user ? (
        <div>
          <h1 className="text-4xl font-bold">Logged in as {user.id}</h1>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      ) : (
        <Button onClick={() => signIn("worldcoin")}>Sign In</Button>
      )}

      {isVerified ? (
        <h1 className="text-4xl font-bold">Verified!</h1>
      ) : (
        <Button onClick={() => verify()}>Verify</Button>
      )}
      <Button onClick={() => pay()}>Pay</Button>
    </div>
  );
}
