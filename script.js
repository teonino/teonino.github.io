// Game state
let gameState = {};
let gameTimer = null;
let dayTimer = null;
let previousSpeed = null; // Store speed before pausing for trading

// Speed settings (milliseconds per game hour)
const SPEED_SETTINGS = {
    0: 0,        // Paused
    1: 5000,     // Slow (5 seconds per hour)
    2: 2000,     // Normal (2 seconds per hour) 
    3: 500       // Fast (0.5 seconds per hour)
};

const SPEED_NAMES = ['Paused', 'Slow', 'Normal', 'Fast'];

// Initialize game when everything is loaded
window.addEventListener('load', function() {
    console.log('Initializing Wall Street Wolves game...');
    
    // Initialize game state
    gameState = {
        cash: GAME_CONFIG.starting_cash,
        portfolio: {},
        reputation: GAME_CONFIG.starting_reputation,
        legalRisk: GAME_CONFIG.starting_legal_risk,
        day: 1,
        hour: 9, // Market opens at 9 AM
        minute: 0,
        illegalActions: 0,
        currentMarketData: JSON.parse(JSON.stringify(MARKET_DATA)),
        newsHistory: [],
        investigationActive: false,
        gameSpeed: 2, // Normal speed
        isPaused: false
    };
    
    // Initialize game
    setupEventListeners();
    updateMarketPrices();
    generateNews();
    generateOpportunities();
    updateDisplay();
    startGameTimer();
    
    console.log('Game initialized successfully!');
});

function setupEventListeners() {
    // Speed control slider
    document.getElementById('speed-slider').addEventListener('input', function(e) {
        const speed = parseInt(e.target.value);
        changeGameSpeed(speed);
    });
    
    // Dynamic action buttons are handled in updateDynamicActions()
    
    // Modal controls
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('execute-trade').addEventListener('click', executeTrade);
    document.getElementById('submit-defense').addEventListener('click', submitDefense);
    
    // Trade quantity input
    document.getElementById('trade-quantity').addEventListener('input', updateTradeTotal);
    
    // Trade action change (show/hide shortcuts)
    document.getElementById('trade-action').addEventListener('change', updateTradeInterface);
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        const tradingModal = document.getElementById('trading-modal');
        const opportunityModal = document.getElementById('opportunity-modal');
        
        if (event.target === tradingModal) {
            closeModal();
        } else if (event.target === opportunityModal) {
            closeOpportunityModal();
        }
    });
}

function updateDisplay() {
    // Update player stats
    document.getElementById('cash').textContent = formatCurrency(gameState.cash);
    document.getElementById('portfolio-value').textContent = formatCurrency(calculatePortfolioValue());
    document.getElementById('net-worth').textContent = formatCurrency(gameState.cash + calculatePortfolioValue());
    document.getElementById('day').textContent = gameState.day;
    
    // Update time display
    updateTimeDisplay();
    
    // Update reputation with color coding
    const repElement = document.getElementById('reputation');
    repElement.textContent = gameState.reputation;
    repElement.className = 'value ' + (gameState.reputation >= 70 ? 'reputation-good' : 'reputation-bad');
    
    // Update legal risk with color coding
    const legalElement = document.getElementById('legal-risk');
    legalElement.textContent = gameState.legalRisk;
    legalElement.className = 'value ' + getLegalRiskClass(gameState.legalRisk);
    
    // Update market display
    updateMarketDisplay();
    updateTopMovers();
    updatePortfolioDisplay();
    updateDynamicActions();
}

function getLegalRiskClass(risk) {
    if (risk < 30) return 'legal-low';
    if (risk < 60) return 'legal-medium';
    return 'legal-high';
}

function updateMarketDisplay() {
    updateAssetList('stocks', gameState.currentMarketData.stocks);
    updateAssetList('crypto', gameState.currentMarketData.crypto);
    updateAssetList('commodities', gameState.currentMarketData.commodities);
}

function updateAssetList(category, assets) {
    const container = document.getElementById(`${category}-list`);
    
    if (!container) {
        console.error(`Container not found: ${category}-list`);
        return;
    }
    
    container.innerHTML = '';
    
    if (!assets || assets.length === 0) {
        console.warn(`No assets found for ${category}`);
        return;
    }
    
    assets.forEach(asset => {
        const item = createAssetItem(asset);
        container.appendChild(item);
    });
}

function createAssetItem(asset) {
    const item = document.createElement('div');
    item.className = 'asset-item';
    item.onclick = () => openTradingModal(asset);
    
    const changePercent = (asset.change * 100).toFixed(2);
    const changeClass = asset.change >= 0 ? 'price-up' : 'price-down';
    const changeSymbol = asset.change >= 0 ? '+' : '';
    
    item.innerHTML = `
        <div class="asset-info">
            <div class="asset-name">${asset.name}</div>
            <div class="asset-symbol">${asset.symbol}</div>
        </div>
        <div class="asset-price">
            <div class="price-value">$${asset.price.toFixed(2)}</div>
            <div class="price-change ${changeClass}">${changeSymbol}${changePercent}%</div>
        </div>
    `;
    
    return item;
}

function updateTopMovers() {
    // Collect all assets from all categories
    const allAssets = [
        ...gameState.currentMarketData.stocks,
        ...gameState.currentMarketData.crypto,
        ...gameState.currentMarketData.commodities
    ];
    
    // Sort by change percentage
    const sortedAssets = [...allAssets].sort((a, b) => b.change - a.change);
    
    // Get top 5 gainers and top 5 losers
    const topGainers = sortedAssets.slice(0, 5);
    const topLosers = sortedAssets.slice(-5).reverse();
    
    // Update gainers list
    const gainersContainer = document.getElementById('top-gainers');
    gainersContainer.innerHTML = '';
    topGainers.forEach(asset => {
        if (asset.change > 0) {
            const item = createMoverItem(asset, 'gain');
            gainersContainer.appendChild(item);
        }
    });
    
    // Update losers list
    const losersContainer = document.getElementById('top-losers');
    losersContainer.innerHTML = '';
    topLosers.forEach(asset => {
        if (asset.change < 0) {
            const item = createMoverItem(asset, 'loss');
            losersContainer.appendChild(item);
        }
    });
}

function createMoverItem(asset, type) {
    const item = document.createElement('div');
    item.className = 'mover-item';
    item.onclick = () => openTradingModal(asset);
    
    const changePercent = (asset.change * 100).toFixed(2);
    const changeClass = type === 'gain' ? 'mover-gain' : 'mover-loss';
    const changeSymbol = type === 'gain' ? '+' : '';
    
    item.innerHTML = `
        <div class="mover-info">
            <div class="mover-symbol">${asset.symbol}</div>
            <div class="mover-name">${asset.name.length > 15 ? asset.name.substring(0, 15) + '...' : asset.name}</div>
        </div>
        <div class="mover-change ${changeClass}">
            ${changeSymbol}${changePercent}%
        </div>
    `;
    
    return item;
}

function updatePortfolioDisplay() {
    const container = document.getElementById('portfolio-list');
    container.innerHTML = '';
    
    if (Object.keys(gameState.portfolio).length === 0) {
        container.innerHTML = '<p class="empty-portfolio">No positions yet. Start trading!</p>';
        return;
    }
    
    Object.entries(gameState.portfolio).forEach(([symbol, quantity]) => {
        const asset = findAssetBySymbol(symbol);
        if (asset && quantity > 0) {
            const item = createPortfolioItem(asset, quantity);
            container.appendChild(item);
        }
    });
}

function createPortfolioItem(asset, quantity) {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    
    const totalValue = asset.price * quantity;
    const changePercent = (asset.change * 100).toFixed(2);
    const changeClass = asset.change >= 0 ? 'price-up' : 'price-down';
    const changeSymbol = asset.change >= 0 ? '+' : '';
    
    item.innerHTML = `
        <div class="portfolio-info">
            <div class="portfolio-name">${asset.name}</div>
            <div class="portfolio-quantity">${quantity} shares @ $${asset.price.toFixed(2)}</div>
        </div>
        <div class="portfolio-value">
            <div class="price-value">$${totalValue.toFixed(2)}</div>
            <div class="price-change ${changeClass}">${changeSymbol}${changePercent}%</div>
        </div>
    `;
    
    return item;
}

function openTradingModal(asset) {
    // Pause the game for trading
    pauseGameForTrading();
    
    const modal = document.getElementById('trading-modal');
    document.getElementById('modal-title').textContent = `Trade ${asset.symbol}`;
    document.getElementById('asset-name').textContent = asset.name;
    document.getElementById('asset-price').textContent = asset.price.toFixed(2);
    
    const changePercent = (asset.change * 100).toFixed(2);
    const changeSymbol = asset.change >= 0 ? '+' : '';
    document.getElementById('asset-change').textContent = `${changeSymbol}${changePercent}%`;
    
    // Store current asset for trading
    modal.dataset.symbol = asset.symbol;
    
    // Reset form
    document.getElementById('trade-action').value = 'buy';
    document.getElementById('trade-quantity').value = '1';
    
    // Setup shortcut buttons
    setupShortcutButtons();
    updateTradeInterface();
    updateTradeTotal();
    
    modal.style.display = 'block';
}

