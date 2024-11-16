import { NextResponse } from "next/server";

export async function POST() {
  // const uuid = crypto.randomUUID().replace(/-/g, "");
  const uuid = "123";

  // TODO: Store the ID field in your database so you can verify the payment later

  return NextResponse.json({ id: uuid });
}
