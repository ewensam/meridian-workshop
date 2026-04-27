# Technical Approach

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

Our approach begins with an independent codebase audit conducted as part of engagement onboarding. Rather than relying on the previous vendor's handoff documentation — which the RFP package itself acknowledges is limited — our team intends to establish a verified understanding of the current system before scoping or committing to delivery estimates. Architecture documentation (R4) is a direct output of this audit, not a separate workstream. Delivery is structured in phases, with each phase designed to close on a working deliverable. R3 (automated testing) is positioned to follow R1 remediation, so that the test suite covers a known-good baseline rather than inheriting existing defects.

---

## R1 — Reports Module Remediation

Our approach to the Reports module is to treat the previous vendor's notes as a starting point, not a complete picture. An independent audit of the module is scoped as the first task of the engagement. Based on the RFP description and a preliminary review of the handoff documentation, the audit is expected to cover at minimum: filter wiring (not all filters appear to have been connected to the API layer), internationalization gaps, inconsistencies between older Options API patterns and the newer Composition API patterns used elsewhere in the codebase, and API response handling inconsistencies.

The deliverable for R1 is a documented defect register (shared with Meridian prior to remediation work beginning) followed by a remediated Reports module. Meridian's review of the defect register is intended to serve as a checkpoint before development effort is committed.

**Assumption:** The defect register may surface issues beyond the eight logged by Meridian's team. Any items discovered during audit that fall outside agreed scope will be flagged for prioritisation rather than addressed unilaterally.

---

## R2 — Restocking Recommendations

The Restocking view is proposed as a new module within the existing dashboard, consistent with current navigation and visual patterns. The feature is scoped to: current stock levels across Meridian's three warehouses, an operator-supplied budget ceiling, and a purchase order recommendation output based on those inputs.

Our approach follows the existing data flow established in the codebase: Vue 3 Composition API on the frontend, API calls through the existing client-side API layer, and a new FastAPI endpoint on the backend to support the recommendation logic. This is intended to minimise deviation from patterns the Meridian IT team will need to maintain after handoff.

**Assumption:** Demand forecasting is treated as out of scope for this engagement. The Restocking view is designed around current stock data. If Meridian wishes to incorporate forecast data in a future phase, the proposed architecture is intended to accommodate that extension.

---

## R3 — Automated Browser Testing

End-to-end test coverage is proposed using Playwright, which is well-suited to Vue-based frontends and is straightforward for Meridian IT to run and extend after handoff.

Our approach to scoping R3 is deliberately collaborative: prior to writing any tests, we propose to deliver a test plan to Meridian IT for review and approval. This is intended to ensure the coverage reflects what IT considers critical, rather than what we assume to be critical. At minimum, the test plan is expected to propose happy-path coverage for each module (Inventory, Orders, Reports, Restocking).

The deliverable is a test plan (for IT sign-off) followed by an implemented, runnable test suite. Instructions for running the suite locally and in CI are included as part of the deliverable.

---

## R4 — Architecture Documentation

Architecture documentation is scoped as an output of the onboarding codebase audit rather than a standalone workstream. The deliverable is intended to cover: system components and their relationships, the API contract between frontend and backend, the current data layer (JSON-file based, with no external database), known constraints, and recommended considerations for future vendors.

Format is at our discretion per the RFP. We propose an interactive HTML diagram supplemented by a written narrative, which is more maintainable than a static image and easier for Meridian IT to reference during future changes.

---

## D1 — UI Modernisation

A visual refresh of the dashboard is within scope as an optional extension, to be sequenced after required items are complete. Our approach would involve aligning the interface to a agreed design direction — either a standard component library or a direction established in collaboration with Meridian stakeholders.

**Assumption:** Meridian does not currently have a brand style guide or design system to reference. If D1 is in scope, a brief design direction conversation with Meridian stakeholders is proposed before work begins.

---

## D2 — Internationalization

The existing codebase includes partial i18n support. Our approach is to extend that support to the remaining modules, with Tokyo warehouse staff as the primary beneficiary. Japanese language coverage is proposed as the priority locale.

**Assumption:** Translation content for Japanese locale would be provided by or reviewed by Meridian's Tokyo team. Our scope covers the technical i18n framework; Meridian is responsible for translation accuracy.

---

## D3 — Dark Mode

An operator-selectable dark theme is proposed using CSS custom properties, which allows the theme to be toggled at runtime without a rebuild and is consistent with modern browser capabilities. The implementation is intended to be additive — the default light theme remains unchanged, and dark mode is introduced as a user preference layer.

This item is scoped as the lowest-dependency optional extension and is well-suited to parallel development on an isolated branch once required scope is stable.
