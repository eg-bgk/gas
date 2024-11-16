import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";

import { worldFunAbi } from "@/lib/abis/world-fun";
import { worldchainClient } from "@/lib/worldcoin/client";

export function useTokenPrice({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  return useQuery({
    queryKey: ["token-price", tokenAddress],
    queryFn: async () => {
      const price = await worldchainClient.readContract({
        address: tokenAddress,
        abi: worldFunAbi,
        functionName: "lastPrice",
      });

      const ethPrice = formatEther(price);

      return Number(ethPrice) * 3000;
    },
  });
}
