/*
 * Cyber Academy – IGA exercises
 * ------------------------------------------------------------------
 * EXPECTED ANSWERS (CORRECTIONS) – EXERCISE 1
 *
 * Two independent solutions:
 *   employeeArrivalSolution    Part 1 – Employee arrival
 *   employeeDepartureSolution  Part 2 – Employee departure
 * (names referenced by config.js > exercise1.parts[].solutionKey)
 *
 * TODO (trainer): fill in the expected workflows below.
 * Every step marked `todo: true` is a PLACEHOLDER. As long as at least
 * one placeholder remains, "Check answer" only validates the structure
 * of the participant's workflow and tells them that the reference
 * answer has not been configured yet.
 *
 * Step fields
 * -----------
 *  id               Unique identifier, used by `parent` references.
 *  name             Reference wording of the action.
 *  acceptedVariants Other accepted wordings. Matching ignores case,
 *                   accents, punctuation, extra spaces, common filler
 *                   words, and tolerates small typos.
 *  keywords         Optional. Array of groups of synonyms; if the
 *                   participant's wording contains at least one word of
 *                   EVERY group, the name is accepted.
 *                   e.g. [['create', 'provision'], ['account']]
 *  doer             Doer id from config.js ('hr', 'auto'), an array of
 *                   accepted ids, or null to skip the check.
 *  application      Application id from config.js ('sirh', 'iga', 'o365',
 *                   'ad', 'mail', 'card'), an array, or null.
 *  transition       Type of the arrow coming INTO this step from its
 *                   parent: 'manual' | 'automatic' | null.
 *  parent           'START' (Employee arrival), 'AND' (a branch of the
 *                   AND node) or the id of another step.
 *  position         'before-and' | 'after-and'.
 *  transitionToEnd  Optional. For the last step of a branch: type of the
 *                   arrow going to END ('manual' | 'automatic'). Leave
 *                   null to only check that the step is linked to END.
 *  todo             true = placeholder, remove once the step is filled.
 */
window.IGA_CORRECTION = {
  /* ================= PART 1 – EMPLOYEE ARRIVAL ================= */
  employeeArrivalSolution: {
    /* Number of failed attempts before "Show correction" is offered. */
    maxAttemptsBeforeCorrection: 3,

    nameMatching: {
      /* 0..1 – minimum similarity for a wording to be accepted. */
      threshold: 0.72,
      /* Words ignored when comparing wordings. */
      ignoredWords: ['the', 'a', 'an', 'of', 'in', 'into', 'on', 'to', 'for', 'is', 'are', 'be', 'and', 'with', 'by', 'from', 'their', 'his', 'her', 'its', 'new']
    },

    /* Arrow going INTO the AND node. */
    andNode: {
      parent: 'TODO_step_before_and', // TODO: id of the last step before AND
      transition: null                // TODO: 'manual' | 'automatic'
    },

    steps: [
      {
        // Pre-filled step (matches config.js > exercise1.firstAction).
        id: 'profile-sirh',
        name: "Employee's profile entered in SAP (SIRH)",
        acceptedVariants: ['Employee profile entered in SAP', 'Profile entered in the SIRH', 'Employee profile created in SAP'],
        keywords: [['profile'], ['sap', 'sirh']],
        doer: 'hr',
        application: 'sirh',
        transition: 'manual',
        parent: 'START',
        position: 'before-and'
      },
      {
        id: 'TODO_step_before_and',
        todo: true,                   // TODO: remove once filled
        name: 'TODO – action between the HR entry and the AND node',
        acceptedVariants: [],
        doer: null,                   // TODO
        application: null,            // TODO
        transition: null,             // TODO
        parent: 'profile-sirh',
        position: 'before-and'
      },
      {
        id: 'TODO_branch_1',
        todo: true,
        name: 'TODO – first parallel action',
        acceptedVariants: [],
        doer: null,
        application: null,
        transition: null,
        parent: 'AND',
        position: 'after-and',
        transitionToEnd: null
      },
      {
        id: 'TODO_branch_2',
        todo: true,
        name: 'TODO – second parallel action',
        acceptedVariants: [],
        doer: null,
        application: null,
        transition: null,
        parent: 'AND',
        position: 'after-and',
        transitionToEnd: null
      },
      {
        id: 'TODO_branch_3',
        todo: true,
        name: 'TODO – third parallel action',
        acceptedVariants: [],
        doer: null,
        application: null,
        transition: null,
        parent: 'AND',
        position: 'after-and',
        transitionToEnd: null
      }
      // Add more steps as needed, e.g. a second action in branch 1:
      // { id: 'branch-1b', name: '...', doer: 'auto', application: 'ad',
      //   transition: 'automatic', parent: 'TODO_branch_1', position: 'after-and' }
    ]
  },

  /* ================= PART 2 – EMPLOYEE DEPARTURE ================= */
  employeeDepartureSolution: {
    maxAttemptsBeforeCorrection: 3,

    nameMatching: {
      threshold: 0.72,
      ignoredWords: ['the', 'a', 'an', 'of', 'in', 'into', 'on', 'to', 'for', 'is', 'are', 'be', 'and', 'with', 'by', 'from', 'their', 'his', 'her', 'its']
    },

    andNode: {
      parent: 'TODO_departure_before_and', // TODO: id of the last step before AND
      transition: null                     // TODO: 'manual' | 'automatic'
    },

    steps: [
      {
        // Pre-filled step (matches config.js > exercise1.parts[1].firstAction).
        id: 'end-date-hr',
        todo: true,                   // TODO: remove once doer/application/transition are filled
        name: 'End date for employee is set in HR source',
        acceptedVariants: [],
        doer: null,                   // TODO
        application: null,            // TODO
        transition: null,             // TODO
        parent: 'START',
        position: 'before-and'
      },
      {
        id: 'TODO_departure_before_and',
        todo: true,
        name: 'TODO – action between the HR end date and the AND node',
        acceptedVariants: [],
        doer: null,
        application: null,
        transition: null,
        parent: 'end-date-hr',
        position: 'before-and'
      },
      {
        id: 'TODO_departure_branch_1',
        todo: true,
        name: 'TODO – first parallel action',
        acceptedVariants: [],
        doer: null,
        application: null,
        transition: null,
        parent: 'AND',
        position: 'after-and',
        transitionToEnd: null
      },
      {
        id: 'TODO_departure_branch_2',
        todo: true,
        name: 'TODO – second parallel action',
        acceptedVariants: [],
        doer: null,
        application: null,
        transition: null,
        parent: 'AND',
        position: 'after-and',
        transitionToEnd: null
      },
      {
        id: 'TODO_departure_branch_3',
        todo: true,
        name: 'TODO – third parallel action',
        acceptedVariants: [],
        doer: null,
        application: null,
        transition: null,
        parent: 'AND',
        position: 'after-and',
        transitionToEnd: null
      }
    ]
  }
};
