/**
 * Nexus Enterprise HTML Sanitizer (XSS Mitigation)
 * Strips executable scripts, inline event handlers, and dangerous protocols
 * while preserving rich text formatting for collaborative editors.
 */

// Tags that are explicitly disallowed and stripped entirely with their contents
const DANGEROUS_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "applet",
  "style",
  "form",
  "meta",
  "link",
  "base"
];

// Regex matching inline on* handlers (e.g. onerror=..., onload=...)
const EVENT_HANDLER_REGEX = /\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;

// Regex matching javascript: or vbscript: or data:text/html protocol attributes
const DANGEROUS_URI_REGEX = /(href|src|action)\s*=\s*['"]\s*(?:javascript|vbscript|data:\s*text\/html):[^'"]*['"]/gi;

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  let clean = rawHtml;

  // 1. Remove dangerous paired tags and their contents
  for (const tag of DANGEROUS_TAGS) {
    const pairedRegex = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    clean = clean.replace(pairedRegex, "");

    // Remove any remaining opening or self-closing tags
    const singleRegex = new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi");
    clean = clean.replace(singleRegex, "");
  }

  // 2. Strip all inline event handlers (e.g. <img src=x onerror=alert(1)>)
  clean = clean.replace(EVENT_HANDLER_REGEX, "");

  // 3. Neutralize dangerous URIs (e.g. href="javascript:void(0)")
  clean = clean.replace(DANGEROUS_URI_REGEX, '$1="#"');

  return clean;
}
