# Agent Skill: Digital Asset Management (DAM) & Media

This skill provides guidelines and patterns for media asset ingestion, natural language visual search, AI auto-tagging, and generative image rendering in Nexus.

---

## Capabilities & Architecture

- **Endpoint:** `/api/dam` (`GET`, `POST`, `DELETE`)
- **Visual Search:** Natural language search matches simultaneously against filename, manual tags, and AI auto-generated visual tags.
- **Generative Rendering:** FLUX-inspired 3D isometric rendering engine supporting multiple aspect ratios (`16:9`, `1:1`, `9:16`, `4:5`).
- **File Upload:** Direct upload support for `.png`, `.jpg`, `.svg`, and `.mp4` formats.

---

## Ingesting a Media Asset with AI Auto-Tagging

```typescript
const response = await fetch("/api/dam", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "nexus-3d-cloud-datacenter.jpg",
    folder: "Hero Graphics",
    type: "image",
    size: "2.4 MB",
    dimensions: "1920 x 1080",
    previewUrl: "/nexus-hero-3d.jpg",
    prompt: "Modern 3D isometric cloud microservices pipeline with glowing fiber optics",
    tags: ["Cloud", "3D", "Architecture"]
  })
});

const data = await response.json();
console.log("Indexed Asset with Auto-Tags:", data.asset.aiAutoTags);
```
