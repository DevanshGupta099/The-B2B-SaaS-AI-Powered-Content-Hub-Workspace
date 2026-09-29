/**
 * Nexus Avatar Generator
 * Generates vector avatars across diverse styles using DiceBear vector API
 * with instant self-contained SVG fallbacks.
 */

export type AvatarStyle = 
  | "lorelei"      // Illustrated modern characters
  | "bottts"       // Playful tech/AI robots
  | "avataaars"    // Vector styled humans
  | "shapes"       // Colorful geometric tech emblems
  | "initials"     // Monogram badges with bold backgrounds
  | "fun-emoji"    // Expressive emoji characters
  | "thumbs";      // Stylish mini characters

// Color palettes for avatar backgrounds
const AVATAR_BG_COLORS = "b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf";

/**
 * Returns a high-resolution vector avatar URL from DiceBear API
 */
export function getAvatarUrl(nameOrEmail: string, style: AvatarStyle = "lorelei"): string {
  const seed = encodeURIComponent((nameOrEmail || "user").trim().toLowerCase());
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${AVATAR_BG_COLORS}`;
}

/**
 * Generate a deterministic avatar style for a user name so each colleague has a unique look
 */
export function getDeterministicAvatar(name: string, index?: number): string {
  const styles: AvatarStyle[] = ["lorelei", "bottts", "avataaars", "thumbs", "shapes", "fun-emoji"];
  const chosenStyle = typeof index === "number" 
    ? styles[index % styles.length]
    : styles[Math.abs(hashString(name)) % styles.length];
  return getAvatarUrl(name, chosenStyle);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Standalone inline SVG Data URI that works 100% offline without any network request
 */
export function getInlineInitialsAvatar(name: string, bg: string = "#4f46e5"): string {
  const initials = (name || "U")
    .split(" ")
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" fill="${bg}" rx="50"/>
    <text x="50" y="55" dominant-baseline="central" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-weight="700" font-size="40" fill="#ffffff">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
