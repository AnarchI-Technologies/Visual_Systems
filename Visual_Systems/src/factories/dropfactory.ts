import type { DropManifest } from "../schema.js";
import { BRAND_IDENTITY } from "../identity/brand.js";

export function createDropManifest(
  name: string,
  theme: string
): DropManifest {

  return {
    id: name
      .toLowerCase()
      .replace(/\s+/g, "_"),

    dropName: name,

    edition: "clean",

    themeName: theme,

    textureProfile: "digital_static",

    glyphBehavior: "brace_frame",

    accentColor: "signal_cyan",

    branding: {
      brandName: BRAND_IDENTITY.NAME,
      systemVersion: BRAND_IDENTITY.SYSTEM_VERSION,
      glyphSystem: BRAND_IDENTITY.GLYPH_SYSTEM,
      tagline: BRAND_IDENTITY.CORE_PHILOSOPHY
    },

    promptProfile: {
      motionProfile: "low_drift",
      creativityTemperature: 0.75,
      styleWeight: 0.85,
      readabilityWeight: 1,
      oversprayIntensity: 0.35
    },

    corruptionProfile: {
      enabled: false,
      gridInstability: 0,
      frameRupture: 0,
      signalNoise: 0,
      signalDrift: 0.15,
      glyphEchoIntensity: 0.1,
      colorBleed: 0,
      motionInstability: 0
    },

    marketplace: {
      title: name,
      shortDescription: "",
      longDescription: "",
      tags: [],
      price: "19.99",
      license: "Standard Commercial Streamer License"
    },

    assets: [],

    createdAt: new Date().toISOString()
    ,updatedAt: new Date().toISOString(),
    serialNumber: ""
  };
}
