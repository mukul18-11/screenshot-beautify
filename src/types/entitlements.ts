import type { ExportScale } from "@/types/editor";

export type EntitlementPlanKey = "free" | "pro";

export type FeatureKey = "watermark.remove";

export type ExportAction = "download" | "copy";

export type ExportAuthorizationReason =
  | "auth_required"
  | "quota_exceeded"
  | "pro_required"
  | null;

export type ExportAuthorizationQuota = {
  limit: number | null;
  periodEnd: string | null;
  periodStart: string | null;
  used: number | null;
};

export type ExportAuthorization = {
  allowed: boolean;
  blockedFeatureKeys: FeatureKey[];
  entitlement: EntitlementPlanKey;
  exportAttemptId: string | null;
  maxScale: ExportScale;
  quota: ExportAuthorizationQuota | null;
  reason: ExportAuthorizationReason;
  requiresWatermark: boolean;
  watermarkText: string | null;
};

export type ExportAuthorizationRequest = {
  action: ExportAction;
  clientExportId: string;
  requestedScale: ExportScale;
  usedFeatureKeys: FeatureKey[];
};
