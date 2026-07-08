import { NextResponse } from "next/server";

import { hasForbiddenImagePayload } from "@/lib/api/image-payload-guard";
import { getAuthenticatedUser } from "@/lib/api/require-user";

export const dynamic = "force-dynamic";

const EXPORT_STATUSES = new Set(["failed", "succeeded"]);

function createNoStoreJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return createNoStoreJson({ error: "Invalid request body." }, { status: 400 });
  }

  if (hasForbiddenImagePayload(body)) {
    return createNoStoreJson(
      { error: "Image payloads are not accepted by export routes." },
      { status: 400 },
    );
  }

  const {
    exportAttemptId,
    failureCode,
    outputPixelHeight,
    outputPixelWidth,
    status,
  } = body as {
    exportAttemptId?: unknown;
    failureCode?: unknown;
    outputPixelHeight?: unknown;
    outputPixelWidth?: unknown;
    status?: unknown;
  };

  if (
    typeof exportAttemptId !== "string" ||
    !EXPORT_STATUSES.has(String(status)) ||
    typeof outputPixelWidth !== "number" ||
    typeof outputPixelHeight !== "number"
  ) {
    return createNoStoreJson(
      { error: "Invalid export completion request." },
      { status: 400 },
    );
  }

  const { configured, user } = await getAuthenticatedUser();

  if (configured && !user) {
    return createNoStoreJson(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  if (status === "failed") {
    console.error("[export] client-reported failure", {
      exportAttemptId,
      failureCode: typeof failureCode === "string" ? failureCode : null,
      outputPixelHeight,
      outputPixelWidth,
      userAgent: request.headers.get("user-agent"),
      userId: user?.id ?? null,
    });
  }

  return createNoStoreJson({
    exportAttemptId,
    failureCode: typeof failureCode === "string" ? failureCode : null,
    ok: true,
    status,
    userId: user?.id ?? null,
  });
}
