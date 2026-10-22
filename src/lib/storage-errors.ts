export function isExistingBucketResponse(status: number, payload: unknown) {
  if (status === 409) return true;
  if (!payload || typeof payload !== "object") return false;
  const error = payload as { code?: unknown; statusCode?: unknown };
  return error.code === "BucketAlreadyExists" || error.statusCode === "409";
}
