// ============================================
// HERNÍ STAV A KONSTANTY
// ============================================

// Herní konstanty
const CANVAS_SIZE = 600;
const GRID_SIZE = 20;
const GRID_COUNT = CANVAS_SIZE / GRID_SIZE;

// Konfigurace hry - náhrada za migrace
const GAME_CONFIG = {
    CANVAS: {
        SIZE: 600,
        GRID_SIZE: 20,
        GRID_COUNT: 30
    },
    SPEED: {
        BASE_SPEED: 200, // Kompromis mezi 150 a 280 - rozumný začátek
        SLOW_BONUS_INCREASE: 80, // Zvětšeno z 20 na 80 pro výraznější zpomalení
        SPEED_INCREMENT: 10,
        MIN_SPEED: 50,
        FOOD_MOVE_SPEED: 2000 // Pohyb jídla každé 2 sekundy
    },
    SCORING: {
        NORMAL_FOOD: 10,
        SUPER_FOOD: 50,
        PENALTY_BONUS: -50,
        SPEED_BONUS_REDUCTION: 10
    },
    PROGRESSION: {
        TIMER_START: 3,
        SPEED_UP_START: 5,
        MOVING_FOOD_START: 5,
        ARROW_HIDE: 8,
        FAST_FOOD_START: 12,
        MULTI_FOOD_START: 12,
        TRIPLE_FOOD_START: 20,
        QUAD_FOOD_START: 35,
        PENTA_FOOD_START: 50,
        BONUS_START: 5
    },
    FRENZY: {
        START_AFTER: 5, // Od 5. jídla může být frenzy bonus
        FOOD_COUNT: 15 // 15 jídel při frenzy
    },
    TIMINGS: {
        BONUS_DURATION: 5000,
        BONUS_EFFECT: 8000, // 8 sekund pro efekt bonusu
        BONUS_COOLDOWN: 3000, // 3 sekundy cooldown
        FOOD_MAX_TIME: 10000,
        SUPER_FOOD_DURATION: 5000, // 5 sekund na mapě
        SUPER_FOOD_INTERVAL: 5000, // 5 sekund mezi spawny
        FRENZY_DURATION: 10000 // 10 sekund frenzy
    },
    PROBABILITY: {
        BONUS_BASE_CHANCE: 0.002 // 0.2% šance každý frame
    }
};

// Herní stav
let gameState = {
    // Základní hra
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5, direction: { x: 0, y: 0 }, lastMoveTime: 0 },
    foods: [],
    multiFood: false,
    direction: { x: 0, y: 0 },
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore')) || 0,
    gameRunning: false,
    gamePaused: false,
    gameStarted: false,
    foodEaten: 0,
    
    // Rychlost a timing (z config.js)
    gameSpeed: GAME_CONFIG.SPEED.BASE_SPEED,
    baseSpeed: GAME_CONFIG.SPEED.BASE_SPEED,
    speedIncrement: GAME_CONFIG.SPEED.SPEED_INCREMENT,
    minSpeed: GAME_CONFIG.SPEED.MIN_SPEED,
    lastUpdateTime: 0,
    lastMoveTime: 0,
    
    // Časované jídlo
    timedFood: false,
    foodTimer: 0,
    foodMaxTime: GAME_CONFIG.TIMINGS.FOOD_MAX_TIME,
    
    // Pohybující se jídlo
    movingFood: false,
    foodMoveSpeed: GAME_CONFIG.SPEED.FOOD_MOVE_SPEED,
    
    // Skiny
    currentSkin: 'classic',
    
    // Super jídlo (z config.js)
    superFood: null,
    superFoodActive: false,
    superFoodTimer: 0,
    superFoodMaxTime: GAME_CONFIG.TIMINGS.SUPER_FOOD_DURATION,
    superFoodSpawnInterval: GAME_CONFIG.TIMINGS.SUPER_FOOD_INTERVAL,
    lastSuperFoodSpawn: 0,
    
    // Bonus zpomalení (z config.js)
    slowBonus: null,
    // Bonusový systém (více bonusů současně)
    bonuses: [], // Pole aktivních bonusů na mapě
    bonusEffectActive: false,
    bonusEffectTimer: 0,
    bonusEffectDuration: GAME_CONFIG.TIMINGS.BONUS_EFFECT,
    bonusCooldownTimer: 0,
    lastActiveBonusType: null, // Pro sledování změn bonusových typů
    bonusCooldown: 1000, // Kratší cooldown při startu
    speedBeforeBonus: 0,
    lastBonusSpawn: 0,
    maxBonusesOnMap: 1, // Dynamicky se změní na 2 od 25. jídla
    bonusType: null, // typ aktuálního bonusu
    
    // Magnet efekt specifické proměnné
    magnetEffectActive: false,
    magnetEffectStartTime: 0,
    magnetAnimations: [],
    
    // Food Frenzy systém
    frenzyActive: false,
    frenzyTimer: 0,
    frenzyDuration: GAME_CONFIG.TIMINGS.FRENZY_DURATION,

    frenzyFoods: [],
    normalFoodCountBeforeFrenzy: 0,

    // Skály - nové proměnné pro překážky
    rocks: [], // Pole pozic skal {x, y}
    rockCount: 0, // Aktuální počet skal
    lastRockMoveTime: 0, // Čas posledního pohybu skály
    rockStage: 0 // 0: žádná, 1: 1 skála, 2: 3 skály, 3: 5 skal
};

