/*
 * Cyber AcaDimy – IGA exercises
 * ------------------------------------------------------------------
 * EXERCISE 2 – PROFILE AND ENTITLEMENT ASSOCIATION (business data)
 *
 * The participant classifies cards into three categories and builds
 * chains:  Actor → Activity → Fine-grained right.
 *
 * Every card has a unique `id`. Relationships are checked with ids only,
 * never with labels (two cards may share the same label).
 *
 * To add a sector later (Energy, Healthcare), fill in its `cards`,
 * `relations` and set `available: true`. No change to index.html needed.
 *
 * Card fields
 *   id        unique identifier (referenced by `relations`)
 *   label     text shown to the participant
 *   category  'actor' | 'activity' | 'right'  (never shown before correction)
 *   sector    id of the sector
 *
 * Relations: list of { from, to } (Actor → Activity, Activity → Right).
 *
 * interchangeableCards: groups of cards with exactly the same label.
 *   The participant cannot tell them apart, so a relationship to any card
 *   of the group is accepted, as long as each card of the group is used
 *   once. Remove a group to require the exact card id.
 */
(function () {
  'use strict';

  const SECTOR = 'consulting';
  const card = (id, label, category) => ({ id, label, category, sector: SECTOR });

  const consultingCards = [
    /* ---------- Actors ---------- */
    card('a-hr-recruiting', 'HR Recruiting', 'actor'),
    card('a-marketing', 'Marketing', 'actor'),
    card('a-it-department', 'IT Department', 'actor'),
    card('a-consultant', 'Consultant/employee', 'actor'),
    card('a-managing-controller', 'Managing controller', 'actor'),
    card('a-hr-relay', 'HR Relay', 'actor'),
    card('a-hr-payroll', 'HR Payroll', 'actor'),
    card('a-cdm-manager', 'CDM/manager', 'actor'),
    card('a-it-support', 'IT Support', 'actor'),

    /* ---------- Activities ---------- */
    card('act-pay-salaries', 'Pay salaries', 'activity'),
    card('act-recruit', 'Recruit new employees', 'activity'),
    card('act-define-budget', 'Define the budget', 'activity'),
    card('act-manage-treasury', 'Manage the treasury', 'activity'),
    card('act-holidays-set-in', 'Holidays set in', 'activity'),
    card('act-newcomer-integration', 'Newcomer’s integration', 'activity'),
    card('act-holidays-validation', 'Holidays validation', 'activity'),
    card('act-salary-increase-validation', 'Salary increase validation', 'activity'),
    card('act-improve-tools', 'Improve internal tools and processes', 'activity'),
    card('act-prospect-clients', 'Prospect future clients of the firm', 'activity'),
    card('act-computer-troubleshooting', 'User computer troubleshooting', 'activity'),
    card('act-holidays-monitoring', 'Holidays and absences monitoring', 'activity'),
    card('act-answer-tickets', 'Answer to the users’ tickets', 'activity'),
    card('act-expense-validation', 'Expense report validation', 'activity'),
    card('act-salary-increase-set-in', 'Salary increase set in', 'activity'),
    card('act-sale-cycle', 'Manage sale cycle and pre-sale', 'activity'),
    card('act-imputations-set-in', 'Imputations set in', 'activity'),
    card('act-client-strategy', 'Establish the strategy of a client account', 'activity'),
    card('act-it-maintenance', 'Internal IT tools maintenance', 'activity'),
    card('act-expense-set-in', 'Expense report set in', 'activity'),

    /* ---------- Fine-grained rights ---------- */
    card('r-wk-salary-increase-validation', 'Wavekeeper – Validation of a salary increase request', 'right'),
    card('r-sr-candidate-creation', 'Smartrecruiters – Candidate file creation', 'right'),
    card('r-wk-pay-tab', 'Wavekeeper – Writing and reading rights – Pay tab', 'right'),
    card('r-budget-tool', 'WS budget tool – Reading and writing rights', 'right'),
    card('r-treasury-tool', 'WS Treasury tool – Reading and writing rights', 'right'),
    card('r-sf-customer-file-write', 'Salesforce – Writing access to a customer’s file', 'right'),
    card('r-wk-employee-holidays-edit', 'Wavekeeper – Employee file editing – Holidays and absences', 'right'),
    card('r-ticketing-1', 'Ticketing tool – Access to WS Support email address', 'right'),
    card('r-wk-holidays-validation', 'Wavekeeper – Holidays validation', 'right'),
    card('r-ticketing-2', 'Ticketing tool – Access to WS Support email address', 'right'),
    card('r-sf-customer-files-read', 'Salesforce – Reading access to customer files', 'right'),
    card('r-wk-salary-increase-tab', 'Wavekeeper – Writing rights – Salary increase tab', 'right'),
    card('r-sf-contact-lists', 'Salesforce – Access to customer contact lists', 'right'),
    card('r-wk-holidays-tab', 'Wavekeeper – Writing rights – Holidays and absences tab', 'right'),
    card('r-wk-imputation-tab', 'Wavekeeper – Writing rights – Imputation tab', 'right'),
    card('r-wk-expense-tab', 'Wavekeeper – Writing rights – Expense report tab', 'right'),
    card('r-sr-candidate-editing', 'Smartrecruiters – Candidate’s file editing', 'right'),
    card('r-wk-read-write', 'Wavekeeper – Reading and writing rights', 'right'),
    card('r-wk-newcomers-read', 'Wavekeeper – Reading rights of newcomers’ files', 'right'),
    card('r-internal-tool-admin', 'Internal tool – Administrator access', 'right'),
    card('r-wk-expense-validation', 'Wavekeeper – Expense report validation', 'right'),
    card('r-admin-tools-admin', 'Administration tools – Administrator access', 'right')
  ];

  const link = (from, to) => ({ from, to });

  const consultingRelations = [
    // HR Recruiting
    link('a-hr-recruiting', 'act-recruit'),
    link('act-recruit', 'r-sr-candidate-creation'),
    link('act-recruit', 'r-sr-candidate-editing'),

    // Marketing
    link('a-marketing', 'act-prospect-clients'),
    link('act-prospect-clients', 'r-sf-contact-lists'),
    link('a-marketing', 'act-sale-cycle'),
    link('act-sale-cycle', 'r-sf-customer-file-write'),
    link('a-marketing', 'act-client-strategy'),
    link('act-client-strategy', 'r-sf-customer-files-read'),

    // IT Department
    link('a-it-department', 'act-improve-tools'),
    link('act-improve-tools', 'r-wk-read-write'),
    link('a-it-department', 'act-it-maintenance'),
    link('act-it-maintenance', 'r-admin-tools-admin'),
    link('act-it-maintenance', 'r-internal-tool-admin'),

    // Consultant/employee
    link('a-consultant', 'act-holidays-set-in'),
    link('act-holidays-set-in', 'r-wk-holidays-tab'),
    link('a-consultant', 'act-imputations-set-in'),
    link('act-imputations-set-in', 'r-wk-imputation-tab'),
    link('a-consultant', 'act-expense-set-in'),
    link('act-expense-set-in', 'r-wk-expense-tab'),

    // Managing controller
    link('a-managing-controller', 'act-define-budget'),
    link('act-define-budget', 'r-budget-tool'),
    link('a-managing-controller', 'act-manage-treasury'),
    link('act-manage-treasury', 'r-treasury-tool'),

    // HR Relay
    link('a-hr-relay', 'act-newcomer-integration'),
    link('act-newcomer-integration', 'r-wk-newcomers-read'),
    link('a-hr-relay', 'act-salary-increase-validation'),
    link('act-salary-increase-validation', 'r-wk-salary-increase-validation'),
    link('a-hr-relay', 'act-holidays-monitoring'),
    link('act-holidays-monitoring', 'r-wk-employee-holidays-edit'),

    // HR Payroll
    link('a-hr-payroll', 'act-pay-salaries'),
    link('act-pay-salaries', 'r-wk-pay-tab'),

    // CDM/manager
    link('a-cdm-manager', 'act-holidays-validation'),
    link('act-holidays-validation', 'r-wk-holidays-validation'),
    link('a-cdm-manager', 'act-salary-increase-set-in'),
    link('act-salary-increase-set-in', 'r-wk-salary-increase-tab'),
    link('a-cdm-manager', 'act-expense-validation'),
    link('act-expense-validation', 'r-wk-expense-validation'),

    // IT Support (each activity has its own Ticketing card)
    link('a-it-support', 'act-computer-troubleshooting'),
    link('act-computer-troubleshooting', 'r-ticketing-1'),
    link('a-it-support', 'act-answer-tickets'),
    link('act-answer-tickets', 'r-ticketing-2')
  ];

  window.IGA_EXERCISE2 = {
    title: 'Exercise 2 – Profile and entitlement association',
    instruction: 'Classify the items into the three categories, then connect them to build meaningful relationships between actors, activities, and fine-grained rights. Create at least 3 relationships to check your answer.',
    minChains: 3,

    /* The three categories (columns), from left to right. */
    categories: [
      { id: 'actor', title: 'Who performs this activity in my organization?', short: 'Actors', icon: 'users' },
      { id: 'activity', title: 'Activities in my organization', short: 'Activities', icon: 'workflow' },
      { id: 'right', title: 'Fine-grained rights', short: 'Fine-grained rights', icon: 'key' }
    ],

    sectors: [
      {
        id: 'consulting',
        aliases: ['wavestone'],   // old URL #/exercise-2/wavestone still works
        label: 'Consulting',
        description: 'A consulting firm: HR, sales, IT and management teams, and the tools they use every day.',
        image: 'assets/wavestone-symbol.svg',
        icon: 'briefcase',   // fallback if the image is removed
        available: true,
        storageKey: 'cyberAcademy.iga.exercise2.wavestone.v1',   // kept as is: preserves saved progress
        cards: consultingCards,
        relations: consultingRelations,
        interchangeableCards: [['r-ticketing-1', 'r-ticketing-2']]
      },
      {
        id: 'energy',
        label: 'Energy',
        description: 'An energy company: operations, maintenance and the industrial systems behind them.',
        icon: 'zap',
        available: false,
        cards: [],
        relations: []
      },
      {
        id: 'healthcare',
        label: 'Healthcare',
        description: 'A hospital: medical and administrative staff, patient services and their applications.',
        icon: 'heartPulse',
        available: false,
        cards: [],
        relations: []
      }
    ]
  };
})();
