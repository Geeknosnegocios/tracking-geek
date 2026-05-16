# Tracking Geek — Installer (Windows PowerShell)
# Instala skill /tracking-geek-install no Claude Code

$ErrorActionPreference = "Stop"

$Repo = "https://github.com/Geeknosnegocios/tracking-geek.git"
$SkillsDir = Join-Path $HOME ".claude\skills"
$TmpDir = Join-Path $env:TEMP "tracking-geek-install-$(Get-Random)"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Tracking Geek — Funil de Otimização do Pixel    ║" -ForegroundColor Cyan
Write-Host "║  Match Quality 9+ · Pixel + CAPI · Multi-canal   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

New-Item -ItemType Directory -Force -Path $SkillsDir | Out-Null

Write-Host "▶ Baixando skill tracking-geek-install..." -ForegroundColor Yellow
git clone --depth 1 $Repo $TmpDir 2>&1 | Select-Object -Last 3

Write-Host "▶ Instalando em $SkillsDir..." -ForegroundColor Yellow
$Skills = @("tracking-geek-install")
foreach ($s in $Skills) {
  $dest = Join-Path $SkillsDir $s
  if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
  Copy-Item -Recurse -Force (Join-Path $TmpDir "skills\$s") $SkillsDir
  Write-Host "  ✓ $s" -ForegroundColor Green
}

Remove-Item -Recurse -Force $TmpDir

Write-Host ""
Write-Host "✅ Tracking Geek instalado" -ForegroundColor Green
Write-Host ""
Write-Host "Reinicie o Claude Code e use:"
Write-Host "  /tracking-geek-install      → Instala FOP em produto lowticket"
Write-Host ""
Write-Host "Scripts CLI também disponíveis:"
Write-Host "  node $SkillsDir\tracking-geek-install\scripts\provision.mjs --help"
Write-Host "  node $SkillsDir\tracking-geek-install\scripts\inject-snippet.mjs --help"
Write-Host ""
Write-Host "Pré-requisitos:"
Write-Host "  • Token Supabase MetricaGeek em ~/.claude/.env"
Write-Host "  • Token Meta Ads em mesma env"
Write-Host "  • Conta MetricaGeek (https://metricageek.vercel.app)"
Write-Host ""
