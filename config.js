/*
 * Cyber Academy – IGA exercises
 * ------------------------------------------------------------------
 * CATALOG CONFIGURATION
 *
 * Edit this file to change the doers, applications, transitions and
 * texts used by the exercises. No build step is needed: save the file
 * and reload index.html.
 *
 * Icons available (see ICONS in index.html):
 *   users, bot, database, shieldCheck, grid, network, mail, idCard,
 *   package, userPlus, userMinus, key, server, cloud, building, laptop
 *
 * IMPORTANT: the `id` values are referenced by correction.js.
 * Change a label freely, but keep ids stable (or update correction.js).
 */
window.IGA_CONFIG = {
  /* ---------- Doers (who performs an action) ---------- */
  doers: [
    { id: 'hr',   label: 'HR team',             icon: 'users' },
    { id: 'auto', label: 'Automatic operation', icon: 'bot' }
  ],

  /* ---------- Applications ----------
   * Participants can also add their own application with "Other";
   * custom applications are stored with their progress in the browser.
   */
  applications: [
    { id: 'sirh', label: 'SIRH',             icon: 'database' },
    { id: 'iga',  label: 'IGA tool',         icon: 'shieldCheck' },
    { id: 'o365', label: 'Office 365',       icon: 'grid' },
    { id: 'ad',   label: 'Active Directory', icon: 'network' },
    { id: 'mail', label: 'Mail Address',     icon: 'mail' },
    { id: 'card', label: 'Access card',      icon: 'idCard' }
  ],

  /* ---------- Transitions (arrow types) ---------- */
  transitions: [
    { id: 'manual',    label: 'Manual operation',    short: 'Manual',    icon: 'hand' },
    { id: 'automatic', label: 'Automatic operation', short: 'Automatic', icon: 'zap' }
  ],

  /* ---------- Home page cards ---------- */
  exercises: [
    {
      id: 'exercise-1',
      number: 'Exercise 1',
      title: 'Employee arrival/departure workflow',
      description: 'Build the joiner workflow step by step: choose the right actions, doers, applications and transitions, from the HR entry to the provisioning of every access.',
      icon: 'userPlus',
      available: true,
      duration: '20–30 min'
    },
    {
      id: 'exercise-2',
      number: 'Exercise 2',
      title: 'Profile and entitlement association',
      description: 'Associate business profiles with the right entitlements across applications, and apply the least-privilege principle.',
      icon: 'key',
      available: false,
      duration: '20 min'
    }
  ],

  /* ---------- Exercise 1 ---------- */
  exercise1: {
    title: 'Exercise 1 – Employee arrival workflow',
    instruction: 'An employee is joining the company. Based on what you learned during the presentation, fill in the blanks with the steps required to ensure that their arrival takes place in the best possible conditions. You must find the right actions, doers and applications for each step of the process.',
    startLabel: 'Employee arrival',

    /* Action shown pre-filled under "Employee arrival" (cannot be deleted). */
    firstAction: {
      name: "Employee's profile entered in SAP (SIRH)",
      doer: 'hr',
      application: 'sirh',
      transition: 'manual'
    },

    /* Optional autocomplete suggestions for the "Action name" field.
     * Leave empty so participants find the actions by themselves, or
     * add generic wording to help beginners, e.g. 'Create the account'. */
    actionSuggestions: []
  }
};
