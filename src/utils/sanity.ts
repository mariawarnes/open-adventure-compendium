import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";
import { sanityClient } from "sanity:client";

export async function getResources(): Promise<Resources[]> {
  return await sanityClient.fetch(
    groq`*[_type == "resource" && defined(slug.current)] | order(_createdAt desc)`
  );
}

export async function getResource(slug: string): Promise<Resources> {
  return await sanityClient.fetch(
    groq`*[_type == "resource" && slug.current == $slug][0]`,
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
  _type: "adventures";
  name: string;
  slug?: Slug;
  publishedAt: string;
  authors?: Authors[];
  duration: AdventureDuration;
  website?: string;
  edition: Editions[];
  system: Systems[];
  recommendedLevels?: AdventureRecommendedLevel[];
  recommendedPartySize?: AdventurePartySize[];
  encounters?: AdventureEncounter[];
}

export interface Authors {
  name: string;
}

export interface Editions {
  name: string;
  slug: Slug;
  systems?: Systems[];
}

export interface Entities {
  name: string;
}

export interface Locations {
  name: string;
}

export interface Resources {
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
  name: string;
  slug: Slug;
  themes?: Themes[];
}

export interface Systems {
  name: string;
  slug: Slug;
}

export interface Themes {
  name: string;
  slug: Slug;
  description?: string;
}