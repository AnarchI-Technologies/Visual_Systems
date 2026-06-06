import * as fs from "fs";
import * as path from "path";
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
function generateThemes(count: number = 100) {
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

  console.log(`Appending ${count} new unique theme combinations...`);

  const targetCount = themes.length + count;

  while (themes.length < targetCount) {
    const accentIdx = Math.floor(Math.random() * PARTS_BIN.accents.length);
    const textureIdx = Math.floor(Math.random() * PARTS_BIN.textures.length);
    const behaviorIdx = Math.floor(Math.random() * PARTS_BIN.behaviors.length);

    const accent = PARTS_BIN.accents[accentIdx];
    const texture = PARTS_BIN.textures[textureIdx];
    const behavior = PARTS_BIN.behaviors[behaviorIdx];
    
    const themeId = `${accent}_${texture}_${behavior}`.toLowerCase();

    if (!usedIds.has(themeId)) {
      usedIds.add(themeId);

      // Select a vocabulary set based on the theme style
      const vocabKeys = Object.keys(PARTS_BIN.vocabularies);
      const vocabKey = vocabKeys[Math.floor(Math.random() * vocabKeys.length)] as keyof typeof PARTS_BIN.vocabularies;

      // Rarity Roll (Deterministic Distribution)
      const roll = Math.floor(Math.random() * 100);
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

      const corruption = (Math.random() * (corruptionRange[1] - corruptionRange[0])) + corruptionRange[0];

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

  fs.writeFileSync(outputPath, JSON.stringify(themes, null, 2));
  console.log(`Successfully wrote ${themes.length} themes to ${outputPath}`);
}

// Run generator
generateThemes(100);