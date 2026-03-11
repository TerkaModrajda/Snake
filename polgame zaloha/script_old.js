// ============================================
// INICIALIZACE HRY - NOVÁ STRUKTURA
// ============================================

/**
 * Hlavní inicializační script
 * Spouští všechny systémy hry v správném pořadí
 */

console.log("🐍 Snake Hra - Načítání...");

/**
 * Načtení uložených dat z localStorage
 */
function loadSavedData() {
    // Načti high score
    gameState.highScore = loadHighScore();
    
    // Načti aktuální skin
    gameState.currentSkin = loadCurrentSkin();
    
    // Načti historii a statistiky
    window.gameHistory = loadGameHistory();
    window.gameStats = loadGameStats();
    
    console.log("[Init] Uložená data načtena");
}

/**
 * Inicializace canvas a 2D kontextu
 */
function initializeCanvas() {
    window.canvas = document.getElementById('gameCanvas');
    window.ctx = canvas.getContext('2d');
    
    if (!canvas || !ctx) {
        throw new Error("Canvas nebo 2D kontext není dostupný");
    }
    
    console.log("[Init] Canvas inicializován");
}

// Event listenery pro ovládací tlačítka
document.addEventListener('DOMContentLoaded', () => {
    // Ovládací tlačítka
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.getAttribute('data-direction');
            handleDirectionInput(direction);
        });
    });
    
    // Herní tlačítka
    const restartBtn = document.getElementById('restart-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    if (restartBtn) restartBtn.addEventListener('click', restartGame);
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
    
    // Skin selector
    document.querySelectorAll('.skin-item').forEach(item => {
        item.addEventListener('click', () => {
            const skinId = item.getAttribute('data-skin');
            changeSkin(skinId);
        });
    });
});

// Inicializace hry při načtení stránky
window.addEventListener('load', initializeGame);