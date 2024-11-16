import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { createClient } from "@/lib/supabase/admin";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

export async function POST(req: NextRequest) {
  const { payload } = (await req.json()) as IRequestPayload;

  // Fetch the reference you created in /initiate-payment to ensure the transaction we are verifying is the same one we initiated
  // const reference = "123";

  const supabase = createClient();
  const { data: payment, error } = await supabase
    .from("payments")
    .select()
    .eq("id", payload.reference)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const reference = payment.id;

  // 1. Check that the transaction we received from the mini app is the same one we sent
  if (payload.reference === reference) {
    const response = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${env.NEXT_PUBLIC_WORLDCOIN_APP_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
        },
      },
    );
    const transaction = await response.json();

    // 2. Here we optimistically confirm the transaction.
    // Otherwise, you can poll until the status == mined
    if (transaction.reference == reference && transaction.status != "failed") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  }

  return NextResponse.json({ success: false });
}
