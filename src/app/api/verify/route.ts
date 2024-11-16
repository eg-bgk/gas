import { verifyCloudProof, IVerifyResponse, ISuccessResult } from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env.mjs";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as IRequestPayload;

  const verifyRes = (await verifyCloudProof(
    payload,
    env.NEXT_PUBLIC_WORLDCOIN_APP_ID as `app_${string}`,
    action,
    signal,
  )) as IVerifyResponse; // Wrapper on this

  console.log("Verify response: ", verifyRes);

  if (verifyRes.success) {
    // This is where you should perform backend actions if the verification succeeds
    // Such as, setting a user as "verified" in a database
    return NextResponse.json({ success: true, status: 200 });
  } else {
    // This is where you should handle errors from the World ID /verify endpoint.
    // Usually these errors are due to a user having already verified.
    return NextResponse.json({ success: false, status: 400 });
  }
}
