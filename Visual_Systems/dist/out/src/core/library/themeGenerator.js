"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const PARTS_BIN = JSON.parse(fs.readFileSync(path.join(__dirname, "partsBin.data.json"), "utf-8"));
/**
 * ANARCHI THEME GENERATOR
 * Populates themes.json with deterministic combinations from the Parts Bin.
 */
function generateThemes(count = 100) {
    const outputPath = path.join(__dirname, "themes.json");
    let themes = [];
    const usedIds = new Set();
    if (fs.existsSync(outputPath)) {
        try {
            const data = fs.readFileSync(outputPath, "utf-8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                themes = parsed;
                themes.forEach(t => usedIds.add(t.id));
                console.log(`Loaded ${themes.length} existing themes from ${outputPath}.`);
            }
            else {
                console.warn(`[WARNING] ${outputPath} format is invalid (expected array). Resetting catalog.`);
            }
        }
        catch (err) {
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
            const vocabKey = vocabKeys[Math.floor(Math.random() * vocabKeys.length)];
            // Rarity Roll (Deterministic Distribution)
            const roll = Math.floor(Math.random() * 100);
            let rarity = 'common';
            let corruptionRange = [0, 0.4];
            if (roll > 95) {
                rarity = 'legendary';
                corruptionRange = [0.85, 1.0];
            }
            else if (roll > 85) {
                rarity = 'rare';
                corruptionRange = [0.65, 0.85];
            }
            else if (roll > 60) {
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
//# sourceMappingURL=themeGenerator.js.map