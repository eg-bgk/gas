import Link from "next/link";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Token } from "@/lib/types";
import { useTokenPrice } from "@/lib/worldcoin/use-token-price";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function TokenCard({ token }: { token: Token }) {
  const { data: price } = useTokenPrice({ tokenAddress: token.tokenAddress });
  const hue = hashString(token.name) % 360; // Get a consistent hue between 0-360

  return (
    <Link href={`/buy?token=${token.tokenAddress}`}>
      <Card className="-m-3 rounded-lg border-0 bg-background p-3 text-card-foreground shadow-none hover:bg-secondary">
        <CardContent className="flex justify-between gap-4 p-0">
          <div className="flex items-center gap-4">
            {token.imageUri.startsWith("http") ? (
              <Avatar className="size-14">
                <AvatarImage
                  alt="avatar"
                  src={token.imageUri.startsWith("http") ? token.imageUri : "/placeholder.png"}
                  className="object-cover"
                />
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
            ) : (
              <div
                className="size-14 rounded-full"
                style={{
                  backgroundColor: `hsl(${hue}, 80%, 60%)`,
                }}
              />
            )}
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
