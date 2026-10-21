import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { defaultSchema } from "hast-util-sanitize";

/**
 * GitHub sanitize schema plus the `tel:` protocol. The default schema strips
 * `tel:` hrefs, so every "[Call: +357 …](tel:…)" link in a post rendered as a
 * dead `<a>` with no href (audit 2026-10-21, F-04). Only the href protocol
 * list is widened; raw HTML is still sanitized exactly as before.
 */
const schema = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href ?? []), "tel"],
  },
};

/**
 * Convert a markdown string to HTML.
 *
 * remark-html defaults to sanitizing output with hast-util-sanitize's
 * GitHub-style schema — we rely on that default. The previous
 * `sanitize: false` opened a stored-XSS path for any raw HTML in the
 * markdown source (blog content files, future CMS input, etc.), which
 * was then rendered via dangerouslySetInnerHTML.
 *
 * remark-gfm is required for pipe tables: without it CommonMark treats
 * them as plain paragraphs, so posts ship literal "| --- |" text and the
 * blog template's prose-table styles never apply. The GitHub sanitize
 * schema already allows table/thead/tbody/tr/th/td, so GFM output
 * survives sanitization.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: schema })
    .process(markdown);
  return result.toString();
}
