#!/usr/bin/env node
// Auto-inject GeekPixel.js snippet em todos HTMLs de um projeto
// Detecta e substitui Pixel inline antigo

import { readdirSync, readFileSync, writeFileSync, statSync, copyFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';

const args = parseArgs(process.argv.slice(2));
if (!args.path || !args.slug) {
  console.error('Usage: inject-snippet.mjs --path /path/to/project --slug copa-milionaria [--commit] [--no-backup]');
  process.exit(1);
}

const ROOT = args.path;
const SLUG = args.slug;
const COMMIT = !!args.commit;
const BACKUP = args['no-backup'] !== true;
const FIRSTPARTY = !!args.firstparty;

const IGNORE_DIRS = new Set(['node_modules', 'dist', 'build', '.next', '.git', '.vercel', '.cache', 'public/_next', 'out']);

const SCRIPT_SRC = FIRSTPARTY
  ? `/_gpx/p/${SLUG}.js`
  : `https://metricageek.vercel.app/p/${SLUG}.js`;

const SNIPPET = `    <!-- GeekPixel FOP — Match Quality 9+${FIRSTPARTY ? ' · first-party proxy' : ''} -->
    <script>window.gpxq=window.gpxq||[];</script>
    <script src="${SCRIPT_SRC}" async></script>`;

const TX_TOKEN_HELPER = `    <script>
      (function () {
        var u = new URLSearchParams(window.location.search);
        var txId = u.get('transaction_token') || u.get('sale_id') || u.get('transaction') || u.get('tx');
        if (txId) {
          window.__txId = txId;
          var fired = sessionStorage.getItem('gpx.purchase.fired');
          if (fired !== txId) {
            window.gpxq.push(['purchase', { event_id: txId }]);
            sessionStorage.setItem('gpx.purchase.fired', txId);
          }
        }
      })();
    </script>`;

const PIXEL_INLINE_RE = /<script[^>]*>\s*!?function\([fb,e,v,n,t,s]+\)[\s\S]*?fbevents\.js[\s\S]*?<\/script>\s*(<noscript>[\s\S]*?<\/noscript>\s*)?/i;
const HEAD_END = /<\/head>/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      if (IGNORE_DIRS.has(name)) continue;
      walk(full, out);
    } else if (extname(name).toLowerCase() === '.html') {
      out.push(full);
    }
  }
  return out;
}

const files = walk(ROOT);
console.log(`▶ ${files.length} arquivos .html encontrados`);

let modified = 0;
let alreadyHasGpx = 0;
let skipped = 0;

for (const f of files) {
  const content = readFileSync(f, 'utf-8');

  // Skip if already has gpx loader pointing to correct origin
  const externalRef = `https://metricageek.vercel.app/p/${SLUG}.js`;
  const firstPartyRef = `/_gpx/p/${SLUG}.js`;
  const hasExternal = content.includes(externalRef);
  const hasFirstParty = content.includes(firstPartyRef);

  // If --firstparty and file has external ref, SWAP it
  if (FIRSTPARTY && hasExternal && !hasFirstParty) {
    const swapped = content.split(externalRef).join(firstPartyRef);
    if (BACKUP) { try { copyFileSync(f, f + '.bak'); } catch {} }
    writeFileSync(f, swapped, 'utf-8');
    console.log(`  ↻ ${f.replace(ROOT, '.')} — swapped pra first-party (/_gpx/p/)`);
    modified++;
    continue;
  }
  // If non-firstparty and file has first-party ref, swap back
  if (!FIRSTPARTY && hasFirstParty && !hasExternal) {
    const swapped = content.split(firstPartyRef).join(externalRef);
    if (BACKUP) { try { copyFileSync(f, f + '.bak'); } catch {} }
    writeFileSync(f, swapped, 'utf-8');
    console.log(`  ↻ ${f.replace(ROOT, '.')} — swapped pra cross-origin`);
    modified++;
    continue;
  }
  if (hasExternal || hasFirstParty) {
    console.log(`  · ${f.replace(ROOT, '.')} — já tem GeekPixel (${hasFirstParty ? '1st-party' : '3rd-party'})`);
    alreadyHasGpx++;
    continue;
  }

  let newContent = content;
  const hasInlinePixel = PIXEL_INLINE_RE.test(newContent);
  const isObrigado = /obrigado|thank|upsell|downsell/i.test(f);

  // Build snippet (with tx_token helper if it's a thank-you/upsell page)
  const fullSnippet = isObrigado ? `${SNIPPET}\n${TX_TOKEN_HELPER}` : SNIPPET;

  if (hasInlinePixel) {
    // Replace inline Pixel with GeekPixel
    newContent = newContent.replace(PIXEL_INLINE_RE, fullSnippet + '\n    ');
    console.log(`  ✎ ${f.replace(ROOT, '.')} — substituído pixel inline`);
  } else if (HEAD_END.test(newContent)) {
    // Insert before </head>
    newContent = newContent.replace(HEAD_END, `${fullSnippet}\n  </head>`);
    console.log(`  + ${f.replace(ROOT, '.')} — injetado no <head>`);
  } else {
    console.log(`  ✗ ${f.replace(ROOT, '.')} — sem </head>, ignorado`);
    skipped++;
    continue;
  }

  if (BACKUP) {
    try { copyFileSync(f, f + '.bak'); } catch {}
  }
  writeFileSync(f, newContent, 'utf-8');
  modified++;
}

console.log(`\n✅ Modificados: ${modified} · Já OK: ${alreadyHasGpx} · Skipped: ${skipped}`);

// First-party proxy: adiciona rewrites em vercel.json
if (FIRSTPARTY) {
  const vercelJsonPath = join(ROOT, 'vercel.json');
  let vj = {};
  try { vj = JSON.parse(readFileSync(vercelJsonPath, 'utf-8')); } catch {}
  vj.rewrites = vj.rewrites || [];
  const GPX_REWRITES = [
    { source: '/_gpx/p/:slug', destination: 'https://metricageek.vercel.app/p/:slug' },
    { source: '/_gpx/track/:ws', destination: 'https://metricageek.vercel.app/api/gpx/track/:ws' },
    { source: '/_gpx/identify/:ws', destination: 'https://metricageek.vercel.app/api/gpx/identify/:ws' },
    { source: '/_gpx/hydrate/:ws/:sid', destination: 'https://metricageek.vercel.app/api/gpx/hydrate/:ws/:sid' },
    { source: '/_gpx/keep-cookie/:ws', destination: 'https://metricageek.vercel.app/api/gpx/keep-cookie/:ws' },
  ];
  for (const r of GPX_REWRITES) {
    if (!vj.rewrites.find((x) => x.source === r.source)) vj.rewrites.push(r);
  }
  writeFileSync(vercelJsonPath, JSON.stringify(vj, null, 2), 'utf-8');
  console.log(`  + vercel.json rewrites adicionados (first-party proxy /_gpx/*)`);
}

if (COMMIT && modified > 0) {
  try {
    process.chdir(ROOT);
    execSync('git add -A', { stdio: 'inherit' });
    execSync(
      `git -c user.email=freitasandrey14@gmail.com -c user.name="Andrey Geek" commit -m "feat: install GeekPixel FOP (Match Quality 9+) - ${SLUG}"`,
      { stdio: 'inherit' }
    );
    execSync('git push', { stdio: 'inherit' });
    console.log('\n✓ git commit + push concluído');
  } catch (e) {
    console.error('git op failed:', e.message);
  }
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { out[key] = next; i++; }
      else out[key] = true;
    }
  }
  return out;
}
