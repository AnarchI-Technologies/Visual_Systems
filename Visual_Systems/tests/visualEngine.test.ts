import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { calculateVisualState } from "../src/core/engine";
import { createThemeBatch } from "../src/core/library/themeGenerator";
import { validateDrop } from "../src/core/validation/assetValidator";
import { buildOfferLadder } from "../src/marketplace/offerBuilder";
import { buildMarketReadyKit } from "../src/marketplace/marketReadyKit";
import type { DropManifest } from "../src/schema";

const manifest: DropManifest = {
  id: "investor-demo",
  dropName: "Investor Demo Overlay",
  edition: "corrupted",
  themeName: "Signal Field",
  textureProfile: "scanline_overlay",
  glyphBehavior: "pulse",
  accentColor: "signal_cyan",
  branding: {
    brandName: "AnarchI",
    systemVersion: "Surface Systems v1",
    glyphSystem: "{ A I }",
    tagline: "Hardcoding freedom into the systems of tomorrow.",
  },
  promptProfile: {
    motionProfile: "medium_instability",
    creativityTemperature: 0.4,
    styleWeight: 0.8,
    readabilityWeight: 0.9,
    oversprayIntensity: 0.1,
  },
  corruptionProfile: {
    enabled: true,
    gridInstability: 0.4,
    frameRupture: 0.2,
    signalNoise: 0.5,
    signalDrift: 0.3,
    glyphEchoIntensity: 0.2,
    colorBleed: 0.25,
    motionInstability: 0.5,
  },
  marketplace: {
    title: "Investor Demo Overlay",
    shortDescription: "Deterministic overlay proof.",
    longDescription: "A deterministic visual system smoke test.",
    tags: ["anarchi", "overlay", "deterministic"],
    price: "0",
    license: "internal-demo",
  },
  assets: [
    { id: "starting-soon", name: "Starting Soon", type: "html", width: 1920, height: 1080, enabled: true },
    { id: "offline", name: "Offline", type: "html", width: 1920, height: 1080, enabled: false },
  ],
  createdAt: "2026-06-20T00:00:00.000Z",
  updatedAt: "2026-06-20T00:00:00.000Z",
  serialNumber: "ANARCHI-TEST-001",
};

function testVisualStateIsDeterministic() {
  const first = calculateVisualState(manifest.corruptionProfile);
  const second = calculateVisualState(manifest.corruptionProfile);

  assert.deepEqual(first, second);
  assert.equal(first.filter, "blur(1px) contrast(1.25)");
  assert.equal(first.transform, "skewX(2deg) translateX(3px)");
  assert.equal(first.opacity, 0.9);
}

function testValidationFindsMissingEnabledAssets() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "anarchi-visual-"));
  fs.writeFileSync(path.join(tmp, "theme.css"), ":root{}");

  const result = validateDrop(tmp, manifest);

  assert.equal(result.valid, false);
  assert.deepEqual(result.missingFiles, ["starting-soon.html"]);
}

function testValidationPassesWhenEnabledAssetsExist() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "anarchi-visual-"));
  fs.writeFileSync(path.join(tmp, "theme.css"), ":root{}");
  fs.writeFileSync(path.join(tmp, "starting-soon.html"), "<html></html>");

  const result = validateDrop(tmp, manifest);

  assert.equal(result.valid, true);
  assert.deepEqual(result.missingFiles, []);
}

function testThemeGenerationIsSeedDeterministic() {
  const first = createThemeBatch(3, "investor-proof-seed");
  const second = createThemeBatch(3, "investor-proof-seed");

  assert.deepEqual(first, second);
}

function testOfferLadderTurnsManifestIntoSellableTiers() {
  const offers = buildOfferLadder(manifest);

  assert.deepEqual(offers.map((offer) => offer.tier), ["starter", "pro", "studio"]);
  assert.ok(offers[0].priceUsd < offers[1].priceUsd);
  assert.ok(offers[1].priceUsd < offers[2].priceUsd);
  assert.equal(offers[0].deliverables.length, 1);
  assert.match(offers[2].sku, /ANARCHI-TEST-001-STUDIO/);
}

function testMarketReadyKitWritesListingAndChecksums() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "anarchi-market-"));
  const assets = path.join(tmp, "assets");
  fs.mkdirSync(assets);
  fs.writeFileSync(path.join(assets, "theme.css"), ":root{}");
  fs.writeFileSync(path.join(assets, "starting-soon.html"), "<html></html>");

  const kit = buildMarketReadyKit(manifest, buildOfferLadder(manifest), assets, path.join(tmp, "kit"));

  assert.ok(fs.existsSync(kit.listingMarkdown));
  assert.ok(fs.existsSync(kit.listingJson));
  assert.ok(fs.existsSync(kit.customerReadme));
  assert.match(fs.readFileSync(kit.checksumManifest, "utf8"), /theme\.css/);
}

testVisualStateIsDeterministic();
testValidationFindsMissingEnabledAssets();
testValidationPassesWhenEnabledAssetsExist();
testThemeGenerationIsSeedDeterministic();
testOfferLadderTurnsManifestIntoSellableTiers();
testMarketReadyKitWritesListingAndChecksums();

console.log("[tests] visual engine deterministic checks passed");