function setupShortcutButtons() {
    // Remove existing event listeners and add new ones
    const buyShortcuts = document.querySelectorAll('#buy-shortcuts .shortcut-btn:not(.max-buy)');
    const sellShortcuts = document.querySelectorAll('#sell-shortcuts .shortcut-btn');
    const maxBuyBtn = document.getElementById('max-buy-btn');
    
    // Buy shortcuts (+1, +10, +100, +1000)
    buyShortcuts.forEach(btn => {
        btn.onclick = function() {
            const addAmount = parseInt(this.dataset.add);
            const currentQuantity = parseInt(document.getElementById('trade-quantity').value) || 0;
            document.getElementById('trade-quantity').value = currentQuantity + addAmount;
            updateTradeTotal();
        };
    });
    
    // MAX buy button
    maxBuyBtn.onclick = function() {
        const symbol = document.getElementById('trading-modal').dataset.symbol;
        const asset = findAssetBySymbol(symbol);
        const maxQuantity = Math.floor(gameState.cash / asset.price);
        document.getElementById('trade-quantity').value = maxQuantity;
        updateTradeTotal();
    };
    
    // Sell shortcuts (25%, 50%, 75%, 100%)
    sellShortcuts.forEach(btn => {
        btn.onclick = function() {
            const percent = parseInt(this.dataset.percent);
            const symbol = document.getElementById('trading-modal').dataset.symbol;
            const currentHoldings = gameState.portfolio[symbol] || 0;
            const sellQuantity = Math.floor(currentHoldings * percent / 100);
            document.getElementById('trade-quantity').value = Math.max(0, sellQuantity);
            updateTradeTotal();
        };
    });
}

function updateTradeInterface() {
    const action = document.getElementById('trade-action').value;
    const symbol = document.getElementById('trading-modal').dataset.symbol;
    const asset = findAssetBySymbol(symbol);
    const currentHoldings = gameState.portfolio[symbol] || 0;
    
    // Show/hide appropriate shortcuts and info
    const buyShortcuts = document.getElementById('buy-shortcuts');
    const sellShortcuts = document.getElementById('sell-shortcuts');
    const holdingsInfo = document.getElementById('holdings-info');
    const affordabilityInfo = document.getElementById('affordability-info');
    
    if (action === 'buy') {
        buyShortcuts.style.display = 'flex';
        sellShortcuts.style.display = 'none';
        holdingsInfo.style.display = 'none';
        affordabilityInfo.style.display = 'block';
        
        // Calculate and show max affordable shares
        const maxAffordable = Math.floor(gameState.cash / asset.price);
        document.getElementById('max-affordable').textContent = maxAffordable;
        
        document.getElementById('trade-quantity').min = '1';
        document.getElementById('trade-quantity').max = maxAffordable;
    } else {
        buyShortcuts.style.display = 'none';
        sellShortcuts.style.display = 'flex';
        holdingsInfo.style.display = 'block';
        affordabilityInfo.style.display = 'none';
        
        document.getElementById('current-holdings').textContent = currentHoldings;
        document.getElementById('trade-quantity').min = '0';
        document.getElementById('trade-quantity').max = currentHoldings;
        
        // Reset quantity if it exceeds holdings
        const currentQuantity = parseInt(document.getElementById('trade-quantity').value) || 0;
        if (currentQuantity > currentHoldings) {
            document.getElementById('trade-quantity').value = currentHoldings;
        }
    }
    
    updateTradeTotal();
}

function updateTradeTotal() {
    const symbol = document.getElementById('trading-modal').dataset.symbol;
    const asset = findAssetBySymbol(symbol);
    const quantity = parseInt(document.getElementById('trade-quantity').value) || 0;
    const total = asset.price * quantity;
    
    document.getElementById('trade-total').textContent = total.toFixed(2);
}

