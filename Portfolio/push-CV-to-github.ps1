# Is script ko run karo jab Git installed ho: CV folder GitHub repo ke CV mein push ho jayega
# Run: Right-click -> Run with PowerShell, ya terminal: .\push-CV-to-github.ps1

$repoUrl = "https://github.com/FatimaCh04/FA23-BSE-123-6B-Fatima-Ch-AWT.git"
$clonePath = "f:\AWT\repo-AWT-temp"
$cvSource = "f:\AWT\Portfolio\CV"

Write-Host "Checking Git..." -ForegroundColor Cyan
$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    Write-Host "ERROR: Git installed nahi hai. Pehle install karo: https://git-scm.com/download/win" -ForegroundColor Red
    pause
    exit 1
}

if (-not (Test-Path $cvSource)) {
    Write-Host "ERROR: CV folder nahi mila: $cvSource" -ForegroundColor Red
    pause
    exit 1
}

if (Test-Path $clonePath) { Remove-Item -Recurse -Force $clonePath }

Write-Host "Cloning repo..." -ForegroundColor Cyan
& git clone $repoUrl $clonePath
if ($LASTEXITCODE -ne 0) {
    Write-Host "Clone fail. Internet / repo URL check karo." -ForegroundColor Red
    pause
    exit 1
}

$cvDest = Join-Path $clonePath "CV"
if (-not (Test-Path $cvDest)) { New-Item -ItemType Directory -Path $cvDest -Force | Out-Null }

Write-Host "Copying CV contents into repo..." -ForegroundColor Cyan
Get-ChildItem -Path $cvDest -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path $cvSource -Force | Copy-Item -Destination $cvDest -Recurse -Force

Push-Location $clonePath
& git add -A
& git status
& git commit -m "Update CV/Portfolio site - AWT"
& git push origin main
Pop-Location

Remove-Item -Recurse -Force $clonePath -ErrorAction SilentlyContinue
Write-Host "Done. Check: https://github.com/FatimaCh04/FA23-BSE-123-6B-Fatima-Ch-AWT/tree/main/CV" -ForegroundColor Green
pause
