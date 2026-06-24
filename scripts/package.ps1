$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manifestPath = Join-Path $root "manifest.json"
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$zipName = "google-docs-themes-$($manifest.version).zip"
$zipPath = Join-Path $root $zipName

$requiredFiles = @(
  "manifest.json",
  "src/themes.js",
  "src/content.js",
  "popup/popup.html",
  "popup/popup.css",
  "popup/popup.js",
  "icons/icon16.png",
  "icons/icon32.png",
  "icons/icon48.png",
  "icons/icon128.png"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $root $file
  if (-not (Test-Path $path)) {
    throw "Missing required extension file: $file"
  }
}

if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

$packageItems = @(
  "manifest.json",
  "src",
  "popup",
  "icons"
)

$paths = $packageItems | ForEach-Object { Join-Path $root $_ }
Compress-Archive -Path $paths -DestinationPath $zipPath

Write-Output "Created $zipName"
