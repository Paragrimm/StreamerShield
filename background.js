// Hintergrund-Skript für die Privatsphäre-Erweiterung für Content Creator
  if (typeof browser === "undefined") {
    var browser = chrome;
  }

// Standardeinstellungen festlegen
const defaultSettings = {
  enabled: false,
  wordList: [],
  caseSensitive: false,
  wholeWords: true
};

// Beim ersten Start die Standardeinstellungen initialisieren
browser.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    browser.storage.local.get(Object.keys(defaultSettings), result => {
      // Nur fehlende Einstellungen initialisieren
      const newSettings = {};
      let settingsChanged = false;
      
      for (const key in defaultSettings) {
        if (result[key] === undefined) {
          newSettings[key] = defaultSettings[key];
          settingsChanged = true;
        }
      }
      
      if (settingsChanged) {
        browser.storage.local.set(newSettings);
      }
    });
  }
});

// Listener für Nachrichten von Popup oder Content-Scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Anfrage zum Aktualisieren der Einstellungen in allen Tabs
  if (message.action === 'updateAllTabs') {
    browser.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        try {
          browser.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            ...message.settings
          }).catch(() => {
            // Ignorieren, wenn der Tab keine Content-Scripts hat
          });
        } catch (error) {
          // Ignorieren, wenn der Tab keine Content-Scripts hat
        }
      });
    });
    
    sendResponse({ success: true });
    return true;
  }
  
  // Anfrage zum Abrufen der aktuellen Statistiken
  if (message.action === 'getStats') {
    browser.storage.local.get('stats', result => {
      sendResponse({ stats: result.stats || { totalHidden: 0, lastScan: null } });
    });
    return true;
  }
  
  // Anfrage zum Aktualisieren der Statistiken
  if (message.action === 'updateStats') {
    browser.storage.local.get('stats', result => {
      const stats = result.stats || { totalHidden: 0, lastScan: null };
      stats.totalHidden += message.hiddenCount || 0;
      stats.lastScan = new Date().toISOString();
      
      browser.storage.local.set({ stats });
      sendResponse({ success: true });
    });
    return true;
  }
});

// Listener für Änderungen an den Einstellungen
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    // Prüfen, ob relevante Einstellungen geändert wurden
    const relevantChanges = {};
    let hasRelevantChanges = false;
    
    for (const key in changes) {
      if (['enabled', 'wordList', 'caseSensitive', 'wholeWords'].includes(key)) {
        relevantChanges[key] = changes[key].newValue;
        hasRelevantChanges = true;
      }
    }
    
    // Wenn relevante Einstellungen geändert wurden, alle Tabs benachrichtigen
    if (hasRelevantChanges) {
      browser.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          try {
            browser.tabs.sendMessage(tab.id, {
              action: 'updateSettings',
              ...relevantChanges
            }).catch(() => {
              // Ignorieren, wenn der Tab keine Content-Scripts hat
            });
          } catch (error) {
            // Ignorieren, wenn der Tab keine Content-Scripts hat
          }
        });
      });
    }
  }
});