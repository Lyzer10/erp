import assert from "node:assert/strict";
import test from "node:test";
import { isExistingBucketResponse } from "./storage-errors";

test("recognizes the Supabase duplicate bucket response", () => {
  assert.equal(
    isExistingBucketResponse(400, {
      statusCode: "409",
      error: "Duplicate",
      message: "The resource already exists",
      code: "BucketAlreadyExists",
    }),
    true,
  );
});

test("does not hide unrelated storage errors", () => {
  assert.equal(isExistingBucketResponse(400, { code: "InvalidRequest" }), false);
  assert.equal(isExistingBucketResponse(401, { code: "Unauthorized" }), false);
});
