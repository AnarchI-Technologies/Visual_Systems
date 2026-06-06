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
/**
 * ANARCHI VIRUSTOTAL UPLOADER
 * Automates file submission for organic reputation building.
 */
async function uploadToVirusTotal() {
    const apiKey = process.env.VT_API_KEY;
    const exePath = path.join(process.cwd(), "bin", "anarchi-visual-engine.exe");
    if (!apiKey) {
        console.error("\n[VT ERROR] Missing VT_API_KEY environment variable.");
        console.log("Get one for free at: https://www.virustotal.com/gui/my-apikey\n");
        process.exit(1);
    }
    if (!fs.existsSync(exePath)) {
        console.error(`\n[VT ERROR] Executable not found at: ${exePath}`);
        console.log("Run 'npm run package' first to generate the build.\n");
        process.exit(1);
    }
    console.log(`\n[VIRUSTOTAL] Preparing upload for: ${path.basename(exePath)}`);
    const fileBuffer = fs.readFileSync(exePath);
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append("file", blob, path.basename(exePath));
    try {
        const response = await fetch("https://www.virustotal.com/api/v3/files", {
            method: "POST",
            headers: {
                "x-apikey": apiKey
            },
            body: formData
        });
        const result = await response.json();
        if (response.ok) {
            const analysisId = result.data.id;
            console.log(`[SUCCESS] Submission complete.`);
            console.log(`[ANALYSIS ID] ${analysisId}`);
            console.log(`[VIEW REPORT] https://www.virustotal.com/gui/file-analysis/${analysisId}/detection\n`);
        }
        else {
            console.error(`[VT ERROR] ${result.error?.message || "Unknown API error"}`);
        }
    }
    catch (error) {
        console.error(`[FATAL] Failed to connect to VirusTotal: ${error.message}`);
    }
}
uploadToVirusTotal();
//# sourceMappingURL=virustotal-upload.js.map