function executeTrade() {
    const symbol = document.getElementById('trading-modal').dataset.symbol;
    const action = document.getElementById('trade-action').value;
    const quantity = parseInt(document.getElementById('trade-quantity').value) || 0;
    
    if (quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    
    const asset = findAssetBySymbol(symbol);
    const totalCost = asset.price * quantity;
    
    if (action === 'buy') {
        if (gameState.cash < totalCost) {
            alert('Insufficient funds!');
            return;
        }
        
        gameState.cash -= totalCost;
        gameState.portfolio[symbol] = (gameState.portfolio[symbol] || 0) + quantity;
        
        // Small reputation boost for legitimate trading
        gameState.reputation = Math.min(100, gameState.reputation + 0.1);
        
    } else if (action === 'sell') {
        const currentHolding = gameState.portfolio[symbol] || 0;
        if (currentHolding < quantity) {
            alert('Insufficient shares to sell!');
            return;
        }
        
        gameState.cash += totalCost;
        gameState.portfolio[symbol] = currentHolding - quantity;
        
        if (gameState.portfolio[symbol] === 0) {
            delete gameState.portfolio[symbol];
        }
    }
    
    updateDisplay();
    closeModal();
}

function closeModal() {
    const tradingModal = document.getElementById('trading-modal');
    const investigationModal = document.getElementById('investigation-modal');
    const opportunityModal = document.getElementById('opportunity-modal');
    
    // Check if trading modal was open
    const wasTradingModalOpen = tradingModal.style.display === 'block';
    
    tradingModal.style.display = 'none';
    investigationModal.style.display = 'none';
    opportunityModal.style.display = 'none';
    
    // Resume game if trading modal was closed
    if (wasTradingModalOpen) {
        resumeGameAfterTrading();
    }
}

// Real-time game functions
function startGameTimer() {
    if (gameTimer) clearInterval(gameTimer);
    
    const speed = SPEED_SETTINGS[gameState.gameSpeed];
    if (speed === 0) return; // Paused
    
    gameTimer = setInterval(advanceTime, speed);
}

function changeGameSpeed(speed) {
    gameState.gameSpeed = speed;
    gameState.isPaused = (speed === 0);
    
    // Update UI
    document.getElementById('current-speed').textContent = SPEED_NAMES[speed];
    
    // Restart timer with new speed
    startGameTimer();
}

function advanceTime() {
    if (gameState.isPaused || gameState.investigationActive) return;
    
    // Advance by 1 hour
    gameState.hour++;
    
    // Handle day transitions
    if (gameState.hour >= 24) {
        gameState.hour = 0;
        nextDay();
    }
    
    // Market is open 9 AM to 5 PM (17:00)
    if (gameState.hour >= 9 && gameState.hour <= 17) {
        // Update market prices more frequently during market hours
        if (Math.random() < 0.3) {
            updateMarketPrices();
        }
        
        // Generate news during market hours
        if (Math.random() < 0.1) {
            generateNews();
        }
        
        // Generate opportunities more frequently
        if (Math.random() < 0.15) {
            generateOpportunities();
        }
    }
    
    updateDisplay();
}

function nextDay() {
    gameState.day++;
    gameState.hour = 9; // Reset to market open
    
    // Daily events
    updateMarketPrices();
    
    // Decay legal risk slightly over time
    gameState.legalRisk = Math.max(0, gameState.legalRisk - 1);
    
    // Check for investigation
    checkForInvestigation();
    
    // Generate daily news
    if (Math.random() < 0.7) {
        generateNews();
    }
    
    // Generate daily opportunities
    if (Math.random() < 0.4) {
        generateOpportunities();
    }
}

function updateTimeDisplay() {
    const timeString = formatTime(gameState.hour, gameState.minute);
    let displayText = `Day ${gameState.day} - ${timeString}`;
    
    // Add trading pause indicator
    if (previousSpeed !== null) {
        displayText += ' (TRADING)';
    }
    
    document.getElementById('time-remaining').textContent = displayText;
    
    // Update speed display
    let speedText = SPEED_NAMES[gameState.gameSpeed];
    if (previousSpeed !== null) {
        speedText += ' (Trading)';
    }
    document.getElementById('current-speed').textContent = speedText;
}

function formatTime(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    
    let status = '';
    if (hour >= 9 && hour <= 17) {
        status = ' (Market Open)';
    } else {
        status = ' (Market Closed)';
    }
    
    return `${displayHour}:${displayMinute} ${period}${status}`;
}

// Trading pause/resume functions
function pauseGameForTrading() {
    // Only pause if game is currently running
    if (gameState.gameSpeed > 0 && !gameState.investigationActive) {
        previousSpeed = gameState.gameSpeed;
        changeGameSpeed(0); // Pause
        console.log('Game paused for trading');
    }
}

function resumeGameAfterTrading() {
    // Only resume if we had paused for trading and not in investigation
    if (previousSpeed !== null && !gameState.investigationActive) {
        changeGameSpeed(previousSpeed);
        previousSpeed = null;
        console.log('Game resumed after trading');
    }
}

function updateMarketPrices() {
    ['stocks', 'crypto', 'commodities'].forEach(category => {
        gameState.currentMarketData[category].forEach(asset => {
            // Smaller, more realistic movements for real-time
            const baseVolatility = category === 'crypto' ? 0.008 : 0.003;
            const randomChange = (Math.random() - 0.5) * baseVolatility * 2;
            
            // Market hours affect volatility
            const isMarketHours = gameState.hour >= 9 && gameState.hour <= 17;
            const volatilityMultiplier = isMarketHours ? 1.5 : 0.3;
            
            const finalChange = randomChange * volatilityMultiplier;
            asset.change = finalChange;
            asset.price *= (1 + finalChange);
            asset.price = Math.max(0.01, asset.price); // Prevent negative prices
        });
    });
}

function generateNews() {
    const newsEvent = NEWS_EVENTS[Math.floor(Math.random() * NEWS_EVENTS.length)];
    gameState.newsHistory.push(newsEvent);
    
    // Apply news effects to market
    Object.entries(newsEvent.effects).forEach(([target, effect]) => {
        if (target === 'stocks' || target === 'crypto' || target === 'commodities') {
            gameState.currentMarketData[target].forEach(asset => {
                asset.price *= (1 + effect);
                asset.change += effect;
            });
        } else {
            // Specific asset
            const asset = findAssetBySymbol(target);
            if (asset) {
                asset.price *= (1 + effect);
                asset.change += effect;
            }
        }
    });
    
    // Display news
    displayNews(newsEvent.text);
}

function displayNews(text) {
    const newsContainer = document.getElementById('news-feed');
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    newsItem.textContent = text;
    
    newsContainer.insertBefore(newsItem, newsContainer.firstChild);
    
    // Keep only last 3 news items
    while (newsContainer.children.length > 3) {
        newsContainer.removeChild(newsContainer.lastChild);
    }
}

function generateOpportunities() {
    const container = document.getElementById('opportunities');
    
    // Don't clear existing opportunities, just add new ones
    // But limit to maximum 4 opportunities at once
    const currentOpportunities = container.children.length;
    if (currentOpportunities >= 4) {
        return; // Too many opportunities already
    }
    
    // Generate 1-3 new opportunities
    const numOpportunities = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numOpportunities && container.children.length < 4; i++) {
        const eventType = Math.random();
        
        if (eventType < 0.3) {
            // 30% chance for interactive events
            const interactiveEvent = INTERACTIVE_EVENTS[Math.floor(Math.random() * INTERACTIVE_EVENTS.length)];
            const item = document.createElement('div');
            item.className = 'opportunity-item interactive-event';
            item.style.borderLeft = '3px solid #ff6b6b';
            item.innerHTML = `
                <strong>⚠️ ${interactiveEvent.title}</strong><br>
                <small>${interactiveEvent.description}</small>
                <div class="opportunity-timer" data-expires="${Date.now() + 30000}">⏰ 30s</div>
            `;
            
            item.onclick = () => showInteractiveEvent(interactiveEvent, item);
            container.appendChild(item);
        } else {
            // 70% chance for regular opportunities
            const allOpportunities = [...LEGAL_OPPORTUNITIES, ...ILLEGAL_OPPORTUNITIES];
            const opportunity = allOpportunities[Math.floor(Math.random() * allOpportunities.length)];
            
            const item = document.createElement('div');
            item.className = 'opportunity-item';
            
            // Add risk indicator
            const isIllegal = ILLEGAL_OPPORTUNITIES.includes(opportunity);
            const riskLevel = isIllegal ? 'high' : 'low';
            const riskColor = isIllegal ? '#dc143c' : '#ffa500';
            
            item.style.borderLeft = `3px solid ${riskColor}`;
            item.innerHTML = `
                <strong>${isIllegal ? '🚨' : '💼'} ${opportunity.title}</strong><br>
                <small>${opportunity.description}</small>
                <div class="opportunity-risk ${riskLevel}-risk">${isIllegal ? 'HIGH RISK' : 'MODERATE RISK'}</div>
                <div class="opportunity-timer" data-expires="${Date.now() + 45000}">⏰ 45s</div>
            `;
            
            item.onclick = () => handleOpportunityWithOutcome(opportunity, item);
            container.appendChild(item);
        }
    }
    
    // Update panel responsiveness
    updateOpportunitiesPanelSize();
    
    // Start timer updates for new opportunities
    updateOpportunityTimers();
}

function updateOpportunitiesPanelSize() {
    const container = document.getElementById('opportunities');
    const section = document.getElementById('opportunities-section');
    const opportunityCount = container.children.length;
    
    // Remove existing responsive classes
    section.classList.remove('has-opportunities', 'many-opportunities', 'no-opportunities');
    
    if (opportunityCount === 0) {
        section.classList.add('no-opportunities');
        // Add empty state message if none exists
        if (!container.querySelector('.no-opportunities-message')) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'no-opportunities-message';
            emptyMessage.innerHTML = '<em>No opportunities available</em>';
            emptyMessage.style.cssText = 'color: #666; font-style: italic; padding: 10px; text-align: center; font-size: 11px;';
            container.appendChild(emptyMessage);
        }
    } else {
        // Remove empty message if it exists
        const emptyMessage = container.querySelector('.no-opportunities-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }
        
        if (opportunityCount >= 3) {
            section.classList.add('many-opportunities');
        } else {
            section.classList.add('has-opportunities');
        }
    }
    
    // Adjust the events panel layout based on opportunities
    adjustEventsPanelLayout(opportunityCount);
}

function adjustEventsPanelLayout(opportunityCount) {
    // The CSS flex properties now handle the responsive sizing
    // This function can be simplified or removed since CSS handles the layout
}function handleOpportunity(opportunity) {
    if (ILLEGAL_OPPORTUNITIES.includes(opportunity)) {
        showIllegalOpportunityModal(opportunity);
    } else {
        showLegalOpportunityModal(opportunity);
    }
}

function handleOpportunityWithOutcome(opportunity, element) {
    // Remove the opportunity from display immediately
    element.remove();
    
    // Update panel size after removal
    updateOpportunitiesPanelSize();
    
    // Show opportunity modal instead of immediate execution
    showOpportunityModal(opportunity);
}

function showOpportunityModal(opportunity) {
    const modal = document.getElementById('opportunity-modal');
    const isIllegal = ILLEGAL_OPPORTUNITIES.includes(opportunity);
    
    // Calculate success probability
    let successChance = 0.6;
    if (isIllegal) {
        successChance = 0.4;
        successChance -= (gameState.legalRisk / 100) * 0.3;
        successChance -= ((100 - gameState.reputation) / 100) * 0.2;
    } else {
        successChance += (gameState.reputation / 100) * 0.2;
        successChance += ((100 - gameState.legalRisk) / 100) * 0.1;
    }
    successChance = Math.max(0.1, Math.min(0.9, successChance));
    
    // Set modal content
    document.getElementById('opportunity-modal-title').textContent = opportunity.title;
    document.getElementById('opportunity-description').textContent = opportunity.description;
    
    // Set details
    let detailsHtml = '<strong>Opportunity Details:</strong><br>';
    if (opportunity.potential_gain) {
        detailsHtml += `💰 Potential Gain: ${(opportunity.potential_gain * 100).toFixed(1)}%<br>`;
    }
    if (opportunity.cost) {
        detailsHtml += `💸 Cost: $${formatCurrency(opportunity.cost)}<br>`;
    }
    if (opportunity.legal_risk) {
        detailsHtml += `⚖️ Legal Risk: +${opportunity.legal_risk}<br>`;
    }
    if (opportunity.reputation_cost) {
        detailsHtml += `📉 Reputation Cost: -${opportunity.reputation_cost}<br>`;
    }
    detailsHtml += `🎯 Success Chance: ${(successChance * 100).toFixed(0)}%`;
    
    document.getElementById('opportunity-details').innerHTML = detailsHtml;
    
    // Set risk info
    const riskInfo = document.getElementById('opportunity-risk-info');
    if (isIllegal) {
        riskInfo.className = 'risk-high';
        riskInfo.innerHTML = '🚨 <strong>HIGH RISK ILLEGAL ACTIVITY</strong><br>Severe penalties if caught!';
    } else {
        riskInfo.className = 'risk-moderate';
        riskInfo.innerHTML = '💼 <strong>LEGITIMATE BUSINESS OPPORTUNITY</strong><br>Legal but market risks apply.';
    }
    
    // Set choices
    const choicesHtml = `
        <button class="opportunity-choice-btn choice-accept" onclick="executeOpportunity(${JSON.stringify(opportunity).replace(/"/g, '&quot;')}, true)">
            ✅ Accept Opportunity
        </button>
        <button class="opportunity-choice-btn choice-decline" onclick="closeOpportunityModal()">
            ❌ Decline Opportunity
        </button>
    `;
    
    document.getElementById('opportunity-choices').innerHTML = choicesHtml;
    
    // Show modal
    modal.style.display = 'block';
}

