import { useQuery } from "@tanstack/react-query";

import { funFactoryAbi } from "@/lib/abis/fun-factory";
import { FUN_FACTORY_ADDRESS } from "@/lib/addresses";
import { worldchainClient } from "@/lib/worldcoin/client";

export function useTokens() {
  return useQuery({
    queryKey: ["tokens"],
    queryFn: async () => {
      return await worldchainClient.readContract({
        address: FUN_FACTORY_ADDRESS,
        abi: funFactoryAbi,
        functionName: "getAllTokenMetadata",
      });
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });
}
