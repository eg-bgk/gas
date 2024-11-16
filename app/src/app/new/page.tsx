"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { createTokenSchema, useCreateToken } from "@/lib/worldcoin/use-create-token";
import { CreateTokenData } from "@/lib/worldcoin/use-create-token";

export default function NewTokenPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTokenData>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      name: "",
      ticker: "",
      description: "",
    },
  });

  const { mutate: createToken, isPending } = useCreateToken({
    onSuccess() {
      console.log("Token created");
    },
  });

  const onSubmit = handleSubmit((data) => {
    createToken(data);
  });

  return (
    <div>
      <h1>Create a token</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label>Name</Label>
          <Input {...register("name")} />
          {errors?.name && <p className="px-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label>Ticker</Label>
          <Input {...register("ticker")} />
          {errors?.ticker && (
            <p className="px-1 text-xs text-destructive">{errors.ticker.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label>Description</Label>
          <Input {...register("description")} />
          {errors?.description && (
            <p className="px-1 text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Create
        </Button>
      </form>
    </div>
  );
}
