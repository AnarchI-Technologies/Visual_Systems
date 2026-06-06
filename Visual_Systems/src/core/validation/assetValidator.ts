import * as fs from "fs";
import { DropManifest } from "../../schema";

export interface ValidationResult {

  valid: boolean;

  missingFiles: string[];
}

export function validateDrop(
  directory: string,
  manifest: DropManifest
): ValidationResult {

  const requiredFiles = manifest.assets
    .filter(asset => asset.enabled)
    .map(asset => `${asset.id}.html`);

  requiredFiles.push("theme.css");

  const missingFiles =
    requiredFiles.filter(
      file =>
        !fs.existsSync(
          `${directory}/${file}`
        )
    );

  return {
    valid: missingFiles.length === 0,
    missingFiles
  };
}