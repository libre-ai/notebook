# Notebook Canonical Agent Rules

## Purpose

Local-first personal knowledge workspace: capture, organize and retrieve notes entirely offline, exporting only what the user explicitly chooses. Couche-1 product of the Libre AI constellation.
Doctrine lives upstream: https://raw.githubusercontent.com/libre-ai/governance/main/docs/README.md

## Domain doctrine

- No cloud sync, no telemetry, no plugin runtime — the workspace never depends on a remote server or an account.
- The `notebook-core` engine sits behind a WIT boundary; its WASM integration into the application's capture/export flows is tracked in `project.v1.yaml`, not restated here.
- `libre-ai/ui`, `libre-ai/web-platform`, `libre-ai/contracts` and `libre-ai/governance` are consumed pinned by SHA in `package.json` — never redefined in this repo.

## Commands

- `bun install` — install dependencies
- `bun run check` — the full gate chain (toolchain, WIT, app tests, secret-scan, personal-data boundary, no-transmission, lint); run before pushing
- `bun run lint` — Biome only
- `cargo test --locked` — Rust workspace tests (`notebook-core`)

## Working here

- Security > quality > performance > completeness, in that order on conflict.
- Check real state before editing: `git status --short` and `bun run check`.
- English for code, comments and this file; French stays the human conversation language elsewhere.
- Never commit a machine-local absolute path (e.g. `/Users/...`); use repo-relative paths or `~`.
