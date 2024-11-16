"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { usePay } from "@/lib/worldcoin/use-pay";
import { useVerify } from "@/lib/worldcoin/use-verify";

export default function Home() {
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
      {isVerified ? (
        <h1 className="text-4xl font-bold">Verified!</h1>
      ) : (
        <Button onClick={() => verify()}>Verify</Button>
      )}
      <Button onClick={() => pay()}>Pay</Button>
    </div>
  );
}
