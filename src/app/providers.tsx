"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

import MiniKitProvider from "@/components/minikit-provider";

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  // @ts-ignore
  const ErudaProvider = dynamic(() => import("../components/eruda").then((c) => c.ErudaProvider), {
    ssr: false,
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <ErudaProvider>
              <MiniKitProvider>{children}</MiniKitProvider>
            </ErudaProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
