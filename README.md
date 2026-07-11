<p align="center">
  <img src=".github/assets/repository-card.svg" alt="Libre AI Notebook, represented by linked private blocks and a controlled export." width="100%">
</p>

# Libre AI Notebook

A private-by-default, local-first knowledge workspace designed for controlled context export.

## Status

| | |
| --- | --- |
| Maturity | **Specification** |
| Works today | product boundary, contribution roadmap and security policy |
| Not available | there is no capture, editor, sync or export runtime |
| Historical ID | `rumble-note` may remain in historical references only |

This repository documents intent. It is not a usable notes application today.

## Product boundary

Notebook is intended to own:

- block-based capture, editing, references and backlinks;
- personal local-first organization and retrieval;
- private-by-default context selection;
- explicit, auditable export to other workflows.

It does **not** own generic extraction, orchestration, shared client infrastructure or long-term memory internals. A future `NoteContextExport` must disclose exactly what leaves the private workspace and require explicit user control.

## Next evidence

The next milestone is a minimal block model plus fixture-backed `NoteContextExport` privacy checks. Sync, hosted use and multi-device claims remain out of scope until encryption, conflict and authorization boundaries are proven.

## Contributing

Start with:

- [Roadmap](ROADMAP.md)
- [Contribution guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

Contributions should preserve data minimization, local-first operation and reversible handoffs.

## License

[MIT](LICENSE).
