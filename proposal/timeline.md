# Timeline

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

The engagement is structured in four phases. Each phase is intended to close on a concrete deliverable, so Meridian receives working output at regular intervals rather than at the end of the contract.

Estimates below assume a prompt start following contract execution and timely availability of a Meridian IT contact for R3 scoping and R4 review.

---

## Phase 1 — Onboarding & Architecture Audit (Week 1)

Independent codebase review. Output: architecture documentation (R4) and a defect register for the Reports module, shared with Meridian prior to Phase 2 beginning. This phase establishes the verified baseline the rest of the engagement builds on.

**Deliverable:** Architecture overview (R4) + Reports defect register

---

## Phase 2 — Reports Remediation (Weeks 2–3)

Remediation of all defects identified in the Phase 1 audit, against the defect register reviewed and agreed with Meridian. Includes filter wiring, i18n gaps, and API pattern inconsistencies.

**Deliverable:** Remediated Reports module (R1)

---

## Phase 3 — Automated Testing (Week 4)

Test plan delivered to Meridian IT for scope approval in the first half of the week. Test suite implemented against the approved plan in the second half, covering the remediated Reports module and existing dashboard modules.

**Deliverable:** Test plan (IT sign-off) + implemented Playwright test suite (R3)

---

## Phase 4 — Restocking Feature (Weeks 5–6)

New Restocking view built against the stable, tested codebase from Phases 1–3. Includes backend API endpoint and frontend view integrated into existing navigation.

**Deliverable:** Restocking recommendations view (R2)

---

## Optional Extensions — D1, D2, D3 (Weeks 7–8, if in scope)

Desired items are scoped as a fifth phase, contingent on required scope completion. UI modernisation (D1), i18n extension (D2), and dark mode (D3) are independent of each other and can be sequenced or de-scoped individually based on Meridian's priorities at that point.

**Estimated duration:** 1–2 weeks depending on items selected

---

## Summary

| Phase | Scope | Weeks |
|---|---|---|
| 1 | Onboarding, architecture audit | 1 |
| 2 | Reports remediation (R1) | 2–3 |
| 3 | Automated testing (R3) | 4 |
| 4 | Restocking feature (R2) | 5–6 |
| 5 *(optional)* | UI, i18n, dark mode (D1–D3) | 7–8 |

**Total (required scope):** 6 weeks from contract execution
**Total (with all desired items):** 8 weeks

---

*Timeline is contingent on: contract execution within two weeks of award, Meridian IT availability for R3 scoping in Week 4, and prompt review of the Phase 1 defect register. Material changes to agreed scope may require timeline revision.*
