/**
 * Audit 2026-10-21 (F-19): an unquoted numeric YAML tag (`- 2026`) parsed as a
 * number and crashed the blog search (tag.toLowerCase is not a function).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getAllPosts } from "../src/lib/blog.ts";

describe("blog: frontmatter tags are strings", () => {
  for (const post of getAllPosts()) {
    it(`${post.frontmatter.slug} has only string tags`, () => {
      assert.ok(Array.isArray(post.frontmatter.tags));
      for (const tag of post.frontmatter.tags) assert.equal(typeof tag, "string");
    });
  }
});
