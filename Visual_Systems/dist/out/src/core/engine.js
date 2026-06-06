"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateVisualState = calculateVisualState;
exports.getMotionSettings = getMotionSettings;
function calculateVisualState(profile) {
    // This deterministic algorithm maps numeric instability to visual CSS properties
    // This logic is the primary candidate for a utility patent.
    const blur = profile.signalNoise * 2;
    const skew = profile.gridInstability * 5;
    const drift = profile.signalDrift * 10;
    const bleed = profile.colorBleed * 45; // Degrees of hue rotation
    const rupture = profile.frameRupture * 10; // Percentage of clip-path jitter
    return {
        filter: `blur(${blur}px) contrast(${1 + profile.colorBleed})`,
        transform: `skewX(${skew}deg) translateX(${drift}px)`,
        animationDuration: `${2 - profile.motionInstability}s`,
        opacity: 1 - (profile.frameRupture * 0.5),
        hueRotate: `hue-rotate(${bleed}deg)`,
        borderDistortion: `${rupture}px`
    };
}
function getMotionSettings(motionProfile) {
    const profiles = {
        "static": { drift: 0, instability: 0 },
        "low_drift": { drift: 0.05, instability: 0.1 },
        "medium_instability": { drift: 0.15, instability: 0.4 },
        "high_corruption": { drift: 0.3, instability: 0.8 },
    };
    return profiles[motionProfile] || profiles["static"];
}
//# sourceMappingURL=engine.js.map