"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { createTokenSchema, useCreateToken } from "@/lib/worldcoin/use-create-token";
import { CreateTokenData } from "@/lib/worldcoin/use-create-token";

export default function NewTokenPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTokenData>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      name: "",
      ticker: "",
      description: "",
      image: undefined,
    },
  });

  const router = useRouter();
  const { mutate: createToken, isPending } = useCreateToken({
    onSuccess() {
      console.log("Token created");
      router.push("/");
    },
  });

  const onFileChange = (file: File | undefined) => {
    if (file) {
      setValue("image", file); // Update form value
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = handleSubmit((data) => {
    console.log("data", data);

    createToken(data);
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button size={"icon"} variant={"secondary"} className="rounded-full">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="font-heading text-3xl font-bold">Create Token</h1>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Name</Label>
        <Input {...register("name")} />
        {errors?.name && <p className="px-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label>Ticker</Label>
        <Input {...register("ticker")} />
        {errors?.ticker && <p className="px-1 text-xs text-destructive">{errors.ticker.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label>Description</Label>
        <Input {...register("description")} />
        {errors?.description && (
          <p className="px-1 text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label>Image</Label>
        <label className="group">
          <div className="relative h-32 w-full rounded-md bg-secondary">
            {imagePreview && (
              <Image
                unoptimized
                src={imagePreview}
                fill
                alt="Block image"
                className="rounded-md object-contain"
              />
            )}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span
                className={cn(
                  "items-center gap-2 whitespace-nowrap rounded-full bg-black/80 px-4 py-2 font-medium text-white",
                )}
              >
                Choose Image
              </span>
            </div>
          </div>
          <input
            type="file"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? undefined)}
            className="hidden"
            disabled={isPending}
          />
        </label>
      </div>

      <div
        className="mt-auto"
        // className="container absolute bottom-10 left-0 flex"
      >
        <Button className="h-16 w-full text-xl tracking-wide" type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Create
        </Button>
      </div>
    </form>
  );
}
