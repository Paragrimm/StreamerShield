// Options-Skript für die Privatsphäre-Erweiterung

document.addEventListener('DOMContentLoaded', function() {
  // Elemente aus dem DOM abrufen
  const wordListTextarea = document.getElementById('wordList');
  const caseSensitiveCheckbox = document.getElementById('caseSensitive');
  const wholeWordsCheckbox = document.getElementById('wholeWords');
  const saveButton = document.getElementById('saveButton');
  const resetButton = document.getElementById('resetButton');
  const statusMessage = document.getElementById('statusMessage');
  if (typeof browser === "undefined") {
    var browser = chrome;
  }
  
  // Gespeicherte Einstellungen laden
  browser.storage.local.get(['wordList', 'caseSensitive', 'wholeWords'], function(result) {
    // Wortliste laden
    if (result.wordList) {
      wordListTextarea.value = result.wordList.join('\n');
    }
    
    // Optionen laden
    caseSensitiveCheckbox.checked = result.caseSensitive !== undefined ? result.caseSensitive : false;
    wholeWordsCheckbox.checked = result.wholeWords !== undefined ? result.wholeWords : true;
  });
  
  // Event-Listener für den Speichern-Button
  saveButton.addEventListener('click', function() {
    // Wortliste aus dem Textarea extrahieren
    const words = wordListTextarea.value
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);
    
    // Einstellungen speichern
    browser.storage.local.set({
      wordList: words,
      caseSensitive: caseSensitiveCheckbox.checked,
      wholeWords: wholeWordsCheckbox.checked
    }).then(() => {
      // Erfolgs-Nachricht anzeigen
      showStatusMessage('Einstellungen wurden gespeichert!', 'success');
      
      // Alle Tabs über die Änderung informieren
      browser.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
          browser.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            wordList: words,
            caseSensitive: caseSensitiveCheckbox.checked,
            wholeWords: wholeWordsCheckbox.checked
          }).catch(error => {
            // Ignorieren, wenn der Tab keine Content-Scripts hat
          });
        });
      });
    }).catch(error => {
      // Fehler-Nachricht anzeigen
      showStatusMessage('Fehler beim Speichern der Einstellungen: ' + error.message, 'error');
    });
  });
  
  // Event-Listener für den Zurücksetzen-Button
  resetButton.addEventListener('click', function() {
    if (confirm('Möchten Sie wirklich alle Einstellungen zurücksetzen?')) {
      // Textarea leeren
      wordListTextarea.value = '';
      
      // Checkboxen zurücksetzen
      caseSensitiveCheckbox.checked = false;
      wholeWordsCheckbox.checked = true;
      
      // Einstellungen speichern
      browser.storage.local.set({
        wordList: [],
        caseSensitive: false,
        wholeWords: true
      }).then(() => {
        // Erfolgs-Nachricht anzeigen
        showStatusMessage('Einstellungen wurden zurückgesetzt!', 'success');
        
        // Alle Tabs über die Änderung informieren
        browser.tabs.query({}, function(tabs) {
          tabs.forEach(tab => {
            browser.tabs.sendMessage(tab.id, {
              action: 'updateSettings',
              wordList: [],
              caseSensitive: false,
              wholeWords: true
            }).catch(error => {
              // Ignorieren, wenn der Tab keine Content-Scripts hat
            });
          });
        });
      }).catch(error => {
        // Fehler-Nachricht anzeigen
        showStatusMessage('Fehler beim Zurücksetzen der Einstellungen: ' + error.message, 'error');
      });
    }
  });
  
  // Funktion zum Anzeigen von Status-Nachrichten
  function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
    
    // Nachricht nach 3 Sekunden ausblenden
    setTimeout(() => {
      statusMessage.className = 'status-message';
    }, 3000);
  }
});
