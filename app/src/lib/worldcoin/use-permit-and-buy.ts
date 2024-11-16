import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { useState } from "react";
import { z } from "zod";

import { env } from "@/env.mjs";
import { worldFunAbi } from "@/lib/abis/world-fun";
import { worldchainClient } from "@/lib/worldcoin/client";

export const permitAndBuySchema = z.object({
  amount: z.string().min(1, "Required"),
  spenderAddress: z.string().min(1, "Required"),
  recipientAddress: z.string().min(1, "Required"),
});

export type PermitAndBuyData = z.infer<typeof permitAndBuySchema>;

export function usePermitAndBuy(
  options?: Omit<UseMutationOptions<void, Error, PermitAndBuyData, unknown>, "mutationFn"> & {
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
    mutationFn: async ({ amount, spenderAddress, recipientAddress }: PermitAndBuyData) => {
      if (!MiniKit.isInstalled()) {
        throw new Error('MiniKit not installed');
      }

      const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString();
      const permitTransfer = {
        permitted: {
          token: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1', // USDC.E
          amount: amount,
        },
        nonce: Date.now().toString(),
        deadline,
      };

      const permitTransferArgsForm = [
        [permitTransfer.permitted.token, permitTransfer.permitted.amount],
        permitTransfer.nonce,
        permitTransfer.deadline,
      ];

      const transferDetails = {
        to: recipientAddress,
        requestedAmount: amount,
      };

      const transferDetailsArgsForm = [
        transferDetails.to, 
        transferDetails.requestedAmount
      ];

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: spenderAddress,
            abi: worldFunAbi,
            functionName: 'buy',
            args: [
              permitTransferArgsForm,
              transferDetailsArgsForm,
              'PERMIT2_SIGNATURE_PLACEHOLDER_0'
            ],
          },
        ],
        permit2: [
          {
            ...permitTransfer,
            spender: spenderAddress,
          },
        ],
      });

      setTransactionId(finalPayload.status);
    },
    onSuccess() {
      onSuccess?.();
    },
    ...rest,
  });

  return {
    ...mutation,
    isConfirming,
    isWaitSuccess,
  };
}
