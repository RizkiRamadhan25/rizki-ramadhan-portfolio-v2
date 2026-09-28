$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSCommandPath

$targets = @(
    'src\pages\GalleryPage.jsx',
    'src\styles\gallery-page.css',
    'src\data\gallery.js',
    'public\images\gallery',
    'GALLERY-PATCH-README.md',
    'GALLERY-README.md'
)

foreach ($relative in $targets) {
    $path = Join-Path $root $relative
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
        Write-Host "Removed: $relative"
    }
}

Write-Host ''
Write-Host 'Gallery page cleanup completed.' -ForegroundColor Green
Write-Host 'Route, navigation entry, Gallery source files, and Gallery image folder have been removed.'
