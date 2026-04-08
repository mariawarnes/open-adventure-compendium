import type { APIRoute } from "astro";

export const prerender = true;

function getRobotsTxt(site?: URL) {
  const vercelEnv = import.meta.env.VERCEL_ENV;

  if (vercelEnv && vercelEnv !== "production") {
    return ["User-agent: *", "Disallow: /", ""].join("\n");
  }

  const lines = ["User-agent: *", "Allow: /"];

  if (site) {
    lines.push(`Sitemap: ${new URL("/sitemap-index.xml", site).href}`);
  }

  return `${lines.join("\n")}\n`;
}

export const GET: APIRoute = ({ site }) =>
  new Response(getRobotsTxt(site), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
