# rumble-note

**Outil** : Rumble
**Rôle** : PKM local-first en blocs et export de contexte privé
**deployment_class** : product-linkable
**Maturité** : contract-first — specs seules/0 runtime ; `NoteContextExport` à écrire
**Place dans la chaîne DoD** : doit produire un contexte personnel contrôlé pour Gear Memory et les handoffs, sans devenir ingestion ni orchestration.
**Doctrine** : local-first et privé par défaut ; le produit garde l’UX, Gear garde le substrat.
**Souveraineté** : licences MIT/Apache/MPL compatibles ; pas d’AGPL/SSPL dans la chaîne versionnée.

## Ce que ça fait

Cadre un système de notes en blocs, références, graphes et exports contrôlés vers le harness. Aujourd’hui, c’est une spec : capture, édition, sync/offline et exports ne sont pas encore prêts.

## Où ça se branche

- Amont : connaissances personnelles utilisateur.
- Aval : [gear-memory](https://github.com/constantin-jais/gear-memory) pour `SourceRef`/mémoire, [gear-loader](https://github.com/constantin-jais/gear-loader) pour import brut, Bolt/Rumble pour handoffs.
- Contrats à produire : block model minimal, `NoteContextExport`, politiques de confidentialité.

---

## Dogfooding

This repository is part of the Daidalos dogfooding loop: the ecosystem should use its own tools to make specs, maturity, contracts, releases, and product documentation observable.

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

- Raw document extraction/OCR/import pipelines: belongs to `gear-loader`.
- Client-platform primitives, tokens, accessibility, and native/web adapters: belong to Portal.
- Agent orchestration and task execution: belongs to `bolt-cos-matic`.
- Long-term memory substrate internals: belongs to `gear-memory`.
- A separate “vault” product; privacy and local-first behavior are requirements of `rumble-note` itself.

## Allowed Dependencies

- Reads/writes through `gear-memory` for persistence/search when needed.
- Calls `gear-loader` for ingestion instead of embedding extraction logic.
- Uses Wrench tools for inspection/validation evidence.
- Uses Portal for reusable client-platform primitives when UI work starts.
- Can use Bolt when notes trigger agentic workflows, spec generation, or learning activities.

## Product Vision Challenge

`rumble-note` must be the personal thinking surface that feeds the rest of the harness. It should not become an ingestion engine, an orchestrator, or a generic cloud notes clone.
