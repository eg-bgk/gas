import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";

import { funFactoryAbi } from "@/lib/abis/fun-factory";
import { worldFunAbi } from "@/lib/abis/world-fun";
import { FUN_FACTORY_ADDRESS } from "@/lib/addresses";
import { worldchainClient } from "@/lib/worldcoin/client";

export function useTokens() {
  return useQuery({
    queryKey: ["tokens"],
    queryFn: async () => {
      const tokens = await worldchainClient.readContract({
        address: FUN_FACTORY_ADDRESS,
        abi: funFactoryAbi,
        functionName: "getAllTokenMetadata",
      });

      // Get price of each token
      const tokensWithPrice = await Promise.all(
        tokens.map(async (token) => {
          const lastPrice = await worldchainClient.readContract({
            address: token.tokenAddress,
            abi: worldFunAbi,
            functionName: "lastPrice",
          });

          const ethPrice = formatEther(lastPrice);
          const price = (Number(ethPrice) * 3000).toFixed(4);

          return { ...token, price };
        }),
      );

      return tokensWithPrice;
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });
}
