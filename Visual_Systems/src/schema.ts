/**
 * AnarchI Studio
 * Drop Schema v1
 *
 * This is the master contract used by:
 * - Prompt Generator
 * - Asset Packager
 * - Marketplace Exporter
 * - Future UI
 */

export type DropEdition =
  | "clean"
  | "corrupted";

export type AccentColor =
  | "signal_cyan"
  | "toxic_green"
  | "ember_red"
  | "industrial_orange";

export interface AssetDefinition {
  id: string;
  name: string;
  type: string;

  width: number;
  height: number;

  enabled: boolean;
}

export interface CorruptionProfile {
  enabled: boolean;

  gridInstability: number;
  frameRupture: number;

  signalNoise: number;
  signalDrift: number;

  glyphEchoIntensity: number;

  colorBleed: number;

  motionInstability: number;
}

export interface PromptProfile {
  motionProfile: string;

  creativityTemperature: number;

  styleWeight: number;

  readabilityWeight: number;

  oversprayIntensity: number;
}

export interface BrandingProfile {
  brandName: string;

  systemVersion: string;

  glyphSystem: string;

  tagline: string;
}

export interface MarketplaceProfile {
  title: string;

  shortDescription: string;

  longDescription: string;

  tags: string[];

  price: string;

  license: string;
}

export interface DropManifest {
  id: string;

  dropName: string;

  edition: DropEdition;

  themeName: string;

  textureProfile: string;

  glyphBehavior: string;

  accentColor: AccentColor;

  branding: BrandingProfile;

  promptProfile: PromptProfile;

  corruptionProfile: CorruptionProfile;

  marketplace: MarketplaceProfile;

  assets: AssetDefinition[];

  createdAt: string;

  updatedAt: string;

  serialNumber: string;
}