"use client";

import { useTranslations } from "next-intl";

export default function SocialShare({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const t = useTranslations("blogPage");
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "LinkedIn",
    },
    {
      name: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: "X",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Facebook",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      label: "WhatsApp",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-brand-navy/60">
        {t("share")}:
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-brand-navy/5 text-brand-navy/60 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
          aria-label={`Share on ${link.name}`}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
