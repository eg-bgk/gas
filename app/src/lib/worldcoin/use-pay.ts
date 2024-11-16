import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MiniKit, tokenToDecimals, Tokens, PayCommandInput } from "@worldcoin/minikit-js";
import ky from "ky";

export interface PaymentResponse {
  success: boolean;
}

export function usePay(
  options?: Omit<UseMutationOptions<PaymentResponse, Error, void, unknown>, "mutationFn">,
) {
  return useMutation({
    mutationFn: async () => {
      console.log("Checking if MiniKit is installed...");

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit is not installed");
      }

      console.log("Initiating payment...");

      const { id } = await ky.post("/api/payments/initiate").json<{ id: string }>();

      console.log("Payment ID: ", id);

      const payload: PayCommandInput = {
        reference: id,
        to: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
        tokens: [
          // {
          //   symbol: Tokens.WLD,
          //   token_amount: tokenToDecimals(0.01, Tokens.WLD).toString(),
          // },
          {
            symbol: Tokens.USDCE,
            token_amount: tokenToDecimals(0.01, Tokens.USDCE).toString(),
          },
        ],
        description: "Test example payment for minikit",
      };

      const { finalPayload } = await MiniKit.commandsAsync.pay(payload);

      console.log("Final payload: ", finalPayload);

      if (finalPayload.status === "success") {
        const payment = await ky
          .post("/api/payments/confirm", {
            json: {
              payload: finalPayload,
            },
          })
          .json<PaymentResponse>();

        if (payment.success) {
          console.log("Payment successful!");
          return payment;
        }
      }

      throw new Error("Payment failed");
    },
    onError(error: Error) {
      console.error("Error: ", error);
    },
    ...options,
  });
}
