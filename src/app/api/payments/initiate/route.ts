import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/admin";

export async function POST() {
  const uuid = crypto.randomUUID().replace(/-/g, "");
  // const uuid = "123";

  const supabase = createClient();
  const { error } = await supabase.from("payments").insert({
    id: uuid,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: uuid });
}
