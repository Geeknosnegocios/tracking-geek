#!/usr/bin/env node
// FOP Provisioning Script
// Cria workspace + webhook + Meta integration + habilita FOP em 1 chamada

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, createCipheriv, createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ───── Load .env ─────
const ENV_PATH = 'C:/Users/freit/Documents/Geek OS/geek-os-claude/_contexto/.credenciais.env';
const env = Object.fromEntries(
  readFileSync(ENV_PATH, 'utf-8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const TOKEN = env.METRICAGEEK_SUPABASE_ACCESS_TOKEN;
const PROJECT = env.METRICAGEEK_SUPABASE_PROJECT_ID || 'oltmvqascwjbvykpewpr';
const SERVICE_KEY = env.METRICAGEEK_SUPABASE_SERVICE_ROLE_KEY;
const META_TOKEN_DEFAULT = env.META_ADS_TOKEN;

if (!TOKEN) { console.error('METRICAGEEK_SUPABASE_ACCESS_TOKEN missing'); process.exit(1); }

// ───── CLI args ─────
const args = parseArgs(process.argv.slice(2));
if (!args.name || !args.slug || !args['pixel-id']) {
  console.error('Usage: provision.mjs --name "Produto" --slug produto --pixel-id 12345 [--domains "d1,d2"] [--meta-token X] [--ad-account act_X]');
  process.exit(1);
}

const META_TOKEN = args['meta-token'] || META_TOKEN_DEFAULT;
const AD_ACCOUNT = args['ad-account'] || env.META_AD_ACCOUNT_ID || null;
const DOMAINS = args.domains ? args.domains.split(',').map(s => s.trim()).filter(Boolean) : [];
const OWNER_EMAIL = args['owner-email'] || 'freitasandrey14@gmail.com';

async function sql(query) {
  const r = await fetch(`https://api.supabase.com/v1/projects/${PROJECT}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const body = await r.json();
  if (!r.ok) throw new Error(`SQL ${r.status}: ${JSON.stringify(body)}`);
  return body;
}

console.log(`▶ Provisioning FOP — ${args.name} (${args.slug})`);

// 1. Find owner user id
const owners = await sql(`SELECT id FROM auth.users WHERE email='${OWNER_EMAIL.replace(/'/g, "''")}' LIMIT 1;`);
if (!owners.length) throw new Error(`Owner email not found: ${OWNER_EMAIL}`);
const ownerId = owners[0].id;
console.log(`✓ Owner: ${OWNER_EMAIL} (${ownerId})`);

// 2. Check workspace exists
const existing = await sql(`SELECT id, slug FROM workspaces WHERE slug='${args.slug.replace(/'/g, "''")}' LIMIT 1;`);
let wsId;
if (existing.length) {
  wsId = existing[0].id;
  console.log(`⚠ Workspace ${args.slug} já existe (${wsId}). Atualizando...`);
} else {
  const created = await sql(`
    INSERT INTO workspaces (name, slug, owner_id, brand_emoji, brand_color, plan)
    VALUES ('${args.name.replace(/'/g, "''")}', '${args.slug.replace(/'/g, "''")}', '${ownerId}', '🔥', '#22d3ee', 'free')
    RETURNING id;
  `);
  wsId = created[0].id;
  console.log(`✓ Workspace criado: ${wsId}`);

  // Auto-join owner as member (if table exists — fallback silently)
  try {
    await sql(`INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ('${wsId}', '${ownerId}', 'owner') ON CONFLICT DO NOTHING;`);
  } catch (e) { /* table may not exist */ }
}

// 3. Enable FOP + set pixel + domains
const domainsArr = DOMAINS.length ? `ARRAY[${DOMAINS.map(d => `'${d.replace(/'/g, "''")}'`).join(',')}]` : 'NULL';
await sql(`
  UPDATE workspaces SET
    meta_pixel_id = '${args['pixel-id']}',
    fop_enabled = true,
    fop_domains = ${domainsArr}
  WHERE id = '${wsId}';
`);
console.log(`✓ FOP habilitado · pixel ${args['pixel-id']} · domains ${DOMAINS.join(', ') || '(none)'}`);

