/**
 * AnarchI Studio
 * Surface Systems Prompt Engine v1
 *
 * Generates structured image-generation prompts
 * based on AnarchI visual identity rules.
 */

import { ACCENT_MAP, BRAND_IDENTITY } from "./src/identity/brand";
import { getMotionSettings } from "./src/core/engine";

export type SlideType =
  | "starting_soon"
  | "brb"
  | "offline"
  | "overlay"
  | "webcam"
  | "chatbox"
  | "alerts"
  | "tipjar";

export type MotionProfile =
  | "static"
  | "low_drift"
  | "medium_instability"
  | "high_corruption";

export type AccentColor =
  | "signal_cyan"
  | "toxic_green"
  | "ember_red"
  | "industrial_orange";

export interface PromptOptions {
  dropName: string;
  themeName: string;

  slideType: SlideType;

  accentColor: AccentColor;

  corruptedMode: boolean;

  width: number;
  height: number;

  motionProfile: MotionProfile;

  optionalModules: {
    webcamFrame: boolean;
    chatBox: boolean;
    streamStatsPanel: boolean;
    eventTicker: boolean;
    backgroundTexture: boolean;
    minimalHud: boolean;

    animatedGlitchPulses: boolean;
    staticNoiseOverlay: boolean;
    frameBreakDistortion: boolean;
    signalDrift: boolean;
    echoDuplication: boolean;

    glyphCornerWatermark: boolean;
    glyphFragments: boolean;
    glyphFrameWrapping: boolean;
    hiddenGlyphRepeats: boolean;

    highContrastMode: boolean;
    darkIndustrialBase: boolean;
    neonAccentAmplification: boolean;
    concreteTextureOverlay: boolean;
    sprayEdgeBoundaries: boolean;
  };
}

const BASE_BRAND_RULES = `
AnarchI Surface Systems v1.

Core philosophy:
Structured interface design disrupted by controlled expressive interference.

Brand identity:
{ A I } glyph system.
The glyph must function as a structural design language rather than a dominant logo.

Layout requirements:
Strict grid-based composition.
Readable hierarchy.
Clear focal zone.
Professional production quality.

Visual principles:
Structure first.
Disruption second.
Readability always preserved.
`;

function getSlideDescription(slideType: SlideType): string {
  switch (slideType) {
    case "starting_soon":
      return `
Create a Twitch Starting Soon screen.
Reserve a clear central content area for stream status text.
`;

    case "brb":
      return `
Create a BRB screen.
Support temporary absence messaging.
Maintain visual continuity with the drop identity.
`;

    case "offline":
      return `
Create an Offline screen.
Present a finished and intentional end-state composition.
`;

    case "overlay":
      return `
Create a stream overlay frame.
Preserve maximum gameplay visibility.
`;

    case "webcam":
      return `
Create a webcam frame module.
Prioritize streamer visibility and framing.
`;

    case "chatbox":
      return `
Create a dedicated chat box module.
Ensure readability under streaming conditions.
`;

    case "alerts":
      return `
Create an alert system visual.
Suitable for follows, subscriptions, raids, donations, and channel events.
`;

    case "tipjar":
      return `
Create a themed tip jar widget.
Integrate naturally into the design language.
`;
  }
}

function getAccentDescription(accent: AccentColor): string {
  return `Primary color profile: ${accent.replace("_", " ")}. Hex: ${ACCENT_MAP[accent] || "#00ffff"}`;
}

function getMotionDescription(profile: MotionProfile): string {
  const settings = getMotionSettings(profile);
  switch (profile) {
    case "static": return "Static composition, no motion.";
    case "low_drift": return `Subtle environmental drift (${settings.drift}).`;
    case "medium_instability": return "Moderate signal instability.";
    case "high_corruption": return "Heavy corruption and high motion instability.";
    default: return "Standard motion profile.";
  }
}

function buildOptionalModules(options: PromptOptions): string {
  const lines: string[] = [];

  const modules = options.optionalModules;

  if (modules.webcamFrame)
    lines.push("- Include webcam frame integration.");

  if (modules.chatBox)
    lines.push("- Include chat box integration.");

  if (modules.streamStatsPanel)
    lines.push("- Include stream statistics panel.");

  if (modules.eventTicker)
    lines.push("- Include event ticker system.");

  if (modules.backgroundTexture)
    lines.push("- Include environmental texture layers.");

  if (modules.minimalHud)
    lines.push("- Include minimal HUD elements.");

  if (modules.animatedGlitchPulses)
    lines.push("- Enable animated glitch pulse language.");

  if (modules.staticNoiseOverlay)
    lines.push("- Add restrained static noise overlays.");

  if (modules.frameBreakDistortion)
    lines.push("- Apply controlled frame break distortions.");

  if (modules.signalDrift)
    lines.push("- Apply signal drift effects.");

  if (modules.echoDuplication)
    lines.push("- Use echo duplication and signal ghosting.");

  if (modules.glyphCornerWatermark)
    lines.push("- Include subtle { A I } corner signatures.");

  if (modules.glyphFragments)
    lines.push("- Include fragmented brace motifs.");

  if (modules.glyphFrameWrapping)
    lines.push("- Use brace-based frame structures.");

  if (modules.hiddenGlyphRepeats)
    lines.push("- Embed hidden glyph repetition patterns.");

  if (modules.highContrastMode)
    lines.push("- Prioritize high contrast readability.");

  if (modules.darkIndustrialBase)
    lines.push("- Use dark industrial foundation tones.");

  if (modules.neonAccentAmplification)
    lines.push("- Amplify accent color presence.");

  if (modules.concreteTextureOverlay)
    lines.push("- Include concrete-inspired texture treatment.");

  if (modules.sprayEdgeBoundaries)
    lines.push("- Use overspray edge rendering behavior.");

  return lines.join("\n");
}

function buildCorruptionLayer(options: PromptOptions): string {
  if (!options.corruptedMode) {
    return `
Clean Drop Mode.

Maintain:
- frame integrity
- stable alignment
- low noise
- subtle overspray
- minimal instability
`;
  }

  return `
Corrupted Override Mode.

Apply:
- controlled frame rupture
- stronger overspray behavior
- visible signal degradation
- brace fragment echoes
- localized color bleed
- layered glitch behavior
- subtle instability

Rules:
- preserve readability
- preserve focal hierarchy
- never obstruct primary content
`;
}

export function generatePrompt(options: PromptOptions): string {
  const sections = [
    `DROP NAME: ${options.dropName}`,
    `THEME: ${options.themeName}`,

    BASE_BRAND_RULES,

    getSlideDescription(options.slideType),

    getAccentDescription(options.accentColor),

    getMotionDescription(options.motionProfile),

    buildCorruptionLayer(options),

    buildOptionalModules(options),

    `
Canvas Dimensions:
${options.width}x${options.height}

Output Requirements:
Professional streaming asset.
Marketplace-ready quality.
High visual coherence.
Strong identity consistency.
Readable at streaming scale.
`,
  ];

  return sections.join("\n\n");
}