import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { fileURLToPath } from "url";
import { ThemeDNA } from "./themeLibrary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let PARTS_BIN: {
  accents: string[];
  textures: string[];
  behaviors: string[];
  vocabularies: Record<string, string[]>;
};

try {
  PARTS_BIN = JSON.parse(
    fs.readFileSync(path.join(__dirname, "partsBin.data.json"), "utf-8")
  );
} catch (err) {
  console.error(`\n[CRITICAL ERROR] Failed to load partsBin.data.json.`);
  console.error(`The file appears to be corrupted with plain text: "already exists...".`);
  console.error(`This usually happens if 'setup.bat' was run previously. Delete the corrupted data files and run the updated setup script.\n`);
  process.exit(1);
}

/**
 * ANARCHI THEME GENERATOR
 * Populates themes.json with deterministic combinations from the Parts Bin.
 */
function seededNumber(seed: string): number {
  const hex = crypto.createHash("sha256").update(seed).digest("hex").slice(0, 12);
  return parseInt(hex, 16) / 0xffffffffffff;
}

function pick<T>(items: T[], seed: string): T {
  return items[Math.floor(seededNumber(seed) * items.length) % items.length];
}

export function createThemeBatch(
  count: number = 100,
  seedPrefix = "anarchi-surface-system",
  existingThemes: ThemeDNA[] = []
): ThemeDNA[] {
  const themes = [...existingThemes];
  const usedIds = new Set<string>();
  themes.forEach(t => usedIds.add(t.id));

  const targetCount = themes.length + count;
  let cursor = 0;

  while (themes.length < targetCount) {
    const seed = `${seedPrefix}:${cursor++}`;
    const accent = pick(PARTS_BIN.accents, `${seed}:accent`);
    const texture = pick(PARTS_BIN.textures, `${seed}:texture`);
    const behavior = pick(PARTS_BIN.behaviors, `${seed}:behavior`);
    
    const themeId = `${accent}_${texture}_${behavior}`.toLowerCase();

    if (!usedIds.has(themeId)) {
      usedIds.add(themeId);

      // Select a vocabulary set based on the theme style
      const vocabKeys = Object.keys(PARTS_BIN.vocabularies);
      const vocabKey = pick(vocabKeys, `${seed}:vocabulary`) as keyof typeof PARTS_BIN.vocabularies;

      // Rarity Roll (Deterministic Distribution)
      const roll = Math.floor(seededNumber(`${seed}:rarity`) * 100);
      let rarity: 'common' | 'uncommon' | 'rare' | 'legendary' = 'common';
      let corruptionRange = [0, 0.4];

      if (roll > 95) {
        rarity = 'legendary';
        corruptionRange = [0.85, 1.0];
      } else if (roll > 85) {
        rarity = 'rare';
        corruptionRange = [0.65, 0.85];
      } else if (roll > 60) {
        rarity = 'uncommon';
        corruptionRange = [0.35, 0.65];
      }

      const corruption = (seededNumber(`${seed}:corruption`) * (corruptionRange[1] - corruptionRange[0])) + corruptionRange[0];

      themes.push({
        id: themeId,
        name: themeId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: `A ${rarity.toUpperCase()} deterministic build using ${accent} highlights, ${texture} textures, and ${behavior} motion behaviors.`,
        accentColor: accent,
        corruptionLevel: corruption,
        textureProfile: texture,
        glyphBehavior: behavior,
        promptVocabulary: PARTS_BIN.vocabularies[vocabKey].slice(0, 5),
        rarity: rarity,
        approved: true
      });
    }
  }

  return themes;
}

export function generateThemes(count: number = 100, seedPrefix = "anarchi-surface-system"): ThemeDNA[] {
  const outputPath = path.join(__dirname, "themes.json");
  let themes: ThemeDNA[] = [];
  const usedIds = new Set<string>();

  if (fs.existsSync(outputPath)) {
    try {
      const data = fs.readFileSync(outputPath, "utf-8");
      const parsed = JSON.parse(data);
      
      if (Array.isArray(parsed)) {
        themes = parsed;
        themes.forEach(t => usedIds.add(t.id));
        console.log(`Loaded ${themes.length} existing themes from ${outputPath}.`);
      } else {
        console.warn(`[WARNING] ${outputPath} format is invalid (expected array). Resetting catalog.`);
      }
    } catch (err) {
      console.error(`[CRITICAL] Failed to read ${outputPath}: File is corrupted or invalid JSON. Starting a fresh theme catalog.`);
      themes = [];
    }
  }

  console.log(`Appending ${count} deterministic unique theme combinations...`);

  themes = createThemeBatch(count, seedPrefix, themes);

  fs.writeFileSync(outputPath, JSON.stringify(themes, null, 2));
  console.log(`Successfully wrote ${themes.length} themes to ${outputPath}`);
  return themes;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateThemes(100);
}
