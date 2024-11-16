"use client";

import Link from "next/link";

import Login from "@/components/login";
import { useTokens } from "@/lib/worldcoin/use-tokens";
import { Button } from "@/components/ui/button";
// import { useBuyToken } from "@/lib/worldcoin/use-buy-token";
// import { useCreateToken } from "@/lib/worldcoin/use-create-token";
// import { useSellToken } from "@/lib/worldcoin/use-sell-token";

export default function Home() {
  const { data: tokens } = useTokens();
  // const { mutate: createToken } = useCreateToken();
  // const { mutate: buyToken } = useBuyToken();
  // const { mutate: sellToken } = useSellToken();
  return (
    <div>
      <Link href="/new">New</Link>

      {tokens?.map((token) => (
        <div key={token.tokenAddress}>
          {token.name} {token.symbol}
        </div>
      ))}

      {/* <Button onClick={() => createToken({ name: "Test", ticker: "TEST", description: "Test", imageUri: "https://example.com/image.png" })}>Create Token</Button>
      <Button onClick={() => buyToken({ tokenAddress: "0xb288aacee3fb5d488afa1b4a5d86156ad8a93cd2", amount: "10000000000000000" })}>Buy Token</Button>
      <Button onClick={() => sellToken({ tokenAddress: "0xb288aacee3fb5d488afa1b4a5d86156ad8a93cd2", amount: "10000000000000000" })}>Sell Token</Button> */}
      <Login />
    </div>
  );
}
