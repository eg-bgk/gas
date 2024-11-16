"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { BuyTokenData, buyTokenSchema, useBuyToken } from "@/lib/worldcoin/use-buy-token";
import { useTokens } from "@/lib/worldcoin/use-tokens";

export default function BuyPage() {
  const form = useForm<BuyTokenData>({
    resolver: zodResolver(buyTokenSchema),
    defaultValues: {
      tokenAddress: "",
      amount: 1,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { data: tokens } = useTokens();
  const { mutate: buyToken, isPending } = useBuyToken();

  const onSubmit = handleSubmit((data) => {
    console.log("data", data);
    buyToken(data);
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Buy a token</h1>

      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {tokens?.map((token) => (
            <div key={token.tokenAddress}>
              {token.name} {token.symbol} {token.tokenAddress}
            </div>
          ))}

          <FormField
            control={form.control}
            name="tokenAddress"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <Label>Token</Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tokens?.map((token) => (
                      <SelectItem key={token.tokenAddress} value={token.tokenAddress}>
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
            <Input type="number" {...register("amount")} />
            {errors?.amount && (
              <p className="px-1 text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="container bottom-10">
            <Button className="h-16 w-full" type="submit" disabled={isPending}>
              {isPending && <Spinner />}
              Buy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
