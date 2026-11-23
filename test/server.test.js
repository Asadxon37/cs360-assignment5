import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { createAppServer } from "../src/server.js";

describe("HTTP API", () => {
  let server;
  let baseURL;

  before(async () => {
    server = createAppServer();
    await new Promise((resolve) => server.listen(0, resolve));
    baseURL = `http://localhost:${server.address().port}`;
  });

  after(() => new Promise((resolve) => server.close(resolve)));

  async function request(method, path, body) {
    const response = await fetch(`${baseURL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : undefined };
  }

  test("BUG-101: grade request for a deleted student returns 404", async () => {
    const created = await request("POST", "/transcripts", { name: "Mira" });
    const id = created.body.studentID;
    await request("POST", `/transcripts/${id}/CS360`, { grade: 88 });
    assert.equal((await request("GET", `/transcripts/${id}/CS360`)).status, 200);

    assert.equal((await request("DELETE", `/transcripts/${id}`)).status, 204);

    assert.equal((await request("GET", `/transcripts/${id}/CS360`)).status, 404);
  });
});
