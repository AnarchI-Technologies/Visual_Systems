import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

import type { DropManifest } from "../schema.js";
import type { MarketplaceOffer } from "./offerBuilder.js";

export interface MarketReadyKit {
  kitDirectory: string;
  listingMarkdown: string;
  listingJson: string;
  customerReadme: string;
  checksumManifest: string;
}

export function buildMarketReadyKit(
  manifest: DropManifest,
  offers: MarketplaceOffer[],
  compiledAssetDirectory: string,
  outputDirectory: string
): MarketReadyKit {
  const kitDirectory = path.join(outputDirectory, manifest.id);
  fs.mkdirSync(kitDirectory, { recursive: true });

  const listingMarkdown = path.join(kitDirectory, "MARKETPLACE-LISTING.md");
  const listingJson = path.join(kitDirectory, "marketplace-listing.json");
  const customerReadme = path.join(kitDirectory, "CUSTOMER-README.md");
  const checksumManifest = path.join(kitDirectory, "SHA256SUMS.txt");

  fs.writeFileSync(listingMarkdown, renderListingMarkdown(manifest, offers));
  fs.writeFileSync(listingJson, JSON.stringify({ manifest, offers }, null, 2));
  fs.writeFileSync(customerReadme, renderCustomerReadme(manifest));
  fs.writeFileSync(checksumManifest, hashDirectory(compiledAssetDirectory));

  return {
    kitDirectory,
    listingMarkdown,
    listingJson,
    customerReadme,
    checksumManifest,
  };
}

function renderListingMarkdown(manifest: DropManifest, offers: MarketplaceOffer[]): string {
  const offerRows = offers
    .map((offer) => `| ${offer.tier} | ${offer.sku} | $${offer.priceUsd} | ${offer.license} |`)
    .join("\n");

  return `# ${manifest.marketplace.title || manifest.dropName}

${manifest.marketplace.shortDescription || "Deterministic visual overlay pack for streamers, creators, and branded demo surfaces."}

## What Buyers Get

- ${manifest.assets.filter((asset) => asset.enabled).length} validated HTML/CSS visual assets.
- Deterministic manifest metadata and serial number: \`${manifest.serialNumber}\`.
- Brand-safe identity configuration.
- SHA-256 checksum manifest for delivered files.

## Offer Ladder

| Tier | SKU | Price | License |
| --- | --- | ---: | --- |
${offerRows}

## Proof Points

${offers[0].proofPoints.map((point) => `- ${point}`).join("\n")}

## Safe Claim Boundary

This product is a deterministic visual system. It does not include customer data, credentials, private platform automation, or unsupported performance guarantees.
`;
}

function renderCustomerReadme(manifest: DropManifest): string {
  return `# ${manifest.dropName} Customer README

Thank you for purchasing an AnarchI Visual Systems pack.

## Files

- \`theme.css\`: deterministic theme variables.
- \`metadata.json\`: serial number, license, and package metadata.
- \`*.html\`: browser-ready visual assets.
- \`SHA256SUMS.txt\`: checksum manifest for delivered files.

## Use

Open any HTML asset in a browser or add it as a browser source in a streaming/production tool.

## License

${manifest.marketplace.license}

## Support Boundary

This pack contains static visual assets. It does not require private account access, browser profiles, or automation permissions.
`;
}

function hashDirectory(directory: string): string {
  const files = collectFiles(directory);
  return files
    .map((file) => `${sha256File(file)}  ${path.relative(directory, file).replace(/\\/g, "/")}`)
    .join("\n") + "\n";
}

function collectFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
  }).sort();
}

function sha256File(file: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
}
