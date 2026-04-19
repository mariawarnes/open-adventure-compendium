import { createClient } from "@sanity/client";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import groq from "groq";
import type {
  Adventure,
  AdventureCharacter,
  AdventureDuration,
  AdventureEncounter,
  AdventureFilters,
  AdventureLocation,
  Author,
  Edition,
  Resource,
} from "./types";

function resolveEnvValue(
  ...values: Array<string | undefined>
): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();

    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
}

const projectId = resolveEnvValue(import.meta.env.SANITY_STUDIO_PROJECT_ID);

const dataset =
  resolveEnvValue(import.meta.env.SANITY_STUDIO_DATASET) || "production";

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity configuration. Set SANITY_STUDIO_PROJECT_ID in your env file.",
  );
}

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-12-08",
  useCdn: false,
});

const builder = createImageUrlBuilder({
  projectId,
  dataset,
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function getEditionsList(): Promise<Edition[]> {
  return await sanityClient.fetch(
    groq`*[_type == "editions"] | order(name asc) {
      name,
      slug
    }`,
  );
}

export async function getDurationList(): Promise<AdventureDuration[]> {
  return ["one-shot", "multi-session"];
}

export async function getAuthorsList(): Promise<Author[]> {
  return await sanityClient.fetch(
    groq`*[_type == "authors"] | order(name asc)`,
  );
}

export async function getThemesList(): Promise<Author[]> {
  return await sanityClient.fetch(groq`*[_type == "themes"] | order(name asc)`);
}

export async function getResourcesList(): Promise<Resource[]> {
  return await sanityClient.fetch(
    groq`*[_type == "resources"] | order(name asc)`,
  );
}

export async function getCharactersByAdventure(
  adventureSlug: string,
): Promise<AdventureCharacter[]> {
  return await sanityClient.fetch(
    groq`*[_type == "characters" && adventure->slug.current == $adventureSlug] {
      name,
      slug,
      adventure->{
        slug
      },
      entity->{
        name
      }
    }`,
    {
      adventureSlug,
    },
  );
}

export async function getLocationsByAdventure(
  adventureSlug: string,
): Promise<AdventureLocation[]> {
  return await sanityClient.fetch(
    groq`*[_type == "locations" && adventure->slug.current == $adventureSlug] {
      name,
      slug,
      adventure->{
        slug
      },
      entity->{
        name
      }
    }`,
    {
      adventureSlug,
    },
  );
}

export async function getEncounter(slug: string): Promise<AdventureEncounter> {
  return await sanityClient.fetch(
    groq`(*[_type == "adventures"].encounters[])[slug.current == $slug][0]`,
    {
      slug,
    },
  );
}

export async function getLocation(slug: string): Promise<AdventureLocation> {
  return await sanityClient.fetch(
    groq`*[_type == "locations"][slug.current == $slug][0]`,
    {
      slug,
    },
  );
}

export async function getCharacter(slug: string): Promise<AdventureCharacter> {
  return await sanityClient.fetch(
    groq`*[_type == "characters"][slug.current == $slug][0]`,
    {
      slug,
    },
  );
}

export async function getAdventuresList(
  filters: AdventureFilters = {},
): Promise<Adventure[]> {
  const selectedAuthors = filters.selectedAuthors || [];
  const selectedEditions = filters.selectedEditions || [];
  const selectedThemes = filters.selectedThemes || [];
  const selectedDuration = filters.selectedDuration || [];
  const selectedLevels = filters.selectedLevels || [];
  const selectedPartySizes = filters.selectedPartySizes || [];

  const conditions = [`_type == "adventures"`];
  const params: Record<string, string[]> = {};

  if (selectedAuthors.length > 0) {
    conditions.push(
      `count((authors[]->slug.current)[@ in $selectedAuthors]) > 0`,
    );
    params.selectedAuthors = selectedAuthors;
  }

  if (selectedThemes.length > 0) {
    conditions.push(
      `count((themes[]->slug.current)[@ in $selectedThemes]) > 0`,
    );
    params.selectedThemes = selectedThemes;
  }

  if (selectedEditions.length > 0) {
    conditions.push(
      `count((edition[]->slug.current)[@ in $selectedEditions]) > 0`,
    );
    params.selectedEditions = selectedEditions;
  }

  if (selectedDuration.length > 0) {
    conditions.push(`duration in $selectedDuration`);
    params.selectedDuration = selectedDuration;
  }

  if (selectedLevels.length > 0) {
    conditions.push(`count((recommendedLevels)[@ in $selectedLevels]) > 0`);
    params.selectedLevels = selectedLevels;
  }

  if (selectedPartySizes.length > 0) {
    conditions.push(
      `count((recommendedPartySize)[@ in $selectedPartySizes]) > 0`,
    );
    params.selectedPartySizes = selectedPartySizes;
  }

  return await sanityClient.fetch(
    groq`
      *[${conditions.join(" && ")}] | order(_createdAt desc) {
        _key,
        _type,
        name,
        slug,
        publishedAt,
        duration,
        website,
        recommendedLevels,
        recommendedPartySize,
        "authors": authors[]->{
          _key,
          name,
          slug
        },
        "theme": theme[]->{
          _key,
          name,
          slug
        },
        "edition": edition[]->{
          _key,
          name,
          slug
        },
        "authorSlugs": authors[]->slug.current,
        "editionSlugs": edition[]->slug.current
      }
    `,
    params,
  );
}

export async function getAdventure(slug: string): Promise<Adventure> {
  return await sanityClient.fetch(
    groq`
    *[_type == "adventures" && slug.current == $slug][0] {
      _key,
      _type,
      name,
      slug,
      theme,
      publishedAt,
      website,
      campaignGuide,
      duration,
      recommendedLevels,
      recommendedPartySize,
      "edition": edition[]->{
        _key,
        slug,
        name
      },
      "authors": authors[]->{
        _key,
        slug,
        name
      },
      "authorSlugs": authors[]->slug.current,
      "editionSlugs": edition[]->slug.current,
      encounters[]{
        _key,
        _type,
        slug,
        name,
        locations[]->{
          _id,
          _key,
          slug,
          name,
          entity->{
            _id,
            name,
            slug,
            kind
          },
          "resources": *[
            _type == "resources" &&
            (
              subject._ref == ^._id ||
              entity._ref == ^._id ||
              location._ref == ^._id
            )
          ]{ _id, type, url, attribution, image }
        },
        entities[]{
          _key,
          _type,
          name,
          slug,
          quantity,
          entity->{
            _id,
            _key,
            name,
            slug,
            kind,
            "resources": *[
              _type == "resources" &&
              (
                subject._ref == ^._id ||
                entity._ref == ^._id ||
                location._ref == ^._id
              )
            ]{ _id, type, url, attribution, image }
          }
        }
      }
    }`,
    {
      slug,
    },
  );
}
