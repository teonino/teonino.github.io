// Market data and game configuration
const MARKET_DATA = {
    stocks: [
        // Tech Giants - Mixed trends
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 0.025, trend: 'bullish', trendStrength: 0.6 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.80, change: -0.012, trend: 'stable', trendStrength: 0.3 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.30, change: 0.018, trend: 'bullish', trendStrength: 0.5 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3420.15, change: -0.008, trend: 'bearish', trendStrength: 0.4 },
        { symbol: 'META', name: 'Meta Platforms', price: 485.20, change: 0.032, trend: 'volatile', trendStrength: 0.8 },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: 425.80, change: -0.015, trend: 'bearish', trendStrength: 0.5 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.25, change: 0.067, trend: 'bullish', trendStrength: 0.9 },
        { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.35, change: 0.041, trend: 'bullish', trendStrength: 0.7 },
        { symbol: 'INTC', name: 'Intel Corp.', price: 43.75, change: -0.022, trend: 'bearish', trendStrength: 0.6 },
        { symbol: 'CRM', name: 'Salesforce Inc.', price: 267.90, change: 0.019, trend: 'stable', trendStrength: 0.4 },
        
        // Electric Vehicles & Energy - Mixed trends
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.60, change: 0.045, trend: 'volatile', trendStrength: 0.9 },
        { symbol: 'RIVN', name: 'Rivian Automotive', price: 18.45, change: -0.067, trend: 'bearish', trendStrength: 0.7 },
        { symbol: 'LCID', name: 'Lucid Group Inc.', price: 4.25, change: -0.089, trend: 'bearish', trendStrength: 0.8 },
        { symbol: 'NIO', name: 'NIO Inc.', price: 8.90, change: 0.034, trend: 'volatile', trendStrength: 0.6 },
        
        // Finance & Banking - Stable with slight bullish bias
        { symbol: 'JPM', name: 'JPMorgan Chase', price: 178.25, change: 0.012, trend: 'bullish', trendStrength: 0.4 },
        { symbol: 'BAC', name: 'Bank of America', price: 34.80, change: -0.008, trend: 'stable', trendStrength: 0.3 },
        { symbol: 'GS', name: 'Goldman Sachs', price: 387.50, change: 0.025, trend: 'bullish', trendStrength: 0.5 },
        { symbol: 'MS', name: 'Morgan Stanley', price: 95.40, change: 0.018, trend: 'stable', trendStrength: 0.4 },
        
        // Healthcare & Pharma - Defensive with growth potential
        { symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.75, change: 0.007, trend: 'stable', trendStrength: 0.3 },
        { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.90, change: -0.015, trend: 'bearish', trendStrength: 0.4 },
        { symbol: 'MRNA', name: 'Moderna Inc.', price: 67.80, change: 0.089, trend: 'volatile', trendStrength: 0.8 },
        { symbol: 'UNH', name: 'UnitedHealth Group', price: 542.30, change: 0.014, trend: 'bullish', trendStrength: 0.5 },
        
        // Retail & Consumer - Stable defensive plays
        { symbol: 'WMT', name: 'Walmart Inc.', price: 165.20, change: 0.009, trend: 'stable', trendStrength: 0.3 },
        { symbol: 'HD', name: 'Home Depot Inc.', price: 334.75, change: 0.021, trend: 'bullish', trendStrength: 0.4 },
        { symbol: 'MCD', name: 'McDonald\'s Corp.', price: 289.40, change: 0.006, trend: 'stable', trendStrength: 0.2 },
        { symbol: 'SBUX', name: 'Starbucks Corp.', price: 98.65, change: -0.012, trend: 'bearish', trendStrength: 0.3 },
        
        // Meme Stocks & Volatile - Extremely volatile
        { symbol: 'GME', name: 'GameStop Corp.', price: 15.75, change: 0.156, trend: 'volatile', trendStrength: 1.0 },
        { symbol: 'AMC', name: 'AMC Entertainment', price: 4.25, change: 0.234, trend: 'volatile', trendStrength: 1.0 },
        { symbol: 'BB', name: 'BlackBerry Ltd.', price: 2.85, change: -0.078, trend: 'bearish', trendStrength: 0.6 },
        { symbol: 'PLTR', name: 'Palantir Technologies', price: 22.40, change: 0.067, trend: 'volatile', trendStrength: 0.7 }
    ],
    crypto: [
        // Major Cryptocurrencies
        { symbol: 'BTC', name: 'Bitcoin', price: 67500.00, change: 0.032 },
        { symbol: 'ETH', name: 'Ethereum', price: 3850.75, change: 0.028 },
        { symbol: 'BNB', name: 'Binance Coin', price: 615.20, change: 0.019 },
        { symbol: 'XRP', name: 'Ripple', price: 0.62, change: -0.045 },
        { symbol: 'ADA', name: 'Cardano', price: 0.85, change: -0.034 },
        { symbol: 'SOL', name: 'Solana', price: 145.30, change: 0.078 },
        { symbol: 'DOGE', name: 'Dogecoin', price: 0.18, change: 0.123 },
        { symbol: 'MATIC', name: 'Polygon', price: 1.15, change: 0.056 },
        { symbol: 'DOT', name: 'Polkadot', price: 7.85, change: -0.023 },
        { symbol: 'AVAX', name: 'Avalanche', price: 42.60, change: 0.089 },
        { symbol: 'LINK', name: 'Chainlink', price: 18.75, change: 0.034 },
        { symbol: 'UNI', name: 'Uniswap', price: 9.40, change: -0.067 }
    ],
    commodities: [
        // Precious Metals
        { symbol: 'GOLD', name: 'Gold', price: 2045.80, change: 0.012 },
        { symbol: 'SILVER', name: 'Silver', price: 24.75, change: 0.018 },
        { symbol: 'PLAT', name: 'Platinum', price: 1025.40, change: -0.008 },
        { symbol: 'PALL', name: 'Palladium', price: 1875.60, change: 0.025 },
        
        // Energy
        { symbol: 'OIL', name: 'Crude Oil', price: 78.45, change: -0.025 },
        { symbol: 'NGAS', name: 'Natural Gas', price: 2.85, change: 0.067 },
        { symbol: 'COAL', name: 'Coal', price: 145.20, change: 0.034 },
        
        // Agriculture
        { symbol: 'WHEAT', name: 'Wheat', price: 6.85, change: 0.035 },
        { symbol: 'CORN', name: 'Corn', price: 4.95, change: -0.012 },
        { symbol: 'SOYB', name: 'Soybeans', price: 12.40, change: 0.028 },
        { symbol: 'COFF', name: 'Coffee', price: 1.85, change: 0.045 },
        { symbol: 'SUGA', name: 'Sugar', price: 0.22, change: -0.034 },
        
        // Industrial Metals
        { symbol: 'COPP', name: 'Copper', price: 4.25, change: 0.019 },
        { symbol: 'ALUM', name: 'Aluminum', price: 2.15, change: -0.015 },
        { symbol: 'ZINC', name: 'Zinc', price: 2.85, change: 0.023 }
    ]
};

