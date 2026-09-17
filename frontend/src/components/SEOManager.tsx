import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  buildJsonLdForPage,
  getPageUrl,
  getSeoPage,
  normalizePathname,
  siteLogoUrl,
} from "@/lib/seo";
import { resolveMediaUrl, useSiteContent } from "@/lib/siteContent";

const INDEXABLE_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const NOINDEX_ROBOTS = "noindex, nofollow";

const setMeta = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const setJsonLd = (jsonLd: ReturnType<typeof buildJsonLdForPage>) => {
  document
    .querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"][data-seo-json-ld="true"]')
    .forEach((element) => element.remove());

  if (!jsonLd) return;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.seoJsonLd = "true";
  script.text = JSON.stringify(jsonLd);
  document.head.appendChild(script);
};

const SEOManager = () => {
  const location = useLocation();
  const { content } = useSiteContent();

  useEffect(() => {
    const normalizedPath = normalizePathname(location.pathname);
    const page = getSeoPage(normalizedPath);
    const editablePage = content.seo.pages[page.path];
    const mergedPage = {
      ...page,
      title: editablePage?.title || page.title || content.seo.defaultTitle,
      description: editablePage?.description || page.description || content.seo.defaultDescription,
      keywords: editablePage?.keywords || page.keywords || content.seo.defaultKeywords,
    };
    const canonicalUrl = getPageUrl(mergedPage.path);
    const robots = mergedPage.index === false ? NOINDEX_ROBOTS : INDEXABLE_ROBOTS;
    const logoUrl = resolveMediaUrl(content.identity.logoUrl) || siteLogoUrl;

    document.documentElement.lang = "en-IN";
    document.title = mergedPage.title;

    setCanonical(canonicalUrl);

    setMeta("name", "description", mergedPage.description);
    setMeta("name", "robots", robots);
    setMeta("name", "googlebot", robots);
    setMeta("name", "author", content.identity.companyName);
    setMeta("name", "application-name", content.identity.brandName);

    if (mergedPage.keywords) {
      setMeta("name", "keywords", mergedPage.keywords);
    }

    setMeta("property", "og:site_name", content.identity.brandName);
    setMeta("property", "og:title", mergedPage.title);
    setMeta("property", "og:description", mergedPage.description);
    setMeta("property", "og:type", mergedPage.ogType || "website");
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", logoUrl);
    setMeta("property", "og:locale", "en_IN");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", mergedPage.title);
    setMeta("name", "twitter:description", mergedPage.description);
    setMeta("name", "twitter:image", logoUrl);

    setJsonLd(buildJsonLdForPage(mergedPage));
  }, [content, location.pathname]);

  return null;
};

export default SEOManager;
