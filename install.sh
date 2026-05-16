#!/usr/bin/env bash
# Tracking Geek — Installer (Mac/Linux)
# Instala skill /tracking-geek-install no Claude Code

set -e

REPO="https://github.com/Geeknosnegocios/tracking-geek.git"
SKILLS_DIR="$HOME/.claude/skills"
TMP_DIR="/tmp/tracking-geek-install-$$"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  Tracking Geek — Funil de Otimização do Pixel    ║"
echo "║  Match Quality 9+ · Pixel + CAPI · Multi-canal   ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

mkdir -p "$SKILLS_DIR"

echo "▶ Baixando skill tracking-geek-install..."
git clone --depth 1 "$REPO" "$TMP_DIR" 2>&1 | tail -3

echo "▶ Instalando em $SKILLS_DIR..."
SKILLS=("tracking-geek-install" "meta-geek")
for s in "${SKILLS[@]}"; do
  # Preserva contas.yaml + .env do user se já existir
  if [ -d "$SKILLS_DIR/$s" ] && [ -f "$SKILLS_DIR/$s/contas.yaml" ]; then
    cp "$SKILLS_DIR/$s/contas.yaml" "/tmp/contas-backup-$s.yaml" 2>/dev/null
  fi
  if [ -d "$SKILLS_DIR/$s" ] && [ -f "$SKILLS_DIR/$s/.env" ]; then
    cp "$SKILLS_DIR/$s/.env" "/tmp/env-backup-$s.env" 2>/dev/null
  fi
  rm -rf "$SKILLS_DIR/$s"
  cp -r "$TMP_DIR/skills/$s" "$SKILLS_DIR/"
  # Restaura contas.yaml + .env após copy
  if [ -f "/tmp/contas-backup-$s.yaml" ]; then
    mv "/tmp/contas-backup-$s.yaml" "$SKILLS_DIR/$s/contas.yaml"
    echo "  ↻ Preservado: $s/contas.yaml"
  fi
  if [ -f "/tmp/env-backup-$s.env" ]; then
    mv "/tmp/env-backup-$s.env" "$SKILLS_DIR/$s/.env"
    echo "  ↻ Preservado: $s/.env"
  fi
  echo "  ✓ $s"
done

rm -rf "$TMP_DIR"

echo ""
echo "✅ Tracking Geek instalado"
echo ""
echo "Reinicie o Claude Code e use:"
echo "  /tracking-geek-install   → Instala FOP em produto lowticket"
echo "  /meta-geek               → Gerencia campanhas Facebook/Instagram Ads (SDK oficial)"
echo ""
echo "Scripts CLI também disponíveis:"
echo "  node $SKILLS_DIR/tracking-geek-install/scripts/provision.mjs --help"
echo "  python $SKILLS_DIR/meta-geek/scripts/read.py campaigns --account act_XXX"
echo ""
echo "Pré-requisitos:"
echo "  • Token Supabase MetricaGeek em ~/.claude/.env"
echo "  • Token Meta Ads em mesma env"
echo "  • Conta MetricaGeek (https://metricageek.vercel.app)"
echo ""
echo "📋 Próximos passos:"
echo "  1. Edita $SKILLS_DIR/meta-geek/contas.yaml com seus clientes"
echo "  2. Cria $SKILLS_DIR/meta-geek/.env com META_ADS_TOKEN + META_APP_ID"
echo "  3. Instala SDK: pip install facebook-business"
echo ""