// News events that affect market prices
const NEWS_EVENTS = [
    // Federal Reserve & Economic Policy
    {
        text: "Federal Reserve hints at interest rate cuts",
        effects: { stocks: 0.02, crypto: 0.015 }
    },
    {
        text: "Fed Chair announces aggressive rate hikes to combat inflation",
        effects: { stocks: -0.035, 'GOLD': 0.025, crypto: -0.045 }
    },
    {
        text: "Unemployment rate drops to historic lows",
        effects: { stocks: 0.018, 'JPM': 0.03, 'BAC': 0.025 }
    },
    {
        text: "GDP growth exceeds expectations by 2%",
        effects: { stocks: 0.025, commodities: 0.015 }
    },
    
    // Technology & AI
    {
        text: "Major tech company announces breakthrough in AI",
        effects: { 'NVDA': 0.08, 'GOOGL': 0.04, 'MSFT': 0.03, 'AMD': 0.05 }
    },
    {
        text: "New AI regulation bill proposed in Congress",
        effects: { 'GOOGL': -0.025, 'MSFT': -0.02, 'META': -0.03, 'NVDA': -0.04 }
    },
    {
        text: "Quantum computing breakthrough announced",
        effects: { 'IBM': 0.12, 'GOOGL': 0.06, 'MSFT': 0.04 }
    },
    {
        text: "Major data breach affects millions of users",
        effects: { 'META': -0.08, 'GOOGL': -0.04, stocks: -0.01 }
    },
    
    // Geopolitical Events
    {
        text: "Geopolitical tensions rise in Eastern Europe",
        effects: { 'GOLD': 0.05, 'OIL': 0.07, stocks: -0.02, 'NGAS': 0.09 }
    },
    {
        text: "Trade war escalates between major economies",
        effects: { stocks: -0.04, 'GOLD': 0.03, commodities: 0.02 }
    },
    {
        text: "Peace talks show promising progress",
        effects: { stocks: 0.03, 'OIL': -0.04, 'GOLD': -0.02 }
    },
    {
        text: "Sanctions imposed on major oil-producing nation",
        effects: { 'OIL': 0.15, 'NGAS': 0.12, 'GOLD': 0.04, stocks: -0.025 }
    },
    
    // Cryptocurrency & Digital Assets
    {
        text: "Cryptocurrency regulation bill passes committee",
        effects: { crypto: -0.06 }
    },
    {
        text: "Major bank announces crypto trading services",
        effects: { crypto: 0.08, 'JPM': 0.02, 'BAC': 0.015 }
    },
    {
        text: "Bitcoin ETF approved by SEC",
        effects: { 'BTC': 0.15, crypto: 0.08, stocks: 0.01 }
    },
    {
        text: "Major crypto exchange hacked, $500M stolen",
        effects: { crypto: -0.12, 'BTC': -0.08, 'ETH': -0.09 }
    },
    {
        text: "Central bank announces digital currency pilot",
        effects: { crypto: -0.04, 'BTC': -0.06, stocks: 0.01 }
    },
    
    // Climate & Energy
    {
        text: "Electric vehicle sales surge globally",
        effects: { 'TSLA': 0.09, 'RIVN': 0.12, 'LCID': 0.15, 'OIL': -0.03 }
    },
    {
        text: "New climate legislation passes Senate",
        effects: { 'TSLA': 0.06, 'NGAS': -0.04, 'COAL': -0.08, 'OIL': -0.02 }
    },
    {
        text: "Major oil discovery in offshore drilling",
        effects: { 'OIL': -0.05, 'NGAS': -0.03, 'TSLA': -0.02 }
    },
    {
        text: "Nuclear power plant accident raises safety concerns",
        effects: { 'OIL': 0.04, 'NGAS': 0.06, 'COAL': 0.08, stocks: -0.015 }
    },
    
    // Agriculture & Weather
    {
        text: "Drought concerns affect agricultural commodities",
        effects: { 'WHEAT': 0.12, 'CORN': 0.10, 'SOYB': 0.08, commodities: 0.03 }
    },
    {
        text: "Record harvest expected this season",
        effects: { 'WHEAT': -0.08, 'CORN': -0.06, 'SOYB': -0.07, 'SUGA': -0.05 }
    },
    {
        text: "Hurricane threatens major agricultural regions",
        effects: { 'WHEAT': 0.15, 'CORN': 0.18, 'SUGA': 0.12, 'COFF': 0.20 }
    },
    {
        text: "Coffee blight destroys crops in South America",
        effects: { 'COFF': 0.25, commodities: 0.02 }
    },
    
    // Healthcare & Pharma
    {
        text: "New pandemic variant detected globally",
        effects: { 'PFE': 0.08, 'MRNA': 0.12, 'JNJ': 0.06, stocks: -0.03 }
    },
    {
        text: "Breakthrough cancer treatment shows 90% success rate",
        effects: { 'JNJ': 0.15, 'PFE': 0.10, 'UNH': 0.05 }
    },
    {
        text: "FDA approves revolutionary gene therapy",
        effects: { 'MRNA': 0.18, 'JNJ': 0.08, 'PFE': 0.06 }
    },
    
    // Retail & Consumer
    {
        text: "Holiday shopping season breaks records",
        effects: { 'AMZN': 0.06, 'WMT': 0.04, 'HD': 0.05, stocks: 0.02 }
    },
    {
        text: "Supply chain disruptions affect major retailers",
        effects: { 'AMZN': -0.04, 'WMT': -0.03, 'HD': -0.05, stocks: -0.015 }
    },
    {
        text: "Consumer confidence hits 10-year high",
        effects: { stocks: 0.025, 'MCD': 0.03, 'SBUX': 0.04 }
    },
    
    // Meme Stock Events
    {
        text: "Reddit traders target another heavily shorted stock",
        effects: { 'GME': 0.25, 'AMC': 0.30, 'BB': 0.20, 'PLTR': 0.15 }
    },
    {
        text: "Short squeeze investigation launched by SEC",
        effects: { 'GME': -0.15, 'AMC': -0.18, 'BB': -0.12, stocks: -0.01 }
    },
    {
        text: "Meme stock mania returns to social media",
        effects: { 'GME': 0.35, 'AMC': 0.40, 'BB': 0.25, crypto: 0.05 }
    }
];

