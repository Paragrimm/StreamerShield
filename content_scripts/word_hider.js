// Content-Script zum Verstecken von Wörtern auf Webseiten

// Konfigurationsvariablen
let wordList = [];
let caseSensitive = false;
let wholeWords = true;
let isEnabled = false;
let hiddenElements = [];
let hiddenCount = 0;
if (typeof browser === "undefined") {
  var browser = chrome;
}

// Einstellungen laden
browser.storage.local.get(['wordList', 'caseSensitive', 'wholeWords', 'enabled'], function(result) {
  wordList = result.wordList || [];
  caseSensitive = result.caseSensitive !== undefined ? result.caseSensitive : false;
  wholeWords = result.wholeWords !== undefined ? result.wholeWords : true;
  isEnabled = result.enabled !== undefined ? result.enabled : false;
  
  // Wenn die Erweiterung aktiviert ist, Wörter verstecken
  if (isEnabled && wordList.length > 0) {
    scanAndHideWords();
  }
});

// Listener für Nachrichten vom Popup oder den Options
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.action === 'enable') {
    isEnabled = true;
    if (wordList.length > 0) {
      scanAndHideWords();
    }
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'disable') {
    isEnabled = false;
    showAllHiddenElements();
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'updateSettings') {
    wordList = message.wordList || wordList;
    caseSensitive = message.caseSensitive !== undefined ? message.caseSensitive : caseSensitive;
    wholeWords = message.wholeWords !== undefined ? message.wholeWords : wholeWords;
    
    // Alle versteckten Elemente zurücksetzen und neu scannen
    showAllHiddenElements();
    if (isEnabled && wordList.length > 0) {
      scanAndHideWords();
    }
    
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'getHiddenCount') {
    sendResponse({ count: hiddenCount });
    return true;
  }
});

// Funktion zum Scannen und Verstecken von Wörtern
function scanAndHideWords() {
  // Alle Textknoten im Dokument finden
  const textNodes = findTextNodes(document.body);
  
  // Für jeden Textknoten prüfen, ob er eines der Wörter enthält
  textNodes.forEach(node => {
    const originalText = node.nodeValue;
    let modifiedText = originalText;
    console.log(originalText);
    
    // Für jedes Wort in der Liste prüfen
    wordList.forEach(word => {
      if (!word) return; // Leere Wörter überspringen
      
      // Regulären Ausdruck erstellen
      let flags = caseSensitive ? 'g' : 'gi';
      let pattern;
      
      if (wholeWords) {
        pattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, flags);
      } else {
        pattern = new RegExp(escapeRegExp(word), flags);
      }
      
      // Wort im Text suchen und durch Span-Element ersetzen
      if (pattern.test(modifiedText)) {
        const parent = node.parentNode;
        
        // Wenn der Elternknoten bereits ein Span ist, das wir erstellt haben, überspringen
        if (parent.nodeName === 'SPAN' && parent.classList.contains('word-hider-span')) {
          return;
        }
        
        // Text in Teile aufteilen und Span-Elemente für die zu versteckenden Wörter erstellen
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        
        // Regulären Ausdruck zurücksetzen
        pattern.lastIndex = 0;
        
        while ((match = pattern.exec(modifiedText)) !== null) {
          // Text vor dem Match hinzufügen
          if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(modifiedText.substring(lastIndex, match.index)));
          }
          
          // Span-Element für das zu versteckende Wort erstellen
          const span = document.createElement('span');
          span.classList.add('word-hider-span');
          span.style.visibility = 'hidden';
          span.textContent = match[0];
          fragment.appendChild(span);
          
          // Span-Element zur Liste der versteckten Elemente hinzufügen
          hiddenElements.push(span);
          hiddenCount++;
          
          lastIndex = pattern.lastIndex;
        }
        
        // Text nach dem letzten Match hinzufügen
        if (lastIndex < modifiedText.length) {
          fragment.appendChild(document.createTextNode(modifiedText.substring(lastIndex)));
        }
        
        // Originalknoten durch das Fragment ersetzen
        parent.replaceChild(fragment, node);
      }
    });
  });
}

