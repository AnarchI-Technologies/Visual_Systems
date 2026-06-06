/**
 * ANARCHI PRODUCTION SUITE - V2
 * Consuming Visual_Systems as a Core Parts Bin.
 */

import { runBuild } from "../Visual_Systems/main.ts";
import { calculateVisualState } from "../Visual_Systems/src/core/engine.ts";
import { buildLogger } from "../Visual_Systems/logger.ts";

async function initializeSuite() {
  console.log("--- ANARCHI PRODUCTION SUITE STARTING ---");

  // Listen to the library's logger
  buildLogger.on("progress", (log) => {
    console.log(`[EXTERNAL_LOG][${log.step}] ${log.message}`);
  });

  // Trigger a deterministic build from our new context
  const result = await runBuild(
    "Suite_Alpha_Drop",
    "Electric_Violet_Heavy_Grain_Smooth_Drift",
    0.45,
    "PRD-V2"
  );

  console.log("Production Build Complete:", result.manifestId);
}

initializeSuite().catch(console.error);