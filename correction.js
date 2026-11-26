/*
 * Cyber AcaDimy – IGA exercises
 * ------------------------------------------------------------------
 * PROPOSED CORRECTIONS – EXERCISE 1
 *
 * There is no single exact answer to this exercise: each workflow below
 * is ONE PROPOSED SOLUTION. When the participant clicks "Check answer",
 * their workflow is shown next to the proposal ("Your answer" /
 * "Proposed correction") and each action is compared element by element
 * (action meaning, doer, application) with a green / orange colour code.
 *
 *   employeeArrivalSolution    Part 1 – Employee arrival
 *   employeeDepartureSolution  Part 2 – Employee departure
 * (names referenced by config.js > exercise1.parts[].solutionKey)
 *
 * Source: reference slides of the Cyber AcaDimy training.
 *
 * Step fields
 * -----------
 *  id               Unique identifier, used by `parent` references.
 *  name             Wording shown in the proposed correction.
 *  acceptedVariants Other wordings with the same meaning (any language).
 *                   Wordings are compared by MEANING: synonyms, English /
 *                   French, more or less detailed sentences are accepted
 *                   (see SEMANTIC_LEXICON in index.html).
 *  keywords         Optional. Groups of synonyms; if the participant's
 *                   wording contains one word of EVERY group, it is
 *                   considered equivalent. e.g. [['disable'], ['ad']]
 *  doer             Doer id from config.js ('hr', 'auto') or an array.
 *  application      Application id from config.js ('sirh', 'iga', 'o365',
 *                   'ad', 'mail', 'card'), an array, or the label of an
 *                   application the participant may add with "Other".
 *  transition       Arrow coming INTO the step: 'manual' | 'automatic' |
 *                   null when the reference slide shows no arrow.
 *  parent           'START', 'AND', the id of another step, or an array of
 *                   ids when several arrows enter the step.
 *  position         'before-and' | 'after-and'.
 *  transitionToEnd  For the last step: arrow going to END.
 *  note             Optional remark shown under the step in the proposal
 *                   (timers, grace period…).
 */
