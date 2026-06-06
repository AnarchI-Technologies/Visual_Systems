import * as fs from "fs";
import * as path from "path";

/**
 * Workspace Cleanup Tool
 * Moves identified redundant files to a 'delete' folder.
 */
export function cleanupWorkspace() {
  const deleteDir = path.join(process.cwd(), "delete");
  const isDryRun = process.argv.includes("--dry-run");

  if (!fs.existsSync(deleteDir)) {
    fs.mkdirSync(deleteDir, { recursive: true });
  }

  const targets = [
    "brand.ts", 
    "src/brand.ts", 
    "src/core/schema/schema.ts",
    "assetValidator.ts",
    "dropfactory.ts",
    "overlayCompiler.ts"
  ];

  console.log(`\n[CLEANUP] Starting workspace audit${isDryRun ? " (DRY RUN)" : ""}...`);

  targets.forEach(target => {
    const fullPath = path.join(process.cwd(), target);
    if (fs.existsSync(fullPath)) {
      if (isDryRun) {
        console.log(`   [PLAN] Would move: ${target}`);
      } else {
        const destination = path.join(deleteDir, `${path.basename(fullPath)}_${Date.now()}`);
        console.log(`   > Moving redundant file to /delete: ${target}`);
        fs.renameSync(fullPath, destination);
      }
    }
  });
  console.log(`[CLEANUP] Workspace optimized.\n`);
}

if (require.main === module) {
  cleanupWorkspace();
}