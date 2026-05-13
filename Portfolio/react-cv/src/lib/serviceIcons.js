/**
 * Maps admin-entered / DB icon strings + service titles to Material Symbols names.
 * See https://fonts.google.com/icons
 */

const ALIASES = {
  ai: 'smart_toy',
  ai_icon: 'smart_toy',
  artificial_intelligence: 'smart_toy',
  openai: 'smart_toy',
  gpt: 'smart_toy',
  llm: 'smart_toy',
  chatgpt: 'smart_toy',
  claude: 'smart_toy',
  gemini: 'smart_toy',
  copilot: 'smart_toy',
  spark: 'auto_awesome',
  sparkles: 'auto_awesome',
  magic: 'auto_awesome',
  integration: 'hub',
  integrations: 'hub',
  webhook: 'hub',
  ml: 'model_training',
  robot: 'smart_toy',
  bots: 'smart_toy',
  frontend: 'palette',
  backend: 'api',
  database: 'database',
  mobile: 'smartphone',
  devops: 'rocket_launch',
  wordpress: 'article',
};

/** First match wins — most specific patterns first */
const TITLE_ICON_RULES = [
  [/\bai\b|llm|gpt|openai|claude|gemini|copilot|chatbot|genai|generative|machine learning|deep learning|neural/i, 'smart_toy'],
  [/mobile|ios|android|flutter|react native|ionic|swift|kotlin|pwa\b|cross-platform app/i, 'smartphone'],
  [/wordpress|drupal|shopify|magento|cms\b|headless cms|content management/i, 'article'],
  [/database|sql|postgres|mongodb|mysql|redis|supabase|sqlite|dynamo|oracle|prisma|orm\b/i, 'database'],
  [/devops|docker|kubernetes|k8s|ci\/?cd|terraform|ansible|jenkins|github actions|infra|cloud (host|comput)|aws\b|azure|gcp\b/i, 'rocket_launch'],
  [/dashboard|analytics|internal tool|admin panel|bi\b|power bi|data viz|reporting|kpi/i, 'dashboard'],
  [/api|backend|rest|graphql|grpc|express|fastapi|node\.?js|microservice|serverless|lambda/i, 'api'],
  [/react|next\.js|nextjs|vue|angular|svelte|component|spa\b|redux|vite\b/i, 'hub'],
  [/ui\/ux|ux\b|ui\b|figma|wireframe|prototype|design system|branding/i, 'palette'],
  [/security|auth|oauth|jwt|encryption|penetration|owasp|firewall|sso\b/i, 'shield'],
  [/test|qa\b|jest|cypress|playwright|selenium|coverage|e2e/i, 'bug_report'],
  [/desktop|electron|windows app|macos app|tauri/i, 'computer'],
  [/seo|marketing|growth|conversion|ads\b|campaign/i, 'trending_up'],
  [/automation|workflow|n8n|zapier|ifttt|cron|scheduled job|orchestrat/i, 'bolt'],
  [/integrat|webhook|stripe|payment gateway|sap\b|erp\b|salesforce|hubspot/i, 'hub'],
  [/documen|technical writing|readme|handover|runbook/i, 'menu_book'],
  [/blockchain|web3|solidity|nft|crypto wallet|defi/i, 'currency_bitcoin'],
  [/web|website|html|css|tailwind|responsive|landing page|full.?stack|front.?end|web dev/i, 'code'],
];

function slugifyIcon(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function inferIconFromTitle(title) {
  const t = String(title || '');
  if (!t.trim()) return null;
  for (const [re, icon] of TITLE_ICON_RULES) {
    if (re.test(t)) return icon;
  }
  return null;
}

/**
 * @param {string} [rawIcon]
 * @param {string} [title] — used when icon missing, generic, or needs disambiguation
 * @returns {string} Material Symbols ligature name
 */
export function resolveServiceIcon(rawIcon, title = '') {
  const slug = slugifyIcon(rawIcon);

  if (slug && ALIASES[slug]) return ALIASES[slug];

  // Explicit non-generic icon from admin → trust it
  if (slug && slug !== 'code') return slug;

  // Empty or generic "code" → prefer a title-based icon when we can infer one
  const fromTitle = inferIconFromTitle(title);
  if (fromTitle) return fromTitle;

  if (slug) return slug;
  return 'code';
}
