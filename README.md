# StreamerShield

[![built with Codeium](https://codeium.com/badges/main)](https://codeium.com/refer?referral_code=ggas84ou7cgqfvd1) (Ref-Link)

Eine Browser-Erweiterung zum Ausblenden sensibler Wörter auf Webseiten.

## Beschreibung

StreamerShield bietet Schutz für Content Creator und Streamer, indem es sensible Wörter auf Webseiten ausblendet. Die Erweiterung erhält das Layout der Seite, während potenziell problematische Inhalte versteckt werden. Perfekt für Live-Streams, Aufnahmen oder Präsentationen, bei denen unerwünschte Inhalte nicht sichtbar sein sollten.

## Funktionen

- Versteckt sensible Wörter auf Webseiten
- Erhält das Layout der Seite (keine Verschiebung von Elementen)
- Einfache Konfiguration über die Options-Seite
- Ein-/Ausschalten über das Popup
- Unterstützt Firefox und Chrome

## Installation

### Firefox

1. Lade die neueste `.xpi`-Datei aus dem [Releases](https://github.com/yourusername/StreamerShield/releases)-Bereich herunter
2. Öffne Firefox und navigiere zu `about:addons`
3. Klicke auf das Zahnrad-Symbol und wähle "Add-on aus Datei installieren..."
4. Wähle die heruntergeladene `.xpi`-Datei aus

### Chrome

1. Lade die neueste `.zip`-Datei aus dem [Releases](https://github.com/yourusername/StreamerShield/releases)-Bereich herunter
2. Öffne Chrome und navigiere zu `chrome://extensions`
3. Aktiviere den "Entwicklermodus" (Schalter oben rechts)
4. Klicke auf "Entpackte Erweiterung laden" und wähle den entpackten Ordner aus

## Verwendung

1. Klicke auf das StreamerShield-Symbol in der Toolbar
2. Aktiviere die Erweiterung mit dem Schalter
3. Konfiguriere die zu versteckenden Wörter über die Options-Seite

## Entwicklung

### Voraussetzungen

- Ein moderner Webbrowser (Firefox oder Chrome)
- Grundlegende Kenntnisse in HTML, CSS und JavaScript

### Lokale Entwicklung

1. Klone das Repository:
   ```
   git clone https://github.com/yourusername/StreamerShield.git
   ```

2. Öffne Firefox oder Chrome und lade die Erweiterung als temporäre Add-on:
   - Firefox: Navigiere zu `about:debugging` > "Dieser Firefox" > "Temporäres Add-on laden..." und wähle die `manifest.json`-Datei aus
   - Chrome: Navigiere zu `chrome://extensions`, aktiviere den "Entwicklermodus" und klicke auf "Entpackte Erweiterung laden"

3. Bearbeite die Dateien nach Bedarf. Die meisten Änderungen werden automatisch übernommen, wenn du die Erweiterung neu lädst.

### Build

Verwende das PowerShell-Skript `build.ps1`, um die Installationsdateien zu erstellen:

```
.\build.ps1
```

Dies erstellt die folgenden Dateien im `dist`-Verzeichnis:
- `firefox_extension.xpi` für Firefox
- `chrome_extension.zip` für Chrome

## Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert.

## Attributionen

### Icon

Das "Hide Eye" Icon wurde von Leonid Tsvetkov erstellt und ist unter der [Creative Commons Attribution License (CC BY)](https://creativecommons.org/licenses/by/4.0/) lizenziert.

Quelle: [Hide Eye Icon](https://www.svgrepo.com/svg/457690/hide-eye)

## Beitragen

Beiträge sind willkommen! Bitte öffne einen Issue oder Pull Request, wenn du Verbesserungen oder Fehlerbehebungen hast.
