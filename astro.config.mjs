// Loading environment variables from .env files
// https://docs.astro.build/en/guides/configuring-astro/#environment-variables
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// Change this depending on your hosting provider (Vercel, Netlify etc)
// https://docs.astro.build/en/guides/server-side-rendering/#adding-an-adapter
import vercel from "@astrojs/vercel";

function resolveSiteUrl(...values) {
  for (const value of values) {
    if (!value) {
      continue;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      continue;
    }

    const candidate = /^https?:\/\//.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    try {
      return new URL(candidate).href;
    } catch {
      // Ignore invalid values and continue to the next fallback.
    }
  }

  return undefined;
}

const {
  PUBLIC_SITE_URL,
  SITE_URL,
  VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL,
} = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

const isVercelProduction = VERCEL_ENV === "production";
const site = resolveSiteUrl(
  SITE_URL,
  PUBLIC_SITE_URL,
  isVercelProduction ? VERCEL_PROJECT_PRODUCTION_URL : undefined,
  isVercelProduction ? VERCEL_URL : undefined,
);

// https://astro.build/config
export default defineConfig({
  site,
  adapter: vercel(),
  integrations: [
    react(), // Required for Sanity Studio
    ...(site ? [sitemap()] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
