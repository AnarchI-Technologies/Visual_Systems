import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as os from "os";
import { fileURLToPath } from "url";
import { createDropManifest } from "./src/factories/dropfactory";
import { OverlayCompiler } from "./src/core/overlayCompiler";
import { buildPackage } from "./src/packaging/packager";
import { validateDrop } from "./src/core/validation/assetValidator";
import { VisualPreviewer } from "./src/core/validation/previewer";
import { ThemeLibrary } from "./src/core/library/themeLibrary";
import { buildLogger, BuildStep } from "./logger";
import puppeteer from "puppeteer";

/**
 * Attempts to find a system-installed Chrome executable.
 * Falls back to a bundled Chromium path if running as a packaged executable.
 */
async function getChromiumExecutablePath(): Promise<string | undefined> {
  // 1. Prioritize PUPPETEER_EXECUTABLE_PATH environment variable
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    buildLogger.log(BuildStep.INIT, `Using Chromium from PUPPETEER_EXECUTABLE_PATH`);
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // 2. Try to find system-installed Chrome
  const platform = os.platform();
  let chromePath: string | undefined;
  if (platform === 'win32') {
    const paths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      `${os.homedir()}\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe`
    ];
    for (const p of paths) {
      try {
        await fs.promises.access(p);
        chromePath = p;
        break;
      } catch { /* continue */ }
    }
  } else if (platform === 'darwin') {
    chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else if (platform === 'linux') {
    chromePath = '/usr/bin/google-chrome'; // Common path for Linux
  }

  try {
    if (chromePath) {
      await fs.promises.access(chromePath);
      buildLogger.log(BuildStep.INIT, `Found system Chrome at: ${chromePath}`);
      return chromePath;
    }
  } catch {
    // Fallback to bundled if access fails
  }

  // 3. Fallback for packaged executable: point to bundled Chromium
  // When pkg bundles, it places node_modules content relative to the executable.
  // Puppeteer's default executable path logic will look for .local-chromium
  // relative to its own package directory.
  // For pkg, the `puppeteer` module itself will be inside the executable.
  // The Chromium binary will be placed in a known location relative to the executable.
  // We need to tell pkg to include it, and then reference it.
  // The default puppeteer.executablePath() logic is smart enough to find it
  // if it's bundled correctly by pkg.
  // So, if we reach here and are packaged, we let Puppeteer's internal logic handle it.
  if ((process as any).pkg) {
    console.log(`   > No system Chrome found, relying on bundled Chromium.`);
    // Return undefined to let Puppeteer's default logic find the bundled Chromium
    return undefined;
  }

  console.warn(`   > No system Chrome found. Puppeteer will attempt to download Chromium.`);
  return undefined; // Let Puppeteer download if not packaged and no system Chrome
}

// Global Factory Resources: Initialized once for efficient build cycles
const library = new ThemeLibrary();
const buildsDir = path.join(process.cwd(), "dist", "builds");
const releasesDir = path.join(process.cwd(), "dist", "releases");
const chromiumPath = await getChromiumExecutablePath();

/**
 * ANARCHI BUILD SYSTEM CLI
 * Orchestrates the deterministic compilation of brand assets.
 * Refactored to support direct calls from GUI.
 */
