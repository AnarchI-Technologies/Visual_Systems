import { DropManifest, AssetDefinition } from "../schema";
import { ACCENT_MAP, BRAND_IDENTITY } from "../identity/brand";
import { BEHAVIOR_CSS_MAP } from "./library/partsBin";
import { calculateVisualState } from "./engine";
import * as fs from "fs";
import * as path from "path";

export class OverlayCompiler {
  private outputBaseDir: string;

  constructor(outputBaseDir: string) {
    this.outputBaseDir = outputBaseDir;
  }

  public async compile(manifest: DropManifest): Promise<string> {
    const dropDir = path.join(this.outputBaseDir, manifest.id);
    
    if (!fs.existsSync(dropDir)) {
      fs.mkdirSync(dropDir, { recursive: true });
    }

    // Generate Global Styles (CSS Variables)
    const cssVariables = this.generateCSSVariables(manifest);
    fs.writeFileSync(path.join(dropDir, "theme.css"), cssVariables);

    // Generate Metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      version: BRAND_IDENTITY.SYSTEM_VERSION,
      manifestId: manifest.id,
      accent: manifest.accentColor,
      price: manifest.marketplace.price,
      license: manifest.marketplace.license,
      serialNumber: manifest.serialNumber
    };
    fs.writeFileSync(path.join(dropDir, "metadata.json"), JSON.stringify(metadata, null, 2));

    // Compile each asset into a deterministic HTML file
    for (const asset of manifest.assets) {
      if (asset.enabled) {
        const html = this.compileAsset(manifest, asset);
        fs.writeFileSync(path.join(dropDir, `${asset.id}.html`), html);
      }
    }

    return dropDir;
  }

  private generateCSSVariables(manifest: DropManifest): string {
    const accent = ACCENT_MAP[manifest.accentColor];
    const cp = manifest.corruptionProfile;
    const visual = calculateVisualState(cp);

    return `
:root {
  --accent-color: ${accent};
  --background-base: #0a0a0a;
  --engine-filter: ${visual.filter};
  --engine-transform: ${visual.transform};
  --engine-speed: ${visual.animationDuration};
  --engine-hue: ${visual.hueRotate};
  --engine-rupture: ${visual.borderDistortion};
  --theme-texture: ${this.getTextureCSS(manifest.textureProfile)};
  --font-main: 'JetBrains Mono', monospace;
  --brand-name: "${BRAND_IDENTITY.NAME}";
  --system-version: "${BRAND_IDENTITY.SYSTEM_VERSION}";
  --glyph-system: "${BRAND_IDENTITY.GLYPH_SYSTEM}";
}
    `.trim();
  }

  private getTextureCSS(profile: string): string {
    const textures: Record<string, string> = {
      "digital_static": "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn969JAAAACXBIWXMAAAsTAAALEwEAmpwYAAAANElEQVQ4y2NgwAaY8BgmPIYJj2HCY5jwGCY8hgmPYcJjmPAYJjyGCY9hwmOY8BgmPIYJj2ECADXpCAnfS97iAAAAAElFTkSuQmCC')",
      "concrete_spray": "radial-gradient(circle, #222 1px, transparent 1px), radial-gradient(circle, #222 1px, transparent 1px)",
      "scanline_overlay": "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
      "carbon_fiber": "linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)"
    };
    return textures[profile] || "none";
  }

  private compileAsset(manifest: DropManifest, asset: AssetDefinition): string {
    const behaviorCSS = BEHAVIOR_CSS_MAP[manifest.glyphBehavior] || "";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="theme.css">
    <style>
        body { 
            width: ${asset.width}px; 
            height: ${asset.height}px; 
            margin: 0; 
            background: var(--background-base);
            background-image: var(--theme-texture);
            background-size: 4px 4px;
            color: var(--accent-color);
            font-family: var(--font-main);
            filter: var(--engine-filter) var(--engine-hue);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .glyph { font-size: 2rem; opacity: 0.8; }
        ${behaviorCSS}
    </style>
</head>
<body class="behavior-layer">
    <div class="glyph" style="color: var(--accent-color)">${BRAND_IDENTITY.GLYPH_SYSTEM}</div>
    <h1>${asset.name}</h1>
    <div class="tagline">${manifest.branding.tagline}</div>
</body>
</html>`.trim();
  }
}