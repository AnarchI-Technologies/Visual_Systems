import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * ANARCHI PARTS BIN VALIDATOR
 * Ensures data integrity by identifying duplicate entries across all libraries.
 */
function validatePartsBin() {
  const filePath = path.join(__dirname, "partsBin.data.json");

  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] Missing file: ${filePath}`);
    process.exit(1);
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    let errorCount = 0;

    const checkArray = (keyPath: string, items: string[]) => {
      const seen = new Set<string>();
      const duplicates = new Set<string>();

      items.forEach((item) => {
        if (seen.has(item)) {
          duplicates.add(item);
        }
        seen.add(item);
      });

      if (duplicates.size > 0) {
        console.error(`[FAIL] ${keyPath} contains duplicates: ${Array.from(duplicates).join(", ")}`);
        errorCount++;
      }
    };

    console.log("[VALIDATING] Checking Parts Bin for redundancy...");

    checkArray("accents", data.accents);
    checkArray("textures", data.textures);
    checkArray("behaviors", data.behaviors);

    Object.keys(data.vocabularies).forEach((vocabKey) => {
      checkArray(`vocabularies.${vocabKey}`, data.vocabularies[vocabKey]);
    });

    if (errorCount > 0) {
      console.error(`\n[CRITICAL] Validation failed with ${errorCount} errors.`);
      process.exit(1);
    }

    console.log("[SUCCESS] Integrity check passed. No duplicates found.");
  } catch (err) {
    console.error("[CRITICAL] Failed to parse Parts Bin. Ensure it is valid JSON.");
    process.exit(1);
  }
}

validatePartsBin();