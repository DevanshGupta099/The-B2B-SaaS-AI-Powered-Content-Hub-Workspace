# Agent Skill: Governance, Brand Linters & Compliance

This skill covers deterministic brand voice rules, superlatives detection, enterprise RBAC, and SOC2 audit streaming.

---

## 1. Deterministic Voice Linters (`evaluateBrandVoice`)

Nexus enforces factual precision and brand authority by actively scanning for prohibited corporate buzzwords and unverified claims:

- Prohibited terms: `revolutionary`, `seamless`, `best-in-class`, `guaranteed`, `game-changer`, `unlock`, `elevate`, `10x`.
- Penalty calculation: 18 points deducted per infraction.
- 1-Click AI AutoFix: Automatically rewrites drafts replacing buzzwords with verifiable, direct metrics and SLA references.

---

## 2. Enterprise RBAC Hierarchy

1. **Owner:** Full organization access, Stripe billing portal, developer API key management.
2. **Admin:** Team invitation, workspace configuration, model routing.
3. **Content Lead:** Editorial approvals, brand kit modification, custom agent provisioning.
4. **Reviewer:** Document commenting, legal/compliance approval stamps.
5. **Guest Client:** Read-only portal view with scoped client feedback permissions.