function executeOpportunity(opportunity, accepted) {
    if (!accepted) {
        closeOpportunityModal();
        return;
    }
    
    const isIllegal = ILLEGAL_OPPORTUNITIES.includes(opportunity);
    
    // Calculate success probability
    let successChance = 0.6;
    if (isIllegal) {
        successChance = 0.4;
        successChance -= (gameState.legalRisk / 100) * 0.3;
        successChance -= ((100 - gameState.reputation) / 100) * 0.2;
    } else {
        successChance += (gameState.reputation / 100) * 0.2;
        successChance += ((100 - gameState.legalRisk) / 100) * 0.1;
    }
    successChance = Math.max(0.1, Math.min(0.9, successChance));
    
    const isSuccess = Math.random() < successChance;
    
    closeOpportunityModal();
    
    if (isIllegal) {
        handleIllegalOpportunityOutcome(opportunity, isSuccess);
    } else {
        handleLegalOpportunityOutcome(opportunity, isSuccess);
    }
}

function closeOpportunityModal() {
    document.getElementById('opportunity-modal').style.display = 'none';
}

function showActionModal(action, buttonElement) {
    // Remove the action button from display
    buttonElement.remove();
    
    const modal = document.getElementById('opportunity-modal');
    
    // Calculate success probability for actions
    let successChance = 0.7; // Base 70% success for actions
    if (action.category === 'Illegal') {
        successChance = 0.5; // 50% base for illegal actions
        successChance -= (gameState.legalRisk / 100) * 0.3;
        successChance -= ((100 - gameState.reputation) / 100) * 0.2;
    } else {
        successChance += (gameState.reputation / 100) * 0.2;
        successChance += ((100 - gameState.legalRisk) / 100) * 0.1;
    }
    successChance = Math.max(0.1, Math.min(0.9, successChance));
    
    // Set modal content
    document.getElementById('opportunity-modal-title').textContent = action.title;
    document.getElementById('opportunity-description').textContent = action.description;
    
    // Set details
    let detailsHtml = '<strong>Action Details:</strong><br>';
    if (action.cost > 0) {
        detailsHtml += `💸 Cost: $${formatCurrency(action.cost)}<br>`;
    }
    if (action.potentialGain) {
        detailsHtml += `💰 Potential Gain: ${(action.potentialGain * 100).toFixed(1)}%<br>`;
    }
    if (action.legalRisk) {
        detailsHtml += `⚖️ Legal Risk: ${action.legalRisk > 0 ? '+' : ''}${action.legalRisk}<br>`;
    }
    if (action.reputationCost) {
        detailsHtml += `📉 Reputation: ${action.reputationCost > 0 ? '+' : ''}${action.reputationCost}<br>`;
    }
    detailsHtml += `🎯 Success Chance: ${(successChance * 100).toFixed(0)}%`;
    
    document.getElementById('opportunity-details').innerHTML = detailsHtml;
    
    // Set risk info
    const riskInfo = document.getElementById('opportunity-risk-info');
    if (action.category === 'Illegal') {
        riskInfo.className = 'risk-high';
        riskInfo.innerHTML = '🚨 <strong>ILLEGAL ACTION</strong><br>Legal consequences if caught!';
    } else {
        riskInfo.className = 'risk-low';
        riskInfo.innerHTML = '✅ <strong>LEGAL ACTION</strong><br>Legitimate business activity.';
    }
    
    // Set choices
    const choicesHtml = `
        <button class="opportunity-choice-btn choice-accept" onclick="executeActionFromModal(${JSON.stringify(action).replace(/"/g, '&quot;')}, true)">
            ✅ Execute Action
        </button>
        <button class="opportunity-choice-btn choice-decline" onclick="closeOpportunityModal()">
            ❌ Cancel Action
        </button>
    `;
    
    document.getElementById('opportunity-choices').innerHTML = choicesHtml;
    
    // Show modal
    modal.style.display = 'block';
}

function executeActionFromModal(action, accepted) {
    if (!accepted) {
        closeOpportunityModal();
        return;
    }
    
    closeOpportunityModal();
    
    // Check if player can afford the action
    if (action.cost > 0 && gameState.cash < action.cost) {
        alert(`Insufficient funds! You need $${formatCurrency(action.cost)} but only have $${formatCurrency(gameState.cash)}.`);
        return;
    }
    
    // Calculate success
    let successChance = 0.7;
    if (action.category === 'Illegal') {
        successChance = 0.5;
        successChance -= (gameState.legalRisk / 100) * 0.3;
        successChance -= ((100 - gameState.reputation) / 100) * 0.2;
    } else {
        successChance += (gameState.reputation / 100) * 0.2;
        successChance += ((100 - gameState.legalRisk) / 100) * 0.1;
    }
    successChance = Math.max(0.1, Math.min(0.9, successChance));
    
    const isSuccess = Math.random() < successChance;
    
    // Execute the action with success/failure
    executeActionWithOutcome(action, isSuccess);
}

function executeActionWithOutcome(action, isSuccess) {
    let effects = [];
    let totalAmount = 0;
    
    if (isSuccess) {
        // Success - apply benefits and reduced costs
        if (action.cost > 0) {
            gameState.cash -= action.cost;
            totalAmount -= action.cost;
        }
        
        if (action.legalRisk) {
            const actualRisk = Math.floor(action.legalRisk * 0.7); // Reduced on success
            gameState.legalRisk += actualRisk;
            effects.push(`⚖️ Legal Risk: ${actualRisk > 0 ? '+' : ''}${actualRisk}`);
        }
        
        if (action.reputationCost) {
            const actualRepCost = Math.floor(action.reputationCost * 0.5); // Reduced on success
            gameState.reputation -= actualRepCost;
            effects.push(`📉 Reputation: ${actualRepCost > 0 ? '-' : '+'}${Math.abs(actualRepCost)}`);
        }
        
        if (action.potentialGain) {
            const gain = gameState.cash * action.potentialGain;
            gameState.cash += gain;
            totalAmount += gain;
        }
        
        const amountText = totalAmount !== 0 ? 
            (totalAmount > 0 ? `+$${formatCurrency(totalAmount)}` : `-$${formatCurrency(Math.abs(totalAmount))}`) : 
            null;
        
        showSuccessToast(
            'Action Successful!',
            `${action.title} completed successfully.`,
            amountText,
            effects.join(' • ')
        );
        
    } else {
        // Failure - heavy penalties
        if (action.cost > 0) {
            gameState.cash -= action.cost;
            totalAmount -= action.cost;
        }
        
        if (action.legalRisk) {
            const actualRisk = Math.floor(action.legalRisk * 1.5); // Increased on failure
            gameState.legalRisk += actualRisk;
            effects.push(`⚖️ Legal Risk: ${actualRisk > 0 ? '+' : ''}${actualRisk}`);
        }
        
        if (action.reputationCost) {
            const actualRepCost = Math.floor(action.reputationCost * 1.3); // Increased on failure
            gameState.reputation -= actualRepCost;
            effects.push(`📉 Reputation: ${actualRepCost > 0 ? '-' : '+'}${Math.abs(actualRepCost)}`);
        }
        
        // Additional penalty for failure
        const penalty = Math.min(gameState.cash * 0.05, 10000);
        gameState.cash = Math.max(1000, gameState.cash - penalty);
        totalAmount -= penalty;
        effects.push(`💸 Penalty: $${formatCurrency(penalty)}`);
        
        const amountText = totalAmount !== 0 ? `-$${formatCurrency(Math.abs(totalAmount))}` : null;
        
        showFailureToast(
            'Action Failed!',
            `${action.title} backfired with consequences.`,
            amountText,
            effects.join(' • ')
        );
    }
    
    // Clamp values
    gameState.legalRisk = Math.max(0, Math.min(100, gameState.legalRisk));
    gameState.reputation = Math.max(0, Math.min(100, gameState.reputation));
    
    updateDisplay();
}

