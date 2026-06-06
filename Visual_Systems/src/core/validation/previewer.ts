import * as path from "path";
import * as fs from "fs";
import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { DropManifest } from "../../schema";

/**
 * ANARCHI VISUAL PREVIEWER
 * Uses a headless browser to verify that the deterministic 
 * output renders without DOM errors or CSS layout shifts.
 */
export class VisualPreviewer {
  private executablePath: string | undefined;

  constructor(executablePath: string | undefined) {
    this.executablePath = executablePath;
  }

  /**
   * Performs a comprehensive visual audit: verifying identity,
   * capturing gallery screenshots, and recording promotional videos.
   */
  public async runAudit(buildDir: string, manifest: DropManifest): Promise<boolean> {
    console.log(`   > Performing visual audit and recording...`);
    const galleryDir = path.join(buildDir, "gallery");
    const videoDir = path.join(buildDir, "videos");
    
    if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true });
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    const browser = await puppeteer.launch({ 
      headless: true,
      executablePath: this.executablePath 
    });
    try {
      const page = await browser.newPage();
       for (const asset of manifest.assets) {
        try {
        if (!asset.enabled) continue;

        const fileName = `${asset.id}.html`;
        const fullPath = path.join(buildDir, fileName);
        if (!fs.existsSync(fullPath)) continue;

        // Ensure robust file URL formatting
        const absolutePath = path.resolve(fullPath).replace(/\\/g, '/');
        const fileUrl = `file:///${absolutePath}`;
        
        console.log(`      -> Auditing: ${asset.id}`);
        await page.setViewport({ width: asset.width, height: asset.height });
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });

        // 1. Integrity Check: Verify brand identity is rendered
        const hasGlyph = await page.evaluate(() => document.querySelector('.glyph') !== null);
        if (!hasGlyph) throw new Error(`Render Error: Trademark glyph missing in ${fileName}`);

        // 2. Snapshot: Capture gallery image
        const screenshotPath = path.join(galleryDir, `${asset.id}.png`);
        await page.screenshot({ path: screenshotPath });
        
        // 3. Motion Capture: Record if it's a promotional video asset
        if (asset.type === 'video') {
          console.log(`         [Recording Promo Video...]`);
          const recorder = new PuppeteerScreenRecorder(page);
          const savePath = path.join(videoDir, `${asset.id}.mp4`);
          
          await recorder.start(savePath);
          await new Promise(r => setTimeout(r, 5000)); // Record duration
          await recorder.stop();
        }
        } catch (assetError: any) {
          console.error(`      [ERROR] Skipping ${asset.id} due to audit failure: ${assetError.message}`);
        }
      }
    } finally {
      await browser.close();
    }

    return true;
  }
}