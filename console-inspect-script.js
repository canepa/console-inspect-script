/**
 * Global Variables and Funtions JavaScript Analyzer
 * A lightweight JavaScript tool for inspecting and exploring global variables and functions in web pages.
 */

(function() {
    // Funzione per creare un elemento di output formattato
    function createOutputContainer() {
        // Rimuovi il container se già esiste
        const existingContainer = document.getElementById('dom-variables-analyzer');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        // Crea il container principale
        const container = document.createElement('div');
        container.id = 'dom-variables-analyzer';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 80%;
            height: 90%;
            background-color: rgba(240, 240, 240, 0.95);
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            font-family: monospace;
            z-index: 9999;
            overflow: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        `;
        
        // Aggiungi il pulsante di chiusura
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 2px 6px;
            cursor: pointer;
        `;
        closeButton.onclick = function() {
            container.remove();
        };
        container.appendChild(closeButton);
        
        // Aggiungi il titolo
        const title = document.createElement('h2');
        title.textContent = 'Variabili Globali e Funzioni JavaScript Analyzer - A.Canepa';
        title.style.cssText = 'margin-top: 0; color: #333;';
        container.appendChild(title);
        
        // Crea i tab per navigare tra variabili e funzioni
        const tabContainer = document.createElement('div');
        tabContainer.style.cssText = `
            display: flex;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
        `;
        
        const tabVars = document.createElement('div');
        tabVars.textContent = 'Variabili Globali';
        tabVars.className = 'active-tab';
        tabVars.style.cssText = `
            padding: 8px 15px;
            cursor: pointer;
            background-color: #e6e6e6;
            border-radius: 5px 5px 0 0;
            margin-right: 5px;
        `;
        
        const tabFuncs = document.createElement('div');
        tabFuncs.textContent = 'Funzioni JavaScript';
        tabFuncs.style.cssText = `
            padding: 8px 15px;
            cursor: pointer;
            background-color: #d9d9d9;
            border-radius: 5px 5px 0 0;
            margin-right: 5px;
        `;
        
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            padding: 10px;
            height: calc(100% - 120px);
            overflow: auto;
        `;
        
        const varsContent = document.createElement('div');
        varsContent.id = 'global-variables';
        
        const funcsContent = document.createElement('div');
        funcsContent.id = 'javascript-functions';
        funcsContent.style.display = 'none';
        
        contentContainer.appendChild(varsContent);
        contentContainer.appendChild(funcsContent);
        
        tabVars.onclick = function() {
            tabVars.style.backgroundColor = '#e6e6e6';
            tabFuncs.style.backgroundColor = '#d9d9d9';
            varsContent.style.display = 'block';
            funcsContent.style.display = 'none';
            tabVars.className = 'active-tab';
            tabFuncs.className = '';
        };
        
        tabFuncs.onclick = function() {
            tabVars.style.backgroundColor = '#d9d9d9';
            tabFuncs.style.backgroundColor = '#e6e6e6';
            varsContent.style.display = 'none';
            funcsContent.style.display = 'block';
            tabVars.className = '';
            tabFuncs.className = 'active-tab';
        };
        
        tabContainer.appendChild(tabVars);
        tabContainer.appendChild(tabFuncs);
        container.appendChild(tabContainer);
        container.appendChild(contentContainer);
        
        document.body.appendChild(container);
        
        return {
            varsContent,
            funcsContent
        };
    }
    
    // Funzione per analizzare le variabili globali
    function analyzeGlobalVariables(container) {
        const globalVars = [];
        const nativeVars = [
            'window', 'document', 'navigator', 'location', 'history', 
            'localStorage', 'sessionStorage', 'console', 'event', 
            'screen', 'addEventListener', 'setTimeout', 'setInterval',
            'clearTimeout', 'clearInterval', 'fetch', 'XMLHttpRequest',
            'Node', 'Element', 'HTMLElement', 'CSS'
        ];
        
        // Elenco di proprietà da ignorare
        const ignoreProps = new Set([
            'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 
            'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',
            'Array', 'Date', 'RegExp', 'Promise', 'Proxy', 'Map', 'WeakMap', 'Set',
            'WeakSet', 'Function', 'Object', 'Boolean', 'Error', 'EvalError', 'RangeError',
            'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'Number', 'Math',
            'JSON', 'Infinity', 'NaN', 'undefined', 'globalThis', 'Reflect', 'Symbol'
        ]);
        
        // Raccogli tutte le variabili globali
        for (const prop in window) {
            if (ignoreProps.has(prop) || nativeVars.includes(prop)) {
                continue;
            }
            
            try {
                const value = window[prop];
                const type = typeof value;
                
                // Filtra le funzioni native JavaScript e metodi interni del browser
                if (type === 'function' && value.toString().indexOf('[native code]') !== -1) {
                    continue;
                }
                
                let stringValue = '';
                
                if (type === 'function') {
                    // Per le funzioni, mostra solo la firma
                    const funcStr = value.toString();
                    const firstLineIndex = funcStr.indexOf('\n');
                    stringValue = firstLineIndex !== -1 
                        ? funcStr.substring(0, firstLineIndex) + ' { ... }'
                        : funcStr;
                } else if (type === 'object' && value !== null) {
                    if (Array.isArray(value)) {
                        // Per gli array, mostra la lunghezza e un'anteprima
                        const arrPreview = value.length > 3 
                            ? JSON.stringify(value.slice(0, 3)).replace(/]$/, ', ...]')
                            : JSON.stringify(value);
                        stringValue = `Array(${value.length}): ${arrPreview}`;
                    } else if (value instanceof Element || value instanceof HTMLElement) {
                        // Per gli elementi DOM
                        stringValue = `<${value.tagName.toLowerCase()}>`;
                    } else if (value instanceof NodeList || value instanceof HTMLCollection) {
                        // Per le collezioni di nodi
                        stringValue = `NodeCollection(${value.length})`;
                    } else {
                        // Per altri oggetti
                        try {
                            const objString = JSON.stringify(value);
                            stringValue = objString.length > 100 
                                ? objString.substring(0, 97) + '...'
                                : objString;
                        } catch (e) {
                            stringValue = '[Oggetto complesso]';
                        }
                    }
                } else {
                    // Per tipi primitivi
                    stringValue = String(value);
                }
                
                globalVars.push({
                    name: prop,
                    type: type,
                    value: stringValue,
                    rawValue: value
                });
            } catch (e) {
                globalVars.push({
                    name: prop,
                    type: 'error',
                    value: `[Errore nell'accesso: ${e.message}]`
                });
            }
        }
        
        // Funzione per ispezionare in profondità gli oggetti
        function inspectDeepObject(obj, maxDepth = 3, currentDepth = 0) {
            if (currentDepth >= maxDepth) return "[Troppo profondo]";
            
            if (obj === null) return "null";
            if (obj === undefined) return "undefined";
            
            const type = typeof obj;
            
            if (type !== 'object') return String(obj);
            
            if (Array.isArray(obj)) {
                const items = obj.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return inspectDeepObject(item, maxDepth, currentDepth + 1);
                    }
                    return String(item);
                });
                return `[${items.join(', ')}]`;
            }
            
            try {
                // Per gli oggetti normali, stampa le proprietà
                const entries = Object.entries(obj).map(([key, value]) => {
                    let valueStr;
                    if (typeof value === 'object' && value !== null) {
                        valueStr = inspectDeepObject(value, maxDepth, currentDepth + 1);
                    } else {
                        valueStr = String(value);
                    }
                    return `${key}: ${valueStr}`;
                });
                return `{${entries.join(', ')}}`;
            } catch (e) {
                return `[Oggetto complesso: ${e.message}]`;
            }
        }
        
        // Ordina alfabeticamente
        globalVars.sort((a, b) => a.name.localeCompare(b.name));
        
        // Ottieni i tipi unici per il filtro
        const uniqueTypes = [...new Set(globalVars.map(v => v.type))].sort();
        
        // Crea la sezione filtri
        const filterBar = document.createElement('div');
        filterBar.style.cssText = `
            display: flex;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 5px;
            margin-bottom: 10px;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        `;
        
        // Crea la tabella delle variabili
        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
        `;
        
        // Intestazione tabella con filtri integrati
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Colonna Nome con filtro
        const nameHeader = document.createElement('th');
        nameHeader.style.cssText = `
            border: 1px solid #ccc; 
            padding: 8px; 
            text-align: left; 
            background-color: #e6e6e6;
        `;
        
        const nameFilterDiv = document.createElement('div');
        nameFilterDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const nameLabel = document.createElement('span');
        nameLabel.textContent = 'Nome';
        
        const nameFilter = document.createElement('input');
        nameFilter.type = 'text';
        nameFilter.placeholder = 'Filtra nome...';
        nameFilter.style.cssText = `
            padding: 4px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 12px;
            width: 150px;
        `;
        
        nameFilterDiv.appendChild(nameLabel);
        nameFilterDiv.appendChild(nameFilter);
        nameHeader.appendChild(nameFilterDiv);
        
        // Colonna Tipo con filtro dropdown
        const typeHeader = document.createElement('th');
        typeHeader.style.cssText = `
            border: 1px solid #ccc; 
            padding: 8px; 
            text-align: left; 
            background-color: #e6e6e6;
        `;
        
        const typeFilterDiv = document.createElement('div');
        typeFilterDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const typeLabel = document.createElement('span');
        typeLabel.textContent = 'Tipo';
        
        const typeFilter = document.createElement('select');
        typeFilter.style.cssText = `
            padding: 4px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 12px;
            min-width: 80px;
        `;
        
        // Opzione per 'Tutti'
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'Tutti';
        typeFilter.appendChild(allOption);
        
        // Aggiungi le opzioni per ciascun tipo
        uniqueTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
        
        typeFilterDiv.appendChild(typeLabel);
        typeFilterDiv.appendChild(typeFilter);
        typeHeader.appendChild(typeFilterDiv);
        
        // Colonna Valore con filtro
        const valueHeader = document.createElement('th');
        valueHeader.style.cssText = `
            border: 1px solid #ccc; 
            padding: 8px; 
            text-align: left; 
            background-color: #e6e6e6;
        `;
        
        const valueFilterDiv = document.createElement('div');
        valueFilterDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const valueLabel = document.createElement('span');
        valueLabel.textContent = 'Valore';
        
        const valueFilter = document.createElement('input');
        valueFilter.type = 'text';
        valueFilter.placeholder = 'Filtra valore...';
        valueFilter.style.cssText = `
            padding: 4px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 12px;
            width: 150px;
        `;
        
        valueFilterDiv.appendChild(valueLabel);
        valueFilterDiv.appendChild(valueFilter);
        valueHeader.appendChild(valueFilterDiv);
        
        headerRow.appendChild(nameHeader);
        headerRow.appendChild(typeHeader);
        headerRow.appendChild(valueHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Corpo tabella
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        
        // Funzione per renderizzare le variabili filtrate
        function renderVariables() {
            tbody.innerHTML = '';
            const nameFilterValue = nameFilter.value.toLowerCase();
            const typeFilterValue = typeFilter.value;
            const valueFilterValue = valueFilter.value.toLowerCase();
            
            let filteredVars = globalVars;
            let visibleCount = 0;
            
            globalVars.forEach(variable => {
                const nameMatch = !nameFilterValue || variable.name.toLowerCase().includes(nameFilterValue);
                const typeMatch = !typeFilterValue || variable.type === typeFilterValue;
                const valueMatch = !valueFilterValue || variable.value.toLowerCase().includes(valueFilterValue);
                
                if (nameMatch && typeMatch && valueMatch) {
                    visibleCount++;
                    const row = document.createElement('tr');
                    
                    // Crea le celle con stile di base
                    const nameCell = document.createElement('td');
                    nameCell.style.cssText = 'border: 1px solid #ddd; padding: 8px; font-weight: bold;';
                    nameCell.textContent = variable.name;
                    
                    const typeCell = document.createElement('td');
                    typeCell.style.cssText = 'border: 1px solid #ddd; padding: 8px; color: #666;';
                    typeCell.textContent = variable.type;
                    
                    const valueCell = document.createElement('td');
                    valueCell.style.cssText = 'border: 1px solid #ddd; padding: 8px; word-break: break-all; font-family: monospace;';
                    
                    // Gestione avanzata della visualizzazione degli oggetti complessi
                    if (variable.type === 'object' && variable.rawValue !== null) {
                        // Container per i controlli
                        const objControlsContainer = document.createElement('div');
                        objControlsContainer.style.cssText = 'margin-bottom: 5px; display: flex; gap: 5px;';
                        
                        // Pulsante per espandere l'oggetto
                        const expandButton = document.createElement('button');
                        expandButton.textContent = 'Esplora oggetto';
                        expandButton.style.cssText = `
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            padding: 5px 10px;
                            text-align: center;
                            font-size: 12px;
                            cursor: pointer;
                            border-radius: 3px;
                        `;
                        
                        // Pulsante per visualizzare come JSON
                        const jsonButton = document.createElement('button');
                        jsonButton.textContent = 'Visualizza JSON';
                        jsonButton.style.cssText = `
                            background-color: #2196F3;
                            color: white;
                            border: none;
                            padding: 5px 10px;
                            text-align: center;
                            font-size: 12px;
                            cursor: pointer;
                            border-radius: 3px;
                        `;
                        
                        // Pulsante per ispezionare in console
                        const consoleButton = document.createElement('button');
                        consoleButton.textContent = 'Console';
                        consoleButton.style.cssText = `
                            background-color: #FF9800;
                            color: white;
                            border: none;
                            padding: 5px 10px;
                            text-align: center;
                            font-size: 12px;
                            cursor: pointer;
                            border-radius: 3px;
                        `;
                        
                        // Area per visualizzare l'oggetto espanso o il JSON
                        const detailsArea = document.createElement('div');
                        detailsArea.style.cssText = `
                            background-color: #f9f9f9;
                            border: 1px solid #ddd;
                            padding: 10px;
                            margin-top: 5px;
                            border-radius: 3px;
                            font-family: monospace;
                            white-space: pre-wrap;
                            max-height: 300px;
                            overflow: auto;
                            display: none;
                        `;
                        
                        expandButton.onclick = function() {
                            if (detailsArea.style.display === 'none') {
                                try {
                                    // Visualizza la struttura dell'oggetto
                                    detailsArea.innerHTML = '';
                                    const objTree = createObjectTree(variable.rawValue);
                                    detailsArea.appendChild(objTree);
                                    detailsArea.style.display = 'block';
                                } catch (e) {
                                    detailsArea.textContent = `Errore nell'elaborazione dell'oggetto: ${e.message}`;
                                    detailsArea.style.display = 'block';
                                }
                            } else {
                                detailsArea.style.display = 'none';
                            }
                        };
                        
                        jsonButton.onclick = function() {
                            if (detailsArea.style.display === 'none' || detailsArea.dataset.view !== 'json') {
                                try {
                                    const jsonString = JSON.stringify(variable.rawValue, null, 2);
                                    detailsArea.textContent = jsonString;
                                    detailsArea.style.display = 'block';
                                    detailsArea.dataset.view = 'json';
                                } catch (e) {
                                    detailsArea.textContent = `Errore nella conversione in JSON: ${e.message}`;
                                    detailsArea.style.display = 'block';
                                }
                            } else {
                                detailsArea.style.display = 'none';
                            }
                        };
                        
                        consoleButton.onclick = function() {
                            console.log(`Ispezionando ${variable.name}:`, variable.rawValue);
                            alert(`L'oggetto "${variable.name}" è stato registrato nella console.`);
                        };
                        
                        objControlsContainer.appendChild(expandButton);
                        objControlsContainer.appendChild(jsonButton);
                        objControlsContainer.appendChild(consoleButton);
                        
                        // Anteprima dell'oggetto
                        const previewDiv = document.createElement('div');
                        previewDiv.textContent = variable.value;
                        previewDiv.style.cssText = 'margin-bottom: 5px;';
                        
                        valueCell.appendChild(previewDiv);
                        valueCell.appendChild(objControlsContainer);
                        valueCell.appendChild(detailsArea);
                    } else {
                        // Per le stringhe lunghe e altri tipi, usa il sistema espandibile
                        if (variable.value.length > 100) {
                            const truncatedValue = document.createElement('div');
                            truncatedValue.textContent = variable.value.substring(0, 97) + '...';
                            
                            const expandButton = document.createElement('button');
                            expandButton.textContent = 'Mostra tutto';
                            expandButton.style.cssText = `
                                background-color: #4CAF50;
                                color: white;
                                border: none;
                                padding: 5px 10px;
                                text-align: center;
                                font-size: 12px;
                                cursor: pointer;
                                border-radius: 3px;
                                margin-top: 5px;
                            `;
                            
                            const fullValueArea = document.createElement('textarea');
                            fullValueArea.value = variable.value;
                            fullValueArea.style.cssText = `
                                width: 100%;
                                height: 150px;
                                margin-top: 5px;
                                font-family: monospace;
                                display: none;
                            `;
                            
                            expandButton.onclick = function() {
                                if (fullValueArea.style.display === 'none') {
                                    fullValueArea.style.display = 'block';
                                    expandButton.textContent = 'Nascondi';
                                } else {
                                    fullValueArea.style.display = 'none';
                                    expandButton.textContent = 'Mostra tutto';
                                }
                            };
                            
                            valueCell.appendChild(truncatedValue);
                            valueCell.appendChild(expandButton);
                            valueCell.appendChild(fullValueArea);
                        } else {
                            valueCell.textContent = variable.value;
                        }
                    }
                    
                    row.appendChild(nameCell);
                    row.appendChild(typeCell);
                    row.appendChild(valueCell);
                    tbody.appendChild(row);
                }
            });
            
            // Aggiorna il conteggio
            countInfo.textContent = `Variabili visualizzate: ${visibleCount} di ${globalVars.length}`;
        }
        
        // Funzione per creare una visualizzazione ad albero di un oggetto
        function createObjectTree(obj, maxDepth = 2, currentDepth = 0) {
            const treeContainer = document.createElement('ul');
            treeContainer.style.cssText = `
                list-style-type: none;
                padding-left: ${currentDepth > 0 ? '20px' : '0'};
                margin: ${currentDepth > 0 ? '5px 0' : '0'};
            `;
            
            try {
                if (obj === null) {
                    const item = document.createElement('li');
                    item.textContent = 'null';
                    treeContainer.appendChild(item);
                    return treeContainer;
                }
                
                if (obj === undefined) {
                    const item = document.createElement('li');
                    item.textContent = 'undefined';
                    treeContainer.appendChild(item);
                    return treeContainer;
                }
                
                if (currentDepth >= maxDepth) {
                    const item = document.createElement('li');
                    item.textContent = '[Troppo profondo]';
                    treeContainer.appendChild(item);
                    return treeContainer;
                }
                
                if (Array.isArray(obj)) {
                    // Per gli array
                    for (let i = 0; i < Math.min(obj.length, 100); i++) {
                        const item = document.createElement('li');
                        
                        const keySpan = document.createElement('span');
                        keySpan.textContent = `[${i}]: `;
                        keySpan.style.fontWeight = 'bold';
                        item.appendChild(keySpan);
                        
                        if (typeof obj[i] === 'object' && obj[i] !== null) {
                            const expandBtn = document.createElement('span');
                            expandBtn.textContent = '▶ ';
                            expandBtn.style.cursor = 'pointer';
                            expandBtn.style.color = 'blue';
                            item.appendChild(expandBtn);
                            
                            const valuePreview = document.createElement('span');
                            valuePreview.textContent = Array.isArray(obj[i]) 
                                ? `Array(${obj[i].length})` 
                                : '{...}';
                            item.appendChild(valuePreview);
                            
                            const subTree = createObjectTree(obj[i], maxDepth, currentDepth + 1);
                            subTree.style.display = 'none';
                            
                            expandBtn.onclick = function() {
                                if (subTree.style.display === 'none') {
                                    expandBtn.textContent = '▼ ';
                                    subTree.style.display = 'block';
                                } else {
                                    expandBtn.textContent = '▶ ';
                                    subTree.style.display = 'none';
                                }
                            };
                            
                            item.appendChild(subTree);
                        } else {
                            const valueSpan = document.createElement('span');
                            valueSpan.textContent = String(obj[i]);
                            item.appendChild(valueSpan);
                        }
                        
                        treeContainer.appendChild(item);
                    }
                    
                    if (obj.length > 100) {
                        const moreItem = document.createElement('li');
                        moreItem.textContent = `... e altri ${obj.length - 100} elementi`;
                        moreItem.style.color = '#777';
                        treeContainer.appendChild(moreItem);
                    }
                } else {
                    // Per gli oggetti
                    const keys = Object.keys(obj);
                    for (const key of keys) {
                        const item = document.createElement('li');
                        
                        const keySpan = document.createElement('span');
                        keySpan.textContent = `${key}: `;
                        keySpan.style.fontWeight = 'bold';
                        item.appendChild(keySpan);
                        
                        try {
                            if (typeof obj[key] === 'object' && obj[key] !== null) {
                                const expandBtn = document.createElement('span');
                                expandBtn.textContent = '▶ ';
                                expandBtn.style.cursor = 'pointer';
                                expandBtn.style.color = 'blue';
                                item.appendChild(expandBtn);
                                
                                const valuePreview = document.createElement('span');
                                valuePreview.textContent = Array.isArray(obj[key]) 
                                    ? `Array(${obj[key].length})` 
                                    : '{...}';
                                item.appendChild(valuePreview);
                                
                                const subTree = createObjectTree(obj[key], maxDepth, currentDepth + 1);
                                subTree.style.display = 'none';
                                
                                expandBtn.onclick = function() {
                                    if (subTree.style.display === 'none') {
                                        expandBtn.textContent = '▼ ';
                                        subTree.style.display = 'block';
                                    } else {
                                        expandBtn.textContent = '▶ ';
                                        subTree.style.display = 'none';
                                    }
                                };
                                
                                item.appendChild(subTree);
                            } else {
                                const valueSpan = document.createElement('span');
                                valueSpan.textContent = String(obj[key]);
                                item.appendChild(valueSpan);
                            }
                        } catch (e) {
                            const errorSpan = document.createElement('span');
                            errorSpan.textContent = `[Errore: ${e.message}]`;
                            errorSpan.style.color = 'red';
                            item.appendChild(errorSpan);
                        }
                        
                        treeContainer.appendChild(item);
                    }
                    
                    if (keys.length === 0) {
                        const emptyItem = document.createElement('li');
                        emptyItem.textContent = '[Oggetto vuoto]';
                        emptyItem.style.color = '#777';
                        treeContainer.appendChild(emptyItem);
                    }
                }
            } catch (e) {
                const errorItem = document.createElement('li');
                errorItem.textContent = `[Errore nell'elaborazione: ${e.message}]`;
                errorItem.style.color = 'red';
                treeContainer.appendChild(errorItem);
            }
            
            return treeContainer;
        }
        
        // Aggiungi event listener per i filtri
        nameFilter.addEventListener('input', renderVariables);
        typeFilter.addEventListener('change', renderVariables);
        valueFilter.addEventListener('input', renderVariables);
        
        // Conteggio delle variabili
        const countInfo = document.createElement('div');
        countInfo.style.cssText = `
            margin-top: 10px;
            font-style: italic;
            color: #666;
        `;
        
        // Renderizza variabili inizialmente
        renderVariables();
        
        container.appendChild(table);
        container.appendChild(countInfo);
    }
    
    // Funzione per analizzare le funzioni JavaScript
    function analyzeFunctions(container) {
        const functions = [];
        const nativeFunctions = new Set([
            'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 
            'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',
            'alert', 'atob', 'btoa', 'clearTimeout', 'clearInterval',
            'confirm', 'fetch', 'open', 'close', 'stop', 'print',
            'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'setInterval',
            'addEventListener', 'removeEventListener'
        ]);
        
        // Raccogli tutte le funzioni
        for (const prop in window) {
            try {
                const value = window[prop];
                if (typeof value === 'function') {
                    // Controlla se è una funzione nativa
                    const isNative = value.toString().indexOf('[native code]') !== -1;
                    
                    // Estrai la signature della funzione
                    let signature = value.toString();
                    let paramStr = '';
                    
                    // Estrai i parametri
                    try {
                        // Cerca di estrarre i parametri tra le parentesi
                        const funcStr = value.toString();
                        const match = funcStr.match(/function\s*[^(]*\(([^)]*)\)/);
                        if (match && match[1]) {
                            paramStr = match[1].trim();
                        } else {
                            // Prova il formato arrow function o classe
                            const arrowMatch = funcStr.match(/\(([^)]*)\)\s*=>/);
                            if (arrowMatch && arrowMatch[1]) {
                                paramStr = arrowMatch[1].trim();
                            } else {
                                paramStr = '?';
                            }
                        }
                    } catch (e) {
                        paramStr = '?';
                    }
                    
                    // Crea la signature completa
                    let fullSignature = '';
                    if (isNative) {
                        fullSignature = `${prop}(${paramStr}) { [native code] }`;
                    } else {
                        // Per funzioni definite, mostra solo la prima riga
                        const firstLineBreak = signature.indexOf('\n');
                        if (firstLineBreak !== -1) {
                            fullSignature = signature.substring(0, firstLineBreak) + ' { ... }';
                        } else {
                            fullSignature = signature;
                        }
                    }
                    
                    functions.push({
                        name: prop,
                        signature: fullSignature,
                        parameters: paramStr,
                        isNative: isNative,
                        rawFunction: value
                    });
                }
            } catch (e) {
                // Ignora errori nell'accesso alle proprietà
            }
        }
        
        // Aggiungi anche le funzioni native che potrebbero non essere state catturate
        nativeFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function' && !functions.some(f => f.name === funcName)) {
                try {
                    const func = window[funcName];
                    functions.push({
                        name: funcName,
                        signature: `${funcName}() { [native code] }`,
                        parameters: '?',
                        isNative: true,
                        rawFunction: func
                    });
                } catch (e) {
                    // Ignora errori
                }
            }
        });
        
        // Ordina alfabeticamente
        functions.sort((a, b) => a.name.localeCompare(b.name));
        
        // Crea filtri
        const filterContainer = document.createElement('div');
        filterContainer.style.cssText = `
            margin: 10px 0;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 5px;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        `;
        
        const nameFilterLabel = document.createElement('label');
        nameFilterLabel.textContent = 'Filtra per nome:';
        
        const nameFilter = document.createElement('input');
        nameFilter.type = 'text';
        nameFilter.placeholder = 'Nome funzione...';
        nameFilter.style.cssText = `
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 200px;
        `;
        
        const nativeFilterLabel = document.createElement('label');
        nativeFilterLabel.textContent = 'Tipo:';
        
        const nativeFilter = document.createElement('select');
        nativeFilter.style.cssText = `
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            line-height: 1.2;
            max-width: 140px;
        `;
        
        const optionAll = document.createElement('option');
        optionAll.value = 'all';
        optionAll.textContent = 'Tutte';
        
        const optionCustom = document.createElement('option');
        optionCustom.value = 'custom';
        optionCustom.textContent = 'Solo definite';
        
        const optionNative = document.createElement('option');
        optionNative.value = 'native';
        optionNative.textContent = 'Solo native';
        
        nativeFilter.appendChild(optionAll);
        nativeFilter.appendChild(optionCustom);
        nativeFilter.appendChild(optionNative);
        
        const paramFilterLabel = document.createElement('label');
        paramFilterLabel.textContent = 'Filtra per parametri:';
        
        const paramFilter = document.createElement('input');
        paramFilter.type = 'text';
        paramFilter.placeholder = 'Parametri...';
        paramFilter.style.cssText = `
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 150px;
        `;
        
        filterContainer.appendChild(nameFilterLabel);
        filterContainer.appendChild(nameFilter);
        filterContainer.appendChild(nativeFilterLabel);
        filterContainer.appendChild(nativeFilter);
        filterContainer.appendChild(paramFilterLabel);
        filterContainer.appendChild(paramFilter);
        
        container.appendChild(filterContainer);
        
        // Crea tabella per le funzioni
        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
        `;
        
        // Intestazione tabella
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left; background-color: #e6e6e6;">Nome</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left; background-color: #e6e6e6;">Parametri</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left; background-color: #e6e6e6;">Tipo</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left; background-color: #e6e6e6;">Signature</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Corpo tabella
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        
        // Conteggio
        const countInfo = document.createElement('div');
        countInfo.style.cssText = `
            margin-top: 10px;
            font-style: italic;
            color: #666;
        `;
        
        // Funzione per renderizzare le funzioni filtrate
        function renderFunctions() {
            tbody.innerHTML = '';
            const nameQuery = nameFilter.value.toLowerCase();
            const nativeQuery = nativeFilter.value;
            const paramQuery = paramFilter.value.toLowerCase();
            
            let visibleCount = 0;
            
            functions.forEach(func => {
                const nameMatch = !nameQuery || func.name.toLowerCase().includes(nameQuery);
                const nativeMatch = 
                    nativeQuery === 'all' || 
                    (nativeQuery === 'native' && func.isNative) || 
                    (nativeQuery === 'custom' && !func.isNative);
                const paramMatch = !paramQuery || func.parameters.toLowerCase().includes(paramQuery);
                
                if (nameMatch && nativeMatch && paramMatch) {
                    visibleCount++;
                    const row = document.createElement('tr');
                    
                    // Nome
                    const nameCell = document.createElement('td');
                    nameCell.style.cssText = 'border: 1px solid #ddd; padding: 8px; font-weight: bold;';
                    nameCell.textContent = func.name;
                    
                    // Parametri
                    const paramCell = document.createElement('td');
                    paramCell.style.cssText = 'border: 1px solid #ddd; padding: 8px; font-family: monospace;';
                    paramCell.textContent = func.parameters || '(nessun parametro)';
                    
                    // Tipo (nativa o definita)
                    const typeCell = document.createElement('td');
                    typeCell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
                    typeCell.textContent = func.isNative ? 'Nativa' : 'Definita';
                    
                    // Signature completa
                    const signatureCell = document.createElement('td');
                    signatureCell.style.cssText = 'border: 1px solid #ddd; padding: 8px; font-family: monospace;';
                    
                    // Per signature lunghe, aggiungi un sistema espandibile
                    if (func.signature.length > 80) {
                        const truncatedSignature = document.createElement('div');
                        truncatedSignature.textContent = func.signature.substring(0, 77) + '...';
                        
                        const expandButton = document.createElement('button');
                        expandButton.textContent = 'Mostra tutto';
                        expandButton.style.cssText = `
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            padding: 5px 10px;
                            text-align: center;
                            font-size: 12px;
                            cursor: pointer;
                            border-radius: 3px;
                            margin-top: 5px;
                        `;
                        
                        const fullSignatureArea = document.createElement('textarea');
                        fullSignatureArea.value = func.signature;
                        fullSignatureArea.style.cssText = `
                            width: 100%;
                            height: 80px;
                            margin-top: 5px;
                            font-family: monospace;
                            display: none;
                        `;
                        
                        expandButton.onclick = function() {
                            if (fullSignatureArea.style.display === 'none') {
                                fullSignatureArea.style.display = 'block';
                                expandButton.textContent = 'Nascondi';
                            } else {
                                fullSignatureArea.style.display = 'none';
                                expandButton.textContent = 'Mostra tutto';
                            }
                        };
                        
                        signatureCell.appendChild(truncatedSignature);
                        signatureCell.appendChild(expandButton);
                        signatureCell.appendChild(fullSignatureArea);
                    } else {
                        signatureCell.textContent = func.signature;
                    }
                    
                    // Aggiunge un pulsante per testare la funzione se non è nativa
                    if (!func.isNative) {
                        const testButton = document.createElement('button');
                        testButton.textContent = 'Ispeziona';
                        testButton.style.cssText = `
                            background-color: #FF9800;
                            color: white;
                            border: none;
                            padding: 5px 10px;
                            text-align: center;
                            font-size: 12px;
                            cursor: pointer;
                            border-radius: 3px;
                            margin-top: 5px;
                            display: block;
                        `;
                        
                        testButton.onclick = function() {
                            console.log(`Ispezionando funzione ${func.name}:`, func.rawFunction);
                            alert(`La funzione "${func.name}" è stata registrata nella console per l'ispezione.`);
                        };
                        
                        signatureCell.appendChild(testButton);
                    }
                    
                    row.appendChild(nameCell);
                    row.appendChild(paramCell);
                    row.appendChild(typeCell);
                    row.appendChild(signatureCell);
                    tbody.appendChild(row);
                }
            });
            
            // Aggiorna il conteggio
            countInfo.textContent = `Funzioni visualizzate: ${visibleCount} di ${functions.length}`;
        }
        
        // Event listener per i filtri
        nameFilter.addEventListener('input', renderFunctions);
        nativeFilter.addEventListener('change', renderFunctions);
        paramFilter.addEventListener('input', renderFunctions);
        
        // Renderizza inizialmente
        renderFunctions();
        
        container.appendChild(table);
        container.appendChild(countInfo);
    }
    
    // Esegui l'analisi
    const { varsContent, funcsContent } = createOutputContainer();
    analyzeGlobalVariables(varsContent);
    analyzeFunctions(funcsContent);
    
    console.log('Analisi delle variabili globali e funzioni JavaScript completata!');
})();
