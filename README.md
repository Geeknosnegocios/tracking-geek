# 🎯 Tracking Geek

> **Funil de Otimização do Pixel (FOP)** — Match Quality 9+ em todos eventos do funil. Substitui Stape, Hyros e Triplewhale rodando em Vercel + Supabase.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stape Killer](https://img.shields.io/badge/Stape-Killer-red)](https://stape.io)
[![Match Quality](https://img.shields.io/badge/Match%20Quality-9%2B-brightgreen)](#)
[![CAPI](https://img.shields.io/badge/CAPI-Meta%20%7C%20TikTok%20%7C%20Kwai%20%7C%20Google-blue)](#)

---

## 💡 O que é

Sistema completo de tracking server-side pra produtos lowticket BR. Em vez de pagar **R$200–2000/mês em Stape, Hyros ou Triplewhale**, roda em conta Vercel + Supabase free tier com dashboard SaaS próprio.

### Stack

| Camada | Tech |
|---|---|
| Backend | Next.js 16 App Router + Vercel Edge |
| Database | Supabase Postgres + pg_cron + pgcrypto |
| Client | Vanilla JS lib `/p/<slug>.js` auto-served per workspace |
| CAPI | Meta · TikTok · Kwai · Google Ads Enhanced Conversions |

---

## 🚀 Instalação 1-click

### Passo 1 — Instalar skill no Claude Code

#### Mac / Linux
```bash
curl -fsSL https://raw.githubusercontent.com/Geeknosnegocios/tracking-geek/main/install.sh | bash
```

#### Windows (PowerShell — abrir como Admin)
```powershell
irm https://raw.githubusercontent.com/Geeknosnegocios/tracking-geek/main/install.ps1 | iex
```

Output esperado:
```
╔══════════════════════════════════════════════════╗
║  Tracking Geek — Funil de Otimização do Pixel    ║
║  Match Quality 9+ · Pixel + CAPI · Multi-canal   ║
╚══════════════════════════════════════════════════╝
✓ tracking-geek-install
✅ Tracking Geek instalado
```

### Passo 2 — Reiniciar Claude Code

Fecha + abre Claude Code. Skill `/tracking-geek-install` aparece no autocomplete.

### Passo 3 — Criar conta MetricaGeek (grátis)

1. Acessa [metricageek.vercel.app](https://metricageek.vercel.app)
2. Sign up com email
3. Cria primeiro workspace (Free tier: 1 workspace, 5K events/day)

### Passo 4 — Configurar credenciais `.env`

Cria arquivo `~/.claude/.env` (Mac/Linux) ou `%USERPROFILE%\.claude\.env` (Windows):

```bash
# Token Supabase MetricaGeek (gerar em supabase.com/dashboard/account/tokens)
METRICAGEEK_SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
METRICAGEEK_SUPABASE_PROJECT_ID=oltmvqascwjbvykpewpr

# Token Meta Ads (Business Manager → System Users → Generate Token)
META_ADS_TOKEN=EAAVxxxxxxxxxxxxxxxxxx
META_AD_ACCOUNT_ID=act_1234567890123
```

### Passo 5 — Instalar FOP em produto novo

No Claude Code:

```
/tracking-geek-install
```

Responde as perguntas:

| Pergunta | Exemplo |
|---|---|
| Nome do produto | Copa Milionária |
| Slug (kebab-case) | copa-milionaria |
| Caminho do projeto local | `C:/Users/freit/Documents/pv-copa` |
| Domínios produção (CSV) | `pv-copa.vercel.app,copamilionaria.site,localhost` |
| Pixel Meta ID | 2253453835506335 |
| Ad Account Meta | act_1296662845681337 |
| Gateway | PerfectPay |

Skill executa automaticamente:
1. Provisiona workspace MetricaGeek
2. Cria webhook endpoint `wsk_<secret>`
3. Habilita FOP + Meta integration (token encrypted)
4. Injeta GeekPixel.js em todos HTMLs do projeto
5. Adiciona `vercel.json` rewrites first-party `/_gpx/*`
6. Git commit + push automático

### Passo 6 — Configurar gateway (manual ~3min)

#### PerfectPay
1. Login [app.perfectpay.com.br](https://app.perfectpay.com.br)
2. Produto → **Configurações** → **Postback**
3. Cola:
   - **URL Webhook**: `https://metricageek.vercel.app/api/webhook/wsk_xxxxxxxxxxxx` (output do passo 5)
   - **Eventos**: TODOS (Aprovado, PIX, Boleto, Devolvido, Chargeback, Expirado, Abandono, Aguardando)
   - **Formato postback**: PerfectPay
   - **Token segurança**: gerar novo no painel → copia → cola no MetricaGeek tracking config
   - **Página venda aprovada**: `https://<DOMÍNIO>/?transaction_token={transaction_token}`
   - **Página obrigado**: `https://<DOMÍNIO>/obrigado?transaction_token={transaction_token}`

#### Cakto
1. Login [cakto.com.br](https://cakto.com.br)
2. Produto → **Notificações** → **Webhook**
3. URL idem, eventos: Aprovado, Reembolso, Chargeback, Aguardando, Recusado

#### Hotmart
1. **Ferramentas** → **Webhook** → cola URL
2. Copia `X-Hotmart-Hottok` header value → cola em workspace via SQL ou dashboard

### Passo 7 — Validar (1min)

1. Abre site em incógnito + DevTools Console
2. Cola:
```js
console.log({
  gpx: !!window.gpx,
  sid: document.cookie.match(/gpx_sid=([^;]+)/)?.[1],
  fbq: !!window.fbq
});
```
Esperado: `{gpx: true, sid: "<uuid>", fbq: true}`

3. Network tab → filtra `metricageek` → vê POST `/_gpx/track/<ws>` 200

4. Events Manager Meta → Pixel → Test Events → cola URL site → vê PageView + Match Quality

---

## 💰 Pricing (sugestão)

### Tier comparison

| | **Free** | **Starter** | **Pro** | **Agency** | **Lifetime** |
|---|---|---|---|---|---|
| **Preço** | R$0 | **R$67/mês** | **R$147/mês** | **R$397/mês** | **R$1.497** (1×) |
| Workspaces | 1 | 5 | 25 | ∞ | ∞ |
| Events/dia | 5K | 30K | 200K | ∞ | ∞ |
| Pixel + CAPI Meta | ✅ | ✅ | ✅ | ✅ | ✅ |
| Multi-canal CAPI (TikTok+Kwai+Google) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Customer Match + Lookalike auto | ❌ | ❌ | ✅ | ✅ | ✅ |
| Predictive LTV + Smart bidding | ❌ | ❌ | ✅ | ✅ | ✅ |
| Conversion Lift A/B | ❌ | ❌ | ✅ | ✅ | ✅ |
| POAS Data Feed | ❌ | ✅ | ✅ | ✅ | ✅ |
| Auto-rules engine | ❌ | ✅ | ✅ | ✅ | ✅ |
| ML Churn + CAC + Anomaly | ❌ | ❌ | ✅ | ✅ | ✅ |
| Lead Ads form bridge | ❌ | ❌ | ✅ | ✅ | ✅ |
| First-party proxy | ❌ | ✅ | ✅ | ✅ | ✅ |
| Cookie Keeper Safari ITP | ❌ | ✅ | ✅ | ✅ | ✅ |
| LGPD consent + bot filter | ✅ | ✅ | ✅ | ✅ | ✅ |
| Webhook retry queue | ❌ | ✅ | ✅ | ✅ | ✅ |
| White-label dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |
| Multi-tenant (revender) | ❌ | ❌ | ❌ | ✅ | ✅ |
| Branding "Powered by Tracking Geek" | ✅ obrigatório | opcional | removido | removido | removido |
| Telegram alerts | ❌ | ❌ | ✅ | ✅ | ✅ |
| Suporte | Comunidade | Email 48h | Email 24h | Priority WhatsApp | Priority WhatsApp |

### Por que vale a pena vs concorrentes

| | Tracking Geek Pro | Stape Pro | Hyros | Triplewhale |
|---|---|---|---|---|
| **Custo/mês** | **R$147** | $80 (~R$420) | $1500 (~R$7800) | $129 (~R$670) |
| **Anual** | R$1.764 | R$5.040 | R$93.600 | R$8.040 |
| Match Quality 9+ | ✅ | ✅ | ❌ | ❌ |
| Customer Match auto | ✅ | ❌ (pago extra) | ❌ | ❌ |
| Lookalike auto-build | ✅ | ❌ | ❌ | ❌ |
| Predictive LTV | ✅ | ❌ | ❌ | parcial |
| Conversion Lift A/B | ✅ | ❌ | ❌ | ❌ |
| Multi-canal CAPI nativo | ✅ 4 canais | ✅ pago extra cada | ❌ só Meta | ❌ só Meta |
| Banco próprio dados | ✅ | ✅ | ❌ | ❌ |

**Economia anual vs Hyros: R$91.836** (1 cliente Pro = paga 52× seu custo).

### Estratégia go-to-market sugerida

**1. Lançamento beta (mês 1):**
- 50 vagas Lifetime R$497 (preço de fundador)
- Conteúdo orgânico Instagram/YouTube nicho infoprodutor
- Captura WhatsApp com lead magnet "Setup MetricaGeek + FOP em 5min"

**2. Crescimento (mês 2-6):**
- Lifetime sobe pra R$997 → R$1.497
- Affiliate program 40% recorrente
- Cases de uso (Dread + Copa = social proof)

**3. Escala (mês 6+):**
- Tier Agency white-label pra agências traffic paid
- Integrações: ManyChat, Brevo, Hotmart marketplace
- API SDK pra devs

### Quem é o público

1. **Infoprodutor BR lowticket** (R$10-R$97 ticket) — não consegue pagar Stape mas precisa MQ alto
2. **Gestor de tráfego pago** rodando 5+ contas — workspace por cliente
3. **Agência traffic** — tier Agency white-label

### Receita projetada (conservadora)

| Cenário | Clientes | MRR | ARR |
|---|---|---|---|
| 6 meses | 30 Starter + 15 Pro + 3 Agency | R$5.346 | R$64.152 |
| 12 meses | 80 Starter + 50 Pro + 12 Agency | R$17.494 | R$209.928 |
| 24 meses | 200 Starter + 150 Pro + 40 Agency | R$51.330 | R$615.960 |

---

## ✨ Features

### Tracking layer
- ✅ Pixel client-side + CAPI server-side com dedup via `event_id`
- ✅ Advanced Matching propagado em **18 eventos hierárquicos** (PageView · ViewContent · Lead · AddToCart · InitiateCheckout · Purchase · Subscribe · Schedule · Search · Contact · CompleteRegistration · AddPaymentInfo · AddToWishlist · CustomizeProduct · FindLocation · Donate · StartTrial · SubmitApplication · custom)
- ✅ Click-IDs 15 canais (fbclid · gclid · ttclid · kwai_id · msclkid · twclid · li_fat_id · rdt_cid · epik · yclid · dclid · gbraid · wbraid · irclickid · sccid)
- ✅ Geo-PageView via Vercel headers (country · city · region · postal · lat/lng) → Match Quality 9.3 desde 1º toque
- ✅ Persistência tripla: cookie 365d + localStorage + banco `gpx_identity`
- ✅ Re-hidratação retornante — visita 2 carrega AM completo antes do PageView
- ✅ Cookie Keeper Safari 16.4+ ITP (HTTP Set-Cookie eleva TTL > 7d JS limit)
- ✅ First-party proxy `/_gpx/*` (bypass adblockers)
- ✅ LGPD consent banner inline opt-in
- ✅ Anti-bot filter (UA + heuristics)

### Multi-canal CAPI
- ✅ Meta Conversions API
- ✅ TikTok Events API v1.3
- ✅ Kwai Conversion Tracking
- ✅ Google Ads Enhanced Conversions

### Identity + ML
- ✅ Cross-device merge (sids da mesma pessoa agrupam por em_hash)
- ✅ Predictive LTV scoring per sid
- ✅ Conversion Lift A/B holdback 10%
- ✅ Churn prediction daily
- ✅ CAC Payback tracking
- ✅ Anomaly z-score detection

### Audiences
- ✅ Customer Match upload automático (cron 1h)
- ✅ Lookalike auto-build (1% + 3% Compradores + 1% High-LTV)
- ✅ Refund/Chargeback → CAPI events + remoção audiences

### Optimization
- ✅ Smart bidding com `predicted_ltv` no CAPI value
- ✅ POAS Data Feed (profit em vez de revenue)
- ✅ Auto-rules engine (7 actions, 6 fields, pg_cron 30min)
- ✅ Monitoring/Alerts Telegram

### Resilience
- ✅ Webhook retry queue exponential backoff (1/5/15/60/240 min, 5 attempts)
- ✅ Webhook signature verification (PerfectPay/Cakto/Hotmart)

### Gateways suportados (auto-detect)
PerfectPay V1+V2 · Cakto · Hotmart · Kiwify · Eduzz · Monetizze · Lastlink

### Lead Ads
- ✅ Meta Lead Ads form bridge (webhook leadgen → identity + CAPI Lead)

---

## 🧠 Skills + CLI

| Skill | Comando | O que faz |
|---|---|---|
| **tracking-geek-install** | `/tracking-geek-install` | Provisiona FOP em produto lowticket: workspace MetricaGeek + Meta integration + webhook + GeekPixel.js auto-injetado |

### Scripts CLI (sem Claude)

```bash
# Provisiona workspace + Meta integration
node ~/.claude/skills/tracking-geek-install/scripts/provision.mjs \
  --name "Produto X" \
  --slug produto-x \
  --pixel-id 1234567890123 \
  --domains "produtox.com,produtox.vercel.app,localhost" \
  --ad-account act_1234567890123

# Injeta snippet em todos HTMLs (substitui pixel inline antigo)
node ~/.claude/skills/tracking-geek-install/scripts/inject-snippet.mjs \
  --path /path/to/projeto \
  --slug produto-x \
  --firstparty \
  --commit
```

---

## 🔧 Troubleshooting

### "METRICAGEEK_SUPABASE_ACCESS_TOKEN missing"
- Cria `~/.claude/.env` com os tokens do passo 4

### "Token PerfectPay invalid 401"
- PerfectPay → API Settings → Regenerate → cola novo no `.env`

### Webhook 429 "rate limit"
- PerfectPay tem rate limit 60/min. Webhook real-time funciona, sync API pode falhar — aguarda 1h cooldown

### Webhooks chegam mas "Platform not detected"
- Garante que está usando PerfectPay V2 (Webhook 2.0). Versão antiga deprecada.

### Dashboard mostra valor diferente do PerfectPay
- PerfectPay panel mostra **net producer** (após taxa) · Dashboard mostra **net_amount** quando `commission` populated. Compare colunas `amount` (gross) vs `net_amount` (líquido)

### Match Quality < 9
- Verifica em `/dashboard/<slug>/tracking` se Customer Data extras populated (em/ph/fn/ln/zip/ct/st/db/ge)
- Aguarda cron Customer Match sync (1h)

---

## 🗺️ Roadmap

- [ ] Pinterest CAPI
- [ ] Snapchat CAPI
- [ ] Bing UET Enhanced Conversions
- [ ] LinkedIn Insight Tag CAPI
- [ ] AMP support
- [ ] WordPress plugin (auto-inject snippet)
- [ ] BigCommerce app
- [ ] Slack/Discord/Email alerts (além Telegram)
- [ ] SDK npm package `@metricageek/gpx`

---

## 📄 Licença

MIT.

---

## 🙋 Suporte

- Issues: [github.com/Geeknosnegocios/tracking-geek/issues](https://github.com/Geeknosnegocios/tracking-geek/issues)
- WhatsApp business: (em breve)
- Site: [metricageek.vercel.app](https://metricageek.vercel.app)

---

**Made with 🔥 by [Andrey Freitas](https://github.com/Geeknosnegocios) / Geek nos Negócios**
