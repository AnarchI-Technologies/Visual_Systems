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
exports.OverlayCompiler = void 0;
const brand_1 = require("../identity/brand");
const partsBin_1 = require("./library/partsBin");
const engine_1 = require("./engine");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class OverlayCompiler {
    outputBaseDir;
    constructor(outputBaseDir) {
        this.outputBaseDir = outputBaseDir;
    }
    async compile(manifest) {
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
            version: brand_1.BRAND_IDENTITY.SYSTEM_VERSION,
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
    generateCSSVariables(manifest) {
        const accent = brand_1.ACCENT_MAP[manifest.accentColor];
        const cp = manifest.corruptionProfile;
        const visual = (0, engine_1.calculateVisualState)(cp);
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
  --brand-name: "${brand_1.BRAND_IDENTITY.NAME}";
  --system-version: "${brand_1.BRAND_IDENTITY.SYSTEM_VERSION}";
  --glyph-system: "${brand_1.BRAND_IDENTITY.GLYPH_SYSTEM}";
}
    `.trim();
    }
    getTextureCSS(profile) {
        const textures = {
            "digital_static": "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn969JAAAACXBIWXMAAAsTAAALEwEAmpwYAAAANElEQVQ4y2NgwAaY8BgmPIYJj2HCY5jwGCY8hgmPYcJjmPAYJjyGCY9hwmOY8BgmPIYJj2ECADXpCAnfS97iAAAAAElFTkSuQmCC')",
            "concrete_spray": "radial-gradient(circle, #222 1px, transparent 1px), radial-gradient(circle, #222 1px, transparent 1px)",
            "scanline_overlay": "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
            "carbon_fiber": "linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)"
        };
        return textures[profile] || "none";
    }
    compileAsset(manifest, asset) {
        const behaviorCSS = partsBin_1.BEHAVIOR_CSS_MAP[manifest.glyphBehavior] || "";
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
    <div class="glyph" style="color: var(--accent-color)">${brand_1.BRAND_IDENTITY.GLYPH_SYSTEM}</div>
    <h1>${asset.name}</h1>
    <div class="tagline">${manifest.branding.tagline}</div>
</body>
</html>`.trim();
    }
}
exports.OverlayCompiler = OverlayCompiler;
//# sourceMappingURL=overlayCompiler.js.map