window.IGA_CORRECTION = {
  /* ================= PART 1 – EMPLOYEE ARRIVAL ================= */
  employeeArrivalSolution: {
    matching: {
      /* 0..1 – minimum similarity of meaning to pair two actions. */
      threshold: 0.5,
      /* Lower similarity accepted when the application is the same. */
      thresholdWithSameApp: 0.3
    },

    andNode: { parent: 'arr-address-check', transition: 'automatic' },

    steps: [
      {
        id: 'arr-profile',
        name: "Employee's profile entered in Wavekeeper (SIRH)",
        acceptedVariants: ['Employee profile created in the HR system', 'Newcomer registered in the SIRH'],
        doer: 'hr',
        application: 'sirh',
        transition: 'manual',
        parent: 'START',
        position: 'before-and'
      },
      {
        id: 'arr-iga-identity',
        name: 'IGA tool gets the newcomer and creates the identity',
        acceptedVariants: ['Identity created in the IGA tool', 'Newcomer imported into the IGA tool'],
        doer: 'auto',
        application: 'iga',
        transition: 'manual',
        parent: 'arr-profile',
        position: 'before-and'
      },
      {
        id: 'arr-email',
        name: 'Email address generated with the « lastname/firstname » template',
        acceptedVariants: ['Email address created from the first name and last name', 'Generate the email address'],
        doer: 'auto',
        application: 'iga',
        transition: 'automatic',
        parent: 'arr-iga-identity',
        position: 'before-and'
      },
      {
        id: 'arr-address-check',
        name: 'Address verification (namesake)',
        acceptedVariants: ['Check that the email address is unique', 'Homonym check'],
        doer: 'auto',
        application: 'iga',
        transition: 'automatic',
        parent: 'arr-email',
        position: 'before-and'
      },
      {
        id: 'arr-ad',
        name: 'Account creation in AD',
        acceptedVariants: ['Create the Active Directory account'],
        doer: 'auto',
        application: 'ad',
        transition: 'automatic',
        parent: 'AND',
        position: 'after-and'
      },
      {
        id: 'arr-o365',
        name: 'Office 365 account creation with email address',
        acceptedVariants: ['Create the Office 365 mailbox'],
        doer: 'auto',
        application: 'o365',
        transition: 'automatic',
        parent: 'AND',
        position: 'after-and'
      },
      {
        id: 'arr-badge',
        name: 'Creation of the badge account for access to company premises',
        acceptedVariants: ['Create the access card', 'Badge creation'],
        doer: 'auto',
        application: 'card',
        transition: 'automatic',
        parent: 'AND',
        position: 'after-and'
      },
      {
        id: 'arr-notify',
        name: 'Notification to manager and beneficiary',
        acceptedVariants: ['Notify the manager and the new employee', 'Send the accesses to the manager and the newcomer'],
        doer: 'auto',
        application: 'mail',
        transition: 'automatic',
        parent: ['arr-ad', 'arr-o365', 'arr-badge'],
        position: 'after-and',
        transitionToEnd: 'manual'
      }
    ]
  },

  /* ================= PART 2 – EMPLOYEE DEPARTURE ================= */
  employeeDepartureSolution: {
    matching: { threshold: 0.5, thresholdWithSameApp: 0.3 },

    andNode: { parent: 'dep-date-reached', transition: 'automatic' },

    /* Shown above the proposed correction. */
    notes: [
      'Grace period: if the employee comes back before the identity is deleted, the identity is reactivated (back to “Get departure date in IGA Tool”).'
    ],

    steps: [
      {
        id: 'dep-end-date',
        name: 'End date for employee is set in HR source',
        acceptedVariants: ['Departure date entered in the SIRH'],
        doer: 'hr',
        application: 'sirh',
        transition: 'manual',
        parent: 'START',
        position: 'before-and'
      },
      {
        id: 'dep-get-date',
        name: 'Get departure date in IGA Tool',
        acceptedVariants: ['IGA tool retrieves the end date', 'Departure date imported into the IGA tool'],
        doer: 'auto',
        application: 'iga',
        transition: 'manual',
        parent: 'dep-end-date',
        position: 'before-and'
      },
      {
        id: 'dep-notify-departure',
        name: 'Notification of the employee departure',
        acceptedVariants: ['Send departure notification to employee', 'Notify the employee of the departure'],
        doer: 'auto',
        application: 'mail',
        transition: null,
        parent: 'dep-get-date',
        position: 'before-and',
        note: '15 days – 7 days – 1 day before the departure'
      },
      {
        id: 'dep-date-reached',
        name: 'Departure date is reached',
        acceptedVariants: ['End date reached', 'Last working day'],
        doer: 'auto',
        application: 'iga',
        transition: 'manual',
        parent: 'dep-notify-departure',
        position: 'before-and'
      },
      {
        id: 'dep-ad',
        name: 'Account disabled in AD',
        acceptedVariants: ['Deactivate the Active Directory account'],
        doer: 'auto',
        application: 'ad',
        transition: 'automatic',
        parent: 'AND',
        position: 'after-and'
      },
      {
        id: 'dep-azure',
        name: 'Account disabled in Azure AD',
        acceptedVariants: ['Deactivate the Entra ID account', 'Disable the cloud account'],
        doer: 'auto',
        // No "Azure AD" in the list: Active Directory or an application
        // added with "Other" (Azure AD / Entra ID) are accepted.
        application: ['ad', 'Azure AD', 'Azure Active Directory', 'Entra ID', 'Microsoft Entra ID'],
        transition: 'automatic',
        parent: 'AND',
        position: 'after-and'
      },
      {
        id: 'dep-badge',
        name: 'Badge account disabled',
        acceptedVariants: ['Deactivate the access card'],
        doer: 'auto',
        application: 'card',
        transition: 'automatic',
        parent: 'AND',
        position: 'after-and'
      },
      {
        id: 'dep-notify-manager',
        name: 'Notify manager about account deactivation',
        acceptedVariants: ['Send a notification to the manager'],
        doer: 'auto',
        application: 'mail',
        transition: 'automatic',
        parent: ['dep-ad', 'dep-azure', 'dep-badge'],
        position: 'after-and',
        note: 'Start of the grace period'
      },
      {
        id: 'dep-rights-removed',
        name: 'Rights removed',
        acceptedVariants: ['Remove the accesses', 'Entitlements revoked'],
        doer: 'auto',
        application: 'iga',
        transition: null,
        parent: 'dep-notify-manager',
        position: 'after-and',
        note: '30 days later (grace period)'
      },
      {
        id: 'dep-identity-deleted',
        name: 'Identity deleted',
        acceptedVariants: ['Delete the identity'],
        doer: 'auto',
        application: 'iga',
        transition: null,
        parent: 'dep-rights-removed',
        position: 'after-and',
        transitionToEnd: 'automatic',
        note: '60 days later'
      }
    ]
  }
};
