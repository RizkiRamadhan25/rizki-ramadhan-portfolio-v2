import { useEffect } from "react";

import {
  getAbsoluteUrl,
  siteConfig,
} from "../data/site";

function updateMetaTag({
  name,
  property,
  content,
}) {
  const selector = name
    ? `meta[name="${name}"]`
    : `meta[property="${property}"]`;

  let element =
    document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");

    if (name) {
      element.setAttribute("name", name);
    }

    if (property) {
      element.setAttribute(
        "property",
        property
      );
    }

    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function updateCanonical(href) {
  let canonical = document.head.querySelector(
    'link[rel="canonical"]'
  );

  if (!canonical) {
    canonical =
      document.createElement("link");

    canonical.setAttribute(
      "rel",
      "canonical"
    );

    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", href);
}

export function usePageMetadata({
  title = siteConfig.defaultTitle,
  description,
  path = "/",
  image = siteConfig.defaultImage,
  type = "website",
  robots = "index, follow",
  language = "en",
}) {
  useEffect(() => {
    const pageUrl = getAbsoluteUrl(path);
    const imageUrl = getAbsoluteUrl(image);

    const pageDescription =
      description ||
      siteConfig.descriptions.en;

    const locale =
      siteConfig.locales[language] ||
      siteConfig.locales.en;

    document.title = title;

    updateMetaTag({
      name: "description",
      content: pageDescription,
    });

    updateMetaTag({
      name: "robots",
      content: robots,
    });

    updateMetaTag({
      property: "og:title",
      content: title,
    });

    updateMetaTag({
      property: "og:description",
      content: pageDescription,
    });

    updateMetaTag({
      property: "og:type",
      content: type,
    });

    updateMetaTag({
      property: "og:url",
      content: pageUrl,
    });

    updateMetaTag({
      property: "og:image",
      content: imageUrl,
    });

    updateMetaTag({
      property: "og:locale",
      content: locale,
    });

    updateMetaTag({
      name: "twitter:card",
      content: "summary_large_image",
    });

    updateMetaTag({
      name: "twitter:title",
      content: title,
    });

    updateMetaTag({
      name: "twitter:description",
      content: pageDescription,
    });

    updateMetaTag({
      name: "twitter:image",
      content: imageUrl,
    });

    updateCanonical(pageUrl);
  }, [
    title,
    description,
    path,
    image,
    type,
    robots,
    language,
  ]);
}