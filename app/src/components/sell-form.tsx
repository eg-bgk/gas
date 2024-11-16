"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { TokenAvatar } from "@/components/token-avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { sellTokenSchema, SellTokenData, useSellToken } from "@/lib/worldcoin/use-sell-token";
import { useTokens } from "@/lib/worldcoin/use-tokens";

export function SellForm() {
  const searchParams = useSearchParams();
  const tokenAddress = searchParams.get("token");

  const form = useForm<SellTokenData>({
    resolver: zodResolver(sellTokenSchema),
    defaultValues: {
      tokenAddress: tokenAddress ?? "",
      amount: "1",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const router = useRouter();
  const { data: tokens } = useTokens();
  const { mutate: sellToken, isPending } = useSellToken({
    onSuccess() {
      router.push("/");
    },
  });

  const selectedTokenAddress = watch("tokenAddress");
  const selectedToken = tokens?.find((token) => token.tokenAddress === selectedTokenAddress);

  const onSubmit = handleSubmit((data) => {
    console.log("data", data);
    sellToken(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex w-full flex-1 flex-col gap-6">
        <FormField
          control={form.control}
          name="tokenAddress"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label>Token</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    {selectedToken && (
                      <div className="flex items-center gap-2">
                        <TokenAvatar token={selectedToken} className="size-6" />
                        {selectedToken?.name} ({selectedToken?.symbol})
                      </div>
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tokens?.map((token) => (
                    <SelectItem key={token.tokenAddress} value={token.tokenAddress}>
                      <TokenAvatar token={token} className="size-6" />
                      {token.name} ({token.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-1">
          <Label>Amount</Label>
          <Input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            {...register("amount", {
              setValueAs: (value) => value.replace(",", "."),
            })}
          />
          {errors?.amount && (
            <p className="px-1 text-xs text-destructive">{errors.amount.message}</p>
          )}
        </div>

        <div
          className="mt-auto"
          // className="container absolute bottom-10 left-0 flex"
        >
          <Button className="h-16 w-full text-xl tracking-wide" type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            Sell
          </Button>
        </div>
      </form>
    </Form>
  );
}
