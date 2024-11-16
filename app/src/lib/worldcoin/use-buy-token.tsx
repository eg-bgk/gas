import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
// import ky from "ky";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { z } from "zod";

// import { TransactionLinkButton } from "@/components/transaction-link-button";
import { env } from "@/env.mjs";
import { funFactoryAbi } from "@/lib/abis/fun-factory";
// import { toast } from "@/lib/hooks/use-toast";
import { worldchainClient } from "@/lib/worldcoin/client";

import { FUN_FACTORY_ADDRESS } from "../addresses";

export const buyTokenSchema = z.object({
  tokenAddress: z.string().min(1, "Required"),
  amount: z.string().min(1, "Required"),
});

export type BuyTokenData = z.infer<typeof buyTokenSchema>;

export function useBuyToken(
  options?: Omit<UseMutationOptions<void, Error, BuyTokenData, unknown>, "mutationFn"> & {
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
    mutationFn: async ({ tokenAddress, amount }: BuyTokenData) => {
      if (!MiniKit.isInstalled()) {
        return;
      }

      console.log("tokenAddress", tokenAddress);
      console.log("amount", parseEther(amount));

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: FUN_FACTORY_ADDRESS,
            abi: funFactoryAbi,
            functionName: "buyTokens",
            args: [tokenAddress, Number(parseEther(amount))],
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

      // toast({
      //   title: "Token Purchased",
      //   description: "Successfully purchased token.",
      //   action: <TransactionLinkButton txnHash={transactionId as `0x${string}`} />,
      //   variant: "default",
      // });

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