// Update action timers
function updateActionTimers() {
    const actionButtons = document.querySelectorAll('.action-btn[data-expires]');
    let actionsRemoved = false;
    
    actionButtons.forEach(button => {
        const expiresAt = parseInt(button.dataset.expires);
        const now = Date.now();
        const timeLeft = Math.max(0, expiresAt - now);
        
        if (timeLeft <= 0) {
            // Action expired, remove it
            button.remove();
            actionsRemoved = true;
        } else {
            // Update timer display
            const secondsLeft = Math.ceil(timeLeft / 1000);
            const timerElement = button.querySelector('.action-timer');
            if (timerElement) {
                timerElement.textContent = `⏰ ${secondsLeft}s`;
                
                // Change color as time runs out
                if (secondsLeft <= 10) {
                    timerElement.style.color = '#dc143c';
                } else if (secondsLeft <= 20) {
                    timerElement.style.color = '#ffa500';
                }
            }
        }
    });
    
    // Update actions if any were removed
    if (actionsRemoved) {
        // Don't regenerate immediately, let the natural cycle handle it
    }
}

// Update action timers every second
setInterval(updateActionTimers, 1000);

// Toast Notification System
function showToast(type, title, content, amount = null, effects = null) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let toastHTML = `<div class="toast-title">${title}</div>`;
    toastHTML += `<div class="toast-content">${content}</div>`;
    
    if (amount !== null) {
        toastHTML += `<div class="toast-amount">${amount}</div>`;
    }
    
    if (effects) {
        toastHTML += `<div class="toast-effects">${effects}</div>`;
    }
    
    toast.innerHTML = toastHTML;
    container.appendChild(toast);
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300); // Wait for fade-out animation
    }, 2000);
}

function showSuccessToast(title, content, amount = null, effects = null) {
    showToast('success', '✅ ' + title, content, amount, effects);
}

function showFailureToast(title, content, amount = null, effects = null) {
    showToast('failure', '❌ ' + title, content, amount, effects);
}

function showInfoToast(title, content, amount = null, effects = null) {
    showToast('info', 'ℹ️ ' + title, content, amount, effects);
}

function handleIllegalOpportunityOutcome(opportunity, isSuccess) {
    let effects = [];
    let totalAmount = 0;
    
    if (isSuccess) {
        // Success - apply gains but still increase risk
        gameState.illegalActions++;
        const legalRiskIncrease = Math.floor(opportunity.legal_risk * 0.7);
        const reputationLoss = Math.floor(opportunity.reputation_cost * 0.5);
        
        gameState.legalRisk += legalRiskIncrease;
        gameState.reputation -= reputationLoss;
        
        effects.push(`⚖️ Legal Risk: +${legalRiskIncrease}`);
        effects.push(`📉 Reputation: -${reputationLoss}`);
        
        let gain = 0;
        if (opportunity.asset) {
            const asset = findAssetBySymbol(opportunity.asset);
            if (asset && gameState.portfolio[opportunity.asset]) {
                gain = gameState.portfolio[opportunity.asset] * asset.price * opportunity.potential_gain;
                gameState.cash += gain;
                totalAmount += gain;
            }
        } else if (opportunity.cost) {
            if (gameState.cash >= opportunity.cost) {
                gameState.cash -= opportunity.cost;
                gain = opportunity.cost * (opportunity.potential_gain || 0.5);
                gameState.cash += gain;
                totalAmount = gain - opportunity.cost;
            } else {
                showFailureToast('Insufficient Funds!', `Cannot afford ${opportunity.title}`, null, null);
                updateDisplay();
                return;
            }
        } else {
            gain = gameState.cash * (opportunity.potential_gain || 0.1);
            gameState.cash += gain;
            totalAmount += gain;
        }
        
        showSuccessToast(
            'Illegal Opportunity Success!',
            'You got away with it... this time!',
            `+$${formatCurrency(totalAmount)}`,
            effects.join(' • ')
        );
        
    } else {
        // Failure - heavy penalties
        gameState.illegalActions++;
        const legalRiskIncrease = Math.floor(opportunity.legal_risk * 1.5);
        const reputationLoss = Math.floor(opportunity.reputation_cost * 1.2);
        
        gameState.legalRisk += legalRiskIncrease;
        gameState.reputation -= reputationLoss;
        
        effects.push(`⚖️ Legal Risk: +${legalRiskIncrease}`);
        effects.push(`📉 Reputation: -${reputationLoss}`);
        
        // Potential financial loss
        const loss = (opportunity.cost || gameState.cash * 0.1) * Math.random() * 0.5;
        gameState.cash = Math.max(1000, gameState.cash - loss);
        totalAmount -= loss;
        
        showFailureToast(
            'Caught Red-Handed!',
            'Authorities are investigating your activities!',
            `-$${formatCurrency(loss)}`,
            effects.join(' • ')
        );
    }
    
    // Clamp values
    gameState.legalRisk = Math.min(100, Math.max(0, gameState.legalRisk));
    gameState.reputation = Math.min(100, Math.max(0, gameState.reputation));
    
    updateDisplay();
}

function handleLegalOpportunityOutcome(opportunity, isSuccess) {
    let effects = [];
    let totalAmount = 0;
    
    if (isSuccess) {
        // Success - apply benefits
        let gain = 0;
        
        if (opportunity.cost) {
            if (gameState.cash >= opportunity.cost) {
                gameState.cash -= opportunity.cost;
                gain = opportunity.cost * (opportunity.potential_gain || 0.2);
                gameState.cash += gain;
                totalAmount = gain - opportunity.cost;
            } else {
                showFailureToast('Insufficient Funds!', `Cannot afford ${opportunity.title}`, null, null);
                return;
            }
        } else {
            gain = gameState.cash * (opportunity.potential_gain || 0.1);
            gameState.cash += gain;
            totalAmount += gain;
        }
        
        // Bonus reputation for successful legal activities
        const reputationBonus = Math.floor(Math.random() * 5) + 2;
        gameState.reputation = Math.min(100, gameState.reputation + reputationBonus);
        effects.push(`📈 Reputation: +${reputationBonus}`);
        
        showSuccessToast(
            'Business Success!',
            'Professional success enhances your market standing!',
            `+$${formatCurrency(totalAmount)}`,
            effects.join(' • ')
        );
        
    } else {
        // Failure - moderate losses
        const loss = (opportunity.cost || gameState.cash * 0.05) * (opportunity.potential_loss || 0.3);
        gameState.cash = Math.max(1000, gameState.cash - loss);
        totalAmount -= loss;
        
        // Small reputation hit for failed business ventures
        const reputationLoss = Math.floor(Math.random() * 3) + 1;
        gameState.reputation = Math.max(0, gameState.reputation - reputationLoss);
        effects.push(`📉 Reputation: -${reputationLoss}`);
        
        showFailureToast(
            'Business Setback',
            'Market conditions weren\'t favorable this time.',
            `-$${formatCurrency(loss)}`,
            effects.join(' • ')
        );
    }
    
    updateDisplay();
}

function showIllegalOpportunity(type) {
    const opportunity = ILLEGAL_OPPORTUNITIES.find(op => op.type === type);
    if (opportunity) {
        showIllegalOpportunityModal(opportunity);
    }
}

function showIllegalOpportunityModal(opportunity) {
    const confirmed = confirm(`${opportunity.title}\n\n${opportunity.description}\n\nPotential gain: ${(opportunity.potential_gain * 100).toFixed(1)}%\nLegal risk: +${opportunity.legal_risk}\nReputation cost: -${opportunity.reputation_cost}\n\nProceed?`);
    
    if (confirmed) {
        executeIllegalAction(opportunity);
    }
}

function executeIllegalAction(opportunity) {
    gameState.illegalActions++;
    gameState.legalRisk += opportunity.legal_risk;
    gameState.reputation -= opportunity.reputation_cost;
    
    // Apply gains if successful
    if (opportunity.asset) {
        const asset = findAssetBySymbol(opportunity.asset);
        if (asset && gameState.portfolio[opportunity.asset]) {
            const gain = gameState.portfolio[opportunity.asset] * asset.price * opportunity.potential_gain;
            gameState.cash += gain;
        }
    } else if (opportunity.cost) {
        gameState.cash -= opportunity.cost;
    }
    
    // Clamp values
    gameState.legalRisk = Math.min(100, gameState.legalRisk);
    gameState.reputation = Math.max(0, gameState.reputation);
    
    updateDisplay();
    
    alert(`Action completed! You've gained money but increased your legal risk and damaged your reputation.`);
}

function checkForInvestigation() {
    if (gameState.investigationActive) return;
    
    let shouldInvestigate = false;
    let charges = [];
    
    // Check triggers
    if (gameState.legalRisk > 70 && Math.random() < 0.8) {
        shouldInvestigate = true;
        charges = ['Suspicious trading patterns', 'Potential market manipulation'];
    } else if (gameState.reputation < 30 && Math.random() < 0.6) {
        shouldInvestigate = true;
        charges = ['Public complaints', 'Ethical violations'];
    } else if (gameState.illegalActions > 3 && Math.random() < 0.9) {
        shouldInvestigate = true;
        charges = ['Multiple securities violations', 'Pattern of illegal activity'];
    } else if (Math.random() < 0.05) {
        shouldInvestigate = true;
        charges = ['Routine audit', 'Random compliance check'];
    }
    
    if (shouldInvestigate) {
        startInvestigation(charges);
    }
}

