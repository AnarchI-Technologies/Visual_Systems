import type { AssetDefinition, DropManifest } from "../schema.js";

export type OfferTier = "starter" | "pro" | "studio";

export interface MarketplaceOffer {
  sku: string;
  title: string;
  tier: OfferTier;
  priceUsd: number;
  license: string;
  deliverables: string[];
  proofPoints: string[];
  upgradePath: string;
}

const TIER_MULTIPLIER: Record<OfferTier, number> = {
  starter: 1,
  pro: 1.9,
  studio: 3.4,
};

const TIER_LICENSE: Record<OfferTier, string> = {
  starter: "Standard Commercial Streamer License",
  pro: "Creator Studio Commercial License",
  studio: "Agency / Team Deployment License",
};

function enabledAssets(assets: AssetDefinition[]): AssetDefinition[] {
  return assets.filter((asset) => asset.enabled);
}

function basePrice(manifest: DropManifest): number {
  const parsed = Number.parseFloat(manifest.marketplace.price);
  return Number.isFinite(parsed) ? parsed : 19.99;
}

export function buildMarketplaceOffer(manifest: DropManifest, tier: OfferTier): MarketplaceOffer {
  const assets = enabledAssets(manifest.assets);
  const corruptionPremium = manifest.edition === "corrupted" ? 8 : 0;
  const assetPremium = Math.max(0, assets.length - 3) * 4;
  const priceUsd = Math.round((basePrice(manifest) + corruptionPremium + assetPremium) * TIER_MULTIPLIER[tier]);

  return {
    sku: `${manifest.serialNumber || manifest.id}-${tier}`.toUpperCase(),
    title: `${manifest.dropName} ${tier.toUpperCase()} Pack`,
    tier,
    priceUsd,
    license: TIER_LICENSE[tier],
    deliverables: assets.map((asset) => `${asset.name} (${asset.width}x${asset.height})`),
    proofPoints: [
      "Deterministic visual state generated from versioned manifest inputs.",
      "Enabled assets validated before packaging.",
      "Brand identity separated from generated output for safe client swaps.",
    ],
    upgradePath: tier === "studio" ? "Custom enterprise integration" : "Upgrade to the next tier for broader deployment rights.",
  };
}

export function buildOfferLadder(manifest: DropManifest): MarketplaceOffer[] {
  return ["starter", "pro", "studio"].map((tier) => buildMarketplaceOffer(manifest, tier as OfferTier));
}
