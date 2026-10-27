/**
 * axe "empty-table-header": a GFM table whose header row starts with "| |"
 * renders an empty <th>. Every header cell in every post needs a label.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const blogDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "content", "blog");
const DELIMITER_ROW = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;

function cells(row) {
  return row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

describe("blog tables", () => {
  it("have no empty header cells", () => {
    for (const name of readdirSync(blogDir).filter((f) => f.endsWith(".md"))) {
      const lines = readFileSync(join(blogDir, name), "utf-8").split("\n");
      lines.forEach((line, i) => {
        if (i === 0 || !DELIMITER_ROW.test(line) || !lines[i - 1].includes("|")) return;
        const header = cells(lines[i - 1]);
        assert.ok(
          header.every((c) => c.length > 0),
          `${name}:${i}: empty table header cell in "${lines[i - 1]}"`,
        );
      });
    }
  });
});
