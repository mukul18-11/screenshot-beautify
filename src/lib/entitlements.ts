import type { ExportScale } from "@/types/editor";
import type {
  EntitlementPlanKey,
  ExportAuthorization,
  ExportAuthorizationRequest,
  FeatureKey,
} from "@/types/entitlements";

export const SNAPINGLY_WATERMARK_TEXT = "Made with Snapingly";

export const FEATURE_KEYS = {
  removeWatermark: "watermark.remove",
} as const satisfies Record<string, FeatureKey>;

export const LOCAL_ENTITLEMENT_PLAN: EntitlementPlanKey = "free";

const LOCAL_MAX_EXPORT_SCALE: ExportScale = 6;

export const LOCAL_FREE_EXPORT_AUTHORIZATION: ExportAuthorization = {
  allowed: true,
  blockedFeatureKeys: [],
  entitlement: LOCAL_ENTITLEMENT_PLAN,
  exportAttemptId: null,
  maxScale: LOCAL_MAX_EXPORT_SCALE,
  quota: null,
  reason: null,
  requiresWatermark: true,
  watermarkText: SNAPINGLY_WATERMARK_TEXT,
};

export function canUseFeature(
  featureKey: FeatureKey,
  entitlement: EntitlementPlanKey,
) {
  if (featureKey === FEATURE_KEYS.removeWatermark) {
    return entitlement === "pro";
  }

  return true;
}

export function authorizeLocalExport({
  usedFeatureKeys,
}: ExportAuthorizationRequest): ExportAuthorization {
  const blockedFeatureKeys = usedFeatureKeys.filter(
    (featureKey) => !canUseFeature(featureKey, LOCAL_ENTITLEMENT_PLAN),
  );

  return {
    ...LOCAL_FREE_EXPORT_AUTHORIZATION,
    allowed: blockedFeatureKeys.length === 0,
    blockedFeatureKeys,
    reason: blockedFeatureKeys.length > 0 ? "pro_required" : null,
  };
}

export function createClientExportId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
