import citiesData from "../data/cities.json";
import servicesData from "../data/services.json";

export async function GET() {
  const baseUrl = "https://www.scalifyapp.com";
  const now = new Date().toISOString().split("T")[0];

  const urls = [];

  // 1. Homepage
  urls.push({
    loc: `${baseUrl}/`,
    lastmod: now,
    changefreq: "daily",
    priority: "1.0",
  });

  // 2. Global Directories
  urls.push({
    loc: `${baseUrl}/services`,
    lastmod: now,
    changefreq: "weekly",
    priority: "0.9",
  });

  urls.push({
    loc: `${baseUrl}/countries`,
    lastmod: now,
    changefreq: "weekly",
    priority: "0.9",
  });

  // 3. Service Pillar Pages (31 URLs)
  for (const s of servicesData) {
    urls.push({
      loc: `${baseUrl}/services/${s.slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.85",
    });
  }

  // 4. Country Hub Pages (50 URLs)
  const countrySlugs = [...new Set(citiesData.map((c) => c.countrySlug))];
  for (const country of countrySlugs) {
    urls.push({
      loc: `${baseUrl}/countries/${country}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  // 5. Programmatic City x Service Pages (15,500 URLs)
  for (const city of citiesData) {
    for (const service of servicesData) {
      urls.push({
        loc: `${baseUrl}/${city.countrySlug}/${city.citySlug}/${service.slug}`,
        lastmod: now,
        changefreq: "monthly",
        priority: "0.7",
      });
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export const ALL = GET;
export const HEAD = GET;

