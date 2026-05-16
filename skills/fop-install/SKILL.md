---
name: fop-install
description: Instala FOP (Funil de Otimização do Pixel) em produto lowticket novo. Cria workspace MetricaGeek + Meta integration + configura pixel + injeta GeekPixel.js em todos HTMLs do projeto + configura PerfectPay/Cakto webhook. Use quando user disser "instalar FOP", "configurar tracking", "subir pixel", "adicionar produto ao MetricaGeek", "instalar GeekPixel", "ativar Match Quality 9", ou após criar novo produto lowticket.
---

# /fop-install — Pipeline FOP pra produtos lowticket

## O que é

Funil de Otimização do Pixel (FOP) é o sistema MetricaGeek que entrega Match Quality 9+ em todos eventos do funil, propaga Advanced Matching hierárquico, e roda CAPI server-side com banco próprio.

Esse skill **provisiona FOP completo** num produto novo em 5min.

## Pré-requisitos

- **Token Supabase MetricaGeek** em `C:\Users\freit\Documents\Geek OS\geek-os-claude\_contexto\.credenciais.env` chave `METRICAGEEK_SUPABASE_ACCESS_TOKEN`
- **Token Meta Ads** em `META_ADS_TOKEN` (mesma env)
- **Token Vercel** em `VERCEL_TOKEN` (pra webhook env vars)
- **Caminho do projeto** local (ex: `C:/Users/freit/Documents/CopaMilionaria`)
- **Pixel Meta ID** do produto (Events Manager → Pixel → ID)
- **Domínios** de produção (ex: `copamilionaria.site`, `copa.vercel.app`)

## Fluxo executado

1. **Login interativo**: pergunta nome, slug, pixel_id, domains
2. **Cria workspace** no MetricaGeek (Supabase Management API)
3. **Cria webhook endpoint** (`wsk_<secret>`)
4. **Habilita FOP** (`fop_enabled=true`, `meta_pixel_id`, `fop_domains`)
5. **Cria integration Meta** (token encrypted)
6. **Detecta tipo de projeto** (Vite/Next/HTML estático)
7. **Injeta GeekPixel.js** em todos HTMLs do projeto (substitui pixel inline)
8. **Configura URLs PerfectPay/Cakto** (mostra URLs pro user copiar)
9. **Output final**: webhook URL + snippet de instalação + URL dashboard

## Como invocar

User diz uma destas frases (ou similar):
- "instala FOP no Copa Milionária"
- "configura tracking pro novo produto X"
- "adiciona produto ao MetricaGeek"
- "subir pixel no funil Y"

Claude faz:

```
1. Pergunta sequencial 1 por 1:
   - Nome do produto?
   - Slug (kebab-case)?
   - Pixel Meta ID?
   - Caminho do projeto local?
   - Domínios produção (CSV)?

2. Executa script de provisioning (abaixo)

3. Roda injetor de snippet em todos .html da pasta
   (substitui pixel inline antigo se houver)

4. Commit + push automático

5. Mostra:
   - Webhook URL pro PerfectPay/Cakto
   - URLs PerfectPay (Página venda aprovada / Página obrigado)
   - Link dashboard MetricaGeek
```

## Script de provisioning

Arquivo: `~/.claude/skills/fop-install/scripts/provision.mjs`

Invocar:
```bash
node ~/.claude/skills/fop-install/scripts/provision.mjs \
  --name "Copa Milionária" \
  --slug copa-milionaria \
  --pixel-id 1234567890123 \
  --domains "copamilionaria.site,copa.vercel.app,localhost" \
  --meta-token "EAAVM1LArCzk..." # opcional, default lê do .env
```

