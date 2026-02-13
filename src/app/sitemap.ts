import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rubikone.ch";

  const routes = [
    "",
    "/konzept",
    "/koeniz",
    "/ueber-uns",
    "/impulsworkshop",
    "/kontakt",
    "/raumgestaltung",
    "/impressum",
    "/datenschutz",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/konzept" || route === "/koeniz" ? 0.9 : 0.7,
  }));
}
