import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

/**
 * Convert a markdown string to HTML.
 *
 * remark-html defaults to sanitizing output with hast-util-sanitize's
 * GitHub-style schema — we rely on that default. The previous
 * `sanitize: false` opened a stored-XSS path for any raw HTML in the
 * markdown source (blog content files, future CMS input, etc.), which
 * was then rendered via dangerouslySetInnerHTML.
 *
 * Blog posts in this project are plain markdown (headings, lists,
 * links, tables) and do not need raw HTML passthrough.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(markdown);
  return result.toString();
}
