// ============================================
// DOM ELEMENTY A INICIALIZACE
// ============================================

// DOM elementy (inicializace se provede později)
let canvas, ctx;

// Funkce pro inicializaci canvasu
function initializeCanvas() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element nenalezen!');
        return false;
    }
    
    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('2D kontext nenalezen!');
        return false;
    }
    
    // Nastavení velikosti
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    
    // Globální export
    window.canvas = canvas;
    window.ctx = ctx;
    
    console.log('Canvas inicializován:', CANVAS_SIZE + 'x' + CANVAS_SIZE);
    return true;
}

const currentScoreElement = document.getElementById('current-score');
const highScoreElement = document.getElementById('high-score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');
const startPopupElement = document.getElementById('start-popup');
const totalGamesElement = document.getElementById('total-games');
const averageScoreElement = document.getElementById('average-score');
const bestStreakElement = document.getElementById('best-streak');
const gameHistoryElement = document.getElementById('game-history');

// UI funkce pro aktualizaci skóre
function updateScore() {
    currentScoreElement.textContent = gameState.score;
}

function updateHighScore() {
    if (highScoreElement) {
        highScoreElement.textContent = gameState.highScore;
        console.log("🎯 Aktualizuji high score na:", gameState.highScore);
    } else {
        console.warn("⚠️ highScoreElement nenalezen!");
    }
}

// Funkce pro popup okna
function showStartPopup() {
    const startPopup = document.getElementById('start-popup');
    if (startPopup) {
        startPopup.classList.remove('hidden');
    }
}

function hideStartPopup() {
    const startPopup = document.getElementById('start-popup');
    if (startPopup) {
        startPopup.classList.add('hidden');
    }
    gameState.gameStarted = true;
}

function showGameOver() {
    finalScoreElement.textContent = gameState.score;
    gameOverElement.classList.remove('hidden');
    document.body.classList.add('game-over');
    
    // Debug: zkontroluj viditelnost kontejnerů
    setTimeout(() => {
        const containers = ['game-container', 'mechanics-container', 'history-container'];
        containers.forEach(className => {
            const element = document.querySelector('.' + className);
            if (element) {
                const styles = window.getComputedStyle(element);
                console.log(`${className}:`, {
                    display: styles.display,
                    opacity: styles.opacity,
                    visibility: styles.visibility,
                    width: styles.width,
                    height: styles.height
                });
            } else {
                console.log(`${className}: element not found`);
            }
        });
    }, 100);
}

function hideGameOver() {
    gameOverElement.classList.add('hidden');
    document.body.classList.remove('game-over');
}

// Herní ovládání
function startGame() {
    console.log("🚀 StartGame volána!");
    
    if (!gameState.gameStarted) {
        hideStartPopup();
        gameState.gameStarted = true;
    }

    if (gameState.direction.x === 0 && gameState.direction.y === 0) {
        gameState.direction = { x: 1, y: 0 };
    }
    
    gameState.gameRunning = true;
    gameState.gamePaused = false;
    
    const currentTime = Date.now();
    gameState.lastUpdateTime = currentTime;
    gameState.lastMoveTime = currentTime;
    
    if (pauseBtn) {
        pauseBtn.textContent = 'Pauza';
    }
    
    // Spuštění herní smyčky
    if (!gameState.gameLoop) {
        console.log("🔄 Spouštím herní smyčku...");
        gameState.gameLoop = setInterval(() => {
            if (typeof gameLoop === 'function') {
                gameLoop();
            } else if (typeof window.gameLoop === 'function') {
                window.gameLoop();
            }
        }, 16); // ~60 FPS
    }
    
    // Přidej třídu pro ztmavení bočních kontejnerů
    document.body.classList.add('game-active');
    
    console.log("✅ Hra spuštěna! Direction:", gameState.direction);
}

function restartGame() {
    console.log("🔄 Restart hry...");
    
    // Zastav starou herní smyčku
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
        gameState.gameLoop = null;
    }
    
    // Resetuj hru a spusť znovu
    if (typeof initGame === 'function') {
        initGame();
    }
    startGame();
}

