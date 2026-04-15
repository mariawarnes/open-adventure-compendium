import type { ImageAsset, Slug } from "sanity";

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

export type AdventurePartySize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

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
  entity: Entity;
  name?: string;
  quantity: number;
}

export interface AdventureEncounter {
  _key: string;
  _type: string;
  encounterName?: string;
  locations?: Location[];
  entities?: AdventureEncounterEntity[];
}

export interface Adventure {
  _key: string;
  _type: "adventures";
  name: string;
  slug: Slug;
  publishedAt: string;
  authors?: Author[];
  duration: AdventureDuration;
  website?: string;
  edition: Edition[];
  system: System[];
  authorSlugs?: string[];
  editionSlugs?: string[];
  systemSlugs?: string[];
  recommendedLevels?: AdventureRecommendedLevel[];
  recommendedPartySize?: AdventurePartySize[];
  encounters?: AdventureEncounter[];
  characters?: Entity[];
  locations?: Location[];
}

export interface Author {
  _key?: string;
  name: string;
  slug: Slug;
}

export interface Edition {
  _key: string;
  name: string;
  slug: Slug;
  systems?: System[];
}

export interface Entity {
  _id?: string;
  _key: string;
  name: string;
  resources?: Resource[];
}

export interface Location {
  _id?: string;
  _key: string;
  name: string;
  resources?: Resource[];
}

export interface Resource {
  _id?: string;
  _key?: string;
  name?: string;
  type: ResourceType;
  material?: ResourceMaterial;
  platform?: ResourcePlatform;
  entity?: Entity;
  location?: Location;
  url?: string;
  image?: ImageAsset;
  attribution?: string;
}

export interface Setting {
  _key: string;
  name: string;
  slug: Slug;
  themes?: Theme[];
}

export interface System {
  _key: string;
  name: string;
  slug: Slug;
}

export interface Theme {
  _key: string;
  name: string;
  slug: Slug;
  description?: string;
}

export interface AdventureOptions {
  authors: Author[];
  editions: Edition[];
  systems: System[];
  duration: AdventureDuration[];
  levels: AdventureRecommendedLevel[];
  partySizes: AdventurePartySize[];
}

export interface AdventureFilters {
  selectedAuthors?: string[];
  selectedEditions?: string[];
  selectedSystems?: string[];
  selectedDuration?: AdventureDuration[];
  selectedLevels?: AdventureRecommendedLevel[];
  selectedPartySizes?: AdventurePartySize[];
}