// 4. Create webhook endpoint
const existingHook = await sql(`SELECT secret FROM webhook_endpoints WHERE workspace_id='${wsId}' LIMIT 1;`);
let webhookSecret;
if (existingHook.length) {
  webhookSecret = existingHook[0].secret;
  console.log(`✓ Webhook existente: ${webhookSecret}`);
} else {
  const got = await sql(`SELECT secret FROM (SELECT * FROM get_or_create_webhook('${wsId}'::uuid)) AS x;`);
  webhookSecret = got[0].secret;
  console.log(`✓ Webhook criado: ${webhookSecret}`);
}

// 5. Create Meta integration (token encrypted)
if (META_TOKEN && AD_ACCOUNT) {
  const credsJson = JSON.stringify({ access_token: META_TOKEN, ad_account_id: AD_ACCOUNT });
  // Encrypted via DB function encrypt_credentials
  const encResult = await sql(`SELECT encrypt_credentials('${credsJson.replace(/'/g, "''")}'::text) AS cipher;`);
  const cipherHex = encResult[0].cipher;

  // Check existing integration
  const existingInt = await sql(`SELECT id FROM integrations WHERE workspace_id='${wsId}' AND provider='meta_ads' LIMIT 1;`);
  if (existingInt.length) {
    await sql(`UPDATE integrations SET credentials_encrypted='${cipherHex}', status='active', external_account_id='${AD_ACCOUNT}' WHERE id='${existingInt[0].id}';`);
    console.log(`✓ Meta integration atualizada (ad_account: ${AD_ACCOUNT})`);
  } else {
    await sql(`
      INSERT INTO integrations (workspace_id, provider, external_account_id, account_name, status, credentials_encrypted)
      VALUES ('${wsId}', 'meta_ads', '${AD_ACCOUNT}', '${args.name.replace(/'/g, "''")}', 'active', '${cipherHex}');
    `);
    console.log(`✓ Meta integration criada (ad_account: ${AD_ACCOUNT})`);
  }
} else {
  console.log('⚠ Meta token ou ad_account_id ausente — integration NÃO criada (configurar manualmente em /integrations)');
}

// 6. Output snippet
const snippet = `<script>window.gpxq=window.gpxq||[];</script>
<script src="https://metricageek.vercel.app/p/${args.slug}.js" async></script>`;

console.log('\n' + '═'.repeat(72));
console.log(`✅ FOP provisionado — ${args.name}`);
console.log('═'.repeat(72));
console.log(`\n📦 Snippet pra colar no <head> de cada HTML:\n\n${snippet}`);
console.log(`\n🔗 Webhook URL (PerfectPay/Cakto/Hotmart):\n   https://metricageek.vercel.app/api/webhook/${webhookSecret}`);
console.log(`\n📊 Dashboard:\n   https://metricageek.vercel.app/dashboard/${args.slug}`);
console.log(`📊 Tracking config:\n   https://metricageek.vercel.app/dashboard/${args.slug}/tracking`);
if (DOMAINS.length) {
  console.log(`\n🌐 PerfectPay URLs sugeridas (replace <dominio>):`);
  console.log(`   Página venda aprovada: https://${DOMAINS[0]}/?transaction_token={transaction_token}`);
  console.log(`   Página obrigado: https://${DOMAINS[0]}/obrigado?transaction_token={transaction_token}`);
}
console.log(`\n💉 Auto-inject em HTMLs do projeto:`);
console.log(`   node ${__dirname.replace(/\\/g, '/')}/inject-snippet.mjs --path "<path-projeto>" --slug ${args.slug}`);
console.log('');

// ───── helpers ─────
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
