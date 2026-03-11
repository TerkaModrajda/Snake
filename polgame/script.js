// ============================================
// INICIALIZACE HRY - PŮVODNÍ VERZE
// ============================================

console.log("🐍 Snake Hra - Načítání...");

// Event listenery pro ovládací tlačítka
document.addEventListener('DOMContentLoaded', () => {
    console.log("📋 DOM načten, inicializace hry...");
    
    // Ovládací tlačítka
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.getAttribute('data-direction');
            if (typeof handleDirectionInput === 'function') {
                handleDirectionInput(direction);
            }
        });
    });
    
    // Start tlačítko
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log("🎯 Start tlačítko stisknuto");
            if (typeof startGame === 'function') {
                startGame();
            }
        });
    }
    
    // Pause tlačítko
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            console.log("⏸️ Pause tlačítko stisknuto");
            if (typeof togglePause === 'function') {
                togglePause();
            }
        });
    }
    
    // Restart tlačítko
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            console.log("🔄 Restart tlačítko stisknuto");
            if (typeof restartGame === 'function') {
                restartGame();
            }
        });
    }
    
    // Klávesnice
    document.addEventListener('keydown', (e) => {
        if (typeof handleKeydown === 'function') {
            handleKeydown(e);
        }
    });
    
    // Inicializace skin listenerů v popup oknech
    if (typeof initializeSkinListeners === 'function') {
        initializeSkinListeners();
    }
    
    // Spustí inicializaci po malé pauze
    setTimeout(initializeGame, 100);
});

// Globální inicializace
function initializeGame() {
    console.log("🎮 Začíná inicializace hry...");
    
    try {
        // 1. Inicializace canvasu
        if (typeof initializeCanvas === 'function') {
            if (!initializeCanvas()) {
                console.error("❌ Nepodařila se inicializace canvasu");
                return;
            }
        } else {
            console.error("❌ Funkce initializeCanvas není dostupná");
            return;
        }
        
        // 2. Načti uložená data
        if (typeof loadHighScore === 'function') {
            gameState.highScore = loadHighScore();
            console.log("🏆 Načítám high score:", gameState.highScore);
        }
        if (typeof loadCurrentSkin === 'function') {
            gameState.currentSkin = loadCurrentSkin();
        }
        if (typeof loadGameHistory === 'function') {
            window.gameHistory = loadGameHistory();
        }
        if (typeof loadGameStats === 'function') {
            window.gameStats = loadGameStats();
        }
        
        // 4. Aktualizace UI s načtenými daty
        if (typeof updateHighScore === 'function') {
            updateHighScore();
            console.log("🏆 High score aktualizováno:", gameState.highScore);
        }
        if (typeof updateHistoryUI === 'function') {
            updateHistoryUI();
            console.log("📊 Historie UI aktualizována");
        }
        
        // 3. Inicializace počátečního stavu hry
        gameState.snake = [{ x: 10, y: 10 }];
        
        if (typeof generateFood === 'function') {
            gameState.food = generateFood();
        } else {
            // Fallback jídlo
            gameState.food = { x: 5, y: 5, direction: { x: 0, y: 0 }, lastMoveTime: 0 };
        }
        
        gameState.direction = { x: 0, y: 0 };
        gameState.gameRunning = false;
        gameState.gameStarted = false;
        
        // 4. Prvotní vykreslení
        console.log("🎨 Spouštím prvotní vykreslení...");
        if (typeof draw === 'function') {
            draw();
        } else if (typeof window.draw === 'function') {
            window.draw();
        } else {
            console.error("❌ Funkce draw není dostupná - ani lokálně ani globálně");
            
            // Nouzové vykreslení
            if (ctx) {
                ctx.fillStyle = '#34495e';
                ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
                
                // Nakresli hada
                if (gameState.snake && gameState.snake.length > 0) {
                    ctx.fillStyle = '#27ae60';
                    gameState.snake.forEach(segment => {
                        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                    });
                }
                
                // Nakresli jídlo
                if (gameState.food) {
                    ctx.fillStyle = '#e74c3c';
                    ctx.fillRect(gameState.food.x * GRID_SIZE, gameState.food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
                
                console.log("🚨 Použité nouzové vykreslení");
            }
        }
        
        // 5. Inicializace úspěchů
        if (typeof initializeAchievements === 'function') {
            initializeAchievements();
            console.log("🏆 Úspěchy inicializovány");
        }
        
        // 6. Inicializace skinů
        if (typeof initializeSkins === 'function') {
            initializeSkins();
            console.log("🎨 Skiny inicializovány");
        }
        if (typeof updateAllSkinGrids === 'function') {
            updateAllSkinGrids();
            console.log("🎨 Skin gridy aktualizovány");
        }
        
        console.log("✅ Hra úspěšně inicializována");
        
    } catch (error) {
        console.error("❌ Chyba při inicializaci hry:", error);
    }
}

// Export pro globální přístup
window.initializeGame = initializeGame;
