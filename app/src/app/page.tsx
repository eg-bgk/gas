"use client";

import Link from "next/link";

import { TokenCard } from "@/components/token-card";
import { Button } from "@/components/ui/button";
import { useTokens } from "@/lib/worldcoin/use-tokens";
// import { useBuyToken } from "@/lib/worldcoin/use-buy-token";
// import { useCreateToken } from "@/lib/worldcoin/use-create-token";
// import { useSellToken } from "@/lib/worldcoin/use-sell-token";

export default function Home() {
  const { data: tokens } = useTokens();
  // const { mutate: createToken } = useCreateToken();
  // const { mutate: buyToken } = useBuyToken();
  // const { mutate: sellToken } = useSellToken();
  return (
    <div className="flex w-full flex-col">
      <h1 className="mb-10 font-heading text-3xl font-bold">Tokens</h1>

      <div className="flex flex-1 flex-col gap-8">
        {!tokens?.length && <div>No tokens found</div>}

        {tokens?.map((token) => <TokenCard key={token.tokenAddress} token={token} />)}
      </div>

      <div
        className="mt-auto"
        // className="container absolute bottom-10 left-0 flex"
      >
        <Link href="/new">
          <Button className="h-16 w-full text-xl tracking-wide">New Token</Button>
        </Link>
      </div>
    </div>
  );
}