function startInvestigation(charges) {
    gameState.investigationActive = true;
    
    const modal = document.getElementById('investigation-modal');
    const chargesList = document.getElementById('charges-list');
    
    chargesList.innerHTML = '<strong>Charges:</strong><br>' + charges.join('<br>');
    
    document.getElementById('defense-statement').value = '';
    modal.style.display = 'block';
    
    // Game automatically pauses during investigation
    console.log('Investigation started - game paused');
}

async function submitDefense() {
    const defense = document.getElementById('defense-statement').value.trim();
    
    if (!defense) {
        alert('Please provide a defense statement.');
        return;
    }
    
    // Here you would integrate with the AI API (Zephyr-7b-beta)
    // For now, we'll simulate the AI response
    const aiVerdict = await simulateAIJudgment(defense);
    
    handleInvestigationResult(aiVerdict);
}

async function simulateAIJudgment(defense) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple scoring based on defense length, legal risk, and reputation
    let score = 0;
    
    // Defense quality (length and keywords)
    if (defense.length > 100) score += 20;
    if (defense.toLowerCase().includes('legal') || defense.toLowerCase().includes('compliance')) score += 15;
    if (defense.toLowerCase().includes('mistake') || defense.toLowerCase().includes('error')) score += 10;
    
    // Player stats influence
    score += Math.max(0, gameState.reputation - 50);
    score -= Math.max(0, gameState.legalRisk - 50);
    score -= gameState.illegalActions * 10;
    
    // Random factor
    score += (Math.random() - 0.5) * 30;
    
    return {
        guilty: score < 30,
        confidence: Math.abs(score - 50) / 50,
        reasoning: score < 30 ? 
            "The evidence suggests a pattern of illegal activity that cannot be adequately explained." :
            "While concerning, the defense provides reasonable doubt about intentional wrongdoing."
    };
}

function handleInvestigationResult(verdict) {
    gameState.investigationActive = false;
    
    if (verdict.guilty) {
        // Penalties
        const fine = Math.min(gameState.cash * 0.3, 500000);
        gameState.cash -= fine;
        gameState.reputation = Math.max(0, gameState.reputation - 30);
        gameState.legalRisk = Math.max(0, gameState.legalRisk - 20); // Some relief after punishment
        
        alert(`GUILTY: You've been fined $${formatCurrency(fine)} and your reputation has been severely damaged.\n\nAI Reasoning: ${verdict.reasoning}`);
    } else {
        // Acquittal
        gameState.reputation = Math.min(100, gameState.reputation + 10);
        gameState.legalRisk = Math.max(0, gameState.legalRisk - 15);
        
        alert(`NOT GUILTY: You've been cleared of charges! Your reputation has improved.\n\nAI Reasoning: ${verdict.reasoning}`);
    }
    
    closeModal();
    updateDisplay();
    
    // Resume game after investigation
    console.log('Investigation ended - game resumed');
}

function showLegalOpportunityModal(opportunity) {
    const confirmed = confirm(`${opportunity.title}\n\n${opportunity.description}\n\nThis is a legal opportunity with potential risks and rewards.\n\nProceed?`);
    
    if (confirmed) {
        executeLegalAction(opportunity);
    }
}

function executeLegalAction(opportunity) {
    // Handle different types of legal opportunities
    if (opportunity.cost && gameState.cash < opportunity.cost) {
        alert('Insufficient funds for this opportunity!');
        return;
    }
    
    if (opportunity.cost) {
        gameState.cash -= opportunity.cost;
    }
    
    // Apply effects based on opportunity type
    if (opportunity.type === 'margin_trading' || opportunity.type === 'crypto_leverage' || opportunity.type === 'forex_leverage') {
        alert(`Leverage trading enabled! Your next trades will have ${opportunity.multiplier}:1 leverage.`);
    } else if (opportunity.type === 'ipo_access' || opportunity.type === 'private_equity' || opportunity.type === 'venture_capital') {
        // Simulate investment outcome
        const success = Math.random() > 0.4;
        if (success) {
            const gain = opportunity.cost * opportunity.potential_gain;
            gameState.cash += gain;
            alert(`Investment was successful! You gained $${formatCurrency(gain)}`);
        } else {
            const loss = opportunity.cost * opportunity.potential_loss;
            gameState.cash = Math.max(0, gameState.cash - loss);
            alert(`Investment failed. You lost $${formatCurrency(loss)}`);
        }
    } else if (opportunity.type.includes('futures') || opportunity.type.includes('options')) {
        // Simulate futures/options outcome
        const success = Math.random() > 0.45;
        if (success) {
            const gain = gameState.cash * opportunity.potential_gain;
            gameState.cash += gain;
            alert(`Trade was profitable! You gained $${formatCurrency(gain)}`);
        } else {
            const loss = gameState.cash * opportunity.potential_loss;
            gameState.cash = Math.max(1000, gameState.cash - loss);
            alert(`Trade went against you. You lost $${formatCurrency(loss)}`);
        }
    } else {
        // Generic investment outcome
        const success = Math.random() > 0.5;
        if (success) {
            const gain = (opportunity.cost || gameState.cash * 0.1) * (opportunity.potential_gain || 0.15);
            gameState.cash += gain;
            alert(`Opportunity paid off! You gained $${formatCurrency(gain)}`);
        } else {
            const loss = (opportunity.cost || gameState.cash * 0.1) * (opportunity.potential_loss || 0.10);
            gameState.cash = Math.max(1000, gameState.cash - loss);
            alert(`Opportunity didn't work out. You lost $${formatCurrency(loss)}`);
        }
    }
    
    updateDisplay();
}

function showInteractiveEvent(event, element) {
    // Remove the opportunity from display
    element.remove();
    
    // Update panel size after removal
    updateOpportunitiesPanelSize();
    
    // Show interactive event in modal
    showInteractiveEventModal(event);
}

function showInteractiveEventModal(event) {
    const modal = document.getElementById('opportunity-modal');
    
    // Set modal content for interactive event
    document.getElementById('opportunity-modal-title').textContent = event.title;
    document.getElementById('opportunity-description').textContent = event.description;
    document.getElementById('opportunity-details').innerHTML = '<strong>Choose your response:</strong>';
    
    // Set risk info
    const riskInfo = document.getElementById('opportunity-risk-info');
    riskInfo.className = 'risk-high';
    riskInfo.innerHTML = '⚠️ <strong>CRITICAL DECISION REQUIRED</strong><br>Your choice will have consequences!';
    
    // Set choices
    let choicesHtml = '';
    event.choices.forEach((choice, index) => {
        let choiceClass = 'opportunity-choice-btn';
        let choiceIcon = '🔸';
        
        // Add visual indicators based on choice effects
        if (choice.legal_risk && choice.legal_risk > 20) {
            choiceIcon = '🚨';
        } else if (choice.reputation_cost && choice.reputation_cost > 15) {
            choiceIcon = '📉';
        } else if (choice.cost && choice.cost > 50000) {
            choiceIcon = '💸';
        } else if (choice.potential_gain && choice.potential_gain > 0.2) {
            choiceIcon = '💰';
        }
        
        choicesHtml += `
            <button class="${choiceClass}" onclick="executeInteractiveChoice(${JSON.stringify(event).replace(/"/g, '&quot;')}, ${index})">
                ${choiceIcon} ${choice.text}
            </button>
        `;
    });
    
    document.getElementById('opportunity-choices').innerHTML = choicesHtml;
    
    // Show modal
    modal.style.display = 'block';
}

function executeInteractiveChoice(event, choiceIndex) {
    closeOpportunityModal();
    handleEventChoice(event, choiceIndex);
}

function updateOpportunityTimers() {
    const opportunities = document.querySelectorAll('.opportunity-timer');
    let opportunitiesRemoved = false;
    
    opportunities.forEach(timer => {
        const expiresAt = parseInt(timer.dataset.expires);
        const now = Date.now();
        const timeLeft = Math.max(0, expiresAt - now);
        
        if (timeLeft <= 0) {
            // Opportunity expired, remove it
            timer.parentElement.remove();
            opportunitiesRemoved = true;
        } else {
            // Update timer display
            const secondsLeft = Math.ceil(timeLeft / 1000);
            timer.textContent = `⏰ ${secondsLeft}s`;
            
            // Change color as time runs out
            if (secondsLeft <= 10) {
                timer.style.color = '#dc143c';
                timer.style.fontWeight = 'bold';
            } else if (secondsLeft <= 20) {
                timer.style.color = '#ffa500';
            }
        }
    });
    
    // Update panel size if opportunities were removed
    if (opportunitiesRemoved) {
        updateOpportunitiesPanelSize();
    }
}

