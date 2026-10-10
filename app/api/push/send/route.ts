
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TeerResult = {
  result_date: string;
  first_round: string;
  second_round: string;
};

export async function POST(request: Request) {
  const secret = process.env.PUSH_INTERNAL_SECRET;
  const authorization = request.headers.get("authorization") || "";
  const suppliedSecret = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!secret || !suppliedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expected = Buffer.from(secret);
  const supplied = Buffer.from(suppliedSecret);

  if (
    expected.length !== supplied.length ||
    !timingSafeEqual(expected, supplied)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
    VAPID_SUBJECT,
  } = process.env;

  if (
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY ||
    !VAPID_PUBLIC_KEY ||
    !VAPID_PRIVATE_KEY ||
    !VAPID_SUBJECT
  ) {
    return NextResponse.json(
      { error: "Push notification configuration is incomplete." },
      { status: 503 }
    );
  }

  let results: TeerResult[];

  try {
    const body = await request.json();
    results = body.results;

    if (
      !Array.isArray(results) ||
      results.length === 0 ||
      results.length > 10 ||
      !results.every(
        (item: TeerResult) =>
          /^\d{4}-\d{2}-\d{2}$/.test(item?.result_date) &&
          /^\d{2}$/.test(item?.first_round) &&
          /^\d{2}$/.test(item?.second_round)
      )
    ) {
      return NextResponse.json(
        { error: "Invalid results payload." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth");

    if (error) {
      throw new Error("Could not load push subscriptions.");
    }

    if (!subscriptions?.length) {
      return NextResponse.json({
        success: true,
        subscriptions: 0,
        sent: 0,
        failed: 0,
      });
    }

    webpush.setVapidDetails(
      VAPID_SUBJECT,
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );

    let sent = 0;
    let failed = 0;
    let removed = 0;

    await Promise.all(
      subscriptions.map(async (subscription) => {
        const messages = results.map((result) => {
          const date = result.result_date.split("-").reverse().join("-");
          return `${date}: First Round ${result.first_round}, Second Round ${result.second_round}`;
        });

        const payload = JSON.stringify({
          title: "Shillong Teer Results",
          body: messages.join("\n"),
          url: "/",
        });

        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            payload
          );
          sent++;
        } catch (error: unknown) {
          failed++;

          const statusCode =
            typeof error === "object" && error !== null && "statusCode" in error
              ? (error as { statusCode?: number }).statusCode
              : undefined;

          if (statusCode === 404 || statusCode === 410) {
            const { error: deleteError } = await supabase
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", subscription.endpoint);

            if (!deleteError) removed++;
          }
        }
      })
    );

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions.length,
      sent,
      failed,
      removed,
    });
  } catch (error) {
    console.error(
      "Push sender error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Could not send push notifications." },
      { status: 500 }
    );
  }
}
