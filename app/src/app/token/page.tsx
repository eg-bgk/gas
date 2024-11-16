"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BuyForm } from "@/components/buy-form";
import { ProtectedPage } from "@/components/protected-page";
import { SellForm } from "@/components/sell-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BuyPage() {
  const [selectedTab, setSelectedTab] = useState("buy");

  return (
    <ProtectedPage>
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="flex w-full flex-col gap-4"
      >
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button size={"icon"} variant={"secondary"} className="rounded-full">
              <ArrowLeft />
            </Button>
          </Link>
        </div>

        <TabsList>
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>

        {selectedTab === "buy" && (
          <TabsContent value="buy" className="flex w-full flex-1 flex-col">
            <BuyForm />
          </TabsContent>
        )}
        {selectedTab === "sell" && (
          <TabsContent value="sell" className="flex w-full flex-1 flex-col">
            <SellForm />
          </TabsContent>
        )}
      </Tabs>
    </ProtectedPage>
  );
}
