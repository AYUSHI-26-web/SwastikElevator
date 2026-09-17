import logoImage from "@/assets/optimized/logo-160.jpg";

export const SITE_NAME = "Swastik Elevator";
export const COMPANY_NAME = "Himanchal Enterprises";
export const DEFAULT_SITE_URL = "https://swastik-lift-elevate-main.vercel.app";

const normalizeSiteUrl = (url: string) => {
  const value = url.trim().replace(/\/+$/, "");
  if (!value) return DEFAULT_SITE_URL;

  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
};

export const SITE_URL = normalizeSiteUrl(import.meta.env.VITE_SITE_URL || __SITE_URL__ || DEFAULT_SITE_URL);

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
  keywords?: string;
  schemaType?: "WebPage" | "AboutPage" | "CollectionPage" | "ContactPage";
  index?: boolean;
  priority?: string;
  changefreq?: string;
  ogType?: "website" | "article";
  blogPosting?: {
    headline: string;
    datePublished: string;
    dateModified?: string;
    authorName?: string;
  };
};

export const publicSeoPages: SeoPage[] = [
  {
    path: "/",
    title: "Swastik Elevator Kanpur | Lift Installation, AMC & Modernization",
    description:
      "Swastik Elevator provides lift installation, AMC maintenance, modernization, emergency repair, and genuine spare parts in Kanpur.",
    breadcrumbLabel: "Home",
    keywords:
      "lift installation Kanpur, elevator maintenance Kanpur, elevator repair Kanpur, AMC lift service, Swastik Elevator",
    schemaType: "WebPage",
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    path: "/about",
    title: "About Swastik Elevator | Himanchal Enterprises Kanpur",
    description:
      "Learn about Swastik Elevator, a unit of Himanchal Enterprises serving Kanpur with safe elevator engineering and 24/7 support.",
    breadcrumbLabel: "About",
    keywords: "about Swastik Elevator, Himanchal Enterprises, elevator company Kanpur",
    schemaType: "AboutPage",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/services",
    title: "Elevator Services in Kanpur | Installation, AMC, Repair",
    description:
      "Book elevator installation, annual maintenance contracts, modernization, emergency repair, and spare parts support in Kanpur.",
    breadcrumbLabel: "Services",
    keywords:
      "elevator services Kanpur, lift AMC Kanpur, elevator installation, elevator modernization, lift repair",
    schemaType: "CollectionPage",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/projects",
    title: "Elevator Projects in Kanpur | Swastik Elevator Portfolio",
    description:
      "View Swastik Elevator projects across residential, commercial, healthcare, industrial, and heritage buildings in Kanpur.",
    breadcrumbLabel: "Projects",
    keywords: "elevator projects Kanpur, lift installation portfolio, commercial elevator projects",
    schemaType: "CollectionPage",
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/gallery",
    title: "Lift Installation Gallery | Swastik Elevator Kanpur",
    description:
      "Browse elevator cabins, panoramic glass lifts, field installation work, modernization panels, and maintenance photos from Kanpur.",
    breadcrumbLabel: "Gallery",
    keywords: "lift gallery Kanpur, elevator cabin photos, glass lift photos, elevator installation images",
    schemaType: "CollectionPage",
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact Swastik Elevator Kanpur | Free Site Survey",
    description:
      "Contact Swastik Elevator for a free site survey, 24/7 lift breakdown help, AMC quotes, and elevator installation guidance.",
    breadcrumbLabel: "Contact",
    keywords: "contact Swastik Elevator, lift repair Kanpur phone, elevator site survey Kanpur",
    schemaType: "ContactPage",
    priority: "0.9",
    changefreq: "weekly",
  },
];

const privateSeoPages: SeoPage[] = [
  {
    path: "/admin",
    title: "Admin Login | Swastik Elevator",
    description: "Admin access for Swastik Elevator.",
    breadcrumbLabel: "Admin",
    index: false,
  },
  {
    path: "/admin/register",
    title: "Admin Registration | Swastik Elevator",
    description: "Admin registration for Swastik Elevator.",
    breadcrumbLabel: "Admin Registration",
    index: false,
  },
];

export const seoPages = [...publicSeoPages, ...privateSeoPages];

export const normalizePathname = (pathname: string) => {
  const withoutQuery = pathname.split("?")[0].split("#")[0] || "/";
  const withLeadingSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : "/";
};

export const getPageUrl = (pathname: string) => {
  const path = normalizePathname(pathname);
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
};

