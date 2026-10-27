/**
 * Heading anchors, table of contents and call-to-action placement for blog
 * articles.
 *
 * Runs on the sanitized HTML returned by markdownToHtml(). The sanitizer
 * prefixes any id it lets through with "user-content-", so ids are added
 * here, after sanitizing, in the same way as the table tabindex in
 * markdown.ts. Only bare `<h2>`…`<h6>` tags are touched; the sanitizer never
 * emits attributes on headings, so nothing an author wrote can reach the id.
 *
 * Pure string functions with no Node or Next imports, so the unit tests in
 * tests/ can import this file directly.
 */

export type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface ArticleHeading {
  level: HeadingLevel;
  /** Visible text of the heading: tags stripped, entities decoded. */
  text: string;
  id: string;
  /** Index in the returned HTML where the heading's opening tag starts. */
  offset: number;
  /** Not nested inside another element, so the HTML can be split here. */
  topLevel: boolean;
}

export interface TocItem {
  id: string;
  text: string;
}

/** A contents list is only worth showing for articles with this many H2s. */
export const MIN_TOC_HEADINGS = 3;

/** Long slugs make unwieldy URLs, especially percent-encoded Cyrillic. */
const MAX_SLUG_LENGTH = 64;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, ref: string) => {
    if (ref.startsWith("#")) {
      const hex = ref[1] === "x" || ref[1] === "X";
      const codePoint = parseInt(ref.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isInteger(codePoint) && codePoint > 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : match;
    }
    return NAMED_ENTITIES[ref.toLowerCase()] ?? match;
  });
}

/** Plain text of a heading's inner HTML. */
export function headingText(innerHtml: string): string {
  return decodeEntities(innerHtml.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * URL fragment for a heading. Keeps letters and digits from any script, so
 * Russian headings get readable Cyrillic slugs instead of an empty string:
 * "Что такое VIP-сервис?" → "что-такое-vip-сервис". Punctuation is dropped,
 * dashes and whitespace collapse to single hyphens. Returns "" when nothing
 * usable is left; the caller supplies a fallback.
 */
export function slugifyHeading(text: string): string {
  const slug = text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‐-―−]/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}\s-]+/gu, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length <= MAX_SLUG_LENGTH) return slug;
  const cut = slug.slice(0, MAX_SLUG_LENGTH);
  const lastHyphen = cut.lastIndexOf("-");
  return (lastHyphen >= MAX_SLUG_LENGTH / 2 ? cut.slice(0, lastHyphen) : cut).replace(
    /-+$/,
    "",
  );
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
  "source", "track", "wbr",
]);

/**
 * Give every bare `<h2>`…`<h6>` a unique slug id and list the headings in
 * document order. Ids in `reservedIds` (ids the page layout already uses)
 * are never handed out; a clashing heading gets a "-1" suffix instead.
 */
export function addHeadingIds(
  html: string,
  reservedIds: Iterable<string> = [],
): { html: string; headings: ArticleHeading[] } {
  const used = new Set(reservedIds);
  const headings: ArticleHeading[] = [];
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let out = "";
  let copiedUpTo = 0;
  let depth = 0;

  for (let match = tagRe.exec(html); match; match = tagRe.exec(html)) {
    const [tag, closing, rawName] = match;
    const name = rawName.toLowerCase();
    if (closing) {
      depth = Math.max(0, depth - 1);
      continue;
    }
    if (VOID_ELEMENTS.has(name) || tag.endsWith("/>")) continue;

    const level = /^h([2-6])$/.exec(name);
    if (level && tag === `<${name}>`) {
      const close = html.indexOf(`</${name}>`, tagRe.lastIndex);
      if (close !== -1) {
        const text = headingText(html.slice(tagRe.lastIndex, close));
        const id = uniqueId(slugifyHeading(text) || "section", used);
        out += html.slice(copiedUpTo, match.index);
        headings.push({
          level: Number(level[1]) as HeadingLevel,
          text,
          id,
          offset: out.length,
          topLevel: depth === 0,
        });
        out += `<${name} id="${id}">`;
        copiedUpTo = tagRe.lastIndex;
      }
    }
    depth++;
  }

  return { html: out + html.slice(copiedUpTo), headings };
}

/** H2 entries for the contents list, or null when there are too few. */
export function buildToc(headings: readonly ArticleHeading[]): TocItem[] | null {
  const items = headings
    .filter((h) => h.level === 2)
    .map(({ id, text }) => ({ id, text }));
  return items.length >= MIN_TOC_HEADINGS ? items : null;
}

const CONCLUSION_RE =
  /\b(conclusion|final thoughts|bottom line|summary|wrapping up|verdict)\b|заключени|итог|вывод|резюме/i;

/**
 * Where the in-article call to action goes, as an offset into the HTML:
 * after the second H2 section (before the third H2) when there are at least
 * three H2s; otherwise before the conclusion — a heading that reads like one,
 * or the last of two H2s. null means "after the article body".
 */
export function ctaInsertOffset(headings: readonly ArticleHeading[]): number | null {
  const h2 = headings.filter((h) => h.level === 2 && h.topLevel);
  if (h2.length >= 3) return h2[2].offset;
  const conclusion = h2.find((h) => CONCLUSION_RE.test(h.text));
  if (conclusion) return conclusion.offset;
  if (h2.length === 2) return h2[1].offset;
  return null;
}
