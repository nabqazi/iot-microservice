import assert from "assert";
import request from "supertest";

import app from "../index.js";

describe("GET /health", () => {
  it("responds with 200", async () => {
    const response = await request(app).get("/health");
    assert.strictEqual(response.status, 200);
  });
});
