import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
