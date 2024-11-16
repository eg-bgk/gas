"use client";

import Link from "next/link";

import { TokenCard } from "@/components/token-card";
import { Button } from "@/components/ui/button";
import { useTokens } from "@/lib/worldcoin/use-tokens";

export default function Home() {
  const { data: tokens } = useTokens();

  const topTokenByPrice = tokens?.sort((a, b) => Number(b.price) - Number(a.price))[0];
  const otherTokens = tokens?.slice(1);

  return (
    <div className="flex w-full flex-col">
      <h1 className="mb-10 font-heading text-3xl font-bold">Tokens</h1>

      <div className="mb-8 flex flex-1 flex-col gap-4 overflow-auto">
        {!tokens?.length ? (
          <div>No tokens found</div>
        ) : (
          <>
            <h3 className="text-lg font-semibold">Most Popular</h3>
            {topTokenByPrice && <TokenCard token={topTokenByPrice} isMostPopular />}

            <h3 className="mt-2 text-lg font-semibold">All Tokens</h3>
            {otherTokens?.map((token) => <TokenCard key={token.tokenAddress} token={token} />)}
          </>
        )}
      </div>

      <div className="mt-auto">
        <Link href="/new">
          <Button className="h-16 w-full text-xl tracking-wide">New Token</Button>
        </Link>
      </div>
    </div>
  );
}
