"use strict";
/**
 * ANARCHI STUDIO - BRAND IDENTITY CONSTANTS
 * Protected under Trademark and Copyright
 *
 * This file now supports dynamic loading for UI plug-and-play support.
 */
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
exports.ACCENT_MAP = exports.BRAND_IDENTITY = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const identityPath = path.join(__dirname, "identity.data.json");
let identityDNA = {};
try {
    if (fs.existsSync(identityPath)) {
        identityDNA = JSON.parse(fs.readFileSync(identityPath, "utf-8"));
    }
}
catch (e) {
    console.error("[ERROR] Failed to load identity.data.json, using core fallbacks.");
}
exports.BRAND_IDENTITY = {
    NAME: identityDNA.NAME || "AnarchI",
    SYSTEM_VERSION: identityDNA.SYSTEM_VERSION || "Surface Systems v1",
    GLYPH_SYSTEM: identityDNA.GLYPH_SYSTEM || "{ A I }",
    CORE_PHILOSOPHY: identityDNA.CORE_PHILOSOPHY || "Structured interference.",
    COPYRIGHT_HOLDER: identityDNA.COPYRIGHT_HOLDER || "AnarchI Studio"
};
exports.ACCENT_MAP = identityDNA.ACCENTS || {
    signal_cyan: "#00ffff",
    toxic_green: "#adff2f",
    ember_red: "#ff4500",
    industrial_orange: "#ff8c00"
};
//# sourceMappingURL=brand.js.map