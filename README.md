# Rumble Note

**Layer:** Rumble — Product  
**Role:** local-first block-based personal knowledge system  
**Mission:** help users capture, structure, connect, and reuse personal knowledge while feeding the agentic harness.

---

## Stack role

- **Layer:** Rumble — Product.
- **Role:** local-first block-based personal knowledge system.
- **Mission:** help users capture, structure, connect, and reuse personal knowledge while feeding the agentic harness.
- **Maturity:** `contract-first`.
- **Scale-ready:** no — specs exist, but the runtime is not present locally.
- **Current increment:** P0 specs.
- **Learning value:** local-first PKM, private blocks, personal memory exports, and privacy-preserving handoff.
- **Next quality step:** define the minimal block model and `NoteContextExport` privacy contract.

See the ecosystem cockpit in [`constantin-jais/ecosystem/status.md`](https://github.com/constantin-jais/constantin-jais/blob/main/ecosystem/status.md).

## Dogfooding

This repository is part of the forge dogfooding loop: the ecosystem should use its own tools to make specs, maturity, contracts, releases, and product documentation observable.

Current visible evidence:

- the repository documents local-first note, block, privacy, and export boundaries;
- README maturity notes make the lack of local runtime explicit;
- specs frame privacy-preserving handoff before sync or hosted claims are made.

Expected next evidence:

- publish example NoteContextExport fixtures;
- add visible privacy-boundary checks for exported context.

Dogfooding claims should stay backed by visible commands, fixtures, CI workflows, generated reports, or linked docs.

## Contributing

See:

- [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines;
- [ROADMAP.md](ROADMAP.md) for current contribution priorities;
- [issue templates](.github/ISSUE_TEMPLATE/) for bugs, docs issues, fixture/example requests, and design discussions.

## Usable today

The repository documents the intended personal knowledge product boundary and how note context should feed the harness without becoming ingestion or orchestration infrastructure.

## Not scale-ready yet

There is no local runtime yet, so capture, editing, sync/offline behavior, and privacy-preserving exports are not product-ready.

## Next product milestone

Specify a minimal block model and `NoteContextExport` contract with explicit private-by-default semantics.

## Purpose

`rumble-note` is a privacy-first personal knowledge system with fine-grained blocks, references, backlinks, Markdown/WYSIWYG ergonomics, and local-first data.

In this ecosystem, notes are not only a personal archive. They are structured context that can later feed agents, specs, learning sessions, inspections, and product work.

## Owns

- Block-based editing, references, backlinks, outlines, and local-first knowledge workflows.
- Personal capture, organization, retrieval, and reuse.
- User-facing knowledge graph and document interactions.
- Controlled handoff from personal notes to Rumble/Bolt workflows.

## Does Not Own

- Raw document extraction/OCR/import pipelines: belongs to Wrench.
- Agent orchestration and task execution: belongs to `cos-matic`.
- Long-term memory substrate internals: belongs to `gear-memory`.
- A separate “vault” product; privacy and local-first behavior are requirements of `rumble-note` itself.

## Allowed Dependencies

- Reads/writes through `gear-memory` for persistence/search when needed.
- Calls Wrench tools for ingestion instead of embedding extraction logic.
- Can use Bolt when notes trigger agentic workflows, spec generation, or learning activities.

## Product Vision Challenge

`rumble-note` must be the personal thinking surface that feeds the rest of the harness. It should not become an ingestion engine, an orchestrator, or a generic cloud notes clone.
