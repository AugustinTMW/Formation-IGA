# Cyber Academy – Exercices IGA interactifs

Site de formation permettant aux participants de la Cyber Academy de réaliser de façon interactive
les exercices jusqu'ici présentés sous forme de diapositives PowerPoint.

- **Exercice 1 – Employee arrival/departure workflow** : disponible, en deux parties :
  - *Part 1 – Employee arrival* (`#/exercise-1/arrival`) ;
  - *Part 2 – Employee departure* (`#/exercise-1/departure`).
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
| `config.js` | Catalogue : doers, applications, transitions, et parties de l'exercice 1 (consignes, bloc de départ, action préremplie). |
| `correction.js` | Corrections attendues : `employeeArrivalSolution` et `employeeDepartureSolution` (**à compléter**, voir §4). |
| `exercise2-data.js` | Exercice 2 : secteurs, cartes (acteurs, activités, droits fins) et relations correctes. |
| `assets/wavestone-symbol.svg` | Logo affiché en haut à gauche (cadre blanc à contour violet). |
| `assets/apps/` | Logos des applications (Active Directory, Office 365, Outlook pour *Mail Address*). |

Ces fichiers doivent rester dans le même dossier (avec le sous-dossier `assets/`).

## 2. Organisation du code (`index.html`)

### Un seul moteur pour les deux parties

Les parties *Employee arrival* et *Employee departure* n'ont pas d'interface séparée : elles utilisent
exactement le même code. Seules les données changent (`config.js` → `exercise1.parts[]`,
`correction.js` → une solution par partie). Au chargement d'une partie, `setPart(id)` définit
`PART` (configuration) et `CORR` (correction). Tous les composants lisent ensuite ces deux variables.

| Composant (cahier des charges) | Implémentation dans `index.html` |
|---|---|
| WorkflowCanvas | `mountExercise`, `renderCanvas`, `renderEdges`, section 15–16 (vue et interactions) |
| ActionNode | `nodeHTML` (cartes `node--action`) |
| AndNode / EndNode / bloc de départ | `nodeHTML` (blocs `node--fixed`) |
| ElementsSidebar | `renderPanel` |
| ActionModal | `openActionModal` |
| TransitionSelector | `transitionChoices`, `openConnectModal`, `openEdgeModal` |
| Validation structurelle | `structuralStatus` |
| Correction | `grade`, `checkAnswer`, `showFeedback`, `buildCorrectionGraph` |
| Navigation entre parties | `partTabs` / `renderPartTabs` (onglets dans le bandeau violet) |

Pour ajouter une troisième partie, il suffit d'ajouter une entrée dans `exercise1.parts` et la
solution correspondante dans `correction.js`.

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

La progression de chaque partie est enregistrée séparément dans le `localStorage` du navigateur
(clé `storageKey` de chaque partie : `cyberAcademy.iga.exercise1.v1` pour l'arrivée,
`cyberAcademy.iga.exercise1.departure.v1` pour le départ). Le bouton « Reset exercise » efface
uniquement la partie affichée.

### Fin de l'exercice

- Partie correcte : fenêtre « Congratulations! » propre à la partie, avec un bouton vers la partie
  restante si elle n'est pas encore réussie.
- Les deux parties correctes : fenêtre « Exercise completed! » (Employee Arrival / Employee
  Departure – Completed), avec « Review exercise » et « Back to home » (bouton principal).
- La carte de l'exercice 1 sur la page d'accueil affiche l'avancement de chaque partie, et
  « Start exercise » ouvre la première partie non terminée.

## 3. Modifier les listes d'actions, de doers et d'applications

Tout se trouve dans **`config.js`** :

