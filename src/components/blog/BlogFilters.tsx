"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import type { BlogCategory } from "@/lib/blog";

interface BlogPost {
  frontmatter: {
    title: string;
    description: string;
    date: string;
    author: string;
    slug: string;
    image: string;
    category: BlogCategory;
    tags: string[];
    locale: string;
    status: string;
  };
  content: string;
  readTime: number;
}

const POSTS_PER_PAGE = 6;

const CATEGORY_KEYS: Record<BlogCategory, string> = {
  all: "categoryAll",
  "corporate-travel": "categoryCorporate",
  luxury: "categoryLuxury",
  "visas-guides": "categoryVisas",
  cyprus: "categoryCyprus",
  cruises: "categoryCruises",
};

export default function BlogFilters({ posts }: { posts: BlogPost[] }) {
  const locale = useLocale();
  const t = useTranslations("blogPage");
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const categories: BlogCategory[] = [
    "all",
    "corporate-travel",
    "luxury",
    "visas-guides",
    "cyprus",
    "cruises",
  ];

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.frontmatter.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.frontmatter.title.toLowerCase().includes(query) ||
          p.frontmatter.description.toLowerCase().includes(query) ||
          p.frontmatter.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [posts, activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const handleCategoryChange = (category: BlogCategory) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-10 space-y-6">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-brand-navy/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-navy/10 bg-white text-sm text-brand-navy placeholder:text-brand-navy/40 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-brand-gold text-brand-navy"
                  : "bg-brand-navy/5 text-brand-navy/60 hover:bg-brand-navy/10 hover:text-brand-navy"
              }`}
            >
              {t(CATEGORY_KEYS[category])}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post) => (
            <Link
              key={post.frontmatter.slug}
              href={`/${locale}/blog/${post.frontmatter.slug}`}
              className="group rounded-2xl border border-brand-navy/10 overflow-hidden hover:shadow-luxury transition-shadow bg-white"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-brand-navy/80 to-brand-dark flex items-center justify-center">
                <span className="text-white/20 text-4xl font-display font-bold">
                  JetSet
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-brand-navy/50 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.frontmatter.date).toLocaleDateString(
                      locale === "ru" ? "ru-RU" : "en-GB",
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime} {t("minRead")}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
                  {post.frontmatter.title}
                </h2>
                <p className="text-sm text-brand-navy/60 leading-relaxed line-clamp-3">
                  {post.frontmatter.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.frontmatter.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-brand-navy/5 text-brand-navy/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center mt-4 text-sm font-semibold text-brand-gold">
                  {t("readMore")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-brand-navy/50 text-lg">{t("noResults")}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium text-brand-navy/60 hover:text-brand-navy hover:bg-brand-navy/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {t("prev")}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-brand-gold text-brand-navy"
                  : "text-brand-navy/60 hover:bg-brand-navy/5"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg text-sm font-medium text-brand-navy/60 hover:text-brand-navy hover:bg-brand-navy/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {t("next")}
          </button>
        </div>
      )}
    </>
  );
}
