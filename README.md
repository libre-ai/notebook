# Notebook

Espace de connaissances local et privé par défaut, export de contexte contrôlé (couche 1).

Pour toute personne qui construit une base de connaissances personnelle, qui rencontre des outils de prise de notes qui envoient ses données dans le nuage et l'y enferment, ce projet permet de capturer, organiser et retrouver ses notes entièrement en local, et n'exporter que ce qu'elle choisit, en produisant un espace de notes local, chiffrable, dont chaque export est un choix explicite, sans dépendre de : aucun serveur distant, aucune télémétrie, aucun compte.

## État du projet

<!-- libre-ai:project-status:begin -->
<!-- Section générée depuis project.v1.yaml — ne pas éditer à la main. -->

- Situation actuelle : L'application Notebook, née dans le hub et greffée ici avec son histoire (γ 3.5), installe et teste verte sur les briques épinglées de la constellation ; le crate notebook-core (frontière WIT, patch aes audité) vit dans ce workspace. Le domaine bloc (apps/notebook/src/domain/block.ts) n'a aujourd'hui aucun appelant hors de ses propres tests ; l'unique écran produit (apps/notebook/src/ui/notebook-app.tsx) est le host de sauvegarde/restauration Gate B (fixture publique), pas un écran de capture. L'intégration WASM dans les parcours réels de l'application reste à faire.
- Maturité : usable
- Exposition : spec-published
- Confiance : medium
- Preuves vérifiées le : 2026-08-18
- Avancement : 10,5 % du périmètre actuellement déclaré

<!-- libre-ai:project-status:end -->

## Vérifier

- `bun install && bun run check` — la chaîne de gates du dépôt, tests inclus.
- La fiche [`project.v1.yaml`](./project.v1.yaml) est l'autorité de l'état du projet ; la section « État du projet » ci-dessus en est générée et un gate de flotte échoue si elles divergent.
- La provenance de chaque chemin migré depuis le hub est tracée dans l'index de migration de `libre-ai/libre-ai` (`ecosystem/migration-index.v1.yaml`).
