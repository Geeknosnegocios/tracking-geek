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
$Skills = @("tracking-geek-install", "meta-geek")
foreach ($s in $Skills) {
  $dest = Join-Path $SkillsDir $s
  $backupContas = $null
  $backupEnv = $null
  if (Test-Path "$dest\contas.yaml") {
    $backupContas = Get-Content "$dest\contas.yaml" -Raw
  }
  if (Test-Path "$dest\.env") {
    $backupEnv = Get-Content "$dest\.env" -Raw
  }
  if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
  Copy-Item -Recurse -Force (Join-Path $TmpDir "skills\$s") $SkillsDir
  if ($backupContas) {
    Set-Content -Path "$dest\contas.yaml" -Value $backupContas -NoNewline
    Write-Host "  ↻ Preservado: $s\contas.yaml" -ForegroundColor Cyan
  }
  if ($backupEnv) {
    Set-Content -Path "$dest\.env" -Value $backupEnv -NoNewline
    Write-Host "  ↻ Preservado: $s\.env" -ForegroundColor Cyan
  }
  Write-Host "  ✓ $s" -ForegroundColor Green
}

Remove-Item -Recurse -Force $TmpDir

Write-Host ""
Write-Host "✅ Tracking Geek instalado" -ForegroundColor Green
Write-Host ""
Write-Host "Reinicie o Claude Code e use:"
Write-Host "  /tracking-geek-install   → Instala FOP em produto lowticket"
Write-Host "  /meta-geek               → Gerencia campanhas Facebook/Instagram Ads (SDK oficial)"
Write-Host ""
Write-Host "Scripts CLI também disponíveis:"
Write-Host "  node $SkillsDir\tracking-geek-install\scripts\provision.mjs --help"
Write-Host "  python $SkillsDir\meta-geek\scripts\read.py campaigns --account act_XXX"
Write-Host ""
Write-Host "Pré-requisitos:"
Write-Host "  • Token Supabase MetricaGeek em ~/.claude/.env"
Write-Host "  • Token Meta Ads em mesma env"
Write-Host "  • Conta MetricaGeek (https://metricageek.vercel.app)"
Write-Host ""
Write-Host "📋 Próximos passos:"
Write-Host "  1. Edita $SkillsDir\meta-geek\contas.yaml com seus clientes"
Write-Host "  2. Cria $SkillsDir\meta-geek\.env com META_ADS_TOKEN + META_APP_ID"
Write-Host "  3. Instala SDK: pip install facebook-business"
Write-Host ""
