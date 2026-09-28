---
name: dam-and-media
description: Workflows for Digital Asset Management (DAM), AI auto-tagging, file uploads, and generative media synthesis.
---

# Digital Asset Management (DAM) & Media Skill

Use this skill when managing visual assets, metadata indexing, generative rendering, and natural language search in Nexus.

## Endpoints & Data Model

- **Endpoint:** `/api/dam` (`GET`, `POST`, `DELETE`)
- **Asset Schema:**
  - `id`: Unique asset identifier
  - `name`: Clean filename (e.g. `nexus-hero-3d.jpg`)
  - `folder`: Category folder (e.g. `Hero Graphics`, `Product Screenshots`, `Brand & Security`)
  - `type`: `image`, `video`, `svg`, `logo`
  - `dimensions`: Standard resolution string (e.g. `1920 x 1080`)
  - `previewUrl`: Local path or data URI
  - `tags`: Manual taxonomy tags
  - `aiAutoTags`: Semantic tags generated via LLM prompt analysis

## Best Practices

1. **Avoid Broken External Hotlinks:** Always provide a valid local fallback image in `content-hub/public/` (e.g. `/nexus-hero-3d.jpg`, `/nexus-dashboard-mockup.jpg`).
2. **AI Auto-Tagging:** When creating new assets via `POST /api/dam`, supply `prompt` or `name` so the backend generates 4 contextual tags automatically.
3. **Natural Search:** Search queries match against `name`, `tags`, and `aiAutoTags` simultaneously.
