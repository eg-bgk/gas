"use client";

import Link from "next/link";

import Login from "@/components/login";
import { useTokens } from "@/lib/worldcoin/use-tokens";

export default function Home() {
  const { data: tokens } = useTokens();

  return (
    <div>
      <Link href="/new">New</Link>

      {tokens?.map((token) => (
        <div key={token.tokenAddress}>
          {token.name} {token.symbol}
        </div>
      ))}

      <Login />
    </div>
  );
}
