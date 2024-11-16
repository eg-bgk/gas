import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MiniKit } from "@worldcoin/minikit-js";
import { Address, createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

import { env } from "@/env.mjs";
import { funFactoryAbi } from "@/lib/abis/fun-factory";
import { FUN_FACTORY_ADDRESS } from "@/lib/addresses";
import { uploadFileToSupabase } from "@/lib/supabase/storage";

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

  const mutation = useMutation({
    mutationFn: async ({ name, ticker, description, image }: CreateTokenData) => {
      if (!MiniKit.isInstalled()) {
        return;
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
