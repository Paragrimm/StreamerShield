# Projektplan: Privatsphäre-Erweiterung für Content Creator

## Übersicht
Diese Browser-Erweiterung ermöglicht es Content Creatorn, eine Liste von Wörtern zu definieren, die auf Webseiten unsichtbar gemacht werden sollen. Dies ist besonders nützlich während Livestreams oder Bildschirmaufnahmen, um sensible Informationen zu verbergen.

## Technische Anforderungen
- Die Wörter sollen mit `visibility: hidden` statt `display: none` ausgeblendet werden, um das Layout zu erhalten
- Die Wortliste soll in den Erweiterungseinstellungen konfigurierbar sein
- Die Erweiterung soll auf allen geladenen Webseiten funktionieren
- Zunächst für Firefox, später für Chrome

## Umsetzungsschritte

### 1. Grundstruktur der Erweiterung - DONE
- Manifest-Datei aktualisieren
- Popup-UI für einfache Steuerung erstellen
- Options-Seite für die Konfiguration der Wortliste erstellen

### 2. Funktionalität zum Speichern der Wortliste - DONE
- Formular für die Eingabe der Wörter erstellen
- Speichern der Wortliste in der Browser-Storage
- Möglichkeit zum Hinzufügen/Entfernen von Wörtern

### 3. Content-Script für das Scannen und Verbergen von Wörtern - DONE
- Content-Script erstellen, das auf allen Webseiten ausgeführt wird
- Funktion zum Scannen des DOM nach den angegebenen Wörtern
- Funktion zum Verbergen der gefundenen Wörter mit `visibility: hidden`

### 4. Aktivieren/Deaktivieren der Erweiterung - DONE
- Toggle-Button im Popup zum Ein-/Ausschalten der Funktionalität
- Speichern des Aktivierungsstatus
- Visuelles Feedback zum aktuellen Status

### 5. Optimierung und Verbesserungen - DONE
- Performance-Optimierung für große Webseiten
- Regelmäßiges Scannen bei DOM-Änderungen (MutationObserver)
- Optionale Einstellungen (z.B. Case-Sensitivity)

### 6. Anpassung für Chrome - DONE
- Manifest für Chrome-Kompatibilität anpassen
- API-Aufrufe anpassen (browser.* zu chrome.*)
- Testen in Chrome

### 7. Dokumentation und Veröffentlichung - DONE
- README aktualisieren
- Installationsanleitung erstellen
- Vorbereitung für Firefox Add-ons und Chrome Web Store