// Illegal opportunities and their consequences
const ILLEGAL_OPPORTUNITIES = [
    // Insider Trading
    {
        type: 'insider_trading',
        title: 'Hot Tip from Board Member',
        description: 'A friend on Apple\'s board hints at surprise earnings beat',
        potential_gain: 0.15,
        legal_risk: 25,
        reputation_cost: 15,
        asset: 'AAPL'
    },
    {
        type: 'insider_trading',
        title: 'Pharmaceutical Leak',
        description: 'Hospital contact reveals FDA approval coming tomorrow',
        potential_gain: 0.22,
        legal_risk: 35,
        reputation_cost: 20,
        asset: 'PFE'
    },
    {
        type: 'insider_trading',
        title: 'Merger Intelligence',
        description: 'Investment banker friend hints at upcoming acquisition',
        potential_gain: 0.18,
        legal_risk: 30,
        reputation_cost: 18,
        asset: 'TSLA'
    },
    {
        type: 'insider_trading',
        title: 'Earnings Whisper Network',
        description: 'Accounting firm employee shares quarterly numbers early',
        potential_gain: 0.12,
        legal_risk: 28,
        reputation_cost: 16,
        asset: 'GOOGL'
    },
    
    // Pump and Dump Schemes
    {
        type: 'pump_dump',
        title: 'Coordinate Social Media Campaign',
        description: 'Organize fake hype around a small crypto coin',
        potential_gain: 0.30,
        legal_risk: 35,
        reputation_cost: 25,
        asset: 'DOGE'
    },
    {
        type: 'pump_dump',
        title: 'Meme Stock Manipulation',
        description: 'Create fake DD posts to pump a struggling stock',
        potential_gain: 0.45,
        legal_risk: 40,
        reputation_cost: 30,
        asset: 'AMC'
    },
    {
        type: 'pump_dump',
        title: 'Penny Stock Scheme',
        description: 'Coordinate with others to artificially inflate small cap',
        potential_gain: 0.60,
        legal_risk: 45,
        reputation_cost: 35,
        asset: 'BB'
    },
    {
        type: 'pump_dump',
        title: 'Crypto Shill Campaign',
        description: 'Pay influencers to promote worthless altcoin',
        potential_gain: 0.80,
        legal_risk: 50,
        reputation_cost: 40,
        asset: 'ADA'
    },
    
    // Bribery and Corruption
    {
        type: 'bribery',
        title: 'Regulatory Information',
        description: 'Pay for advance notice of FDA drug approval',
        potential_gain: 0.25,
        legal_risk: 40,
        reputation_cost: 30,
        cost: 50000,
        asset: 'MRNA'
    },
    {
        type: 'bribery',
        title: 'Fed Meeting Minutes',
        description: 'Bribe staffer for early access to interest rate decisions',
        potential_gain: 0.20,
        legal_risk: 55,
        reputation_cost: 45,
        cost: 100000
    },
    {
        type: 'bribery',
        title: 'Commodity Report Access',
        description: 'Pay agriculture official for crop yield data',
        potential_gain: 0.18,
        legal_risk: 35,
        reputation_cost: 25,
        cost: 25000,
        asset: 'WHEAT'
    },
    {
        type: 'bribery',
        title: 'Energy Department Intel',
        description: 'Corrupt official provides oil reserve information',
        potential_gain: 0.22,
        legal_risk: 45,
        reputation_cost: 35,
        cost: 75000,
        asset: 'OIL'
    },
    
    // Market Manipulation
    {
        type: 'market_manipulation',
        title: 'Spread False Rumors',
        description: 'Plant fake news about competitor\'s financial troubles',
        potential_gain: 0.08,
        legal_risk: 20,
        reputation_cost: 20
    },
    {
        type: 'market_manipulation',
        title: 'Fake Analyst Reports',
        description: 'Create fraudulent research reports to move prices',
        potential_gain: 0.12,
        legal_risk: 30,
        reputation_cost: 25
    },
    {
        type: 'market_manipulation',
        title: 'Coordinated Short Attack',
        description: 'Organize group to simultaneously short and spread FUD',
        potential_gain: 0.15,
        legal_risk: 35,
        reputation_cost: 30
    },
    {
        type: 'market_manipulation',
        title: 'Spoofing Algorithm',
        description: 'Use fake orders to manipulate bid/ask spreads',
        potential_gain: 0.10,
        legal_risk: 40,
        reputation_cost: 20
    },
    
    // Money Laundering
    {
        type: 'money_laundering',
        title: 'Crypto Mixer Service',
        description: 'Use cryptocurrency to hide illegal trading profits',
        potential_gain: 0.05,
        legal_risk: 60,
        reputation_cost: 50,
        cost: 10000
    },
    {
        type: 'money_laundering',
        title: 'Offshore Shell Company',
        description: 'Route trades through untraceable foreign entities',
        potential_gain: 0.03,
        legal_risk: 45,
        reputation_cost: 40,
        cost: 50000
    },
    
    // Fraud
    {
        type: 'fraud',
        title: 'Fake Company IPO',
        description: 'Create shell company with fraudulent financials',
        potential_gain: 0.50,
        legal_risk: 70,
        reputation_cost: 60,
        cost: 200000
    },
    {
        type: 'fraud',
        title: 'Ponzi Investment Scheme',
        description: 'Promise unrealistic returns to attract new investors',
        potential_gain: 0.40,
        legal_risk: 65,
        reputation_cost: 55,
        cost: 100000
    }
];

