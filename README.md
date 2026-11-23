# Cyber Academy – Exercices IGA interactifs

Site de formation permettant aux participants de la Cyber Academy de réaliser de façon interactive
les exercices jusqu'ici présentés sous forme de diapositives PowerPoint.

- **Exercice 1 – Employee arrival/departure workflow** : disponible.
- **Exercice 2 – Profile and entitlement association** : affiché « Coming soon ».

L'interface participant est en anglais.

## 1. Installation et lancement

Le projet ne nécessite **aucune installation, aucun build et aucune dépendance externe**
(pas de CDN, pas d'images distantes, icônes SVG intégrées).

1. Récupérer le dossier (clone Git ou archive ZIP).
2. Ouvrir `index.html` dans un navigateur récent (Chrome, Edge, Firefox, Safari).

C'est tout : le site fonctionne en double-cliquant sur le fichier (`file://`).

Pour le diffuser sur un réseau, il suffit de déposer les trois fichiers ci-dessous sur n'importe quel
hébergement statique (SharePoint, GitHub Pages, serveur web interne…). En local, on peut aussi lancer :

```bash
python3 -m http.server 8000
```

puis ouvrir <http://localhost:8000>.

### Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Application complète (HTML, CSS et JavaScript). |
| `config.js` | Catalogue : doers, applications, transitions, textes, action préremplie. |
| `correction.js` | Correction attendue de l'exercice 1 (**à compléter**, voir §4). |

Les trois fichiers doivent rester dans le même dossier.

## 2. Organisation du code (`index.html`)

Le script est découpé en sections numérotées (repérables par les bandeaux de commentaires) :

| Section | Contenu |
|---|---|
| 1. Configuration | Lecture de `config.js` / `correction.js`, constantes, messages affichés. |
| 2. Icons | Icônes SVG au style Lucide (`ICONS`) et helper `icon(name)`. |
| 3. State & persistence | Modèle de données (`nodes`, `edges`, `customApps`, `attempts`…) et sauvegarde `localStorage`. |
| 4–5. Catalog / Graph helpers | Recherche des doers/applications, parcours du graphe, règles de connexion (`canConnect`), complétude structurelle (`structuralStatus`). |
| 6. Answer grading | Comparaison avec la correction (`grade`), normalisation et similarité des libellés (`nameScore`). |
| 7. Automatic layout | Disposition automatique en couches (bouton « Tidy up » et vue correction). |
| 8–9. Toasts / Dialog | Notifications et fenêtres modales accessibles (élément `<dialog>`). |
| 10. Action modal | Création / modification d'une action, champ « Other », placement automatique. |
| 11. Connect / edge / delete | Ajout de connexions, modification du type de transition, suppression (simple ou en cascade). |
| 12. Check answer | Vérification, retours pédagogiques, félicitations, affichage de la correction. |
| 13. Router & render | Navigation par hash (`#/` et `#/exercise-1`), page d'accueil, barre d'outils, panneau latéral. |
| 14. Canvas rendering | Rendu des blocs, des cartes d'action et des flèches (SVG). |
| 15–16. View & interactions | Zoom, déplacement, recentrage, glisser-déposer avec alignement magnétique, raccourcis clavier. |

### Modèle de données

```js
{
  nodes: {               // blocs du workflow
    start: { type: 'start', x, y },
    a1:    { type: 'action', x, y, name, doer, app, required: true },
    and:   { type: 'and', x, y },
    end:   { type: 'end', x, y }
  },
  edges: [ { id, from, to, type: 'manual' | 'automatic' } ],
  customApps: [ { id, label, icon } ],   // applications ajoutées via « Other »
  attempts, solved, feedback, view
}
```

La progression est enregistrée dans le `localStorage` du navigateur (clé
`cyberAcademy.iga.exercise1.v1`). Le bouton « Reset exercise » l'efface.

## 3. Modifier les listes d'actions, de doers et d'applications

Tout se trouve dans **`config.js`** :

- `doers` : liste des doers (`id`, `label`, `icon`).
- `applications` : liste des applications (`id`, `label`, `icon`).
- `transitions` : libellés des opérations manuelle / automatique.
- `exercises` : cartes de la page d'accueil (titre, description, disponibilité).
- `exercise1.instruction` : consigne affichée dans le bandeau violet.
- `exercise1.firstAction` : action préremplie sous « Employee arrival ».
- `exercise1.actionSuggestions` : suggestions facultatives d'intitulés d'action (autocomplétion du
  champ « Action name »). Laissée vide par défaut pour ne pas donner la réponse.

Icônes disponibles : `users`, `bot`, `database`, `shieldCheck`, `grid`, `network`, `mail`, `idCard`,
`package`, `userPlus`, `userMinus`, `key`, `server`, `cloud`, `building`, `laptop`.
Pour en ajouter une, insérer son tracé SVG (24×24) dans l'objet `ICONS` de `index.html`.

> Les `id` sont utilisés par `correction.js`. On peut modifier un libellé librement, mais un `id`
> modifié doit aussi l'être dans la correction.

## 4. Configurer la correction attendue

La correction se configure dans **`correction.js`**. Elle contient volontairement des valeurs
**TODO** : aucune correction métier n'est intégrée au code.

Tant qu'une étape porte `todo: true`, le bouton « Check answer » vérifie uniquement la **structure**
du workflow et indique au participant que la correction n'est pas encore configurée.

Pour chaque étape :

| Champ | Description |
|---|---|
| `id` | Identifiant unique, utilisé par `parent`. |
| `name` | Libellé de référence. |
| `acceptedVariants` | Autres formulations acceptées. |
| `keywords` | Facultatif. Groupes de synonymes : si l'intitulé contient un mot de chaque groupe, il est accepté. Ex. `[['create','provision'],['account']]`. |
| `doer` | `id` du doer attendu (ou tableau d'`id`, ou `null` pour ne pas vérifier). |
| `application` | `id` de l'application attendue (ou tableau, ou `null`). |
| `transition` | Type de la flèche **entrante** : `'manual'` ou `'automatic'`. |
| `parent` | `'START'`, `'AND'` ou l'`id` de l'étape précédente. |
| `position` | `'before-and'` ou `'after-and'`. |
| `transitionToEnd` | Facultatif, pour la dernière étape d'une branche : type de la flèche vers END. |

Autres réglages :

- `maxAttemptsBeforeCorrection` : nombre de tentatives avant d'afficher « Show correction » (3 par défaut).
- `andNode.parent` / `andNode.transition` : étape qui mène au nœud AND et type de la flèche.
- `nameMatching.threshold` : seuil de similarité (0 à 1, 0,72 par défaut).
- `nameMatching.ignoredWords` : mots ignorés lors de la comparaison.

### Comparaison des libellés

Les libellés sont comparés après normalisation : majuscules/minuscules, accents, ponctuation et
espaces superflus ignorés, mots vides retirés, pluriels et formes en *-ed/-ing* rapprochés. Le score
combine la similarité par mots (tolérante aux fautes de frappe) et la distance d'édition sur la phrase
entière. Le nom est accepté si ce score atteint le seuil, s'il correspond exactement à une variante, ou
si les mots-clés configurés sont tous présents.

### Retours affichés au participant

En cas de réponse partiellement correcte, le participant reçoit des messages génériques (action
manquante, doer, application, type de transition, branche AND incomplète, action non reliée à END…),
et les actions concernées sont surlignées en orange, **sans que la bonne réponse soit révélée**. Les
textes de ces messages se trouvent dans la constante `MSG` au début du script de `index.html`.

## 5. Accessibilité et ergonomie

- Navigation complète au clavier : <kbd>Tab</kbd> pour sélectionner un bloc, flèches pour le
  déplacer (<kbd>Maj</kbd> pour aller plus vite), <kbd>Entrée</kbd> pour le modifier, <kbd>Suppr</kbd>
  pour le supprimer.
- Fenêtres modales natives (`<dialog>`) avec gestion du focus et fermeture par <kbd>Échap</kbd>.
- Messages d'erreur reliés aux champs (`aria-describedby`, `aria-invalid`), notifications annoncées
  aux lecteurs d'écran.
- Contrastes conformes WCAG AA ; animations désactivées si l'utilisateur préfère réduire les mouvements.
- Interface responsive (usage prioritaire sur ordinateur ; le panneau passe sous le canevas sur les
  écrans étroits).
