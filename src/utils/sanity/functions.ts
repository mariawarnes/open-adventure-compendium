import { createClient } from "@sanity/client";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import groq from "groq";
import type {
  Adventure,
  AdventureDuration,
  AdventureFilters,
  Author,
  Edition,
  Resource,
  System,
} from "./types";

const projectId =
  import.meta.env.PUBLIC_SANITY_STUDIO_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECTID;

const dataset =
  import.meta.env.PUBLIC_SANITY_STUDIO_DATASET ||
  import.meta.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity configuration. Set PUBLIC_SANITY_PROJECT_ID (or legacy PUBLIC_SANITY_PROJECTID) and PUBLIC_SANITY_DATASET.",
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

export async function getSystemsList(): Promise<System[]> {
  return await sanityClient.fetch(
    groq`*[_type == "systems"] | order(name asc)`,
  );
}

export async function getEditionsList(): Promise<Edition[]> {
  return await sanityClient.fetch(
    groq`*[_type == "editions"] | order(name asc) {
      name,
      slug,
      "systems": systems[]->{name, slug}
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

export async function getResourcesList(): Promise<Resource[]> {
  return await sanityClient.fetch(
    groq`*[_type == "resources"] | order(name asc)`,
  );
}

export async function getResource(
  slug?: string,
  location?: string,
): Promise<Resource | undefined> {
  let conditions: string = `_type == "resources"`;
  let param: string = "";

  if (slug != null && slug != "") {
    conditions += `slug.current == $slug][0]`;
    param = slug;
  } else if (location != null && location !== "") {
    conditions += `entity.name == $location][0]`;
    param = location;
  }

  return await sanityClient.fetch(groq`*[${conditions}] | order(name asc)`, {
    location: param,
  });
}

export async function getAdventuresList(
  filters: AdventureFilters = {},
): Promise<Adventure[]> {
  const selectedAuthors = filters.selectedAuthors || [];
  const selectedEditions = filters.selectedEditions || [];
  const selectedSystems = filters.selectedSystems || [];
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

  if (selectedEditions.length > 0) {
    conditions.push(
      `count((edition[]->slug.current)[@ in $selectedEditions]) > 0`,
    );
    params.selectedEditions = selectedEditions;
  }

  if (selectedSystems.length > 0) {
    conditions.push(
      `count((system[]->slug.current)[@ in $selectedSystems]) > 0`,
    );
    params.selectedSystems = selectedSystems;
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
        "edition": edition[]->{
          _key,
          name,
          slug
        },
        "system": system[]->{
          _key,
          name,
          slug
        },
        "authorSlugs": authors[]->slug.current,
        "editionSlugs": edition[]->slug.current,
        "systemSlugs": system[]->slug.current
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
      publishedAt,
      website,
      duration,
      recommendedLevels,
      recommendedPartySize,
      "edition": edition[]->{
        _key,
        slug,
        name
      },
      "system": system[]->{
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
      "systemSlugs": system[]->slug.current,
      locations[]->{
        _id,
        _key,
        name,
        "resources": *[
          _type == "resources" &&
          location._ref == ^._id
        ]{
          _id,
          type,
          url,
          attribution,
          image
        }
      },
      characters[]->{
        _id,
        _key,
        name,
        "resources": *[
          _type == "resources" &&
          entity._ref == ^._id
        ]{
          _id,
          type,
          url,
          attribution,
          image
        }
      },
      encounters[]{
        _key,
        _type,
        encounterName,
        locations[]->{
          _id,
          _key,
          name,
          "resources": *[
            _type == "resources" &&
            location._ref == ^._id
          ]{ _id, type, url, attribution, image }
        },
        entities[]{
          _key,
          _type,
          name,
          quantity,
          entity->{
            _id,
            _key,
            name,
            "resources": *[
              _type == "resources" &&
              entity._ref == ^._id
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