// Legal opportunities (legitimate but risky)
const LEGAL_OPPORTUNITIES = [
    // Leverage and Margin Trading
    {
        type: 'margin_trading',
        title: 'High Leverage Opportunity',
        description: 'Bank offers 10:1 leverage on tech stocks',
        multiplier: 10,
        interest_rate: 0.08,
        legal_risk: 0,
        reputation_cost: 0
    },
    {
        type: 'crypto_leverage',
        title: 'Crypto Futures Trading',
        description: '50:1 leverage available on Bitcoin futures',
        multiplier: 50,
        interest_rate: 0.12,
        legal_risk: 0,
        reputation_cost: 0,
        asset: 'BTC'
    },
    {
        type: 'forex_leverage',
        title: 'Currency Trading Platform',
        description: '100:1 leverage on major currency pairs',
        multiplier: 100,
        interest_rate: 0.15,
        legal_risk: 0,
        reputation_cost: 0
    },
    
    // IPO and Private Investments
    {
        type: 'ipo_access',
        title: 'Pre-IPO Investment',
        description: 'Exclusive access to promising startup IPO',
        potential_gain: 0.40,
        potential_loss: 0.60,
        legal_risk: 0,
        reputation_cost: 0,
        cost: 100000
    },
    {
        type: 'private_equity',
        title: 'Private Equity Fund',
        description: 'Minimum $500K investment in tech-focused PE fund',
        potential_gain: 0.25,
        potential_loss: 0.30,
        legal_risk: 0,
        reputation_cost: 0,
        cost: 500000
    },
    {
        type: 'venture_capital',
        title: 'VC Syndicate Deal',
        description: 'Join accredited investor group for Series A round',
        potential_gain: 0.60,
        potential_loss: 0.80,
        legal_risk: 0,
        reputation_cost: 0,
        cost: 250000
    },
    
    // Commodities and Futures
    {
        type: 'commodity_futures',
        title: 'Oil Futures Contract',
        description: 'Bet on oil price movements with futures',
        potential_gain: 0.20,
        potential_loss: 0.25,
        legal_risk: 0,
        reputation_cost: 0,
        asset: 'OIL'
    },
    {
        type: 'gold_futures',
        title: 'Gold Futures Trading',
        description: 'Hedge against inflation with precious metals',
        potential_gain: 0.15,
        potential_loss: 0.18,
        legal_risk: 0,
        reputation_cost: 0,
        asset: 'GOLD'
    },
    {
        type: 'agricultural_futures',
        title: 'Wheat Futures Contract',
        description: 'Seasonal agricultural commodity play',
        potential_gain: 0.30,
        potential_loss: 0.35,
        legal_risk: 0,
        reputation_cost: 0,
        asset: 'WHEAT'
    },
    
    // Options and Derivatives
    {
        type: 'options_trading',
        title: 'Weekly Options Strategy',
        description: 'High-risk, high-reward weekly expiration options',
        potential_gain: 0.50,
        potential_loss: 0.90,
        legal_risk: 0,
        reputation_cost: 0
    },
    {
        type: 'covered_calls',
        title: 'Covered Call Strategy',
        description: 'Generate income from existing stock positions',
        potential_gain: 0.08,
        potential_loss: 0.05,
        legal_risk: 0,
        reputation_cost: 0
    },
    {
        type: 'iron_condor',
        title: 'Iron Condor Spread',
        description: 'Profit from low volatility with complex options',
        potential_gain: 0.12,
        potential_loss: 0.15,
        legal_risk: 0,
        reputation_cost: 0
    },
    
    // Alternative Investments
    {
        type: 'real_estate',
        title: 'REIT Investment Fund',
        description: 'Diversified real estate investment trust',
        potential_gain: 0.18,
        potential_loss: 0.20,
        legal_risk: 0,
        reputation_cost: 0,
        cost: 150000
    },
    {
        type: 'art_investment',
        title: 'Fine Art Auction',
        description: 'Invest in blue-chip artwork at Sotheby\'s',
        potential_gain: 0.35,
        potential_loss: 0.40,
        legal_risk: 0,
        reputation_cost: 0,
        cost: 300000
    },
    {
        type: 'wine_investment',
        title: 'Vintage Wine Portfolio',
        description: 'Bordeaux first-growth wine investment',
        potential_gain: 0.22,
        potential_loss: 0.25,
        legal_risk: 0,
        reputation_cost: 0,
        cost: 75000
    },
    
    // High-Risk Legitimate Strategies
    {
        type: 'day_trading',
        title: 'Day Trading Bootcamp',
        description: 'Intensive course promises 20% monthly returns',
        potential_gain: 0.20,
        potential_loss: 0.40,
        legal_risk: 0,
        reputation_cost: 0,
        cost: 25000
    },
    {
        type: 'algorithmic_trading',
        title: 'AI Trading Algorithm',
        description: 'Purchase machine learning trading system',
        potential_gain: 0.15,
        potential_loss: 0.20,
        legal_risk: 0,
        reputation_cost: 0,
        cost: 100000
    },
    {
        type: 'hedge_fund',
        title: 'Exclusive Hedge Fund',
        description: 'Minimum investment in top-performing fund',
        potential_gain: 0.30,
        potential_loss: 0.25,
        legal_risk: 0,
        reputation_cost: 0,
        cost: 1000000
    }
];

