<div align="center">

# 🎯 Tracking Geek

### **Funil de Otimização do Pixel (FOP)** — Match Quality 9+ em todos eventos do funil.

Substitui Stape, Hyros e Triplewhale rodando em Vercel + Supabase.

🌐 **Site:** [trackinggeek.com.br](https://trackinggeek.com.br) · 📊 **Dashboard:** [metricageek.vercel.app](https://metricageek.vercel.app) · 🐙 **Repo:** [github.com/Geeknosnegocios/tracking-geek](https://github.com/Geeknosnegocios/tracking-geek)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stape Killer](https://img.shields.io/badge/Stape-Killer-red)](https://stape.io)
[![Match Quality](https://img.shields.io/badge/Match%20Quality-9%2B-brightgreen)](#)
[![CAPI](https://img.shields.io/badge/CAPI-Meta%20%7C%20TikTok%20%7C%20Kwai%20%7C%20Google-blue)](#)
[![Brasil](https://img.shields.io/badge/Made%20in-Brasil%20🇧🇷-009C3B)](#)

</div>

---

## 📋 Índice

- [O que é](#-o-que-é)
- [Demo](#-demo)
- [Stack](#-stack)
- [Instalação 1-click](#-instalação-1-click-passo-a-passo)
- [Skills incluídas](#-skills-incluídas)
- [Features completas](#-features-completas)
- [Pricing](#-pricing)
- [Comparativo Stape/Hyros/Triplewhale](#-comparativo-com-concorrentes)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#%EF%B8%8F-roadmap)
- [Licença + Suporte](#-licença--suporte)

---

## 💡 O que é

Sistema completo de tracking server-side pra produtos lowticket BR. Em vez de pagar **R$200–2000/mês em Stape, Hyros ou Triplewhale**, roda em conta Vercel + Supabase free tier com dashboard SaaS próprio.

**Em 5 minutos** você instala FOP completo em qualquer produto:
- Pixel + CAPI server-side
- Match Quality 9+ em todos eventos
- Multi-canal (Meta + TikTok + Kwai + Google Ads)
- Customer Match + Lookalike auto-build
- Predictive LTV + Smart bidding
- Auto-rules + Telegram alerts

---

## 🎬 Demo

```
Cliente abre site → Pixel client-side + CAPI server-side → Match Quality 9.2
       ↓
       Click checkout → utm_content=gpx:<sid> → PerfectPay/Cakto
       ↓
       Webhook approved → Bridge re-identifica → Multi-canal fan-out
       ↓
       Meta + TikTok + Kwai + Google CAPI events_received: 1
       ↓
       Customer Match audience auto-grows (cron 1h)
       ↓
       Lookalike 1% Buyers auto-criada (quando 100+ buyers)
       ↓
       Dashboard real-time + ML diário (Churn + CAC + Anomaly)
       ↓
       Auto-rules pausa CPA > R$25, boost CPA < R$10
```

**Resultado real Dread (R$23 lowticket):**
- Match Quality Purchase: **9.2** (vs 5-7 sem FOP)
- ROAS otimização: **+27%** após POAS Data Feed ativo
- Tempo manual gestão: **3h/dia → 15min/dia**

---

## 🛠 Stack

| Camada | Tech |
|---|---|
| Backend SaaS | Next.js 16 App Router + Vercel Edge |
| Database | Supabase Postgres + pg_cron + pgcrypto |
| Client lib | Vanilla JS `/p/<slug>.js` auto-served per workspace |
| CAPI | Meta · TikTok · Kwai · Google Ads Enhanced Conversions |
| ML | Heurística + z-score (sem ML pesado, roda em edge) |
| Auth | Supabase Auth (workspaces multi-tenant via RLS) |

---

## 🚀 Instalação 1-click (passo a passo)

### Passo 1 — Instalar skill no Claude Code

#### Mac / Linux
```bash
curl -fsSL https://raw.githubusercontent.com/Geeknosnegocios/tracking-geek/main/install.sh | bash
```

#### Windows (PowerShell)
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
✓ meta-geek
✅ Tracking Geek instalado
```

### Passo 2 — Reiniciar Claude Code

Fecha + abre Claude Code. Skills `/tracking-geek-install` e `/meta-geek` aparecem no autocomplete.

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
META_APP_ID=1234567890123
```

E também `~/.claude/skills/meta-geek/.env`:
```bash
META_ADS_TOKEN=EAAVxxxxxxxxxxxxxxxxxx
META_APP_ID=1234567890123
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
| Domínios produção (CSV) | `pv-copa.vercel.app,copamilionaria.com.br,localhost` |
| Pixel Meta ID | 2253453835506335 |
| Ad Account Meta | act_1296662845681337 |
| Gateway | PerfectPay |

Skill executa automaticamente:
1. ✅ Provisiona workspace MetricaGeek
2. ✅ Cria webhook endpoint `wsk_<secret>`
3. ✅ Habilita FOP + Meta integration (token encrypted)
4. ✅ Injeta GeekPixel.js em todos HTMLs do projeto
5. ✅ Adiciona `vercel.json` rewrites first-party `/_gpx/*`
6. ✅ Git commit + push automático

### Passo 6 — Configurar gateway (manual ~3min)

#### PerfectPay
1. Login [app.perfectpay.com.br](https://app.perfectpay.com.br)
2. Produto → **Configurações** → **Postback**
3. Cola:
   - **URL Webhook**: `https://metricageek.vercel.app/api/webhook/wsk_xxxxxxxxxxxx` (output do passo 5)
   - **Eventos**: TODOS (Aprovado, PIX, Boleto, Devolvido, Chargeback, Expirado, Abandono, Aguardando)
   - **Formato postback**: PerfectPay
   - **Token segurança (Public token)**: gera no PerfectPay → cola no dashboard MetricaGeek `/tracking`
   - **Página venda aprovada**: `https://<DOMÍNIO>/?transaction_token={transaction_token}`
   - **Página obrigado**: `https://<DOMÍNIO>/obrigado?transaction_token={transaction_token}`

#### Cakto
1. Login [cakto.com.br](https://cakto.com.br)
2. Produto → **Notificações** → **Webhook**
3. URL idem · Eventos: Aprovado, Reembolso, Chargeback, Aguardando, Recusado
4. Secret HMAC: cola no dashboard MetricaGeek

#### Hotmart
1. **Ferramentas** → **Webhook** → cola URL
2. Copia `X-Hotmart-Hottok` value → cola em workspace via SQL ou dashboard

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

## 🧠 Skills incluídas

| Skill | Comando | O que faz |
|---|---|---|
| **tracking-geek-install** | `/tracking-geek-install` | Provisiona FOP em produto lowticket: workspace MetricaGeek + Meta integration + webhook + GeekPixel.js auto-injetado |
| **meta-geek** | `/meta-geek` | Gerencia campanhas Facebook/Instagram Ads via SDK oficial. Lê campanhas/adsets/ads/criativos/insights. Cria/edita/pausa/duplica/deleta. Busca interesses/comportamentos/geolocalizações. Troca url_tags. 39 sub-comandos |

### Scripts CLI (sem Claude)

#### tracking-geek-install
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

#### meta-geek
```bash
# Lista campanhas
python ~/.claude/skills/meta-geek/scripts/read.py campaigns --account act_123 --status ACTIVE

# Insights última semana
python ~/.claude/skills/meta-geek/scripts/insights.py account --id act_123 --date-preset last_7d

# Pausa campanha
python ~/.claude/skills/meta-geek/scripts/update.py campaign --id 123 --status PAUSED

# Cria campanha PAUSED (sempre cria pausado por segurança)
python ~/.claude/skills/meta-geek/scripts/create.py campaign --account act_123 \
  --name "LEADS-Teste" --objective OUTCOME_LEADS

# Troca url_tags de ad existente
python ~/.claude/skills/meta-geek/scripts/advanced.py swap-url-tags --ad 123 \
  --url-tags "utm_source=facebook&utm_medium=cpc&utm_campaign=NOME"

# Duplica campanha inteira (deep copy)
python ~/.claude/skills/meta-geek/scripts/advanced.py duplicate-campaign --id 123 --deep

# Diagnóstico Pixel/Dataset
python ~/.claude/skills/meta-geek/scripts/dataset.py diagnostics --id 456
```

Setup pré-requisito (1×):
```bash
# 1. Edita contas
nano ~/.claude/skills/meta-geek/contas.yaml

# 2. Cria .env (token Meta Ads + App ID)
cat > ~/.claude/skills/meta-geek/.env <<EOF
META_ADS_TOKEN=EAAVxxxxxxxxxxxxxx
META_APP_ID=1234567890123
META_AD_ACCOUNT_ID=act_1234567890123
EOF

# 3. Instala SDK Python
pip install facebook-business
```

---

## ✨ Features completas

### Tracking layer
- ✅ Pixel client-side + CAPI server-side dedup via `event_id`
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

## 💰 Pricing

> **Free tier disponível.** Pra features avançadas e múltiplos workspaces, planos pagos abaixo.

### Tier comparison

| | **Free** | **Starter** | **Pro** ⭐ | **Agency** | **Lifetime** 🔥 |
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
| Branding "Powered by Tracking Geek" | obrigatório | opcional | removido | removido | removido |
| Telegram alerts | ❌ | ❌ | ✅ | ✅ | ✅ |
| Suporte | Comunidade | Email 48h | Email 24h | Priority WhatsApp | Priority WhatsApp |

🔥 **Lifetime — limitado a 100 founders. Preço atual: R$1.497. Sobe pra R$1.997 após 50 vendas.**

[**Contratar pelo site →**](https://trackinggeek.com.br)

---

## 📊 Comparativo com concorrentes

| | Tracking Geek Pro | Stape Pro | Hyros | Triplewhale |
|---|---|---|---|---|
| **Custo/mês** | **R$147** | $80 (~R$420) | $1500 (~R$7800) | $129 (~R$670) |
| **Anual** | **R$1.764** | R$5.040 | **R$93.600** | R$8.040 |
| Match Quality 9+ | ✅ | ✅ | ❌ | ❌ |
| Customer Match auto | ✅ | ❌ (pago extra) | ❌ | ❌ |
| Lookalike auto-build | ✅ | ❌ | ❌ | ❌ |
| Predictive LTV | ✅ | ❌ | ❌ | parcial |
| Conversion Lift A/B | ✅ | ❌ | ❌ | ❌ |
| Multi-canal CAPI nativo | ✅ 4 canais | ✅ pago extra cada | ❌ só Meta | ❌ só Meta |
| Banco próprio dados | ✅ | ✅ | ❌ | ❌ |

**Economia anual vs Hyros: R$91.836** (1 cliente Pro paga 52× seu custo de infra).

---

## 🔧 Troubleshooting

### "METRICAGEEK_SUPABASE_ACCESS_TOKEN missing"
- Cria `~/.claude/.env` com os tokens do [Passo 4](#passo-4--configurar-credenciais-env)

### "Token PerfectPay invalid 401"
- PerfectPay → API Settings → Regenerate → cola novo no `.env` + workspace

### Webhook 429 "rate limit"
- PerfectPay limita 60 req/min na API sync. Webhook real-time funciona sempre, sync API pode falhar — aguarda 1h cooldown ou usa webhook puro

### Webhooks chegam mas "Platform not detected"
- Garante que está usando PerfectPay V2 (Webhook 2.0). Versão antiga deprecada. Tracking Geek detecta ambos automaticamente

### Dashboard mostra valor diferente do PerfectPay
- PerfectPay panel mostra **net producer** (após taxa) · Dashboard mostra `net_amount` quando `commission[]` populated · Compare `amount` (gross) vs `net_amount` (líquido)

### Match Quality < 9
- Verifica em `/dashboard/<slug>/tracking` se Customer Data extras populated (em/ph/fn/ln/zip/ct/st/db/ge)
- Aguarda cron Customer Match sync (1h)
- Adiciona `event_source_url` no payload (Meta exige)

### Build falha "Type error" no Vercel
- Atualize repo: `git pull origin main` no projeto Tracking Geek
- Rode `npx tsc --noEmit` localmente pra ver erros

### Skill `/tracking-geek-install` não aparece no autocomplete
- Reinicia Claude Code (fecha + abre)
- Confirma instalação: `ls ~/.claude/skills/tracking-geek-install/`

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
- [ ] CRM Bridge (HubSpot, Pipedrive, HighLevel)

---

## 📄 Licença + Suporte

**Licença:** MIT.

**Suporte:**
- 🌐 Site: [trackinggeek.com.br](https://trackinggeek.com.br)
- 📊 Dashboard: [metricageek.vercel.app](https://metricageek.vercel.app)
- 🐙 Issues: [github.com/Geeknosnegocios/tracking-geek/issues](https://github.com/Geeknosnegocios/tracking-geek/issues)
- 💬 WhatsApp: (em breve)

---

<div align="center">

**Made with 🔥 by [Andrey Freitas](https://github.com/Geeknosnegocios) / Geek nos Negócios**

🇧🇷 Construído pra produtores lowticket BR que querem MQ 9+ sem pagar R$7.800/mês em Hyros.

[⬆ Voltar ao topo](#-tracking-geek)

</div>
