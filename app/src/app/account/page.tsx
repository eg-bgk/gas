"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button size={"icon"} variant={"secondary"} className="rounded-full">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="font-heading text-3xl font-bold">Account</h1>
      </div>

      <div className="mt-auto w-full">
        <Button className="h-16 w-full gap-5 text-xl tracking-wide" onClick={() => signOut}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
