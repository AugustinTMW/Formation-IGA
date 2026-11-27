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

- « Check answer » ouvre la comparaison avec la proposition de correction (voir §4). Une partie
  vérifiée est marquée comme terminée dans les onglets et sur la page d'accueil.
- Part 1 → « Continue to Part 2 » ; Part 2 → « Back to Home ».
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

## 4. Correction de l'exercice 1 – proposition de correction

Il n'existe pas une réponse unique : chaque partie est comparée à **une proposition de correction**
(`correction.js` : `employeeArrivalSolution` et `employeeDepartureSolution`, issues des slides de la
formation).

### Déroulé
1. « Check answer » reste désactivé tant que la checklist structurelle n'est pas complète.
2. Au clic, la page affiche **côte à côte** « Your answer » (le workflow du participant, inchangé) et
   « Proposed correction », dans le même style de cartes, avec le message *« This is one possible
   solution. Other workflows may also be valid if they follow a coherent business logic. »*
3. Les boutons de la barre d'actions deviennent :
   - Part 1 : **Edit my workflow** et **Continue to Part 2** ;
   - Part 2 : **Edit my workflow** et **Back to Home**.
   « Edit my workflow » revient à l'édition ; on peut corriger puis relancer « Check answer ».

### Comparaison
- Chaque action du participant est rapprochée de l'étape de la proposition qui a le **même sens**
  (couple numéroté n°1, n°2… des deux côtés). Les libellés sont comparés par concepts : synonymes,
  anglais / français, formulations plus ou moins détaillées (ex. *Disable Active Directory account* ≈
  *Deactivate AD account* ; *Send departure notification to employee* ≈ *Notifier l'employé de son
  départ*). Le lexique est la constante `SEMANTIC_LEXICON` de `index.html` (on peut y ajouter des
  mots) ; `acceptedVariants` et `keywords` dans `correction.js` complètent la reconnaissance.
- Une fois le couple trouvé, **Action**, **Doer** et **Application** sont comparés séparément :
  - **vert** : cohérent / équivalent à la proposition ;
  - **orange** : différent de la proposition (l'info-bulle indique la valeur de l'autre côté) ;
  - **cadre orange en pointillés** : action absente de la proposition (« Not in the proposed
    correction ») ou étape de la proposition non retrouvée (« Potentially missing from your workflow »).
  Pas de rouge : la proposition n'est pas une correction absolue.
- Un résumé indique le nombre d'actions cohérentes, avec différences, potentiellement manquantes et
  hors proposition.
- Réglages (`matching` dans `correction.js`) : `threshold` (similarité minimale, 0,5) et
  `thresholdWithSameApp` (seuil plus bas si l'application est la même, 0,3).

### Modifier la proposition
Chaque étape : `name`, `acceptedVariants`, `keywords`, `doer`, `application` (identifiant, tableau,
ou libellé d'une application ajoutée avec « Other »), `transition` (`null` si la slide ne montre pas
de flèche), `parent` (`'START'`, `'AND'`, un identifiant ou un tableau d'identifiants), `position`,
`transitionToEnd`, `note` (minuteries, période de grâce…). `notes` affiche des remarques au-dessus de
la proposition (ex. réactivation de l'identité pendant la période de grâce, boucle non représentable
dans le workflow).

## 5. Accessibilité et ergonomie

- **Zone de travail ajustée à l'écran :** dans l'exercice 1 (deux parties) et l'exercice 2, la zone de
  travail prend toute la largeur et la hauteur restante sous la partie haute (en-tête, consigne, barre
  d'actions, messages, bandeau d'étiquettes), contrôles de zoom compris, sans défilement de la page.
  Elle se recalcule quand la fenêtre change de taille ou qu'un message apparaît (`fitWorkspace()`).
  En dessous d'environ 380 px disponibles (petits écrans, téléphone), une hauteur minimale est gardée et
  la page défile.
- **Ajustement du contenu à l'ouverture :** le workflow (exercice 1) ou les trois catégories
  (exercice 2) sont zoomés pour tenir dans la zone (au minimum 40 % pour l'exercice 1, 50 % pour
  l'exercice 2 afin de rester lisible). *Focus* montre tout le contenu ; dès que l'on zoome ou déplace
  la vue, elle n'est plus réajustée automatiquement au redimensionnement.

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

### Déroulé (deux parties successives sur le même tableau)
Le tableau est fixe (trois colonnes, pas de zone libre ni de zoom), inspiré de la slide de
référence : *Who performs this activity in my organization?* (cartes blanches à bord noir),
*Activities in my organization* (colonne violette), *Fine-grained rights* (colonne grise, cartes à
bord violet). Il occupe la hauteur disponible et défile à l'intérieur s'il y a beaucoup d'éléments.

1. **Part 1 — Classify the items** : glisser-déposer les étiquettes du bandeau (ordre aléatoire)
   dans les colonnes, les réordonner, les changer de colonne ou les renvoyer au bandeau. Aucune
   relation n'est possible. **Continue to Part 2** s'active quand chaque colonne contient au moins
   3 éléments (indicateurs *Who / Activities / Rights x/3* dans la barre d'actions et dans les
   en-têtes de colonnes).
2. **Part 2 — Create the relationships** : même tableau, classement conservé et verrouillé (le
   bandeau d'étiquettes est masqué). On tire une flèche depuis le rond à droite d'un élément vers un
   élément de la colonne suivante (ou clic sur un élément puis sur un élément surligné en vert).
   - Sens imposé : *Who → Activity → Fine-grained right* (pas de *Who → Right*).
   - **1:1 et 1:N autorisés, N:1 et N:N refusés** : un élément peut pointer vers plusieurs
     éléments de la colonne suivante, mais n'en reçoit qu'un seul de la colonne précédente.
   - **Check answer** s'active à partir de 3 associations complètes *Who → Activity → Right*
     (les relations partielles ne comptent pas).
   - **Back to Part 1** permet de revoir le classement (les relations devenues invalides sont
     retirées) ; **Tidy up** réordonne les cartes pour limiter les croisements.
- Les flèches passent derrière les cartes (aucun libellé masqué) ; celles de l'élément sélectionné
  et celles de la correction passent au premier plan.

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

