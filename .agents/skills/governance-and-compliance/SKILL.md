---
name: governance-and-compliance
description: Protocols for deterministic brand voice linters, zero data retention guardrails, and enterprise RBAC in Nexus.
---

# Governance & Compliance Skill

Use this skill when implementing, extending, or testing brand voice rules, RBAC policies, and audit streaming in Nexus.

## Deterministic Voice Linters (`evaluateBrandVoice`)

Nexus rejects unverified superlatives and corporate filler through deterministic regular expression tokenization.

- **Flagged Superlatives:** `revolutionary`, `seamless`, `best-in-class`, `guaranteed`, `game-changer`, `unlock`, `elevate`, `10x`.
- **Scoring Formula:**
  - Base score: 100
  - Penalty: 18 points per infraction (capped at 30 for short headlines < 10 words).
  - Minimum floor: 12.
- **Tone Classification:**
  - `score >= 85`: Flawless brand alignment.
  - `60 <= score < 85`: Moderate compliance.
  - `score < 60`: High risk of brand drift.

## Enterprise RBAC Matrix

- **Owner:** Full system administrative control, billing, API keys.
- **Admin:** Team management, workspace provisioning, model selection.
- **Content Lead:** Editorial approvals, brand rules configuration, agent deployment.
- **Reviewer:** Document commenting, legal/compliance approval stamps.
- **Guest Client:** Read-only portal view with scoped client feedback permissions.
