import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function getExplorerTransactionUrl(txHash: string) {
  return `https://worldchain-mainnet.explorer.alchemy.com/tx/${txHash}`;
}

interface TransactionLinkButtonProps {
  txnHash: `0x${string}`;
}

export function TransactionLinkButton({ txnHash }: TransactionLinkButtonProps) {
  return (
    <a
      href={getExplorerTransactionUrl(txnHash)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ size: "sm" }), "text-sm")}
    >
      See on Explorer
    </a>
  );
}
