"use client";

import { ISuccessResult, MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import ky from "ky";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel; // Default: Orb
};

const verifyPayload: VerifyCommandInput = {
  action: "verify-human", // This is your action ID from the Developer Portal
  signal: "0x12312", // Optional additional data
  verification_level: VerificationLevel.Orb, // Orb | Device
};

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    // World App will open a drawer prompting the user to confirm the operation, promise is resolved once user confirms or cancels
    const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
    if (finalPayload.status === "error") {
      console.log("Error payload", finalPayload);
      return;
    }

    const res = await ky
      .post("/api/verify", {
        json: {
          payload: finalPayload as ISuccessResult,
          action: "verify-human",
          signal: "0x12312",
        },
      })
      .json<{ success: boolean }>();

    if (res.success) {
      setIsVerified(true);
    }
  };

  return (
    <div>
      {isVerified ? (
        <h1 className="text-4xl font-bold">Verified!</h1>
      ) : (
        <Button onClick={handleVerify}>Verify</Button>
      )}
    </div>
  );
}
