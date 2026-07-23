[English](README.md) · **Français**

> [!NOTE]
> **Réservé · futur foyer de Notebook** — reconstruit dans le dépôt de base canonique [`libre-ai/libre-ai`](https://github.com/libre-ai/libre-ai) ([topologie multi-dépôts, ADR-0008](https://github.com/libre-ai/libre-ai/blob/main/docs/adr/0008-multi-repo-target-topology-and-brand.md)).
> Ce dépôt rouvrira comme dépôt produit réel lorsque le propriétaire l'activera, consommant la base comme dépendance versionnée. Les fondations décrites ci-dessous sont **en cours de construction** — avec des liens vers le code qui existe déjà.

# Notebook

**Graphe de connaissances privé, d'abord local.** Créez, recherchez et organisez des blocs liés hors ligne dans un espace de travail privé portable. Sélectionnez précisément quels blocs et leur contexte entrent une export immuable — déterministe, adressée par contenu, jamais transmise implicitement. Sauvegarde chiffrée par code de récupération, restauration avec détection de conflits, ou suppression sans trace.

Le cas canonique auquel il répond : _« mes notes restent miennes, sur cet appareil, interrogeables sans le cloud »_ — préservé par une capacité hors ligne, stockage local uniquement, export contrôlé et sauvegarde cryptographique sans compte serveur ni synchronisation cloud.

## Ce qui le distingue

- **D'abord local, pas d'abord sync.** Tous les parcours fonctionnent hors ligne — capture, recherche, sélection, export, sauvegarde, restauration — sans compte serveur ni réseau. Les données vivent dans IndexedDB sur votre appareil ; les exports sont des fichiers immuables sous votre contrôle.
- **Blocs portables, pas dossiers cloud.** Sélectionnez le sous-graphe exact — blocs et leurs liens transitifs — qui entre dans une export. Le résultat est un fichier immuable adressé par contenu avec une sérialisation canonique que vous pouvez auditer octet par octet.
- **Sauvegarde déterministe, rejouable.** Chiffrez tout espace de travail en un code de récupération (16 octets, 32 caractères hex, scellage Argon2id). La restauration détecte toujours les conflits (même ID de bloc, contenu divergent). Aucune écrasement silencieux, aucune révocation à distance des exports téléchargés.
- **Graphe, pas fichiers markdown.** Les blocs sont des révisions immuables avec liens, recherche texte intégral et index de rétroliens — pas des fichiers texte dans des dossiers. L'historique des révisions est local et explicite, jamais inféré des heures de modification du système de fichiers.
- **Privé par défaut.** La propriété de l'appareil est le seul acteur en v1. Les consommateurs externes reçoivent des exports explicites immuables, jamais un accès direct au notebook. Pas de synchronisation en arrière-plan, pas d'ingestion implicite, pas de télémétrie.

## État — spécifié publiquement, fondations en construction

Notebook est reconstruit à partir de contrats verrouillés. Il **n'est pas encore publié** ; le domaine local des blocs et l'export contrôlée viennent d'abord, et une bonne partie existe déjà et est prouvée dans le dépôt de base :

| Fondation                                                                  | État                | Preuve                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`notebook-core`** — moteur WASM sauvegarde/export déterministe           | ✅ construit, prêt  | Aucun import hôte — ni réseau, ni système de fichiers, ni horloge, ni aléa, ni identité ([crates/notebook-core](https://github.com/libre-ai/libre-ai/tree/main/crates/notebook-core))                                                              |
| **Modèle de domaine blocs** — commandes, requêtes, événements, index local | ✅ construit, testé | Révisions de blocs immuables, liens, recherche texte intégral, index de rétroliens — 29 tests ([#217](https://github.com/libre-ai/libre-ai/pull/217))                                                                                              |
| **Indexation de recherche locale** — incrément de parité SiYuan            | ✅ fusionné         | Recherche texte intégral localisée pilotée par le domaine, historique des révisions, index de rétroliens ([#217](https://github.com/libre-ai/libre-ai/pull/217))                                                                                   |
| **Contrats** — schémas, monde WIT, vecteurs golden                         | ✅ publié           | Sauvegarde v2, requête de scellement v2, document contextuel v2 ; vecteurs golden pour cas corrompus/anciens/manquants ([contracts/fixtures/notebook-core-v2](https://github.com/libre-ai/libre-ai/tree/main/contracts/fixtures/notebook-core-v2)) |
| Intégration côté serveur ou au niveau app — consommer notebook-core        | ⏳ suite            | L'hôte Bun/React câble le composant WASM dans un worker navigateur ; Gate B approuvée sur fixtures uniquement                                                                                                                                      |
| Interface hors ligne, sélection d'export, flux sauvegarde/restauration     | ⏳ en cours         | Éditeur accessible au clavier, aperçu du contexte, génération déterministe d'export, flux de récupération                                                                                                                                          |

Ce dépôt est `private` jusqu'à ce qu'un audit de sécurité autorise sa réouverture publique (vague 4). **Cible de référence :** SiYuan ([https://github.com/siyuan-note/siyuan](https://github.com/siyuan-note/siyuan)) — atteinte par une architecture local-first portable, export déterministe et prioritaire hors ligne plutôt que par la découverte sync/cloud.

## Comment ça fonctionne

1. **Capture hors ligne** — le propriétaire de l'appareil crée/édite des blocs liés avec révisions locales durables, recherche sans réseau, inspecte les rétroliens et l'historique des révisions.
2. **Préparez le contexte** — le propriétaire sélectionne un bloc racine, le système parcourt les dépendances transitives (liens requis), identifie et alerte sur les exclusions, et calcule une sérialisation canonique.
3. **Exportez immuablement** — génère un fichier d'export adressé par contenu avec IDs remappées (scoped à l'export), aucun code de récupération en clair, reçu local uniquement. Une copie partagée en externe reste sous le contrôle du propriétaire ; pas de révocation à distance.
4. **Sauvegarde chiffrée** — scelle l'espace de travail dans un code de récupération (Argon2id + AES-256-GCM), produit une enveloppe déterministe. Portable entre appareils ; la restauration détecte explicitement les conflits.
5. **Restaurez et gérez** — restaurez dans un nouvel espace de travail avec détection de conflits ; dépassez ou supprimez sans prétendre effacer les copies déjà partagées ; détruisez définitivement les clés et données de l'espace de travail.

## Architecture — assemblé à partir de briques interopérables

Notebook est un produit assemblé à partir de briques versionnées indépendamment ; chacune est utilisable et testable seule, et le produit est leur composition (la cible multi-dépôts de [l'ADR-0008](https://github.com/libre-ai/libre-ai/blob/main/docs/adr/0008-multi-repo-target-topology-and-brand.md)).

| Brique                                      | Rôle                                            | Interface exposée / consommée                                                                                                                          |
| ------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`notebook-core`** (Rust → composant WASM) | Moteur déterministe sauvegarde/export + crypto  | Monde WIT `notebook-core-v2` : `sealBackup(plaintext, recovery_code) → envelope`, `openBackup(envelope, recovery_code) → plaintext` ; sans import hôte |
| **Domaine blocs** (TypeScript)              | Commandes, requêtes, événements, logique graphe | `decideBlockCommand(state, cmd) → [events]` ; `searchLocalIndex(query) → blocks` ; `computeContextDeps(root) → required_blocks`                        |
| **`@libre-ai/web-platform`**                | Fondation PWA Bun/React                         | Gestionnaire de requêtes, instanciation de worker hors ligne, document rendu côté serveur accessible                                                   |
| **Contrats**                                | Surface d'interopérabilité verrouillée          | `notebook-backup.v2`, `context-document.v2`, schémas + monde WIT + `SEMANTICS.md` + vecteurs golden                                                    |

L'hôte qui autorise passe au moteur le plaintext canonique et le code de récupération ; le moteur ne détient aucune clé privée et n'atteint aucune capacité réseau. Tout consommateur qui parle les mêmes contrats peut piloter la même sauvegarde/restauration.

## Où se déroule le travail

Tout le développement actif est dans le dépôt de base, sous :

- `apps/notebook` — l'hôte produit (PWA, interface hors ligne, sélection de contexte et flux d'export)
- `crates/notebook-core` — le moteur Rust et son composant WASM (crypto de sauvegarde, sérialisation canonique)
- `contracts/` — les schémas verrouillés, le monde WIT, les vecteurs golden et la sémantique des contrats
- [`docs/apps/notebook.md`](https://github.com/libre-ai/libre-ai/blob/main/docs/apps/notebook.md) — le cahier des charges produit complet

Pour suivre l'avancement ou contribuer, ouvrez issues et pull requests dans [`libre-ai/libre-ai`](https://github.com/libre-ai/libre-ai). Ce dépôt reste réservé jusqu'à son activation.

## Licence

EUPL-1.2.
