import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { env } from "@/env.mjs";
import { funFactoryAbi } from "@/lib/abis/fun-factory";
import { worldchainClient } from "@/lib/worldcoin/client";

export const createTokenSchema = z.object({
  name: z.string().min(1, "Required"),
  ticker: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

export type CreateTokenData = z.infer<typeof createTokenSchema>;

export function useCreateToken(
  options?: Omit<UseMutationOptions<void, Error, CreateTokenData, unknown>, "mutationFn"> & {
    onSuccess(): void;
  },
) {
  const { onSuccess, ...rest } = options || {};

  const [transactionId, setTransactionId] = useState<string>("");

  const { isLoading: isConfirming, isSuccess: isWaitSuccess } = useWaitForTransactionReceipt({
    client: worldchainClient,
    appConfig: {
      app_id: env.NEXT_PUBLIC_WORLD_APP_ID,
    },
    transactionId: transactionId,
  });

  const mutation = useMutation({
    mutationFn: async ({ name, ticker, description }: CreateTokenData) => {
      if (!MiniKit.isInstalled()) {
        return;
      }

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0xce4d639a7B897EFF69a7176b8108b2e4270a902c",
            abi: funFactoryAbi,
            functionName: "createToken",
            args: [name, ticker, description, "Url"],
          },
        ],
      });

      console.log("commandPayload", commandPayload);

      if (finalPayload.status === "error") {
        console.log("Error ", finalPayload);
        return;
      }

      const transactionId = finalPayload.transaction_id;
      setTransactionId(transactionId);

      console.log("success");
    },
    onError(error: Error) {
      console.error("Error: ", error);
    },
    ...rest,
  });

  useEffect(() => {
    if (isWaitSuccess) {
      onSuccess?.();
    }
  }, [isWaitSuccess, onSuccess]);

  return {
    ...mutation,
    isPending: mutation.isPending || isConfirming,
  };
}
