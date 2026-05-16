#!/usr/bin/env bash
# Tracking Geek — Installer (Mac/Linux)
# Instala skill /fop-install no Claude Code

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

echo "▶ Baixando skill fop-install..."
git clone --depth 1 "$REPO" "$TMP_DIR" 2>&1 | tail -3

echo "▶ Instalando em $SKILLS_DIR..."
SKILLS=("fop-install")
for s in "${SKILLS[@]}"; do
  rm -rf "$SKILLS_DIR/$s"
  cp -r "$TMP_DIR/skills/$s" "$SKILLS_DIR/"
  echo "  ✓ $s"
done

rm -rf "$TMP_DIR"

echo ""
echo "✅ Tracking Geek instalado"
echo ""
echo "Reinicie o Claude Code e use:"
echo "  /fop-install      → Instala FOP em produto lowticket"
echo ""
echo "Scripts CLI também disponíveis:"
echo "  node $SKILLS_DIR/fop-install/scripts/provision.mjs --help"
echo "  node $SKILLS_DIR/fop-install/scripts/inject-snippet.mjs --help"
echo ""
echo "Pré-requisitos:"
echo "  • Token Supabase MetricaGeek em ~/.claude/.env"
echo "  • Token Meta Ads em mesma env"
echo "  • Conta MetricaGeek (https://metricageek.vercel.app)"
echo ""
