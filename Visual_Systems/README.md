# AnarchI Visual Systems Engine

## Surface Systems v1

A deterministic asset factory for high-fidelity overlays, branded screens, and reusable visual packs.

## Quick Start

```bash
npm install
copy src\identity\identity.data.example.json src\identity\identity.data.json
npm test
npm run build
npm run market:demo
npm run gui
```

## Core Features

- Deterministic visual states calculated from numeric instability profiles.
- Rarity and marketplace metadata for packaged asset drops.
- Sellable offer ladders for starter, pro, and studio packaging.
- Plug-and-play brand identity through `src/identity/identity.data.json`.
- Validation tests for generated assets and deterministic CSS output.
- Release scripts that run tests before packaging.
- A no-Puppeteer market-ready build path that emits assets, marketplace listing copy, customer README, checksums, offer tiers, and a ZIP package.

## Sell Immediately

```bash
npm run preflight:market
```

The market-ready ZIP is emitted under `dist/market-ready/release/`.

## Safety

Generated `dist`, `bin`, and `releases` outputs are intentionally ignored. The source of truth is TypeScript, JSON configuration, and authored tests.

Copyright 2026 AnarchI Studio. Professional Visual Systems for deterministic branded production.