// Investigation triggers and questions
const INVESTIGATION_TRIGGERS = [
    {
        condition: 'legal_risk > 70',
        probability: 0.8,
        charges: ['Suspicious trading patterns', 'Potential market manipulation']
    },
    {
        condition: 'reputation < 30',
        probability: 0.6,
        charges: ['Public complaints', 'Ethical violations']
    },
    {
        condition: 'illegal_actions > 3',
        probability: 0.9,
        charges: ['Multiple securities violations', 'Pattern of illegal activity']
    },
    {
        condition: 'random',
        probability: 0.05,
        charges: ['Routine audit', 'Random compliance check']
    }
];

// Interactive events that require player decisions
const INTERACTIVE_EVENTS = [
    // Whistleblower Events
    {
        type: 'whistleblower',
        title: 'Suspicious Activity Report',
        description: 'A colleague notices your unusual trading patterns and threatens to report you to compliance.',
        choices: [
            { text: 'Bribe them to stay quiet ($50,000)', cost: 50000, legal_risk: 15, reputation_cost: 10 },
            { text: 'Threaten them with blackmail', legal_risk: 25, reputation_cost: 20 },
            { text: 'Come clean and stop illegal activities', legal_risk: -10, reputation_cost: -5 },
            { text: 'Ignore them and continue', legal_risk: 30, reputation_cost: 15 }
        ]
    },
    {
        type: 'whistleblower',
        title: 'SEC Informant Offer',
        description: 'An SEC agent approaches you privately, offering immunity in exchange for information on other traders.',
        choices: [
            { text: 'Cooperate and provide information', legal_risk: -20, reputation_cost: 30 },
            { text: 'Refuse and lawyer up', legal_risk: 10, reputation_cost: -5, cost: 25000 },
            { text: 'Pretend to cooperate but give false info', legal_risk: 40, reputation_cost: 10 },
            { text: 'Try to bribe the agent', legal_risk: 60, reputation_cost: 25, cost: 100000 }
        ]
    },
    
    // Market Crash Events
    {
        type: 'market_crash',
        title: 'Flash Crash Opportunity',
        description: 'Markets are crashing due to algorithmic trading error. You could profit from the chaos.',
        choices: [
            { text: 'Buy the dip with all available cash', potential_gain: 0.25, potential_loss: 0.40 },
            { text: 'Short the market aggressively', potential_gain: 0.30, potential_loss: 0.35 },
            { text: 'Stay in cash and wait', potential_gain: 0, potential_loss: 0 },
            { text: 'Spread panic to amplify the crash', potential_gain: 0.40, legal_risk: 35, reputation_cost: 25 }
        ]
    },
    {
        type: 'market_crash',
        title: 'Bank Run Rumors',
        description: 'Rumors spread about a major bank\'s solvency. Financial stocks are plummeting.',
        choices: [
            { text: 'Short bank stocks immediately', potential_gain: 0.20, potential_loss: 0.25 },
            { text: 'Buy bank stocks as contrarian play', potential_gain: 0.35, potential_loss: 0.50 },
            { text: 'Spread the rumors on social media', potential_gain: 0.15, legal_risk: 25, reputation_cost: 20 },
            { text: 'Do nothing and observe', potential_gain: 0, potential_loss: 0 }
        ]
    },
    
    // Insider Information Events
    {
        type: 'insider_info',
        title: 'Overheard Conversation',
        description: 'At a restaurant, you overhear two executives discussing an upcoming merger.',
        choices: [
            { text: 'Act on the information immediately', potential_gain: 0.18, legal_risk: 30, reputation_cost: 15 },
            { text: 'Research publicly available info first', potential_gain: 0.08, legal_risk: 5 },
            { text: 'Ignore the information completely', potential_gain: 0, legal_risk: 0 },
            { text: 'Try to get closer to hear more details', potential_gain: 0.25, legal_risk: 40, reputation_cost: 20 }
        ]
    },
    {
        type: 'insider_info',
        title: 'Family Connection',
        description: 'Your cousin works at a pharmaceutical company and mentions a drug trial failure.',
        choices: [
            { text: 'Short the stock based on the tip', potential_gain: 0.22, legal_risk: 35, reputation_cost: 25 },
            { text: 'Ask for more specific details', potential_gain: 0.30, legal_risk: 45, reputation_cost: 30 },
            { text: 'Warn your cousin about insider trading', potential_gain: 0, legal_risk: 0, reputation_cost: -5 },
            { text: 'Pretend you didn\'t hear anything', potential_gain: 0, legal_risk: 0 }
        ]
    },
    
    // Regulatory Events
    {
        type: 'regulatory',
        title: 'Compliance Audit',
        description: 'Your firm is being audited. They want to review your trading records.',
        choices: [
            { text: 'Cooperate fully with the audit', legal_risk: -5, reputation_cost: -10 },
            { text: 'Hide suspicious transactions', legal_risk: 25, reputation_cost: 15 },
            { text: 'Bribe the auditor', legal_risk: 50, reputation_cost: 30, cost: 75000 },
            { text: 'Destroy incriminating evidence', legal_risk: 60, reputation_cost: 40 }
        ]
    },
    {
        type: 'regulatory',
        title: 'New Trading Restrictions',
        description: 'Regulators announce new rules that will limit your trading strategies.',
        choices: [
            { text: 'Comply with new regulations', potential_gain: -0.05, legal_risk: -10 },
            { text: 'Find loopholes to exploit', potential_gain: 0.08, legal_risk: 20 },
            { text: 'Move operations offshore', potential_gain: 0.12, legal_risk: 30, cost: 200000 },
            { text: 'Lobby against the regulations', potential_gain: 0.05, cost: 100000, reputation_cost: 10 }
        ]
    },
    
    // Social Media Events
    {
        type: 'social_media',
        title: 'Viral Trading Post',
        description: 'Your trading success goes viral on social media. Thousands want your advice.',
        choices: [
            { text: 'Start a paid trading course', potential_gain: 0.10, reputation_cost: -10, cost: -50000 },
            { text: 'Pump stocks to your followers', potential_gain: 0.20, legal_risk: 35, reputation_cost: 25 },
            { text: 'Stay humble and avoid attention', potential_gain: 0, reputation_cost: -5 },
            { text: 'Sell fake trading signals', potential_gain: 0.15, legal_risk: 40, reputation_cost: 35, cost: -25000 }
        ]
    },
    {
        type: 'social_media',
        title: 'Meme Stock Frenzy',
        description: 'A stock you own becomes a meme. Reddit traders are pumping it hard.',
        choices: [
            { text: 'Sell everything at the peak', potential_gain: 0.30, reputation_cost: 10 },
            { text: 'Hold and ride the wave', potential_gain: 0.15, potential_loss: 0.25 },
            { text: 'Add fuel to the fire online', potential_gain: 0.40, legal_risk: 20, reputation_cost: 15 },
            { text: 'Short the stock expecting a crash', potential_gain: 0.25, potential_loss: 0.35, reputation_cost: 20 }
        ]
    },
    
    // Personal Events
    {
        type: 'personal',
        title: 'Gambling Addiction',
        description: 'Your trading has become compulsive. Friends and family are concerned.',
        choices: [
            { text: 'Seek professional help', legal_risk: 0, reputation_cost: -15, cost: 10000 },
            { text: 'Double down on risky trades', potential_gain: 0.30, potential_loss: 0.60, legal_risk: 10 },
            { text: 'Take a break from trading', potential_gain: -0.05, legal_risk: -5, reputation_cost: -10 },
            { text: 'Ignore everyone and continue', legal_risk: 15, reputation_cost: 20 }
        ]
    },
    {
        type: 'personal',
        title: 'Divorce Proceedings',
        description: 'Your spouse is divorcing you and wants half of your trading profits.',
        choices: [
            { text: 'Settle fairly and split assets', cost: 0.5, reputation_cost: -5 },
            { text: 'Hide assets in offshore accounts', legal_risk: 45, reputation_cost: 30, cost: 0.2 },
            { text: 'Fight it in court', cost: 100000, reputation_cost: 15 },
            { text: 'Liquidate everything out of spite', potential_loss: 0.3, reputation_cost: 25 }
        ]
    }
];

