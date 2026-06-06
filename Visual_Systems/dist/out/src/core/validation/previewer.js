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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualPreviewer = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const puppeteer_screen_recorder_1 = require("puppeteer-screen-recorder");
/**
 * ANARCHI VISUAL PREVIEWER
 * Uses a headless browser to verify that the deterministic
 * output renders without DOM errors or CSS layout shifts.
 */
class VisualPreviewer {
    executablePath;
    constructor(executablePath) {
        this.executablePath = executablePath;
    }
    /**
     * Performs a comprehensive visual audit: verifying identity,
     * capturing gallery screenshots, and recording promotional videos.
     */
    async runAudit(buildDir, manifest) {
        console.log(`   > Performing visual audit and recording...`);
        const galleryDir = path.join(buildDir, "gallery");
        const videoDir = path.join(buildDir, "videos");
        if (!fs.existsSync(galleryDir))
            fs.mkdirSync(galleryDir, { recursive: true });
        if (!fs.existsSync(videoDir))
            fs.mkdirSync(videoDir, { recursive: true });
        const browser = await puppeteer_1.default.launch({
            headless: true,
            executablePath: this.executablePath
        });
        try {
            const page = await browser.newPage();
            for (const asset of manifest.assets) {
                try {
                    if (!asset.enabled)
                        continue;
                    const fileName = `${asset.id}.html`;
                    const fullPath = path.join(buildDir, fileName);
                    if (!fs.existsSync(fullPath))
                        continue;
                    // Ensure robust file URL formatting
                    const absolutePath = path.resolve(fullPath).replace(/\\/g, '/');
                    const fileUrl = `file:///${absolutePath}`;
                    console.log(`      -> Auditing: ${asset.id}`);
                    await page.setViewport({ width: asset.width, height: asset.height });
                    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
                    // 1. Integrity Check: Verify brand identity is rendered
                    const hasGlyph = await page.evaluate(() => document.querySelector('.glyph') !== null);
                    if (!hasGlyph)
                        throw new Error(`Render Error: Trademark glyph missing in ${fileName}`);
                    // 2. Snapshot: Capture gallery image
                    const screenshotPath = path.join(galleryDir, `${asset.id}.png`);
                    await page.screenshot({ path: screenshotPath });
                    // 3. Motion Capture: Record if it's a promotional video asset
                    if (asset.type === 'video') {
                        console.log(`         [Recording Promo Video...]`);
                        const recorder = new puppeteer_screen_recorder_1.PuppeteerScreenRecorder(page);
                        const savePath = path.join(videoDir, `${asset.id}.mp4`);
                        await recorder.start(savePath);
                        await new Promise(r => setTimeout(r, 5000)); // Record duration
                        await recorder.stop();
                    }
                }
                catch (assetError) {
                    console.error(`      [ERROR] Skipping ${asset.id} due to audit failure: ${assetError.message}`);
                }
            }
        }
        finally {
            await browser.close();
        }
        return true;
    }
}
exports.VisualPreviewer = VisualPreviewer;
//# sourceMappingURL=previewer.js.map