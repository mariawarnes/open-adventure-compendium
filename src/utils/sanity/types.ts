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
  | "landscape"
  | "vttModule";

export type ResourcePlatform =
  | "any"
  | "talespire"
  | "tabletopSimulator"
  | "vtt";

export type ResourceMaterial = "paper" | "plastic";
export type EntityKind =
  | "character"
  | "creature"
  | "location"
  | "object"
  | "other";

export interface AdventureEncounterEntity {
  _key: string;
  _type: string;
  entity: Entity | AdventureCharacter;
  name?: string;
  quantity: number;
}

export interface AdventureEncounter {
  _key: string;
  _type: string;
  name?: string;
  locations?: AdventureLocation[];
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
  campaignGuide: string;
  edition: Edition[];
  authorSlugs?: string[];
  editionSlugs?: string[];
  recommendedLevels?: AdventureRecommendedLevel[];
  recommendedPartySize?: AdventurePartySize[];
  encounters?: AdventureEncounter[];
  characters?: AdventureCharacter[];
  locations?: AdventureLocation[];
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
}

export interface Entity {
  _id?: string;
  _key?: string;
  slug?: Slug;
  kind?: EntityKind;
  name: string;
  resources?: Resource[];
}

export interface AdventureReference {
  _id?: string;
  name: string;
  slug?: Slug;
}

export interface AdventureCharacter {
  _id?: string;
  _key?: string;
  slug?: Slug;
  entity?: Entity;
  name: string;
  resources?: Resource[];
}

export interface AdventureLocation {
  _id?: string;
  _key?: string;
  slug?: Slug;
  entity?: Entity;
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
  subject?: Entity | AdventureCharacter | AdventureLocation;
  adventure?: AdventureReference;
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

export interface Theme {
  _key: string;
  name: string;
  slug: Slug;
  description?: string;
}

export interface AdventureOptions {
  authors: Author[];
  editions: Edition[];
  duration: AdventureDuration[];
  levels: AdventureRecommendedLevel[];
  partySizes: AdventurePartySize[];
}

export interface AdventureFilters {
  selectedAuthors?: string[];
  selectedEditions?: string[];
  selectedDuration?: AdventureDuration[];
  selectedLevels?: AdventureRecommendedLevel[];
  selectedPartySizes?: AdventurePartySize[];
}
