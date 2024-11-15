"use client";

import { ISuccessResult, MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel; // Default: Orb
};

// type MiniAppVerifyActionSuccessPayload = {
//   status: "success";
//   proof: string;
//   merkle_root: string;
//   nullifier_hash: string;
//   verification_level: VerificationLevel;
//   version: number;
// };

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

    console.log("Final payload", finalPayload);

    // Verify the proof in the backend
    const verifyResponse = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: finalPayload as ISuccessResult, // Parses only the fields we need to verify
        action: "voting-action",
        signal: "0x12312", // Optional
      }),
    });

    // TODO: Handle Success!
    const verifyResponseJson = await verifyResponse.json();

    if (verifyResponseJson.status === 200) {
      console.log("Verification success!");
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
