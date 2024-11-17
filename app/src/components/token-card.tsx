import Link from "next/link";

import { TokenAvatar } from "@/components/token-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Token } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TokenCardProps {
  token: Token & { price: string; marketCap: string };
  className?: string;
  isMostPopular?: boolean;
}

export function TokenCard({ token, className, isMostPopular }: TokenCardProps) {
  const formattedMarketCap =
    Number(token.marketCap) > 0
      ? Number(token.marketCap) >= 1e9
        ? (Number(token.marketCap) / 1e9).toFixed(2) + "B"
        : Number(token.marketCap) >= 1e6
          ? (Number(token.marketCap) / 1e6).toFixed(2) + "M"
          : Number(token.marketCap).toFixed(2)
      : "";

  return (
    <Link href={`/token?token=${token.tokenAddress}`}>
      <Card
        style={{
          background: isMostPopular
            ? "linear-gradient(in hsl longer hue 45deg, rgb(255 0 0 / 0.2) 0 0)"
            : undefined,
        }}
        className={cn(
          "rounded-lg border-0 bg-background p-3 text-card-foreground shadow-none hover:bg-secondary",
          className,
        )}
      >
        <CardContent className="flex items-center justify-between gap-4 p-0">
          <div className="flex items-center gap-4">
            <TokenAvatar token={token} />
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold leading-none tracking-tight">{token.name}</h3>
              <p className="text-balance text-lg font-semibold leading-none text-muted-foreground">
                {token.symbol}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-lg font-semibold leading-none tracking-tight">
              $
              <span>
                {Number(token.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            {formattedMarketCap && (
              <div className="text-lg font-semibold leading-none tracking-tight text-muted-foreground">
                MC $<span>{formattedMarketCap}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
