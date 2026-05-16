# Aprendizados — Meta Ads Ratos

Regras aprendidas durante o uso. O Claude DEVE ler este arquivo antes de criar qualquer objeto.

---

### 2026-04-03 — Sempre incluir CTA no criativo
**Regra:** Ao criar criativos (create.py creative), SEMPRE incluir call_to_action_type. Padrão: LEARN_MORE pra tráfego, SIGN_UP pra leads, SHOP_NOW pra vendas. Nunca criar criativo sem CTA.
**Contexto:** Criou carrossel sem botão de CTA. Usuário teve que corrigir manualmente.

### 2026-04-03 — Carrossel Instagram: multi_share_end_card=false
**Regra:** Em campanhas de visita ao perfil Instagram, SEMPRE usar multi_share_end_card=false e multi_share_optimized=false no criativo.
**Contexto:** Cartão "Ver mais" sem URL quebrou o anúncio em 10 posicionamentos. O end_card exige uma URL de destino que não existe em campanhas de perfil.

### 2026-04-03 — Sempre passar instagram_user_id no criativo
**Regra:** Ao criar criativos pra Instagram, SEMPRE usar --instagram-user-id com o ID da conta Instagram do cliente (do contas.yaml).
**Contexto:** Sem instagram_user_id, o ad não publica no Instagram. Erro: "Seu anúncio deve ser associado a uma conta do Instagram."

### 2026-04-03 — Desligar format options em carrosséis
**Regra:** Ao criar ads de carrossel, SEMPRE passar --degrees-of-freedom-spec com OPT_OUT pra carousel_to_video, image_touchups e standard_enhancements.
**Contexto:** "Blocos de coleção" e "mídia única" distorcem o carrossel sequencial. Desligar pra manter ordem dos slides.

### 2026-05-11 — Criar ABO campaign exige is_adset_budget_sharing_enabled
**Regra:** Ao criar campanha ABO via API (sem campaign budget), SEMPRE passar `is_adset_budget_sharing_enabled: False` no params da create_campaign. Sem isso retorna erro 4834011: "É necessário especificar True ou False no campo is_adset_budget_sharing_enabled".
**Contexto:** Criando ABO Test pra Dread (act_4549861662006585) com R$30/adset isolando 3 vídeos. Sem o param a API rejeitou a criação. Param controla se adsets podem compartilhar 20% do budget — `False` = budgets totalmente independentes.

### 2026-05-11 — Token Meta de 60 dias: trocar via /oauth/access_token
**Regra:** Quando token expirar (erro 190 OAuthException "Session has expired"), trocar token curto por longo (60 dias) via curl:
```
curl "https://graph.facebook.com/v25.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={TOKEN_CURTO}"
```
Salvar em DUAS posições: `~/.claude/skills/meta-geek/.env` (META_ADS_TOKEN) E `~/.claude/settings.json` (env.META_ADS_TOKEN). Settings.json sobrescreve o .env porque exporta como env var antes do script rodar.
**Contexto:** Token Dread expirou 02/mai mesmo com .env atualizado. Lib carregava de env var (settings.json) ignorando .env. Atualizar os DOIS lugares evita repetir bug.

### 2026-05-11 — Política de Privacidade obrigatória para Meta App Live
**Regra:** App Meta NÃO vai pra Live mode sem Privacy Policy URL + Terms of Service URL preenchidos em App Settings > Basic. URLs precisam retornar 200 OK (não validam conteúdo). Sem isso, Marketing API API não consegue criar criativos com posts orgânicos nem dark posts.
**Contexto:** App `1545467223761911` (Geek Ads Manager) ficou Dev mode até criar páginas `/privacidade` e `/termos` no blog.geekacademy.site. Páginas Next.js criadas em app/privacidade/page.tsx + app/termos/page.tsx.

### 2026-05-11 — Decisão: testar criativos isolados em ABO, não dentro do CBO
**Regra:** Quando criativo dentro de CBO zera (R$0 spend ou conversão zero), NÃO é por ser ruim — é porque o CBO concentrou budget no que já estava convertendo. Para teste justo, criar campanha ABO nova com 1 adset por criativo isolado, budget forçado R$30/dia (2x CPA alvo). Comparação só vale com budget igual.
**Contexto:** Dread tinha 3 vídeos zerados no CBO. CBO injusto — imagens converteram primeiro e roubaram todo budget. Criada ABO `120251881515010151` pra dar chance real aos vídeos.
