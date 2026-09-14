import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readJsonObject } from "../src/lib/json-body.ts";

const request = (body, headers = {}) => new Request("http://localhost/api/contact", {
  method: "POST", headers: { "content-type": "application/json", ...headers }, body,
});

describe("enquiry body parsing", () => {
  it("accepts Unicode JSON objects", async () => {
    const body = { name: "Нотис", message: "Кипр → Афины" };
    assert.deepEqual(await readJsonObject(request(JSON.stringify(body))), { ok: true, body });
  });
  for (const body of ["null", "[]", '"text"', "42", "true", "", "{invalid"]) {
    it(`rejects ${JSON.stringify(body)} with 400`, async () => {
      assert.equal((await readJsonObject(request(body))).status, 400);
    });
  }
  it("rejects non-JSON content types", async () => {
    assert.equal((await readJsonObject(request("{}", { "content-type": "text/plain" }))).status, 415);
  });
  it("rejects oversized declared bodies", async () => {
    assert.equal((await readJsonObject(request("{}", { "content-length": "99999" }))).status, 413);
  });
  it("enforces byte limits even when Content-Length is missing or false", async () => {
    const body = JSON.stringify({ message: "😀".repeat(9000) });
    for (const headers of [{}, { "content-length": "2" }]) {
      assert.equal((await readJsonObject(request(body, headers))).status, 413);
    }
  });
  it("bounds a chunked body and cancels the stream", async () => {
    let cancelled = false;
    const stream = new ReadableStream({
      pull(controller) { controller.enqueue(new Uint8Array(20_000)); },
      cancel() { cancelled = true; },
    });
    const req = new Request("http://localhost", {
      method: "POST", headers: { "content-type": "application/json" }, body: stream, duplex: "half",
    });
    assert.equal((await readJsonObject(req)).status, 413);
    assert.equal(cancelled, true);
  });
});
