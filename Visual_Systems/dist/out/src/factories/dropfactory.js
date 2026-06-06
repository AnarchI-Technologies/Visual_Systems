"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDropManifest = createDropManifest;
const brand_1 = require("../identity/brand");
function createDropManifest(name, theme) {
    return {
        id: name
            .toLowerCase()
            .replace(/\s+/g, "_"),
        dropName: name,
        edition: "clean",
        themeName: theme,
        textureProfile: "digital_static",
        glyphBehavior: "brace_frame",
        accentColor: "signal_cyan",
        branding: {
            brandName: brand_1.BRAND_IDENTITY.NAME,
            systemVersion: brand_1.BRAND_IDENTITY.SYSTEM_VERSION,
            glyphSystem: brand_1.BRAND_IDENTITY.GLYPH_SYSTEM,
            tagline: brand_1.BRAND_IDENTITY.CORE_PHILOSOPHY
        },
        promptProfile: {
            motionProfile: "low_drift",
            creativityTemperature: 0.75,
            styleWeight: 0.85,
            readabilityWeight: 1,
            oversprayIntensity: 0.35
        },
        corruptionProfile: {
            enabled: false,
            gridInstability: 0,
            frameRupture: 0,
            signalNoise: 0,
            signalDrift: 0.15,
            glyphEchoIntensity: 0.1,
            colorBleed: 0,
            motionInstability: 0
        },
        marketplace: {
            title: name,
            shortDescription: "",
            longDescription: "",
            tags: [],
            price: "19.99",
            license: "Standard Commercial Streamer License"
        },
        assets: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        serialNumber: ""
    };
}
//# sourceMappingURL=dropfactory.js.map