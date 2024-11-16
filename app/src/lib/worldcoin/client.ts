import { Chain, createPublicClient, http } from "viem";

const worldchain: Chain = {
  id: 480,
  name: "Worldchain",
  nativeCurrency: {
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://worldchain-mainnet.g.alchemy.com"],
    },
  },
} as const;

export const worldchainClient = createPublicClient({
  chain: worldchain,
  transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
});