export async function runBuild(
  dropName: string = process.argv[2] || "Project_AnarchI",
  themeName: string = process.argv[3] || "Industrial_Protocol",
  intensity: number = parseFloat(process.argv[4] || "0"),
  serialPrefix: string = process.argv[5] || "ANX",
  tier: string = (process.argv[6] || "standard").toLowerCase()
) {
  buildLogger.log(BuildStep.INIT, `Initializing manifest for "${dropName}"...`);
  const manifest = createDropManifest(dropName, themeName);

  // Seed bank integration: pull DNA before applying intensity
  const themeDNA = library.getThemeById(themeName.toLowerCase());
  if (themeDNA) {
    buildLogger.log(BuildStep.INIT, `Seed data loaded: ${themeDNA.name}`);
    manifest.accentColor = themeDNA.accentColor as any;
    manifest.textureProfile = themeDNA.textureProfile;
    manifest.glyphBehavior = themeDNA.glyphBehavior;
    manifest.marketplace.longDescription = themeDNA.description;
    
    // Auto-adjust price based on theme rarity
    if (themeDNA.rarity === 'rare') manifest.marketplace.price = "29.99";
    if (themeDNA.rarity === 'legendary') manifest.marketplace.price = "49.99";
  }

  // Apply intensity to the corruption profile to create variety
  if (intensity > 0) {
    manifest.edition = "corrupted";
    manifest.corruptionProfile.enabled = true;
    manifest.corruptionProfile.gridInstability = intensity * 0.5;
    manifest.corruptionProfile.signalNoise = intensity * 0.3;
    manifest.corruptionProfile.colorBleed = intensity * 0.8;
    manifest.corruptionProfile.frameRupture = intensity * 0.2;
    manifest.id += `_v_${Math.floor(intensity * 100)}`;
  }

  // Generate a deterministic Serial Number for marketplace traceability
  const seed = JSON.stringify({ dropName, themeName, intensity, tier });
  const hash = crypto.createHash("sha256").update(seed).digest("hex").toUpperCase();
  manifest.serialNumber = `${serialPrefix}-${hash.substring(0, 12)}`;
  buildLogger.log(BuildStep.INIT, `Generated Serial: ${manifest.serialNumber}`);

  // Inject standard asset definitions into the manifest
  manifest.assets = [
    { id: "starting_soon", name: "Starting Soon", type: "screen", width: 1920, height: 1080, enabled: true },
    { id: "brb", name: "Be Right Back", type: "screen", width: 1920, height: 1080, enabled: true },
    { id: "overlay", name: "Main Stream Overlay", type: "overlay", width: 1920, height: 1080, enabled: true }
    , { id: "promo_video", name: "Promo Video", type: "video", width: 1920, height: 1080, enabled: true }
  ];

  // Inject Premium Bells and Whistles
  if (tier === "premium") {
    buildLogger.log(BuildStep.INIT, `Injecting Premium Asset Pack...`);
    manifest.assets.push(
      { id: "tip_jar", name: "Premium Tip Jar", type: "widget", width: 400, height: 600, enabled: true },
      { id: "alerts", name: "Event Alerts", type: "widget", width: 800, height: 200, enabled: true },
      { id: "stream_stats", name: "Live Statistics", type: "widget", width: 300, height: 150, enabled: true },
      { id: "goal_ticker", name: "Goal Ticker", type: "widget", width: 1920, height: 50, enabled: true }
    );
    manifest.marketplace.price = (parseFloat(manifest.marketplace.price) + 20).toString();
    manifest.id += "_PREMIUM";
  }

  buildLogger.log(BuildStep.CLEAN, `Removing previous build data...`);
  await fs.promises.rm(buildsDir, { recursive: true, force: true });

  // Ensure directories exist
  await fs.promises.mkdir(buildsDir, { recursive: true });
  await fs.promises.mkdir(releasesDir, { recursive: true });

  buildLogger.log(BuildStep.COMPILE, `Generating deterministic HTML/CSS assets...`);
  const compiler = new OverlayCompiler(buildsDir);
  const compiledPath = await compiler.compile(manifest);

  buildLogger.log(BuildStep.VALIDATE, `Verifying compiled assets...`);
  const validation = validateDrop(compiledPath, manifest);
  
  if (!validation.valid) {
    throw new Error(`Validation failed! Missing assets in build: ${validation.missingFiles.join(", ")}`);
  }

  buildLogger.log(BuildStep.PREVIEW, `Verifying visual integrity...`);
  const previewer = new VisualPreviewer(chromiumPath);
  await previewer.runAudit(compiledPath, manifest);

  buildLogger.log(BuildStep.PACKAGE, `Compressing assets into distribution ZIP...`);
  const zipPath = await buildPackage({
    dropName: manifest.id,
    sourceDirectory: compiledPath,
    outputDirectory: releasesDir
  });

  // Calculate package metrics
  const stats = await fs.promises.stat(zipPath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const entries = await fs.promises.readdir(compiledPath, { withFileTypes: true });
  const fileCount = entries.filter(e => e.isFile()).length;

  // Detailed Completion Logging for GUI/CLI symmetry
  buildLogger.log(BuildStep.COMPLETE, `Pipeline complete. Packed ${fileCount} assets (${fileSizeMB} MB).`);
  buildLogger.log(BuildStep.COMPLETE, `Deployment target: ${zipPath}`);
  
  // Internal system logs for debugging
  console.log(`   [METRICS] Serial: ${manifest.serialNumber} | Price: ${manifest.marketplace.price}`);

  return { success: true, manifestId: manifest.id, zipPath };
}

// Execute build process
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  try {
    await runBuild();
  } catch (error) {
    console.error(`\n[FATAL ERROR] Build process failed:`);
    console.error(error);
    process.exit(1);
  }
}