// Update timers every second
setInterval(updateOpportunityTimers, 1000);

// Dynamic Actions System
function updateDynamicActions() {
    const legalContainer = document.getElementById('legal-actions-list');
    const illegalContainer = document.getElementById('illegal-actions-list');
    const section = document.getElementById('actions-section');
    
    // Clear existing actions
    legalContainer.innerHTML = '';
    illegalContainer.innerHTML = '';
    
    const availableActions = getAvailableActions();
    
    // Separate actions into legal and illegal
    const legalActions = availableActions.filter(action => 
        ['Legal', 'Trading', 'Desperate'].includes(action.category)
    );
    const illegalActions = availableActions.filter(action => 
        action.category === 'Illegal'
    );
    
    const totalActionCount = availableActions.length;
    
    // Update section classes based on total actions
    section.classList.remove('no-actions', 'few-actions', 'many-actions');
    
    if (totalActionCount === 0) {
        section.classList.add('no-actions');
    } else if (totalActionCount <= 4) {
        section.classList.add('few-actions');
    } else {
        section.classList.add('many-actions');
    }
    
    // Populate legal actions
    if (legalActions.length === 0) {
        legalContainer.innerHTML = '<div class="no-actions-message">No legal actions available</div>';
    } else {
        legalActions.forEach(action => {
            const button = createActionButton(action);
            legalContainer.appendChild(button);
        });
    }
    
    // Populate illegal actions
    if (illegalActions.length === 0) {
        illegalContainer.innerHTML = '<div class="no-actions-message">No illegal actions available</div>';
    } else {
        illegalActions.forEach(action => {
            const button = createActionButton(action);
            illegalContainer.appendChild(button);
        });
    }
}

function getAvailableActions() {
    const actions = [];
    const netWorth = gameState.cash + calculatePortfolioValue();
    const portfolioSize = Object.keys(gameState.portfolio).length;
    
    // Basic illegal actions (always available but with conditions)
    if (gameState.legalRisk < 80) {
        actions.push({
            id: 'insider-trading',
            title: 'Insider Trading',
            description: 'Use non-public information for profit',
            category: 'Illegal',
            risk: 'high',
            enabled: portfolioSize > 0 || gameState.cash > 10000,
            disabledReason: 'Need investments or more cash',
            cost: 0,
            legalRisk: 25,
            reputationCost: 15,
            potentialGain: 0.15,
            duration: 45000 // 45 seconds
        });
        
        actions.push({
            id: 'market-manipulation',
            title: 'Market Manipulation',
            description: 'Spread false information to move prices',
            category: 'Illegal',
            risk: 'high',
            enabled: gameState.reputation > 20,
            disabledReason: 'Reputation too low',
            cost: 0,
            legalRisk: 20,
            reputationCost: 20,
            potentialGain: 0.08,
            duration: 60000 // 60 seconds
        });
    }
    
    // Money laundering (high net worth)
    if (netWorth > 500000 && gameState.legalRisk > 30) {
        actions.push({
            id: 'money-laundering',
            title: 'Money Laundering',
            description: 'Hide illegal profits through complex transactions',
            category: 'Illegal',
            risk: 'extreme',
            enabled: true,
            cost: 50000,
            legalRisk: -15,
            reputationCost: 10,
            duration: 30000 // 30 seconds
        });
    }
    
    // Bribery (high cash, high legal risk)
    if (gameState.cash > 100000 && gameState.legalRisk > 40) {
        actions.push({
            id: 'bribery',
            title: 'Bribe Officials',
            description: 'Pay off regulators to reduce scrutiny',
            category: 'Illegal',
            risk: 'extreme',
            enabled: true,
            cost: 100000,
            legalRisk: -25,
            reputationCost: 20,
            duration: 20000 // 20 seconds
        });
    }
    
    // Legal actions
    if (gameState.reputation > 50) {
        actions.push({
            id: 'networking',
            title: 'Business Networking',
            description: 'Build professional relationships',
            category: 'Legal',
            risk: 'none',
            enabled: true,
            cost: 5000,
            reputationCost: -5,
            duration: 90000 // 90 seconds
        });
    }
    
    if (gameState.cash > 50000) {
        actions.push({
            id: 'hire-advisor',
            title: 'Hire Financial Advisor',
            description: 'Get professional investment advice',
            category: 'Legal',
            risk: 'none',
            enabled: true,
            cost: 50000,
            reputationCost: -3,
            duration: 120000 // 2 minutes
        });
    }
    
    if (gameState.legalRisk > 60) {
        actions.push({
            id: 'hire-lawyer',
            title: 'Hire Defense Lawyer',
            description: 'Prepare for potential legal troubles',
            category: 'Legal',
            risk: 'none',
            enabled: gameState.cash > 25000,
            disabledReason: 'Need $25,000 minimum',
            cost: 25000,
            legalRisk: -10,
            duration: 75000 // 75 seconds
        });
    }
    
    // Reputation management
    if (gameState.reputation < 70) {
        actions.push({
            id: 'charity-donation',
            title: 'Charity Donation',
            description: 'Improve public image through philanthropy',
            category: 'Legal',
            risk: 'none',
            enabled: gameState.cash > 10000,
            disabledReason: 'Need $10,000 minimum',
            cost: 10000,
            reputationCost: -8,
            duration: 60000 // 60 seconds
        });
    }
    
    // Emergency actions
    if (gameState.legalRisk > 80) {
        actions.push({
            id: 'flee-country',
            title: 'Flee Country',
            description: 'Escape to non-extradition country',
            category: 'Desperate',
            risk: 'extreme',
            enabled: gameState.cash > 1000000,
            disabledReason: 'Need $1M minimum'
        });
    }
    
    if (netWorth < 5000) {
        actions.push({
            id: 'desperate-loan',
            title: 'Desperate Loan',
            description: 'Borrow money at terrible rates',
            category: 'Desperate',
            risk: 'high',
            enabled: true
        });
    }
    
    // Market-specific actions
    const isMarketHours = gameState.hour >= 9 && gameState.hour <= 17;
    if (isMarketHours && portfolioSize > 0) {
        actions.push({
            id: 'panic-sell',
            title: 'Panic Sell All',
            description: 'Liquidate entire portfolio immediately',
            category: 'Trading',
            risk: 'moderate',
            enabled: true
        });
    }
    
    if (gameState.cash > 100000) {
        actions.push({
            id: 'all-in-bet',
            title: 'All-In Bet',
            description: 'Risk everything on a single trade',
            category: 'Trading',
            risk: 'extreme',
            enabled: isMarketHours,
            disabledReason: 'Market is closed'
        });
    }
    
    return actions;
}

function groupActionsByCategory(actions) {
    const grouped = {};
    actions.forEach(action => {
        if (!grouped[action.category]) {
            grouped[action.category] = [];
        }
        grouped[action.category].push(action);
    });
    return grouped;
}

function createActionButton(action) {
    const button = document.createElement('button');
    button.className = 'action-btn';
    
    // Add expiration time
    const expiresAt = Date.now() + action.duration;
    button.dataset.expires = expiresAt;
    
    // Add risk-based styling
    if (action.category === 'Illegal') {
        if (action.risk === 'extreme') {
            button.style.background = 'linear-gradient(180deg, #ff4444 0%, #cc0000 100%)';
            button.style.color = 'white';
        } else {
            button.style.background = 'linear-gradient(180deg, #ffb6c1 0%, #dc143c 100%)';
            button.style.color = 'white';
        }
    } else {
        if (action.risk === 'extreme') {
            button.style.background = 'linear-gradient(180deg, #ffb347 0%, #ff8c00 100%)';
            button.style.color = 'white';
        } else if (action.risk === 'moderate') {
            button.style.background = 'linear-gradient(180deg, #fff8dc 0%, #ffa500 100%)';
            button.style.color = '#8b4513';
        } else {
            button.style.background = 'linear-gradient(180deg, #e8f8e8 0%, #90ee90 100%)';
            button.style.color = '#006400';
        }
    }
    
    // Disable if not enabled
    if (!action.enabled) {
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
        button.title = action.disabledReason || 'Not available';
    } else {
        button.title = action.description;
    }
    
    // Set button content with costs and timer
    const riskIcon = {
        'none': '✅',
        'moderate': '⚠️',
        'high': '🚨',
        'extreme': '💀'
    };
    
    // Truncate long titles for better fit
    let displayTitle = action.title;
    if (displayTitle.length > 10) {
        displayTitle = displayTitle.substring(0, 10) + '...';
    }
    
    let costText = '';
    if (action.cost > 0) {
        costText = `<div class="action-cost">💸 $${formatCurrency(action.cost)}</div>`;
    }
    
    let consequenceText = '';
    if (action.legalRisk) {
        consequenceText += `⚖️${action.legalRisk > 0 ? '+' : ''}${action.legalRisk} `;
    }
    if (action.reputationCost) {
        consequenceText += `📉${action.reputationCost > 0 ? '+' : ''}${action.reputationCost}`;
    }
    if (consequenceText) {
        consequenceText = `<div class="action-consequence">${consequenceText}</div>`;
    }
    
    const timerSeconds = Math.ceil(action.duration / 1000);
    
    button.innerHTML = `
        <div>${riskIcon[action.risk] || '🔸'} ${displayTitle}</div>
        ${costText}
        ${consequenceText}
        <div class="action-timer">⏰ ${timerSeconds}s</div>
    `;
    
    // Add click handler to open modal
    if (action.enabled) {
        button.onclick = () => showActionModal(action, button);
    }
    
    return button;
}

