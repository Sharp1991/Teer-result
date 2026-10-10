import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Push subscriptions are not configured." },
      { status: 503 }
    );
  }

  let subscription: any;

  try {
    subscription = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const endpoint = subscription?.endpoint;
  const p256dh = subscription?.keys?.p256dh;
  const auth = subscription?.keys?.auth;

  if (
    typeof endpoint !== "string" ||
    typeof p256dh !== "string" ||
    typeof auth !== "string" ||
    endpoint.length > 4096 ||
    p256dh.length > 512 ||
    auth.length > 512
  ) {
    return NextResponse.json(
      { error: "Invalid push subscription." },
      { status: 400 }
    );
  }

  try {
    const parsedEndpoint = new URL(endpoint);

    if (
      parsedEndpoint.protocol !== "https:" ||
      !["fcm.googleapis.com", "push.services.mozilla.com",
         "updates.push.services.mozilla.com", "web.push.apple.com",
         "wns.windows.com"].some(
        (host) =>
          parsedEndpoint.hostname === host ||
          parsedEndpoint.hostname.endsWith(`.${host}`)
      )
    ) {
      return NextResponse.json(
        { error: "Unsupported push endpoint." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        { endpoint, p256dh, auth },
        { onConflict: "endpoint" }
      );

    if (error) {
      console.error("Failed to save push subscription:", error.message);
      return NextResponse.json(
        { error: "Could not save subscription." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscription request failed:", error);
    return NextResponse.json(
      { error: "Could not process subscription." },
      { status: 500 }
    );
  }
}
