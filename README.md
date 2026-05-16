# Tracking Geek

**Funil de Otimização do Pixel (FOP)** — Match Quality 9+, Pixel + CAPI server-side, Advanced Matching propagado em 18 eventos hierárquicos, multi-canal (Meta + TikTok + Kwai + Google Ads), Customer Match + Lookalike auto-build, banco próprio LGPD-ready.

Substitui Stape · Hyros · Triplewhale · Trackify.

---

## Instalação 1-click

### Mac / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/Geeknosnegocios/tracking-geek/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/Geeknosnegocios/tracking-geek/main/install.ps1 | iex
```

Reinicie o Claude Code após instalar.

---

## O que é

Sistema completo de tracking server-side pra produtos lowticket BR. Em vez de pagar **R$200-2000/mês** em Stape/Hyros/etc, roda em conta gratuita Vercel + Supabase com **dashboard SaaS próprio**.

### Stack

| Camada | Tech |
|---|---|
| Backend | Next.js 16 App Router + Vercel Edge |
| Database | Supabase (Postgres + pg_cron + pg_net + pgcrypto) |
| Client lib | Vanilla JS (`/p/<slug>.js`) auto-served per workspace |
| CAPI | Meta · TikTok Events API · Kwai · Google Ads Enhanced Conversions |
| Identity | SHA-256 hashes · cross-device merge · persistência tripla (cookie + localStorage + DB) |

---

## Features

### Tracking layer
- ✅ Pixel client-side + CAPI server-side dedup via event_id
- ✅ Advanced Matching propagado em **18 eventos hierárquicos** (PageView, ViewContent, Lead, AddToCart, IC, Purchase, Subscribe, Schedule, Search, Contact, CompleteRegistration, AddPaymentInfo, AddToWishlist, CustomizeProduct, FindLocation, Donate, StartTrial, SubmitApplication, custom)
- ✅ Click-IDs 15 canais (fbclid, gclid, ttclid, kwai_id, msclkid, twclid, li_fat_id, rdt_cid, epik, yclid, dclid, gbraid, wbraid, irclickid, sccid)
- ✅ Geo-PageView via Vercel headers (country, city, region, postal, lat/lng) — Match Quality 9.3 desde 1º toque
- ✅ Persistência tripla: cookie 365d + localStorage + banco `gpx_identity`
- ✅ Re-hidratação retornante (`/api/gpx/hydrate`) — visita 2 carrega AM completo antes do PageView
- ✅ Cookie Keeper Safari 16.4+ ITP defense (HTTP Set-Cookie eleva TTL > 7d JS limit)
- ✅ First-party proxy `/_gpx/*` (bypass adblockers)
- ✅ LGPD consent banner inline opt-in
- ✅ Anti-bot filter (UA + heuristics, z-score)

### Multi-canal CAPI
- ✅ Meta Conversions API
- ✅ TikTok Events API v1.3
- ✅ Kwai Conversion Tracking
- ✅ Google Ads Enhanced Conversions (OAuth)

### Identity + ML
- ✅ Cross-device merge (sids da mesma pessoa agrupam por em_hash)
- ✅ Predictive LTV scoring per sid
- ✅ Conversion Lift A/B holdback 10%
- ✅ Churn prediction daily
- ✅ CAC Payback tracking
- ✅ Anomaly z-score detection

### Audiences
- ✅ Customer Match upload automático (cron 1h)
- ✅ Lookalike auto-build (LAL 1% + 3% Compradores + 1% High-LTV)
- ✅ Refund/Chargeback → CAPI events + remoção audiences

### Optimization
- ✅ Smart bidding com `predicted_ltv` no CAPI value
- ✅ POAS Data Feed (envia profit em vez de revenue)
- ✅ Auto-rules engine (7 actions, 6 fields, cooldown, pg_cron 30min)
- ✅ Monitoring/Alerts Telegram (anomalias automáticas)

### Resilience
- ✅ Webhook retry queue exponential backoff (1/5/15/60/240 min, 5 attempts)
- ✅ Webhook signature verification (PerfectPay/Cakto/Hotmart)
- ✅ Bot drop + holdback drop logged

### Gateways suportados (auto-detect)
- PerfectPay (V1 + V2)
- Cakto
- Hotmart
- Kiwify
- Eduzz
- Monetizze
- Lastlink

### Lead Ads
- ✅ Meta Lead Ads form bridge (webhook leadgen → identity + CAPI Lead)

---

## Skill

| Skill | Comando | O que faz |
|---|---|---|
| **fop-install** | `/fop-install` | Provisiona FOP completo em produto lowticket: workspace MetricaGeek + Meta integration + webhook + GeekPixel.js auto-injetado em todos HTMLs + vercel.json rewrites first-party |

### Scripts CLI (também acessíveis direto)

```bash
# Provisiona workspace MetricaGeek + Meta integration
node ~/.claude/skills/fop-install/scripts/provision.mjs \
  --name "Produto X" \
  --slug produto-x \
  --pixel-id 1234567890 \
  --domains "produtox.com,produtox.vercel.app,localhost" \
  --ad-account act_1234567890123

# Injeta GeekPixel snippet em todos HTMLs (substitui pixel inline antigo)
node ~/.claude/skills/fop-install/scripts/inject-snippet.mjs \
  --path /path/to/projeto \
  --slug produto-x \
  --firstparty \
  --commit
```

---

## Pipeline completo (~5 min por produto)

```
1. /fop-install
   → Pergunta: nome, slug, pixel, domínios, gateway
   → Executa: provision + inject + commit + push

2. Configurar gateway (manual, ~3 min)
   PerfectPay/Cakto/Hotmart painel:
   • Webhook URL: https://metricageek.vercel.app/api/webhook/<wsk_secret>
   • Página venda aprovada: https://<domínio>/?transaction_token={var}
   • Página obrigado: https://<domínio>/obrigado?transaction_token={var}
   • Token segurança (signature)

3. Validar (~1 min)
   • DevTools console: window.gpx definido
   • Network: POST /_gpx/track/<ws> ok
   • Events Manager Meta → Test Events
```

---

## Pré-requisitos

- **Node.js 18+** (pra rodar scripts mjs)
- **Conta Supabase** (Free tier OK) + access token
- **Conta MetricaGeek** ([metricageek.vercel.app](https://metricageek.vercel.app))
- **Token Meta Ads** com scopes `ads_management`, `business_management`

### Configurar `.env`

Cria `~/.claude/.env` (ou cola em `_contexto/.credenciais.env`):

```bash
METRICAGEEK_SUPABASE_ACCESS_TOKEN=sbp_...
METRICAGEEK_SUPABASE_PROJECT_ID=oltmvqascwjbvykpewpr
METRICAGEEK_SUPABASE_SERVICE_ROLE_KEY=eyJ...
META_ADS_TOKEN=EAAV...
META_AD_ACCOUNT_ID=act_1234567890
```

---

## Diferenças vs concorrentes

| Feature | Tracking Geek | Stape | Hyros | Triplewhale |
|---|---|---|---|---|
| **Custo/mês** | **R$0** | R$200-2000 | R$1500+ | R$1500+ |
| Stape (sGTM) | ✅ substitui | ✅ | ❌ | ❌ |
| Match Quality 9+ | ✅ | ✅ | ❌ | ❌ |
| Multi-canal CAPI | ✅ Meta+TikTok+Kwai+Google | ✅ | ✅ Meta | ✅ Meta |
| Attribution multi-touch | ✅ | ❌ | ✅ | ✅ |
| Customer Match auto | ✅ | ✅ | ❌ | ❌ |
| Lookalike auto-build | ✅ | ❌ | ❌ | ❌ |
| Predictive LTV | ✅ | ❌ | ❌ | ❌ |
| Conversion Lift A/B | ✅ | ❌ | ❌ | ❌ |
| Churn prediction | ✅ | ❌ | ❌ | ❌ |
| POAS Data Feed | ✅ | ✅ | ❌ | ❌ |
| Auto-rules engine | ✅ | ❌ | ❌ | ❌ |
| Banco próprio | ✅ (Supabase) | ✅ | ❌ | ❌ |
| LGPD-ready | ✅ | ✅ | ❌ | ❌ |
| Skill Claude Code | ✅ | ❌ | ❌ | ❌ |

---

## Documentação técnica

- [SKILL.md](./skills/fop-install/SKILL.md) — Workflow completo + scripts
- [docs/architecture.md](./docs/architecture.md) — Arquitetura banco + endpoints (em breve)

---

## Licença

MIT.

---

## Suporte

Issues: [github.com/Geeknosnegocios/tracking-geek/issues](https://github.com/Geeknosnegocios/tracking-geek/issues)

Autor: [@Geeknosnegocios](https://github.com/Geeknosnegocios)
