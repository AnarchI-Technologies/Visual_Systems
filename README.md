# AnarchI Visual Systems Engine

Deterministic visual systems engine for branded overlays, streaming surfaces, and generated asset packs.

Hardcoding freedom into the systems of tomorrow.

## Purpose

Visual Systems turns visual identity into repeatable production logic. Instead of treating each asset as a one-off design task, it models themes, rarity, instability, validation, and brand state as configurable inputs that can generate consistent output at scale.

## Quick Start

```bash
cd Visual_Systems
npm install
copy src\identity\identity.data.example.json src\identity\identity.data.json
npm test
npm run build
npm run gui
```

## Core Features

- Deterministic visual state generation through numeric instability rules.
- Rarity tiers for asset and pricing variation.
- JSON-driven identity swaps for fast rebranding.
- Presentation-safe asset factory architecture.
- Authored test harness for deterministic output and asset validation.

## Production Notes

- Keep private brand assets and client files out of public commits unless intentionally released.
- Treat generated outputs as artifacts, not source-of-truth configuration.
- Cleanup is dry-run by default; use `npm run cleanup -- --apply` only when intentionally moving files.
- Add screenshots or sample outputs when the next visual set is approved for public display.

## Brand

AnarchI builds systems that feel alive because the rules underneath them are deep, explicit, and controlled.
