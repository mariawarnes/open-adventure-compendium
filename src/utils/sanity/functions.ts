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
  Entity,
  Resource,
  Theme,
} from "./types";

declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

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

const env = typeof process !== "undefined" ? process.env : {};

const projectId = resolveEnvValue(
  import.meta.env.SANITY_STUDIO_PROJECT_ID,
  import.meta.env.SANITY_PROJECT_ID,
  import.meta.env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
  import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  import.meta.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  env?.SANITY_STUDIO_PROJECT_ID,
  env?.SANITY_PROJECT_ID,
  env?.PUBLIC_SANITY_STUDIO_PROJECT_ID,
  env?.PUBLIC_SANITY_PROJECT_ID,
  env?.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

const dataset =
  resolveEnvValue(
    import.meta.env.SANITY_STUDIO_DATASET,
    import.meta.env.SANITY_DATASET,
    import.meta.env.PUBLIC_SANITY_STUDIO_DATASET,
    import.meta.env.PUBLIC_SANITY_DATASET,
    import.meta.env.NEXT_PUBLIC_SANITY_DATASET,
    env?.SANITY_STUDIO_DATASET,
    env?.SANITY_DATASET,
    env?.PUBLIC_SANITY_STUDIO_DATASET,
    env?.PUBLIC_SANITY_DATASET,
    env?.NEXT_PUBLIC_SANITY_DATASET,
  ) || "production";

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity configuration. Set SANITY_STUDIO_PROJECT_ID or SANITY_PROJECT_ID in your Vercel environment variables.",
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

const resourceFields = `
  _id,
  name,
  type,
  material,
  platform,
  "subject": subject->{
    _id,
    _type,
    name,
    slug
  },
  url,
  image,
  attribution
`;

const encounterLocationProjection = `
  _id,
  _type,
  slug,
  name,
  "entity": select(
    _type == "locations" && defined(entity) => entity->{
      _id,
      _type,
      name,
      slug
    },
    _type == "entities" => {
      _id,
      _type,
      name,
      slug
    },
    null
  ),
  "resources": *[
    _type == "resources" &&
    (
      subject._ref == ^._id ||
      subject._ref == ^.entity._ref
    )
  ] | order(name asc) {
    ${resourceFields}
  }
`;

const encounterEntityProjection = `
  _key,
  _type,
  quantity,
  "name": entity->name,
  "slug": entity->slug,
  "entity": entity->{
    _id,
    _type,
    name,
    slug,
    "resources": *[
      _type == "resources" &&
      (
        subject._ref == ^._id ||
        subject._ref == ^.entity._ref
      )
    ] | order(name asc) {
      ${resourceFields}
    }
  }
`;

export async function getEditionsList(): Promise<Edition[]> {
  return await sanityClient.fetch(
    groq`*[_type == "editions" && count(*[_type == "adventures" && edition._ref == ^._id]) > 0] | order(name asc) {
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
    groq`*[_type == "authors" && count(*[_type == "adventures" && ^._id in authors[]._ref]) > 0] | order(name asc)`,
  );
}

export async function getThemesList(): Promise<Theme[]> {
  return await sanityClient.fetch(
    groq`*[_type == "themes" && count(*[_type == "adventures" && ^._id in themes[]._ref]) > 0] | order(name asc)`,
  );
}

export async function getLevelsList(): Promise<string[]> {
  return await sanityClient.fetch(
    groq`array::unique(*[
      _type == "adventures" &&
      defined(recommendedLevels)
    ].recommendedLevels[]) | order(@ asc)`,
  );
}

export async function getPartySizeList(): Promise<string[]> {
  return await sanityClient.fetch(
    groq`array::unique(*[
      _type == "adventures" &&
      defined(recommendedPartySize)
    ].recommendedPartySize[]) | order(@ asc)`,
  );
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

export async function getResourcesByCharacter(
  slug: string,
): Promise<Resource[]> {
  return await sanityClient.fetch(
    groq`*[_type == "characters" && slug.current == $slug][0]{
      "resources": *[
        _type == "resources" &&
        (
          subject._ref == ^._id ||
          subject._ref == ^.entity._ref
        )
      ] | order(name asc) {
        ${resourceFields}
      }
    }.resources`,
    {
      slug,
    },
  );
}

export async function getResourcesByEntity(slug: string): Promise<Resource[]> {
  return await sanityClient.fetch(
    groq`*[_type == "entities" && slug.current == $slug][0]{
      "resources": *[
        _type == "resources" &&
        (
          subject._ref == ^._id ||
          subject._ref == ^.entity._ref
        )
      ] | order(name asc) {
        ${resourceFields}
      }
    }.resources`,
    {
      slug,
    },
  );
}

export async function getEncounter(slug: string): Promise<AdventureEncounter> {
  return await sanityClient.fetch(
    groq`(*[_type == "adventures"].encounters[])[slug.current == $slug][0]{
        _key,
        _type,
        slug,
        name,
        locations[]->{
          ${encounterLocationProjection}
        },
        entities[]{
          ${encounterEntityProjection}
        }
    }`,
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

export async function getEntity(slug: string): Promise<Entity> {
  return await sanityClient.fetch(
    groq`*[_type == "entities"][slug.current == $slug][0]`,
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
    conditions.push(`edition->slug.current in $selectedEditions`);
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
        _id,
        _type,
        name,
        slug,
        icon{
          _type,
          provider,
          name,
          svg
        },
        publishedAt,
        duration,
        website,
        recommendedLevels,
        recommendedPartySize,
        "authors": authors[]->{
          _id,
          name,
          slug
        },
        "themes": themes[]->{
          _id,
          name,
          slug,
          description
        },
        "edition": edition->{
          _id,
          name,
          slug,
          longName
        },
        "authorSlugs": authors[]->slug.current,
        "editionSlugs": select(defined(edition) => [edition->slug.current], [])
      }
    `,
    params,
  );
}

export async function getAdventure(slug: string): Promise<Adventure> {
  return await sanityClient.fetch(
    groq`
    *[_type == "adventures" && slug.current == $slug][0] {
      _id,
      _type,
      name,
      slug,
      icon{
        _type,
        provider,
        name,
        svg
      },
      "themes": themes[]->{
        _id,
        slug,
        name,
        description
      },
      publishedAt,
      website,
      campaignGuide,
      duration,
      recommendedLevels,
      recommendedPartySize,
      edition->{
        _id,
        slug,
        name,
        longName
      },
      "authors": authors[]->{
        _id,
        slug,
        name
      },
      "authorSlugs": authors[]->slug.current,
      "editionSlugs": select(defined(edition) => [edition->slug.current], []),
      encounters[]{
        _key,
        _type,
        slug,
        name,
        locations[]->{
          ${encounterLocationProjection}
        },
        entities[]{
          ${encounterEntityProjection}
        }
      }
    }`,
    {
      slug,
    },
  );
}
