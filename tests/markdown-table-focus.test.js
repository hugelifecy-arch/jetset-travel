/**
 * Article tables scroll sideways on phones, so they must be focusable for
 * keyboard users (axe: scrollable-region-focusable, WCAG 2.1.1).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { markdownToHtml } from "../src/lib/markdown.ts";

describe("markdown tables", () => {
  it("renders GFM tables with tabindex=0", async () => {
    const html = await markdownToHtml("| a | b |\n|---|---|\n| 1 | 2 |\n");
    assert.match(html, /<table tabindex="0">/);
  });

  it("still strips author-supplied attributes such as event handlers", async () => {
    const html = await markdownToHtml('<table onclick="x()"><tr><td>1</td></tr></table>');
    assert.ok(!html.includes("onclick"));
  });
});
