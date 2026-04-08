import { createClient } from "@sanity/client";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

const projectId =
  import.meta.env.PUBLIC_SANITY_STUDIO_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECTID;

const dataset =
  import.meta.env.PUBLIC_SANITY_STUDIO_DATASET ||
  import.meta.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity configuration. Set PUBLIC_SANITY_PROJECT_ID (or legacy PUBLIC_SANITY_PROJECTID) and PUBLIC_SANITY_DATASET."
  );
}

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-12-08",
  useCdn: false,
});

export async function getResourcesList(): Promise<Resources[]> {
  return await sanityClient.fetch(
    groq`*[_type == "resources"] | order(_createdAt desc)`
  );
}

export async function getResource(slug: string): Promise<Resources> {
  return await sanityClient.fetch(
    groq`*[_type == "resources" && slug.current == $slug][0]`,
    {
      slug,
    }
  );
}

export async function getAdventuresList(): Promise<Adventures[]> {
  return await sanityClient.fetch(
    groq`*[_type == "adventures"] | order(_createdAt desc)`
  );
}

export async function getAdventure(slug: string): Promise<Adventures> {
  return await sanityClient.fetch(
    groq`
    *[_type == "adventures" && slug.current == $slug][0] {
      authors[] {
        name
      },
      website,
      encounters[] {
        _key,
        _type,
        encounterName,
        locations[]->{
          _key,
          name
        },
      },
      characters[]->{
        _key,
        name
      }
    }`,
    {
      slug,
    }
  );
}

export type AdventureDuration = "one-shot" | "multi-session";

export type AdventureRecommendedLevel =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20";

export type AdventurePartySize =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8";

export type ResourceType =
  | "campaignGuide"
  | "map"
  | "playlist"
  | "soundboard"
  | "mini"
  | "token"
  | "terrain"
  | "itemCard"
  | "handout"
  | "portrait"
  | "vttModule";

export type ResourcePlatform =
  | "any"
  | "talespire"
  | "tabletopSimulator"
  | "vtt";

export type ResourceMaterial = "paper" | "plastic";

export interface AdventureEncounterEntity {
  _key: string;
  _type: string;
  entity: Entities[];
  name?: string;
  quantity: number;
}

export interface AdventureEncounter {
  _key: string;
  _type: string;
  encounterName?: string;
  locations?: Locations[];
  entities?: AdventureEncounterEntity[];
}

export interface Adventures {
  _key: string;
  _type: "adventures";
  name: string;
  slug: Slug;
  publishedAt: string;
  authors?: Authors[];
  duration: AdventureDuration;
  website?: string;
  edition: Editions[];
  system: Systems[];
  recommendedLevels?: AdventureRecommendedLevel[];
  recommendedPartySize?: AdventurePartySize[];
  encounters?: AdventureEncounter[];
  characters?: Entities[];
}

export interface Authors {
  name: string;
}

export interface Editions {
  _key: string;
  name: string;
  slug: Slug;
  systems?: Systems[];
}

export interface Entities {
  _key: string;
  name: string;
}

export interface Locations {
  _key: string;
  name: string;
}

export interface Resources {
  _key: string;
  type: ResourceType;
  material?: ResourceMaterial;
  platform?: ResourcePlatform;
  entity?: Entities[];
  location?: Locations[];
  url?: string;
  image?: ImageAsset;
  attribution?: string;
}

export interface Settings {
  _key: string;
  name: string;
  slug: Slug;
  themes?: Themes[];
}

export interface Systems {
  _key: string;
  name: string;
  slug: Slug;
}

export interface Themes {
  _key: string;
  name: string;
  slug: Slug;
  description?: string;
}
