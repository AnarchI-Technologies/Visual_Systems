/**
 * ANARCHI STUDIO - BRAND IDENTITY CONSTANTS
 * Protected under Trademark and Copyright
 * 
 * This file now supports dynamic loading for UI plug-and-play support.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const identityPath = path.join(__dirname, "identity.data.json");
let identityDNA: any = {};

try {
  if (fs.existsSync(identityPath)) {
    identityDNA = JSON.parse(fs.readFileSync(identityPath, "utf-8"));
  }
} catch (e) {
  console.error("[ERROR] Failed to load identity.data.json, using core fallbacks.");
}

export const BRAND_IDENTITY = {
  NAME: identityDNA.NAME || "AnarchI",
  SYSTEM_VERSION: identityDNA.SYSTEM_VERSION || "Surface Systems v1",
  GLYPH_SYSTEM: identityDNA.GLYPH_SYSTEM || "{ A I }",
  CORE_PHILOSOPHY: identityDNA.CORE_PHILOSOPHY || "Structured interference.",
  COPYRIGHT_HOLDER: identityDNA.COPYRIGHT_HOLDER || "AnarchI Studio"
};

export type AccentColorHex = "#00ffff" | "#adff2f" | "#ff4500" | "#ff8c00";

export const ACCENT_MAP: Record<string, string> = identityDNA.ACCENTS || {
  signal_cyan: "#00ffff",
  toxic_green: "#adff2f",
  ember_red: "#ff4500",
  industrial_orange: "#ff8c00"
};