export const toAbsoluteUrl = (value: string) => {
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
};

export const siteLogoUrl = toAbsoluteUrl(logoImage);

export const getSeoPage = (pathname: string): SeoPage => {
  const path = normalizePathname(pathname);
  const page = seoPages.find((item) => item.path === path);

  if (page) return page;

  return {
    path,
    title: "Page Not Found | Swastik Elevator",
    description: "The requested Swastik Elevator page could not be found.",
    breadcrumbLabel: "Page Not Found",
    index: false,
  };
};

const organizationId = `${SITE_URL}/#organization`;
const localBusinessId = `${SITE_URL}/#localbusiness`;
const websiteId = `${SITE_URL}/#website`;

const businessAddress = {
  "@type": "PostalAddress",
  streetAddress: "Panki Kanpur nagar",
  addressLocality: "Kanpur",
  addressRegion: "Uttar Pradesh",
  addressCountry: "IN",
};

const sameAs = [
  "https://www.instagram.com/swastik_elevetor_kanpur?igsh=MWltcDQxc2J4YXEzeQ==",
];

const businessPhone = "+91 8318326578";
const technicalPhone = "+91 8318503363";
const businessEmail = "himanchalenterprises6@gmail.com";

const baseGraph = [
  {
    "@type": "Organization",
    "@id": organizationId,
    name: SITE_NAME,
    alternateName: COMPANY_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: siteLogoUrl,
    },
    sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: businessPhone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
      {
        "@type": "ContactPoint",
        telephone: technicalPhone,
        contactType: "technical support",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
  },
  {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": localBusinessId,
    name: SITE_NAME,
    alternateName: COMPANY_NAME,
    url: SITE_URL,
    image: siteLogoUrl,
    logo: siteLogoUrl,
    telephone: [businessPhone, technicalPhone],
    email: businessEmail,
    priceRange: "INR",
    address: businessAddress,
    areaServed: [
      {
        "@type": "City",
        name: "Kanpur",
      },
      {
        "@type": "AdministrativeArea",
        name: "Uttar Pradesh",
      },
      {
        "@type": "Place",
        name: "North India",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    hasMap: "https://www.google.com/maps/search/?api=1&query=Panki+Kanpur+nagar%2C+Uttar+Pradesh",
    sameAs,
    parentOrganization: {
      "@id": organizationId,
    },
  },
  {
    "@type": "WebSite",
    "@id": websiteId,
    name: SITE_NAME,
    alternateName: COMPANY_NAME,
    url: SITE_URL,
    publisher: {
      "@id": organizationId,
    },
    inLanguage: "en-IN",
  },
];

const buildBreadcrumbSchema = (page: SeoPage) => {
  const canonicalUrl = getPageUrl(page.path);
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ];

  if (page.path !== "/") {
    itemListElement.push({
      "@type": "ListItem",
      position: 2,
      name: page.breadcrumbLabel,
      item: canonicalUrl,
    });
  }

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement,
  };
};

const buildWebPageSchema = (page: SeoPage) => {
  const canonicalUrl = getPageUrl(page.path);

  return {
    "@type": page.schemaType || "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: page.title,
    description: page.description,
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": localBusinessId,
    },
    publisher: {
      "@id": organizationId,
    },
    breadcrumb: {
      "@id": `${canonicalUrl}#breadcrumb`,
    },
    inLanguage: "en-IN",
  };
};

const buildBlogPostingSchema = (page: SeoPage) => {
  if (!page.blogPosting) return null;

  const canonicalUrl = getPageUrl(page.path);

  return {
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#blogposting`,
    mainEntityOfPage: {
      "@id": `${canonicalUrl}#webpage`,
    },
    headline: page.blogPosting.headline,
    description: page.description,
    image: siteLogoUrl,
    datePublished: page.blogPosting.datePublished,
    dateModified: page.blogPosting.dateModified || page.blogPosting.datePublished,
    author: {
      "@type": "Person",
      name: page.blogPosting.authorName || SITE_NAME,
    },
    publisher: {
      "@id": organizationId,
    },
    inLanguage: "en-IN",
  };
};

export const buildJsonLdForPage = (page: SeoPage) => {
  if (page.index === false) return null;

  const graph = [...baseGraph, buildWebPageSchema(page), buildBreadcrumbSchema(page)];
  const blogPosting = buildBlogPostingSchema(page);

  if (blogPosting) graph.push(blogPosting);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};
