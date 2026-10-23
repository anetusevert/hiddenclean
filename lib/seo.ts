import type { Metadata } from "next";

export const feedTypes = {
  "text/plain": "/llms.txt",
  "application/rss+xml": "/feed.xml",
  "application/json": "/tips.json",
} as const;

/** Canonical plus feed alternates. Child `alternates` replace the layout's, so every page sets both. */
export function pageAlternates(canonical: string): Metadata["alternates"] {
  return { canonical, types: { ...feedTypes } };
}

export function collectionLd(opts: { name: string; url: string; description: string; items: { name: string; url: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Lowercase, Wi-Fi as wifi, punctuation to spaces. Two phrases "match" when this is equal. */
export function normalizeQuery(value: string) {
  return value
    .toLowerCase()
    .replace(/wi-fi/g, "wifi")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** URL slug from a search phrase. */
export function slugify(value: string) {
  return normalizeQuery(value).replace(/ /g, "-");
}

/** "<H1>. <answer>", cut at a word boundary so it fits a search snippet. */
export function metaDescription(title: string, answer: string, max = 160) {
  const full = `${title}. ${answer}`;
  if (full.length <= max) return full;
  const cut = full.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function itemListLd(opts: { name: string; url: string; items: { name: string; url: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    url: opts.url,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
