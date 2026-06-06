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
exports.runBuild = runBuild;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const os = __importStar(require("os"));
const dropfactory_1 = require("./src/factories/dropfactory");
const overlayCompiler_1 = require("./src/core/overlayCompiler");
const packager_1 = require("./src/packaging/packager");
const assetValidator_1 = require("./src/core/validation/assetValidator");
const previewer_1 = require("./src/core/validation/previewer");
const themeLibrary_1 = require("./src/core/library/themeLibrary");
/**
 * Attempts to find a system-installed Chrome executable.
 * Falls back to a bundled Chromium path if running as a packaged executable.
 */
function getChromiumExecutablePath() {
    // 1. Prioritize PUPPETEER_EXECUTABLE_PATH environment variable
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        console.log(`   > Using Chromium from PUPPETEER_EXECUTABLE_PATH: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
        return process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    // 2. Try to find system-installed Chrome
    const platform = os.platform();
    let chromePath;
    if (platform === 'win32') {
        const paths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            `${os.homedir()}\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe`
        ];
        chromePath = paths.find(p => fs.existsSync(p));
    }
    else if (platform === 'darwin') {
        chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
    else if (platform === 'linux') {
        chromePath = '/usr/bin/google-chrome'; // Common path for Linux
    }
    if (chromePath && fs.existsSync(chromePath)) {
        console.log(`   > Found system Chrome at: ${chromePath}`);
        return chromePath;
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
    if (process.pkg) {
        console.log(`   > No system Chrome found, relying on bundled Chromium.`);
        // Return undefined to let Puppeteer's default logic find the bundled Chromium
        return undefined;
    }
    console.warn(`   > No system Chrome found. Puppeteer will attempt to download Chromium.`);
    return undefined; // Let Puppeteer download if not packaged and no system Chrome
}
/**
 * ANARCHI BUILD SYSTEM CLI
 * Orchestrates the deterministic compilation of brand assets.
 * Refactored to support direct calls from GUI.
 */
async function runBuild(dropName = process.argv[2] || "Project_AnarchI", themeName = process.argv[3] || "Industrial_Protocol", intensity = parseFloat(process.argv[4] || "0"), serialPrefix = process.argv[5] || "ANX", tier = (process.argv[6] || "standard").toLowerCase()) {
    console.log(`\n[1/4] Factory: Initializing manifest for "${dropName}"...`);
    const manifest = (0, dropfactory_1.createDropManifest)(dropName, themeName);
    // Seed bank integration: pull DNA before applying intensity
    const library = new themeLibrary_1.ThemeLibrary();
    const themeDNA = library.getThemeById(themeName.toLowerCase());
    if (themeDNA) {
        console.log(`   > Seed data loaded from Theme Library: ${themeDNA.name}`);
        manifest.accentColor = themeDNA.accentColor;
        manifest.textureProfile = themeDNA.textureProfile;
        manifest.glyphBehavior = themeDNA.glyphBehavior;
        manifest.marketplace.longDescription = themeDNA.description;
        // Auto-adjust price based on theme rarity
        if (themeDNA.rarity === 'rare')
            manifest.marketplace.price = "29.99";
        if (themeDNA.rarity === 'legendary')
            manifest.marketplace.price = "49.99";
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
    const serialData = `${manifest.id}-${intensity}-${manifest.createdAt}`;
    manifest.serialNumber = `${serialPrefix}-${crypto.createHash('sha256').update(serialData).digest('hex').toUpperCase().substring(0, 12)}`;
    console.log(`   > Generated Serial: ${manifest.serialNumber}`);
    // Inject standard asset definitions into the manifest
    manifest.assets = [
        { id: "starting_soon", name: "Starting Soon", type: "screen", width: 1920, height: 1080, enabled: true },
        { id: "brb", name: "Be Right Back", type: "screen", width: 1920, height: 1080, enabled: true },
        { id: "overlay", name: "Main Stream Overlay", type: "overlay", width: 1920, height: 1080, enabled: true },
        { id: "promo_video", name: "Promo Video", type: "video", width: 1920, height: 1080, enabled: true }
    ];
    // Inject Premium Bells and Whistles
    if (tier === "premium") {
        console.log(`   > Injecting Premium Asset Pack...`);
        manifest.assets.push({ id: "tip_jar", name: "Premium Tip Jar", type: "widget", width: 400, height: 600, enabled: true }, { id: "alerts", name: "Event Alerts", type: "widget", width: 800, height: 200, enabled: true }, { id: "stream_stats", name: "Live Statistics", type: "widget", width: 300, height: 150, enabled: true }, { id: "goal_ticker", name: "Goal Ticker", type: "widget", width: 1920, height: 50, enabled: true });
        manifest.marketplace.price = (parseFloat(manifest.marketplace.price) + 20).toString();
        manifest.id += "_PREMIUM";
    }
    // Define build and release paths
    const buildsDir = path.join(process.cwd(), "dist", "builds");
    const releasesDir = path.join(process.cwd(), "dist", "releases");
    console.log(`[0/4] Clean: Removing previous build data...`);
    if (fs.existsSync(buildsDir)) {
        fs.rmSync(buildsDir, { recursive: true, force: true });
    }
    // Ensure directories exist
    if (!fs.existsSync(buildsDir))
        fs.mkdirSync(buildsDir, { recursive: true });
    if (!fs.existsSync(releasesDir))
        fs.mkdirSync(releasesDir, { recursive: true });
    console.log(`[2/4] Compiler: Generating deterministic HTML/CSS assets...`);
    const compiler = new overlayCompiler_1.OverlayCompiler(buildsDir);
    const compiledPath = await compiler.compile(manifest);
    console.log(`[2.5/4] Validator: Verifying compiled assets...`);
    const validation = (0, assetValidator_1.validateDrop)(compiledPath, manifest);
    if (!validation.valid) {
        throw new Error(`Validation failed! Missing assets in build: ${validation.missingFiles.join(", ")}`);
    }
    console.log(`[2.7/4] Preview: Verifying visual integrity...`);
    const previewer = new previewer_1.VisualPreviewer(getChromiumExecutablePath());
    await previewer.runAudit(compiledPath, manifest);
    console.log(`[3/4] Packager: Compressing assets into distribution ZIP...`);
    const zipPath = await (0, packager_1.buildPackage)({
        dropName: manifest.id,
        sourceDirectory: compiledPath,
        outputDirectory: releasesDir
    });
    // Calculate package metrics
    const stats = fs.statSync(zipPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const fileCount = fs.readdirSync(compiledPath).filter((f) => !fs.lstatSync(path.join(compiledPath, f)).isDirectory()).length;
    console.log(`[4/4] Success: Build pipeline complete.`);
    console.log(`-------------------------------------------`);
    console.log(`Manifest ID: ${manifest.id}`);
    console.log(`Serial No:   ${manifest.serialNumber}`);
    console.log(`Marketplace: ${manifest.marketplace.price} (${manifest.marketplace.license})`);
    console.log(`Files Packed: ${fileCount} items`);
    console.log(`Package Size: ${fileSizeMB} MB`);
    console.log(`Release Location: ${zipPath}`);
    console.log(`-------------------------------------------\n`);
    return { success: true, manifestId: manifest.id, zipPath };
}
// Execute build process
if (require.main === module) {
    runBuild().catch((error) => {
        console.error(`\n[FATAL ERROR] Build process failed:`);
        console.error(error);
        process.exit(1);
    });
}
//# sourceMappingURL=main.js.map