function togglePause() {
    if (gameState.gameRunning) {
        gameState.gamePaused = !gameState.gamePaused;
        pauseBtn.textContent = gameState.gamePaused ? 'Pokračovat' : 'Pauza';
        
        // Při pauzě odeber třídu (rozjasni kontejnery), při pokračování ji přidej
        if (gameState.gamePaused) {
            document.body.classList.remove('game-active');
        } else {
            document.body.classList.add('game-active');
        }
    }
}

// Konec hry
function gameOver() {
    console.log("💀 Game Over!");
    
    gameState.gameRunning = false;
    gameState.gamePaused = false;
    
    // Zastavit herní smyčku
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
        gameState.gameLoop = null;
    }
    
    // Vyčištění všech vizuálních efektů a notifikací
    if (typeof clearAllVisualEffects === 'function') {
        clearAllVisualEffects();
    }
    
    // NEODBÍREJ game-active - zachová layout během game-over
    // document.body.classList.remove('game-active');
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        saveHighScore(gameState.highScore);
        updateHighScore();
        console.log("🏆 Nový rekord:", gameState.highScore);
    }
    
    if (typeof unlockSkins === 'function') {
        unlockSkins(gameState.score);
    }
    
    if (typeof updateGameHistory === 'function') {
        updateGameHistory(gameState.score);
    }
    
    clearCanvas();
    showGameOver();
}

function clearCanvas() {
    // Vyčisti canvas na tmavé pozadí
    ctx.fillStyle = '#001100';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Nakresli mřížku
    if (typeof drawGrid === 'function') {
        drawGrid();
    }
    
    // Nekreslíme "GAME OVER" text na canvas - máme popup
}

// Aktualizace UI historie
function updateHistoryUI() {
    if (totalGamesElement) {
        totalGamesElement.textContent = gameStats.totalGames;
    }
    
    const averageScore = gameStats.totalGames > 0 ? Math.round(gameStats.totalScore / gameStats.totalGames) : 0;
    if (averageScoreElement) {
        averageScoreElement.textContent = averageScore;
    }
    
    if (bestStreakElement) {
        bestStreakElement.textContent = gameStats.bestStreak;
    }
    
    if (gameHistoryElement) {
        if (gameHistory.length === 0) {
            gameHistoryElement.innerHTML = '<p class="no-games">Zatím žádné hry...</p>';
        } else {
            gameHistoryElement.innerHTML = gameHistory.map(game => `
                <div class="history-item">
                    <div>
                        <div class="game-number">#${game.gameNumber}</div>
                        <div class="game-date">${game.date}</div>
                    </div>
                    <div class="game-score">${game.score}</div>
                </div>
            `).join('');
        }
    }
}

// Debug funkce pro testování high score
function testHighScore() {
    console.log("📝 Test high score:");
    console.log("   Aktuální gameState.highScore:", gameState.highScore);
    console.log("   V localStorage:", localStorage.getItem('snakeHighScore'));
    console.log("   Parsovaná hodnota:", parseInt(localStorage.getItem('snakeHighScore')));
    
    // Test nastavení
    saveHighScore(123);
    console.log("   Po uložení 123:", localStorage.getItem('snakeHighScore'));
    
    const loaded = loadHighScore();
    console.log("   Po načtení:", loaded);
    
    return loaded;
}

// Funkce pro správu high score
function loadHighScore() {
    const stored = localStorage.getItem('snakeHighScore');
    return stored ? parseInt(stored) : 0;
}

function saveHighScore(score) {
    localStorage.setItem('snakeHighScore', score.toString());
}

// Exporty funkcí pro localStorage
window.loadHighScore = loadHighScore;
window.saveHighScore = saveHighScore;
window.loadCurrentSkin = loadCurrentSkin;
window.loadGameHistory = loadGameHistory;
window.loadGameStats = loadGameStats;
window.saveGameHistory = saveGameHistory;
window.saveGameStats = saveGameStats;

// Export UI funkcí
window.updateScore = updateScore;
window.updateHighScore = updateHighScore;
window.showStartPopup = showStartPopup;
window.gameOver = gameOver;
window.testHighScore = testHighScore;
window.hideStartPopup = hideStartPopup;
window.showGameOver = showGameOver;
window.hideGameOver = hideGameOver;
window.initializeCanvas = initializeCanvas;
window.togglePause = togglePause;
window.startGame = startGame;
window.restartGame = restartGame;
window.updateHistoryUI = updateHistoryUI;
window.testHighScore = testHighScore;
