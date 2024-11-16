import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ISuccessResult, MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import ky from "ky";
import { Address, createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

// import { TransactionLinkButton } from "@/components/transaction-link-button";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { env } from "@/env.mjs";
import { funFactoryAbi } from "@/lib/abis/fun-factory";
import { FUN_FACTORY_ADDRESS } from "@/lib/addresses";
// import { toast } from "@/lib/hooks/use-toast";
import { uploadFileToSupabase } from "@/lib/supabase/storage";

import { toast } from "../hooks/use-toast";

const worldchain = defineChain({
  id: 480,
  name: "Worldchain",
  nativeCurrency: {
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://worldchain-mainnet.g.alchemy.com/public"],
    },
  },
});

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

export const createTokenSchema = z.object({
  name: z.string().min(1, "Required"),
  ticker: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  image: z
    .custom<File>()
    .refine((file) => file instanceof File, "Image is required")
    .optional(),
});

export type CreateTokenData = z.infer<typeof createTokenSchema>;

export function useCreateToken(
  options?: Omit<UseMutationOptions<void, Error, CreateTokenData, unknown>, "mutationFn"> & {
    onSuccess(): void;
  },
) {
  const { onSuccess, ...rest } = options || {};

  const mutation = useMutation({
    mutationFn: async ({ name, ticker, description, image }: CreateTokenData) => {
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

      const account = privateKeyToAccount(env.NEXT_PUBLIC_SIGNER as Address);

      const client = createWalletClient({
        account,
        chain: worldchain,
        transport: http(),
      });

      let imageUrl = "";

      if (image) {
        const uploadedImage = await uploadFileToSupabase(image);
        if (uploadedImage) {
          imageUrl = uploadedImage;
        }
      }

      console.log("imageUrl", imageUrl);
      console.log("address", FUN_FACTORY_ADDRESS);

      const hash = await client.writeContract({
        address: FUN_FACTORY_ADDRESS,
        abi: funFactoryAbi,
        functionName: "createToken",
        args: [name, ticker, description, imageUrl],
      });

      toast({
        title: "Token Created",
        description: "Successfully created token.",
        action: <TransactionLinkButton txnHash={hash as `0x${string}`} />,
        variant: "default",
      });

      console.log("Transaction Hash: ", hash);

      if (hash) {
        onSuccess?.();
      }
    },
    onError(error: Error) {
      console.error("Error: ", error);
    },
    ...rest,
  });

  return {
    ...mutation,
    isPending: mutation.isPending,
  };
}
