import { NextResponse } from "next/server";

import { hasForbiddenImagePayload } from "@/lib/api/image-payload-guard";
import { getAuthenticatedUser } from "@/lib/api/require-user";
import { authorizeLocalExport } from "@/lib/entitlements";
import type { ExportScale } from "@/types/editor";
import type { ExportAction, FeatureKey } from "@/types/entitlements";

export const dynamic = "force-dynamic";

const EXPORT_ACTIONS = new Set<ExportAction>(["copy", "download"]);
const EXPORT_SCALES = new Set<ExportScale>([1, 2, 4, 6]);
const FEATURE_KEYS = new Set<FeatureKey>(["watermark.remove"]);

function createNoStoreJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

function isExportAction(value: unknown): value is ExportAction {
  return typeof value === "string" && EXPORT_ACTIONS.has(value as ExportAction);
}

function isExportScale(value: unknown): value is ExportScale {
  return typeof value === "number" && EXPORT_SCALES.has(value as ExportScale);
}

function getFeatureKeys(value: unknown): FeatureKey[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (featureKey): featureKey is FeatureKey =>
      typeof featureKey === "string" &&
      FEATURE_KEYS.has(featureKey as FeatureKey),
  );
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

  const { action, clientExportId, requestedScale, usedFeatureKeys } = body as {
    action?: unknown;
    clientExportId?: unknown;
    requestedScale?: unknown;
    usedFeatureKeys?: unknown;
  };

  if (
    !isExportAction(action) ||
    typeof clientExportId !== "string" ||
    clientExportId.trim().length === 0 ||
    !isExportScale(requestedScale)
  ) {
    return createNoStoreJson(
      { error: "Invalid export authorization request." },
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

  const authorization = authorizeLocalExport({
    action,
    clientExportId,
    requestedScale,
    usedFeatureKeys: getFeatureKeys(usedFeatureKeys),
  });

  return createNoStoreJson({
    authorization: {
      ...authorization,
      exportAttemptId: clientExportId,
    },
    userId: user?.id ?? null,
  });
}