function executeAction(action) {
    let resultMessage = `${action.title}\n\n${action.description}\n\n`;
    
    switch (action.id) {
        case 'insider-trading':
            showIllegalOpportunity('insider_trading');
            return;
            
        case 'market-manipulation':
            showIllegalOpportunity('market_manipulation');
            return;
            
        case 'money-laundering':
            if (gameState.cash >= 50000) {
                gameState.cash -= 50000;
                gameState.legalRisk = Math.max(0, gameState.legalRisk - 15);
                gameState.reputation -= 10;
                resultMessage += '✅ Successfully laundered money through offshore accounts.\n';
                resultMessage += '💸 Cost: $50,000\n⚖️ Legal Risk: -15\n📉 Reputation: -10';
            }
            break;
            
        case 'bribery':
            if (gameState.cash >= 100000) {
                gameState.cash -= 100000;
                gameState.legalRisk = Math.max(0, gameState.legalRisk - 25);
                gameState.reputation -= 20;
                resultMessage += '✅ Officials have been "convinced" to look the other way.\n';
                resultMessage += '💸 Cost: $100,000\n⚖️ Legal Risk: -25\n📉 Reputation: -20';
            }
            break;
            
        case 'networking':
            gameState.reputation = Math.min(100, gameState.reputation + 5);
            resultMessage += '✅ Made valuable business connections.\n📈 Reputation: +5';
            break;
            
        case 'hire-advisor':
            if (gameState.cash >= 50000) {
                gameState.cash -= 50000;
                gameState.reputation = Math.min(100, gameState.reputation + 3);
                // Add temporary boost to success rates (could be implemented)
                resultMessage += '✅ Hired top-tier financial advisor.\n';
                resultMessage += '💸 Cost: $50,000\n📈 Reputation: +3\n🎯 Better investment advice unlocked!';
            }
            break;
            
        case 'hire-lawyer':
            if (gameState.cash >= 25000) {
                gameState.cash -= 25000;
                gameState.legalRisk = Math.max(0, gameState.legalRisk - 10);
                resultMessage += '✅ Retained experienced defense attorney.\n';
                resultMessage += '💸 Cost: $25,000\n⚖️ Legal Risk: -10\n🛡️ Better prepared for investigations!';
            }
            break;
            
        case 'charity-donation':
            const donation = Math.min(gameState.cash * 0.1, 100000);
            gameState.cash -= donation;
            gameState.reputation = Math.min(100, gameState.reputation + 8);
            resultMessage += '✅ Made generous charitable donation.\n';
            resultMessage += `💸 Donated: $${formatCurrency(donation)}\n📈 Reputation: +8`;
            break;
            
        case 'flee-country':
            if (gameState.cash >= 1000000) {
                resultMessage += '✈️ You have fled to a non-extradition country!\n';
                resultMessage += 'Game Over - You escaped but lost everything in your home country.';
                // Could implement game over state
            }
            break;
            
        case 'desperate-loan':
            const loanAmount = 50000;
            gameState.cash += loanAmount;
            gameState.reputation -= 5;
            resultMessage += '💰 Received emergency loan from loan sharks.\n';
            resultMessage += `💸 Received: $${formatCurrency(loanAmount)}\n📉 Reputation: -5\n⚠️ High interest rates apply!`;
            break;
            
        case 'panic-sell':
            let totalSold = 0;
            Object.entries(gameState.portfolio).forEach(([symbol, quantity]) => {
                const asset = findAssetBySymbol(symbol);
                if (asset) {
                    totalSold += asset.price * quantity;
                }
            });
            gameState.cash += totalSold;
            gameState.portfolio = {};
            gameState.reputation -= 3;
            resultMessage += '📉 Panic sold entire portfolio!\n';
            resultMessage += `💰 Received: $${formatCurrency(totalSold)}\n📉 Reputation: -3`;
            break;
            
        case 'all-in-bet':
            // Pick a random volatile asset
            const volatileAssets = [...gameState.currentMarketData.crypto, ...gameState.currentMarketData.stocks.filter(s => ['TSLA', 'GME', 'AMC'].includes(s.symbol))];
            const randomAsset = volatileAssets[Math.floor(Math.random() * volatileAssets.length)];
            const success = Math.random() > 0.5;
            
            if (success) {
                const gain = gameState.cash * 0.5;
                gameState.cash += gain;
                resultMessage += `🎰 ALL-IN BET WON!\n💰 Gained: $${formatCurrency(gain)}\n🎯 Bet on ${randomAsset.symbol}`;
            } else {
                const loss = gameState.cash * 0.7;
                gameState.cash = Math.max(1000, gameState.cash - loss);
                resultMessage += `💥 ALL-IN BET LOST!\n💸 Lost: $${formatCurrency(loss)}\n📉 Bet on ${randomAsset.symbol}`;
            }
            break;
            
        default:
            resultMessage += 'Action not implemented yet.';
    }
    
    // Clamp values
    gameState.legalRisk = Math.max(0, Math.min(100, gameState.legalRisk));
    gameState.reputation = Math.max(0, Math.min(100, gameState.reputation));
    
    alert(resultMessage);
    updateDisplay();
}

function handleEventChoice(event, choiceIndex) {
    const choice = event.choices[choiceIndex];
    let resultMessage = `You chose: ${choice.text}\n\n`;
    
    // Apply choice effects
    if (choice.cost) {
        if (choice.cost > 0 && gameState.cash < choice.cost) {
            alert('Insufficient funds for this choice!');
            return;
        }
        gameState.cash -= choice.cost;
        if (choice.cost > 0) {
            resultMessage += `Cost: $${formatCurrency(choice.cost)}\n`;
        } else {
            resultMessage += `Gained: $${formatCurrency(-choice.cost)}\n`;
        }
    }
    
    if (choice.legal_risk) {
        gameState.legalRisk += choice.legal_risk;
        gameState.legalRisk = Math.max(0, Math.min(100, gameState.legalRisk));
        resultMessage += `Legal Risk: ${choice.legal_risk > 0 ? '+' : ''}${choice.legal_risk}\n`;
    }
    
    if (choice.reputation_cost) {
        gameState.reputation -= choice.reputation_cost;
        gameState.reputation = Math.max(0, Math.min(100, gameState.reputation));
        resultMessage += `Reputation: ${choice.reputation_cost > 0 ? '-' : '+'}${Math.abs(choice.reputation_cost)}\n`;
    }
    
    if (choice.potential_gain || choice.potential_loss) {
        const success = Math.random() > 0.5;
        if (success && choice.potential_gain) {
            const gain = gameState.cash * choice.potential_gain;
            gameState.cash += gain;
            resultMessage += `Success! Gained: $${formatCurrency(gain)}\n`;
        } else if (!success && choice.potential_loss) {
            const loss = gameState.cash * choice.potential_loss;
            gameState.cash = Math.max(1000, gameState.cash - loss);
            resultMessage += `Failed! Lost: $${formatCurrency(loss)}\n`;
        }
    }
    
    // Handle special cost types (like percentage of assets)
    if (typeof choice.cost === 'number' && choice.cost > 0 && choice.cost < 1) {
        const assetLoss = gameState.cash * choice.cost;
        gameState.cash -= assetLoss;
        resultMessage += `Asset division: Lost $${formatCurrency(assetLoss)}\n`;
    }
    
    // Show toast notification instead of alert
    showInfoToast(
        'Decision Made',
        'Your choice has been processed.',
        null,
        resultMessage.replace(/You chose:.*\n\n/, '').replace(/\n/g, ' • ')
    );
    updateDisplay();
}

// Utility functions
function findAssetBySymbol(symbol) {
    for (const category of ['stocks', 'crypto', 'commodities']) {
        const asset = gameState.currentMarketData[category].find(a => a.symbol === symbol);
        if (asset) return asset;
    }
    return null;
}

function calculatePortfolioValue() {
    let total = 0;
    Object.entries(gameState.portfolio).forEach(([symbol, quantity]) => {
        const asset = findAssetBySymbol(symbol);
        if (asset) {
            total += asset.price * quantity;
        }
    });
    return total;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}