Output:
```
✓ Workspace criado: <uuid>
✓ Webhook endpoint: wsk_xxxxxxxxxxxx
✓ Meta integration ativada
✓ FOP habilitado · domínios whitelisted
✓ Pixel: 1234567890123
✓ Dashboard: https://metricageek.vercel.app/dashboard/copa-milionaria

📋 PRÓXIMOS PASSOS (manual):
   1. Cola no <head> de cada HTML do projeto:
      <script>window.gpxq=window.gpxq||[];</script>
      <script src="https://metricageek.vercel.app/p/copa-milionaria.js" async></script>

   2. PerfectPay (ou outro gateway) → Configurar:
      • Webhook/Postback URL: https://metricageek.vercel.app/api/webhook/wsk_xxxxxxx
      • Página de venda aprovada: https://<domain>/?transaction_token={transaction_token}
      • Página de obrigado: https://<domain>/obrigado?transaction_token={transaction_token}

   3. Comando pra auto-injetar nos HTMLs:
      node ~/.claude/skills/fop-install/scripts/inject-snippet.mjs \
        --path /path/to/project --slug copa-milionaria
```

## Script de injeção HTML

Arquivo: `~/.claude/skills/fop-install/scripts/inject-snippet.mjs`

Faz:
- Varre `*.html` no diretório (recursivo, ignora `node_modules`, `dist`, `.next`)
- Detecta pixel inline antigo (regex `fbq\(['"]init['"]`)
- Substitui por GeekPixel loader
- Preserva timestamp transaction_token reader se existir
- Salva backup `.html.bak` antes de modificar
- Commit automático opcional

Invocar:
```bash
node ~/.claude/skills/fop-install/scripts/inject-snippet.mjs \
  --path "C:/Users/freit/Documents/CopaMilionaria" \
  --slug copa-milionaria \
  --commit  # opcional: faz git add + commit + push
```

## Configurações por gateway

### PerfectPay
- Webhook: `https://metricageek.vercel.app/api/webhook/<WEBHOOK_SECRET>`
- Página venda aprovada: `https://<dominio>/upsell-x?transaction_token={transaction_token}` ou `/obrigado?transaction_token={transaction_token}`
- Variáveis: `{transaction_token}`, `{customer_email}`, `{value}`
- Checkout URL params: `?upsell=true` exigido pra upsell

### Cakto
- Webhook: mesma URL
- Variáveis: `{transaction_id}`, `{customer_email}`
- Painel: cakto.com.br → Produto → Notificações → Webhook

### Hotmart
- Webhook: mesma URL
- Variáveis: `{transaction}`, `{customer_email}`
- Painel: app.hotmart.com → Ferramentas → Webhook
- Header X-Hotmart-Hottok: detectado automático

### Kiwify / Eduzz / Lastlink / Monetizze
Mesma URL. Detector automático via payload structure.

## Validação pós-instalação

Claude valida com:

```bash
# 1. Script carrega?
curl -sS https://metricageek.vercel.app/p/<slug>.js | head -3
# Esperado: /* GeekPixel FOP — wsk:<slug> */

# 2. Workspace está ativo?
curl -sS https://metricageek.vercel.app/api/webhook/<wsk_xxx>
# Esperado: {"ok":true,"enabled":true,...}

# 3. Track endpoint responde?
curl -sS -X POST https://metricageek.vercel.app/api/gpx/track/<WS_ID> \
  -H "Content-Type: application/json" \
  -d '{"sid":"validate","event_name":"PageView","event_id":"v1","ts":'"$(date +%s)"'}'
# Esperado: {"ok":true,"capi":{"ok":true,...},"match_quality":...}
```

## Após instalação

- Dashboard `https://metricageek.vercel.app/dashboard/<slug>/tracking` mostra stats real-time
- Events Manager Meta → Diagnostics deve mostrar Match Quality subindo após ~10 conversões
- Auto-rules engine em `/dashboard/<slug>/regras` (criar regras CPA/Frequency)

## Memória persistente

Após cada instalação, atualizar:
- `memory/MEMORY.md` ou `memory/produtos_lowticket.md` com produto + workspace slug + webhook ID
- `memory/fop_installs.md` (cria se não existir) — registro cronológico

## Lição aprendida

- **Vite parse5 strict**: `<noscript>` com `<img>` no `<head>` quebra build. Não usar.
- **Run cookies SameSite=Lax** pra propagar entre subdomínios
- **Cache `/p/<slug>.js`**: 300s. Após mudança domain whitelist, esperar ou cache-bust com `?v=N`
- **Test event timestamps**: Meta rejeita ts > 7 dias
