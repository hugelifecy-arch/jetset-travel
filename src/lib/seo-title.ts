/**
 * Document <title> rules (Bing Webmaster, Oct 2026: titles over 70
 * characters are a High-severity issue; we keep a margin at 65).
 *
 * Pure functions, no Next imports, so tests/ and scripts/ can use them.
 */

/** Hard ceiling for any rendered <title>. */
export const MAX_TITLE_LENGTH = 65;

/** Brand suffix for blog post titles (was " | JetSet Travel Cyprus"). */
export const BLOG_TITLE_SUFFIX = " | JetSet";

/**
 * Length in characters as a reader (and Bing) counts them: Unicode code
 * points, so Cyrillic and "—" count as one each, never as their UTF-8 bytes.
 */
export function titleLength(title: string): number {
  return [...title].length;
}

/**
 * The <title> for a blog post. `seoTitle` from frontmatter wins and is used
 * as written (it already carries the brand if it wants one). Otherwise the
 * post title gets " | JetSet", unless that would push it past the limit, in
 * which case the bare title is used. The H1, og:title and twitter:title
 * always keep the full post title; only <title> is shortened.
 */
export function blogDocumentTitle(post: { title: string; seoTitle?: string }): string {
  if (post.seoTitle?.trim()) return post.seoTitle.trim();
  const withSuffix = `${post.title}${BLOG_TITLE_SUFFIX}`;
  return titleLength(withSuffix) <= MAX_TITLE_LENGTH ? withSuffix : post.title;
}