// Funktion zum Finden aller Textknoten im Dokument
function findTextNodes(node) {
  const textNodes = [];
  
  // Rekursive Funktion zum Durchsuchen des DOM
  function findTextNodesRecursive(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
      textNodes.push(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Bestimmte Elemente überspringen (Skripte, Stile, etc.)
      if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'NOSCRIPT') {
        return;
      }
      
      // Alle Kinder durchsuchen
      for (let i = 0; i < node.childNodes.length; i++) {
        findTextNodesRecursive(node.childNodes[i]);
      }
    }
  }
  
  findTextNodesRecursive(node);
  return textNodes;
}

// Funktion zum Anzeigen aller versteckten Elemente
function showAllHiddenElements() {
  hiddenElements.forEach(element => {
    if (element.parentNode) {
      element.style.visibility = 'visible';
    }
  });
  
  hiddenElements = [];
  hiddenCount = 0;
}

// Hilfsfunktion zum Escapen von Sonderzeichen in regulären Ausdrücken
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// MutationObserver erstellen, um DOM-Änderungen zu überwachen
const observer = new MutationObserver(mutations => {
  if (isEnabled && wordList.length > 0) {
    // Nur neue Textknoten scannen
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const textNodes = findTextNodes(node);
            if (textNodes.length > 0) {
              textNodes.forEach(textNode => {
                const originalText = textNode.nodeValue;
                let modifiedText = originalText;
                
                // Für jedes Wort in der Liste prüfen
                wordList.forEach(word => {
                  if (!word) return; // Leere Wörter überspringen
                  
                  // Regulären Ausdruck erstellen
                  let flags = caseSensitive ? 'g' : 'gi';
                  let pattern;
                  
                  if (wholeWords) {
                    pattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, flags);
                  } else {
                    pattern = new RegExp(escapeRegExp(word), flags);
                  }
                  
                  // Wort im Text suchen und durch Span-Element ersetzen
                  if (pattern.test(modifiedText)) {
                    const parent = textNode.parentNode;
                    
                    // Wenn der Elternknoten bereits ein Span ist, das wir erstellt haben, überspringen
                    if (parent.nodeName === 'SPAN' && parent.classList.contains('word-hider-span')) {
                      return;
                    }
                    
                    // Text in Teile aufteilen und Span-Elemente für die zu versteckenden Wörter erstellen
                    const fragment = document.createDocumentFragment();
                    let lastIndex = 0;
                    let match;
                    
                    // Regulären Ausdruck zurücksetzen
                    pattern.lastIndex = 0;
                    
                    while ((match = pattern.exec(modifiedText)) !== null) {
                      // Text vor dem Match hinzufügen
                      if (match.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(modifiedText.substring(lastIndex, match.index)));
                      }
                      
                      // Span-Element für das zu versteckende Wort erstellen
                      const span = document.createElement('span');
                      span.classList.add('word-hider-span');
                      span.style.visibility = 'hidden';
                      span.textContent = match[0];
                      fragment.appendChild(span);
                      
                      // Span-Element zur Liste der versteckten Elemente hinzufügen
                      hiddenElements.push(span);
                      hiddenCount++;
                      
                      lastIndex = pattern.lastIndex;
                    }
                    
                    // Text nach dem letzten Match hinzufügen
                    if (lastIndex < modifiedText.length) {
                      fragment.appendChild(document.createTextNode(modifiedText.substring(lastIndex)));
                    }
                    
                    // Originalknoten durch das Fragment ersetzen
                    parent.replaceChild(fragment, textNode);
                  }
                });
              });
            }
          }
        });
      }
    });
  }
});

// MutationObserver starten
observer.observe(document.body, {
  childList: true,
  subtree: true
});
