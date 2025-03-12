# Build-Skript für die StreamerShield-Erweiterung
# Dieses Skript erstellt die Installationsdateien für Firefox (.xpi) und Chrome (.zip)

# Funktion zum Anzeigen von Fortschrittsmeldungen
function Write-Step {
    param (
        [string]$Message
    )
    Write-Host ""
    Write-Host "===== $Message =====" -ForegroundColor Green
}

# Verzeichnispfade
$rootDir = $PSScriptRoot
$distDir = Join-Path -Path $rootDir -ChildPath "dist"
$firefoxDir = Join-Path -Path $distDir -ChildPath "firefox"
$chromeDir = Join-Path -Path $distDir -ChildPath "chrome"

# Bereinige das dist-Verzeichnis, falls es bereits existiert
Write-Step "Bereinige das dist-Verzeichnis"
if (Test-Path -Path $distDir) {
    Remove-Item -Path $distDir -Recurse -Force
}

# Erstelle die Verzeichnisstruktur
Write-Step "Erstelle die Verzeichnisstruktur"
New-Item -Path $distDir -ItemType Directory -Force | Out-Null
New-Item -Path $firefoxDir -ItemType Directory -Force | Out-Null
New-Item -Path $chromeDir -ItemType Directory -Force | Out-Null

# Kopiere die Dateien für Firefox
Write-Step "Kopiere die Dateien für Firefox"
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "manifest.json") -Destination $firefoxDir
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "background.js") -Destination $firefoxDir
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "browser-polyfill.js") -Destination $firefoxDir
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "content_scripts\word_hider.js") -Destination $firefoxDir
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "popup\popup.html") -Destination (Join-Path -Path $firefoxDir -ChildPath "popup.html")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "popup\popup.js") -Destination (Join-Path -Path $firefoxDir -ChildPath "popup.js")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "popup\popup.css") -Destination (Join-Path -Path $firefoxDir -ChildPath "popup.css")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "options\options.html") -Destination (Join-Path -Path $firefoxDir -ChildPath "options.html")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "options\options.js") -Destination (Join-Path -Path $firefoxDir -ChildPath "options.js")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "options\options.css") -Destination (Join-Path -Path $firefoxDir -ChildPath "options.css")

# Kopiere die Icons für Firefox
Write-Step "Kopiere die Icons für Firefox"
$iconFiles = @("19x19.png", "38x38.png", "48x48.png", "96x96.png")
foreach ($icon in $iconFiles) {
    $iconPath = Join-Path -Path $rootDir -ChildPath "icons\$icon"
    $destPath = Join-Path -Path $firefoxDir -ChildPath $icon
    
    # Wenn das Icon existiert, kopiere es, ansonsten erstelle eine leere Datei
    if (Test-Path -Path $iconPath) {
        Copy-Item -Path $iconPath -Destination $destPath -Force
    } else {
        New-Item -Path $destPath -ItemType File -Force | Out-Null
        Write-Host "  Warnung: Icon $icon nicht gefunden, leere Datei erstellt." -ForegroundColor Yellow
    }
}

# Kopiere die Dateien für Chrome
Write-Step "Kopiere die Dateien für Chrome"
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "manifest.chrome.json") -Destination (Join-Path -Path $chromeDir -ChildPath "manifest.json")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "background.js") -Destination $chromeDir
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "browser-polyfill.js") -Destination $chromeDir
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "content_scripts\word_hider.js") -Destination $chromeDir
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "popup\popup.html") -Destination (Join-Path -Path $chromeDir -ChildPath "popup.html")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "popup\popup.js") -Destination (Join-Path -Path $chromeDir -ChildPath "popup.js")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "popup\popup.css") -Destination (Join-Path -Path $chromeDir -ChildPath "popup.css")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "options\options.html") -Destination (Join-Path -Path $chromeDir -ChildPath "options.html")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "options\options.js") -Destination (Join-Path -Path $chromeDir -ChildPath "options.js")
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "options\options.css") -Destination (Join-Path -Path $chromeDir -ChildPath "options.css")

# Kopiere die Icons für Chrome
Write-Step "Kopiere die Icons für Chrome"
foreach ($icon in $iconFiles) {
    $iconPath = Join-Path -Path $rootDir -ChildPath "icons\$icon"
    $destPath = Join-Path -Path $chromeDir -ChildPath $icon
    
    # Wenn das Icon existiert, kopiere es, ansonsten erstelle eine leere Datei
    if (Test-Path -Path $iconPath) {
        Copy-Item -Path $iconPath -Destination $destPath -Force
    } else {
        New-Item -Path $destPath -ItemType File -Force | Out-Null
        Write-Host "  Warnung: Icon $icon nicht gefunden, leere Datei erstellt." -ForegroundColor Yellow
    }
}

# Kopiere die Datenschutzerklärungen und Attributionen
Write-Step "Kopiere die Datenschutzerklärungen und Attributionen"
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "DATENSCHUTZ.md") -Destination $firefoxDir -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "PRIVACY_POLICY.md") -Destination $firefoxDir -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "ATTRIBUTION.md") -Destination $firefoxDir -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "DATENSCHUTZ.md") -Destination $chromeDir -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "PRIVACY_POLICY.md") -Destination $chromeDir -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path -Path $rootDir -ChildPath "ATTRIBUTION.md") -Destination $chromeDir -ErrorAction SilentlyContinue

# Erstelle die Firefox-ZIP-Datei
Write-Step "Erstelle die Firefox-ZIP-Datei"
$firefoxZipPath = Join-Path -Path $distDir -ChildPath "firefox_extension.zip"
Compress-Archive -Path "$firefoxDir\*" -DestinationPath $firefoxZipPath -Force

# Erstelle die Firefox-XPI-Datei
Write-Step "Erstelle die Firefox-XPI-Datei"
$firefoxXpiPath = Join-Path -Path $distDir -ChildPath "firefox_extension.xpi"
Copy-Item -Path $firefoxZipPath -Destination $firefoxXpiPath -Force

# Erstelle die Chrome-ZIP-Datei
Write-Step "Erstelle die Chrome-ZIP-Datei"
$chromeZipPath = Join-Path -Path $distDir -ChildPath "chrome_extension.zip"
Compress-Archive -Path "$chromeDir\*" -DestinationPath $chromeZipPath -Force

Write-Step "Build abgeschlossen"
Write-Host "Firefox-Erweiterung: $firefoxXpiPath"
Write-Host "Chrome-Erweiterung: $chromeZipPath"
Write-Host ""
Write-Host "Installationsanleitung für Firefox:"
Write-Host "1. Öffne Firefox und navigiere zu about:addons"
Write-Host "2. Klicke auf das Zahnrad-Symbol und wähle 'Add-on aus Datei installieren...'"
Write-Host "3. Wähle die Datei firefox_extension.xpi aus dem dist-Ordner"
Write-Host ""
Write-Host "Installationsanleitung für Chrome:"
Write-Host "1. Öffne Chrome und navigiere zu chrome://extensions"
Write-Host "2. Aktiviere den 'Entwicklermodus' (Schalter oben rechts)"
Write-Host "3. Klicke auf 'Entpackte Erweiterung laden' oder ziehe die chrome_extension.zip direkt in das Fenster"
