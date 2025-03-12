/**
 * Browser-Polyfill für die Privatsphäre-Erweiterung
 * 
 * Dieser Polyfill ermöglicht die Verwendung der gleichen API-Aufrufe in Firefox und Chrome,
 * indem er die browser.* API für Chrome bereitstellt.
 */

(function() {
  // Prüfen, ob wir in Chrome oder Firefox sind
  const isChrome = typeof chrome !== 'undefined' && typeof browser === 'undefined';
  
  // Wenn wir in Chrome sind, erstellen wir ein browser-Objekt
  if (isChrome) {
    window.browser = {
      // Storage API
      storage: {
        local: {
          get: function(keys) {
            return new Promise((resolve, reject) => {
              try {
                chrome.storage.local.get(keys, result => {
                  if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                  } else {
                    resolve(result);
                  }
                });
              } catch (error) {
                reject(error);
              }
            });
          },
          set: function(items) {
            return new Promise((resolve, reject) => {
              try {
                chrome.storage.local.set(items, () => {
                  if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                  } else {
                    resolve();
                  }
                });
              } catch (error) {
                reject(error);
              }
            });
          }
        },
        onChanged: {
          addListener: function(callback) {
            chrome.storage.onChanged.addListener(callback);
          }
        }
      },
      
      // Runtime API
      runtime: {
        onMessage: {
          addListener: function(callback) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
              // In Chrome müssen wir true zurückgeben, um asynchrone Antworten zu unterstützen
              const result = callback(message, sender, sendResponse);
              return result === true;
            });
          }
        },
        onInstalled: {
          addListener: function(callback) {
            chrome.runtime.onInstalled.addListener(callback);
          }
        },
        sendMessage: function(message) {
          return new Promise((resolve, reject) => {
            try {
              chrome.runtime.sendMessage(message, response => {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  resolve(response);
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        },
        openOptionsPage: function() {
          return new Promise((resolve, reject) => {
            try {
              chrome.runtime.openOptionsPage(() => {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        }
      },
      
      // Tabs API
      tabs: {
        query: function(queryInfo) {
          return new Promise((resolve, reject) => {
            try {
              chrome.tabs.query(queryInfo, tabs => {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  resolve(tabs);
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        },
        sendMessage: function(tabId, message) {
          return new Promise((resolve, reject) => {
            try {
              chrome.tabs.sendMessage(tabId, message, response => {
                if (chrome.runtime.lastError) {
                  // Ignorieren, wenn der Tab keine Content-Scripts hat
                  if (chrome.runtime.lastError.message.includes('Could not establish connection')) {
                    resolve(null);
                  } else {
                    reject(chrome.runtime.lastError);
                  }
                } else {
                  resolve(response);
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        }
      },
      
      // Notifications API (falls benötigt)
      notifications: {
        create: function(options) {
          return new Promise((resolve, reject) => {
            try {
              chrome.notifications.create(options, notificationId => {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  resolve(notificationId);
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        }
      }
    };
  }
})();
