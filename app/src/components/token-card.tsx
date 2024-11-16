import Link from "next/link";

import { TokenAvatar } from "@/components/token-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Token } from "@/lib/types";
import { useTokenPrice } from "@/lib/worldcoin/use-token-price";

export function TokenCard({ token }: { token: Token }) {
  const { data: price } = useTokenPrice({ tokenAddress: token.tokenAddress });

  return (
    <Link href={`/token?token=${token.tokenAddress}`}>
      <Card className="-m-3 rounded-lg border-0 bg-background p-3 text-card-foreground shadow-none hover:bg-secondary">
        <CardContent className="flex justify-between gap-4 p-0">
          <div className="flex items-center gap-4">
            <TokenAvatar token={token} />
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold leading-none tracking-tight">{token.name}</h3>
              <p className="text-balance text-lg font-semibold leading-none text-muted-foreground">
                {token.symbol}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-semibold leading-none tracking-tight">
              $<span>{price}</span>
            </div>
            <Button size="sm" className="hidden">
              Buy
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
