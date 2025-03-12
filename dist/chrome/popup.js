// Popup-Skript für die Privatsphäre-Erweiterung

document.addEventListener('DOMContentLoaded', function() {
  // Elemente aus dem DOM abrufen
  const enableExtensionToggle = document.getElementById('enableExtension');
  const statusText = document.getElementById('statusText');
  const optionsButton = document.getElementById('editWordList');
  const hiddenCount = document.getElementById('hiddenCount');
  
  // Status der Erweiterung laden
  browser.storage.local.get('enabled', function(result) {
    const isEnabled = result.enabled !== undefined ? result.enabled : false;
    enableExtensionToggle.checked = isEnabled;
    statusText.textContent = isEnabled ? 'Aktiviert' : 'Deaktiviert';
    statusText.style.color = isEnabled ? '#4CAF50' : '#dc3545';
  });
  
  // Anzahl der versteckten Wörter auf der aktuellen Seite abfragen
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      browser.tabs.sendMessage(tabs[0].id, {action: 'getHiddenCount'})
        .then(response => {
          if (response && response.count !== undefined) {
            hiddenCount.textContent = response.count;
          }
        })
        .catch(error => {
          console.error('Fehler beim Abrufen der versteckten Wörter:', error);
        });
    }
  });
  
  // Event-Listener für den Toggle-Button
  enableExtensionToggle.addEventListener('change', function() {
    const isEnabled = enableExtensionToggle.checked;
    
    // Status in der Storage speichern
    browser.storage.local.set({enabled: isEnabled});
    
    // UI aktualisieren
    statusText.textContent = isEnabled ? 'Aktiviert' : 'Deaktiviert';
    statusText.style.color = isEnabled ? '#4CAF50' : '#dc3545';
    
    // Status an alle Tabs senden
    browser.tabs.query({}, function(tabs) {
      tabs.forEach(tab => {
        browser.tabs.sendMessage(tab.id, {
          action: isEnabled ? 'enable' : 'disable'
        }).catch(error => {
          // Ignorieren, wenn der Tab keine Content-Scripts hat
        });
      });
    });
  });
  
  // Event-Listener für den Options-Button
  optionsButton.addEventListener('click', function() {
    browser.runtime.openOptionsPage();
  });
});