- `doers` : liste des doers (`id`, `label`, `icon`).
- `applications` : liste des applications (`id`, `label`, `icon`, et `image` facultatif : chemin vers un vrai
  logo SVG ou PNG transparent carré, rangé dans `assets/apps/`, qui remplace alors l'icône).
- `transitions` : libellés des opérations manuelle / automatique.
- `exercises` : cartes de la page d'accueil (titre, description, disponibilité).
- `exercise1.parts[]` : une entrée par partie :
  - `instruction` : consigne affichée dans le bandeau violet ;
  - `startLabel` / `startIcon` : bloc de départ (« Employee arrival », « Employee departure ») ;
  - `firstAction` : action préremplie (`name`, `doer`, `application`, `transition`) ;
  - `storageKey` / `solutionKey` : clé de sauvegarde et nom de la solution dans `correction.js`.
- `exercise1.actionSuggestions` : suggestions facultatives d'intitulés d'action (autocomplétion du
  champ « Action name »). Laissée vide par défaut pour ne pas donner la réponse.

> **Part 2 – à compléter :** le doer, l'application et la transition de l'action préremplie
> « End date for employee is set in HR source » ne sont pas encore fournis (`null` + `TODO`).
> Tant qu'ils valent `null`, la carte affiche « Not set » et le participant doit les renseigner
> lui-même (crayon) pour que le workflow soit complet.

Icônes disponibles : `users`, `bot`, `database`, `shieldCheck`, `grid`, `network`, `mail`, `idCard`,
`package`, `userPlus`, `userMinus`, `key`, `server`, `cloud`, `building`, `laptop`.
Pour en ajouter une, insérer son tracé SVG (24×24) dans l'objet `ICONS` de `index.html`.

> Les `id` sont utilisés par `correction.js`. On peut modifier un libellé librement, mais un `id`
> modifié doit aussi l'être dans la correction.

## 4. Configurer la correction attendue

La correction se configure dans **`correction.js`**, qui contient deux solutions indépendantes :

- `employeeArrivalSolution` – Part 1 ;
- `employeeDepartureSolution` – Part 2.

Les deux ont exactement la même structure (décrite ci-dessous). Elles contiennent volontairement des
valeurs **TODO** : aucune correction métier n'est intégrée au code.

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

- **Fenêtre d'action :** elle ne contient que le nom, le doer et l'application. L'étape précédente
  et le type de transition se choisissent sur la flèche : en la traçant, via « Add an action » (petit
  menu Manual / Automatic avant la fenêtre), en cliquant sur son étiquette ou en déplaçant son bout.
- **Tracer une flèche à la souris :** attraper le point rond « + » sous un bloc et le glisser
  - sur un autre bloc : il s'entoure de vert (connexion valide) ou de rouge (refusée, avec la raison) ;
    au relâchement, un petit menu demande *Manual operation* ou *Automatic operation* ;
  - dans le vide : même menu, puis la fenêtre de création d'action, la nouvelle action étant placée à cet endroit.
- **Rebrancher une flèche :** attraper le bout de la flèche (petit rond qui apparaît au survol) et le
  déposer sur un autre bloc. Le type de transition est conservé.
- Un simple clic sur le point « + » ouvre toujours la fenêtre « Add a connection » ; la fenêtre d'une
  flèche (clic sur son étiquette) permet aussi de changer sa cible (« Connected to »), utile au clavier.

- Navigation complète au clavier : <kbd>Tab</kbd> pour sélectionner un bloc, flèches pour le
  déplacer (<kbd>Maj</kbd> pour aller plus vite), <kbd>Entrée</kbd> pour le modifier, <kbd>Suppr</kbd>
  pour le supprimer.
- Fenêtres modales natives (`<dialog>`) avec gestion du focus et fermeture par <kbd>Échap</kbd>.
- Messages d'erreur reliés aux champs (`aria-describedby`, `aria-invalid`), notifications annoncées
  aux lecteurs d'écran.
- Contrastes conformes WCAG AA ; animations désactivées si l'utilisateur préfère réduire les mouvements.
- Interface responsive (usage prioritaire sur ordinateur ; le panneau passe sous le canevas sur les
  écrans étroits).

## 6. Exercice 2 – Profile and entitlement association

Accès : page d'accueil → *Exercise 2* → choix du secteur (`#/exercise-2`). Seul **Consulting** est
disponible ; *Energy* et *Healthcare* sont affichés « Coming soon ».

### Déroulé
1. **Classer** les étiquettes du bandeau (ordre aléatoire) dans trois zones : *Who performs this
   activity in my organization?*, *Activities in my organization* (colonne centrale de couleur
   distincte) et *Fine-grained rights*, par glisser-déposer. On peut aussi déplacer une étiquette
   d'une zone à l'autre, la réordonner ou la renvoyer dans le bandeau.
2. **Relier** : tirer le rond à droite d'une carte vers une carte compatible, ou cliquer une carte
   puis une carte surlignée en vert. Seuls *Actor → Activity* et *Activity → Fine-grained right* sont
   autorisés. Le × rouge au milieu d'une flèche la supprime.
3. **Check answer** (même barre d'actions que l'exercice 1) : actif dès 3 chaînes complètes
   *Actor → Activity → Fine-grained right*.

### Règles de correction
- Chaque carte classée est marquée ✓ (bonne catégorie) ou ✗ (mauvaise). Les cartes encore dans le
  bandeau ne sont pas corrigées.
- Les flèches sont colorées en vert / rouge pendant environ 3 s, puis :
  - *Actor → Activity* correcte : conservée ;
  - *Activity → Right* correcte : conservée si l'activité a au moins une liaison acteur correcte (ou
    aucune liaison acteur) ;
  - si la liaison *Actor → Activity* d'une chaîne est fausse, toute la chaîne est supprimée, y compris
    une liaison *Activity → Right* correcte ;
  - toute liaison incorrecte est supprimée.
- Un résumé indique les chaînes entièrement correctes, les liaisons acteur conservées, les connexions
  supprimées et le nombre de cartes bien / mal classées. Aucune note sur 100.
- On peut recommencer autant de fois que nécessaire ; quand tout est classé et que les 42 relations
  sont correctes, la fenêtre « Exercise completed! » s'affiche.

### Données (`exercise2-data.js`)
- Chaque carte : `id` unique, `label`, `category` (`actor` | `activity` | `right`, jamais affichée
  avant la correction), `sector`.
- `relations` : liste `{ from, to }` vérifiée **par identifiant**, jamais par libellé.
- `interchangeableCards` : les deux cartes *Ticketing tool – Access to WS Support email address* ont
  des identifiants différents (une par activité). Comme le participant ne peut pas les distinguer,
  l'une ou l'autre est acceptée, à condition que chacune ne serve qu'une fois. Supprimer ce groupe
  pour exiger l'identifiant exact.
- Ajouter un secteur : renseigner `cards`, `relations`, `storageKey` et passer `available: true`.
- La progression est enregistrée par secteur (`storageKey`) ; « Reset exercise » efface le classement
  et les relations du secteur affiché ; « Reset view » ne touche qu'au zoom et à la position.

