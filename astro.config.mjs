// Loading environment variables from .env files
// https://docs.astro.build/en/guides/configuring-astro/#environment-variables
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";

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

// https://astro.build/config
export default defineConfig(({ mode }) => {
  const {
    PUBLIC_SANITY_STUDIO_PROJECT_ID,
    PUBLIC_SANITY_STUDIO_DATASET,
    PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_PROJECTID,
    PUBLIC_SANITY_DATASET,
    PUBLIC_SITE_URL,
    SITE_URL,
    VERCEL_ENV,
    VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_URL,
  } = loadEnv(mode, process.cwd(), "");

  // Different environments use different variables
  const projectId =
    PUBLIC_SANITY_STUDIO_PROJECT_ID ||
    PUBLIC_SANITY_PROJECT_ID ||
    PUBLIC_SANITY_PROJECTID;
  const dataset = PUBLIC_SANITY_STUDIO_DATASET || PUBLIC_SANITY_DATASET;
  const isVercelProduction = VERCEL_ENV === "production";
  const site = resolveSiteUrl(
    SITE_URL,
    PUBLIC_SITE_URL,
    isVercelProduction ? VERCEL_PROJECT_PRODUCTION_URL : undefined,
    isVercelProduction ? VERCEL_URL : undefined,
  );

  return {
    site,
    // Hybrid+adapter is required to support embedded Sanity Studio
    output: "hybrid",
    adapter: vercel(),
    integrations: [
      sanity({
        projectId,
        dataset,
        // studioBasePath: "/admin",
        useCdn: false,
        // `false` if you want to ensure fresh data
        apiVersion: "2024-12-08", // Set to date of setup to use the latest API version
      }),
      react(), // Required for Sanity Studio
      ...(site ? [sitemap()] : []),
    ],
  };
});
