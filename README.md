**English** · [Français](README.fr.md)

> [!NOTE]
> **Reserved · future home of Notebook** — rebuilt in the canonical base repository [`libre-ai/libre-ai`](https://github.com/libre-ai/libre-ai) ([multi-repo topology, ADR-0008](https://github.com/libre-ai/libre-ai/blob/main/docs/adr/0008-multi-repo-target-topology-and-brand.md)).
> This repository will reopen as the real product repository when the owner activates it, consuming the base as a versioned dependency. The foundations described below are **being built now** — with links to the code that already exists.

# Notebook

**Private local-first knowledge graph.** Create, search and organize linked blocks offline in a portable private workspace. Select exactly which blocks and their context enter an immutable export — deterministic, content-addressed, never implicitly transmitted. Encrypted backup to recovery code, restore with conflict detection, or delete without trace.

The canonical brief it answers: _"my notes stay mine, on this device, searchable without the cloud"_ — preserved through offline capability, local-only storage, controlled export, and cryptographic backup with no server account or cloud sync.

## Why it's different

- **Local-first, not sync-first.** All journeys work offline — capture, search, select, export, backup, restore — without a server account or network. Data lives in IndexedDB on your device; exports are immutable files under your control.
- **Portable blocks, not cloud folders.** Select the exact subgraph — blocks and their transitive links — that enters an export. The result is a content-addressed immutable file with a canonical serialization you can audit byte-by-byte.
- **Deterministic, replayable backup.** Encrypt any workspace to a recovery code (16 bytes, 32 hex chars, Argon2id sealing). Restore always detects conflicts (same block ID, divergent content). No silent overwrites, no remote revocation of downloaded exports.
- **Graph, not markdown files.** Blocks are immutable revisions with links, full-text search, and backlinks index — not text files in folders. Revision history is local and explicit, never inferred from filesystem modification times.
- **Private by default.** Device ownership is the only actor in v1. External consumers receive explicit immutable exports, never direct notebook access. No background sync, no implicit ingestion, no telemetry.

## Status — spec-published, foundations under construction

Notebook is being rebuilt from locked contracts. It is **not released yet**; the local block domain and controlled export come first, and a good part of it already exists and is proven in the base repository:

| Foundation                                                      | State            | Evidence                                                                                                                                                                                                                  |
| --------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`notebook-core`** — deterministic WASM backup/export engine   | ✅ built, ready  | No host imports — no network, filesystem, clock, randomness or identity ([crates/notebook-core](https://github.com/libre-ai/libre-ai/tree/main/crates/notebook-core))                                                     |
| **Block domain model** — commands, queries, events, local index | ✅ built, tested | Immutable block revisions, links, full-text search, backlinks — 29 tests ([#217](https://github.com/libre-ai/libre-ai/pull/217))                                                                                          |
| **Local search indexing** — SiYuan parity increment             | ✅ merged        | Domain-driven local full-text search, revision history, backlinks index ([#217](https://github.com/libre-ai/libre-ai/pull/217))                                                                                           |
| **Contracts** — schemas, WIT world, golden vectors              | ✅ published     | Backup v2, seal request v2, context document v2; golden vectors for corrupt/old/missing cases ([contracts/fixtures/notebook-core-v2](https://github.com/libre-ai/libre-ai/tree/main/contracts/fixtures/notebook-core-v2)) |
| Server-side or app-level integration — consume notebook-core    | ⏳ next          | Bun/React host wires WASM component in browser worker; gate B approved on fixtures only                                                                                                                                   |
| Offline UI, export selection, backup/restore flow               | ⏳ in progress   | Keyboard-accessible editor, context preview, deterministic export generation, recovery flow                                                                                                                               |

This repository is a public reserved home, intentionally without product code until activation (wave 4). **Benchmark target:** SiYuan ([github.com/siyuan-note/siyuan](https://github.com/siyuan-note/siyuan)) — reached through portable local-first blocks, deterministic export, and offline-first architecture rather than sync/cloud discovery.

## How it works

1. **Capture offline** — device owner creates/edits linked blocks with local durable revisions, searches without network, inspects backlinks and revision history.
2. **Prepare context** — owner selects a root block, the system walks transitive dependencies (required links), identifies and alerts on exclusions, and computes a canonical serialization.
3. **Export immutable** — generates a content-addressed export file with remapped IDs (export-scoped), no plaintext recovery codes, local receipt only. Copy shared externally stays under owner's control; no remote revocation.
4. **Backup encrypted** — seals workspace to a recovery code (Argon2id + AES-256-GCM), produces deterministic envelope. Portable across devices; restore explicitly detects conflicts.
5. **Restore and manage** — restore into new workspace with conflict detection; supersede or delete without pretending to erase copies already shared; permanently destroy workspace keys and data.

## Architecture — built from interoperable bricks

Notebook is a product assembled from independently versioned bricks; each is usable and testable on its own, and the product is their composition (the multi-repo target of [ADR-0008](https://github.com/libre-ai/libre-ai/blob/main/docs/adr/0008-multi-repo-target-topology-and-brand.md)).

| Brick                                       | Role                                        | Interface it exposes / consumes                                                                                                                     |
| ------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`notebook-core`** (Rust → WASM component) | Deterministic backup/export engine + crypto | WIT world `notebook-core-v2`: `sealBackup(plaintext, recovery_code) → envelope`, `openBackup(envelope, recovery_code) → plaintext`; no host imports |
| **Block domain** (TypeScript)               | Commands, queries, events, graph logic      | `decideBlockCommand(state, cmd) → [events]`; `searchLocalIndex(query) → blocks`; `computeContextDeps(root) → required_blocks`                       |
| **`@libre-ai/web-platform`**                | Bun/React PWA foundation                    | Request handler, offline worker instantiation, accessible server-rendered document                                                                  |
| **Contracts**                               | Locked interoperability surface             | `notebook-backup.v2`, `context-document.v2`, schemas + WIT world + `SEMANTICS.md` + golden vectors                                                  |

The authorizing host passes canonical plaintext and recovery code to the engine; the engine holds no private key and reaches no network capability. Any consumer that speaks the same contracts can drive the same backup/restore.

## Where the work happens

All active development is in the base repository, under:

- `apps/notebook` — the product host (PWA, offline UI, context selection and export flow)
- `crates/notebook-core` — the Rust engine and its WASM component (backup crypto, canonical serialization)
- `contracts/` — the locked schemas, WIT world, golden vectors and contract semantics
- [`docs/apps/notebook.md`](https://github.com/libre-ai/libre-ai/blob/main/docs/apps/notebook.md) — the full product brief

To follow progress or contribute, open issues and pull requests in [`libre-ai/libre-ai`](https://github.com/libre-ai/libre-ai). This repository stays reserved until activation.

## License

EUPL-1.2.
