import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MiniKit, ISuccessResult, VerificationLevel } from "@worldcoin/minikit-js";
import ky from "ky";

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

export function useVerify(
  options?: Omit<UseMutationOptions<void, Error, void, unknown>, "mutationFn">,
) {
  return useMutation({
    mutationFn: async () => {
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

      if (!res.success) {
        throw new Error("Failed to verify");
      }
    },
    onError(error: Error) {
      console.error("Error: ", error);
    },
    ...options,
  });
}
