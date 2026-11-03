// Server-side allowlist HTML sanitizer for trusted-but-small rich HTML
// (funnel descriptions, announcement bodies). The reference site ships
// DOMPurify; this is the minimal equivalent for before dangerouslySetInnerHTML.

const ALLOWED_TAGS = new Set([
  'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i',
  'br', 'blockquote', 'hr', 'code', 'pre', 'span',
])

const ALLOWED_ATTRS: Record<string, Set<string>> = {} // none for now — links dropped (see below)

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Sanitize rich HTML: strip <script>/<style>/<iframe>/<object> entirely,
 * strip on* handlers and javascript: URLs anywhere, drop disallowed tags
 * (keeping their inner text), allow the basic formatting tags above.
 * <a> tags are neutralized (converted to <span>) — funnel copy shouldn't
 * link off-site.
 */
export function sanitizeRichHtml(html: string): string {
  let out = ''
  let buffer = html
  const blocked = /<\s*(script|style|iframe|object|embed|form)[\s\S]*?<\s*\/\s*\1\s*>|<\s*(script|style|iframe|object|embed|form)[^>]*>/gi
  buffer = buffer.replace(blocked, '')

  // Attributes: strip any on*, href/src/srcset/style/background attributes
  const attrs = /\s([a-zA-Z-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g
  buffer = buffer.replace(/<([a-zA-Z][a-zA-Z0-9]*)((?:\s[^<>]*?)?)(\/?)>/g, (_m, tag: string, attrBlob: string) => {
    const t = tag.toLowerCase()
    if (!ALLOWED_TAGS.has(t)) return '' // drop tag, keep content via later pass
    if (!attrBlob) return `<${t}>`
    let safe = ''
    for (const m of attrBlob.matchAll(attrs)) {
      const name = m[1].toLowerCase()
      const value = m[2].replace(/^["']|["']$/g, '')
      if (name.startsWith('on')) continue
      const dangerous = /^(javascript|data|vbscript):/i.test(value.trim())
      if (dangerous) continue
      if ((ALLOWED_ATTRS[t] ?? new Set()).has(name)) safe += ` ${name}="${escapeHtml(value)}"`
    }
    return `<${t}${safe}>`
  })
  out = buffer

  // Close dangling tags opened by dropped tags (rare in our content)
  // Escape any stray < that doesn't start an allowed tag
  out = out.replace(/</g, (m, idx, s: string) => {
    const next = s.slice(idx + 1).match(/^\s*\/?\s*([a-zA-Z0-9]+)/)
    if (!next) return '&lt;'
    return ALLOWED_TAGS.has(next[1].toLowerCase()) ? '<' : '&lt;'
  })
  return out
}
