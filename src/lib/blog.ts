import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export const BLOG_CATEGORIES = [
  "all",
  "corporate-travel",
  "luxury",
  "visas-guides",
  "cyprus",
  "cruises",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
  image: string;
  category: BlogCategory;
  tags: string[];
  locale: string;
  status: "draft" | "published";
  translationSlug?: string; // slug of the equivalent post in the other language
}

export interface BlogPost {
  frontmatter: BlogPostFrontmatter;
  content: string;
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getAllPosts(locale?: string): (BlogPost & { readTime: number })[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const filePath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = data as BlogPostFrontmatter;
    return {
      frontmatter,
      content,
      readTime: estimateReadTime(content),
    };
  });

  const filtered = locale
    ? posts.filter((p) => p.frontmatter.locale === locale)
    : posts;

  return filtered.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
}

export function getPublishedPosts(locale?: string) {
  return getAllPosts(locale).filter((p) => p.frontmatter.status === "published");
}

export function getPostBySlug(slug: string): (BlogPost & { readTime: number }) | null {
  const posts = getAllPosts();
  return posts.find((p) => p.frontmatter.slug === slug) ?? null;
}

export function getPostsByCategory(category: BlogCategory, locale?: string) {
  const posts = getPublishedPosts(locale);
  if (category === "all") return posts;
  return posts.filter((p) => p.frontmatter.category === category);
}

export function getAllCategories(): BlogCategory[] {
  return [...BLOG_CATEGORIES];
}

export function getPostTranslationSlug(slug: string): { en?: string; ru?: string } {
  const post = getPostBySlug(slug);
  if (!post) return {};

  const locale = post.frontmatter.locale;
  const translationSlug = post.frontmatter.translationSlug;

  if (translationSlug) {
    // Paired post exists in the other language
    if (locale === "en") {
      return { en: slug, ru: translationSlug };
    }
    return { en: translationSlug, ru: slug };
  }

  // Single-language post
  if (locale === "en") {
    return { en: slug };
  }
  return { ru: slug };
}