// Skiny definice
const snakeSkins = {
    classic: {
        name: 'Klasický',
        head: '#27ae60',
        body: '#2ecc71',
        unlocked: true
    },
    rainbow: {
        name: 'Duha',
        head: '#e74c3c',
        body: '#f39c12',
        unlocked: true,
        isRainbow: true
    },
    neon: {
        name: 'Neon',
        head: '#00ff41',
        body: '#00d4aa',
        unlocked: true,
        glowing: true
    },
    golden: {
        name: 'Zlatý',
        head: '#f1c40f',
        body: '#f39c12',
        unlocked: false,
        unlockCondition: 200
    },
    fire: {
        name: 'Ohnivý',
        head: '#e74c3c',
        body: '#c0392b',
        unlocked: false,
        unlockCondition: 300,
        glowing: true
    },
    ice: {
        name: 'Ledový',
        head: '#3498db',
        body: '#74b9ff',
        unlocked: false,
        unlockCondition: 400,
        glowing: true
    },
    purple: {
        name: 'Fialový',
        head: '#9b59b6',
        body: '#a29bfe',
        unlocked: false,
        unlockCondition: 500,
        glowing: true
    },
    galaxy: {
        name: 'Galaxie',
        head: '#2d3436',
        body: '#636e72',
        unlocked: false,
        unlockCondition: 750,
        isGalaxy: true
    },
    diamond: {
        name: 'Diamant',
        head: '#ddd',
        body: '#fff',
        unlocked: false,
        unlockCondition: 1000,
        isDiamond: true
    }
};

// Historie a statistiky
let gameHistory = JSON.parse(localStorage.getItem('snakeGameHistory')) || [];
let gameStats = JSON.parse(localStorage.getItem('snakeGameStats')) || {
    totalGames: 0,
    totalScore: 0,
    bestStreak: 0,
    achievements: []
};

// Exporty pro globální dostupnost
window.gameState = gameState;
window.snakeSkins = snakeSkins;
window.gameHistory = gameHistory;
window.gameStats = gameStats;
window.CANVAS_SIZE = CANVAS_SIZE;
window.GRID_SIZE = GRID_SIZE;
window.GRID_COUNT = GRID_COUNT;
window.GAME_CONFIG = GAME_CONFIG;

function initGame() {
    // Reset herního stavu
    gameState.snake = [{ x: 10, y: 10 }];
    gameState.food = { x: 5, y: 5, direction: { x: 0, y: 0 }, lastMoveTime: 0 };
    gameState.foods = [];
    gameState.multiFood = false;
    gameState.direction = { x: 0, y: 0 };
    gameState.score = 0;
    gameState.gameRunning = false;
    gameState.gamePaused = false;
    gameState.gameStarted = false;
    gameState.foodEaten = 0;

    // Rychlost a timing (z config.js)
    gameState.gameSpeed = GAME_CONFIG.SPEED.BASE_SPEED;
    gameState.baseSpeed = GAME_CONFIG.SPEED.BASE_SPEED;
    gameState.speedIncrement = GAME_CONFIG.SPEED.SPEED_INCREMENT;
    gameState.minSpeed = GAME_CONFIG.SPEED.MIN_SPEED;
    gameState.lastUpdateTime = 0;
    gameState.lastMoveTime = 0;

    // Časované jídlo
    gameState.timedFood = false;
    gameState.foodTimer = 0;
    gameState.foodMaxTime = GAME_CONFIG.TIMINGS.FOOD_MAX_TIME;

    // Pohybující se jídlo
    gameState.movingFood = false;
    gameState.foodMoveSpeed = GAME_CONFIG.SPEED.FOOD_MOVE_SPEED;

    // Skiny
    gameState.currentSkin = 'classic';

    // Super jídlo (z config.js)
    gameState.superFood = null;
    gameState.superFoodActive = false;
    gameState.superFoodTimer = 0;
    gameState.superFoodMaxTime = GAME_CONFIG.TIMINGS.SUPER_FOOD_DURATION;
    gameState.superFoodSpawnInterval = GAME_CONFIG.TIMINGS.SUPER_FOOD_INTERVAL;
    gameState.lastSuperFoodSpawn = 0;

    // Bonus zpomalení (z config.js)
    gameState.slowBonus = null;
    // Bonusový systém (více bonusů současně)
    gameState.bonuses = []; // Pole aktivních bonusů na mapě
    gameState.bonusEffectActive = false;
    gameState.bonusEffectTimer = 0;
    gameState.bonusEffectDuration = GAME_CONFIG.TIMINGS.BONUS_EFFECT;
    gameState.bonusCooldownTimer = 0;
    gameState.lastActiveBonusType = null;
    gameState.bonusCooldown = 1000; // Kratší cooldown při startu
    gameState.speedBeforeBonus = 0;
    gameState.lastBonusSpawn = 0;
    gameState.maxBonusesOnMap = 1; // Dynamicky se změní na 2 od 25. jídla
    gameState.bonusType = null; // typ aktuálního bonusu

    // Magnet efekt specifické proměnné
    gameState.magnetEffectActive = false;
    gameState.magnetEffectStartTime = 0;
    gameState.magnetAnimations = [];

    // Food Frenzy systém
    gameState.frenzyActive = false;
    gameState.frenzyTimer = 0;
    gameState.frenzyDuration = GAME_CONFIG.TIMINGS.FRENZY_DURATION;

    gameState.frenzyFoods = [];
    gameState.normalFoodCountBeforeFrenzy = 0;

    // Skály - nové proměnné pro překážky
    gameState.rocks = [];
    gameState.rockCount = 0;
    gameState.lastRockMoveTime = 0;
    gameState.rockStage = 0;
}