// AI Prosecutor questions based on player actions
const PROSECUTOR_QUESTIONS = [
    "Explain the unusual timing of your trades in {asset} just before the earnings announcement.",
    "How did you obtain the information that led to your profitable position in {asset}?",
    "Your trading pattern shows suspicious activity. Can you justify these transactions?",
    "Multiple witnesses report you spreading false information about {asset}. What's your response?",
    "Your reputation in the market has declined significantly. How do you explain this?",
    "Bank records show unusual cash flows. Can you explain the source of this money?",
    "You've been accused of coordinating with others to manipulate prices. Is this true?",
    "Your success rate is statistically improbable without inside information. Explain.",
    "Witnesses claim you attempted to bribe a federal agent. How do you respond?",
    "Your social media posts show clear market manipulation attempts. What's your defense?",
    "Phone records show suspicious calls before major trades. Can you explain these?",
    "You've been linked to several pump-and-dump schemes. What's your involvement?",
    "Your offshore accounts suggest money laundering activities. Care to explain?",
    "Multiple informants have provided evidence against you. What's your response?",
    "Your trading algorithm appears designed for spoofing. Is this accurate?",
    "You've been accused of running a Ponzi scheme. How do you plead?"
];

// Game configuration
const GAME_CONFIG = {
    starting_cash: 100000,
    starting_reputation: 85,
    starting_legal_risk: 12,
    max_reputation: 100,
    max_legal_risk: 100,
    investigation_threshold: 70,
    bankruptcy_threshold: 1000,
    market_volatility: 0.02,
    news_frequency: 0.3,
    opportunity_frequency: 0.2
};