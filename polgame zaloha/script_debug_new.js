// ============================================
// SIMPLIFIED INIT - DEBUG VERSION (FIXED)
// ============================================

console.log("🐍 Snake Hra - Spouští se...");

// Počkej na DOM a pak na načtení všech modulů
document.addEventListener('DOMContentLoaded', function() {
    console.log("📋 DOM ready, čekám na moduly...");
    
    // Funkce pro čekání na načtení modulů
    function waitForModules() {
        return new Promise((resolve) => {
            const checkModules = () => {
                if (typeof initializeGame === 'function' && 
                    typeof startGameLoop === 'function' && 
                    typeof gameState !== 'undefined' &&
                    typeof GAME_CONFIG !== 'undefined' &&
                    typeof initializeInput === 'function') {
                    console.log("✅ Všechny moduly načteny!");
                    resolve();
                } else {
                    console.log("⏳ Čekám na moduly...", {
                        initializeGame: typeof initializeGame,
                        startGameLoop: typeof startGameLoop,
                        gameState: typeof gameState,
                        GAME_CONFIG: typeof GAME_CONFIG,
                        initializeInput: typeof initializeInput
                    });
                    setTimeout(checkModules, 100);
                }
            };
            checkModules();
        });
    }
    
    // Čekej na moduly a pak inicializuj
    waitForModules().then(() => {
        console.log("⏰ Všechny moduly načteny, spouštím inicializaci...");
        
        try {
            // Základní inicializace
            window.canvas = document.getElementById('gameCanvas');
            window.ctx = canvas.getContext('2d');
            
            if (!canvas || !ctx) {
                throw new Error("Canvas nebo kontext nenalezen!");
            }
            
            console.log("✅ Canvas inicializován:", canvas, ctx);
            
            // Zkontroluj dostupnost klíčových funkcí
            console.log("🔍 Kontrola dostupných funkcí:");
            console.log("- gameState:", typeof gameState);
            console.log("- GAME_CONFIG:", typeof GAME_CONFIG);
            console.log("- initializeGame:", typeof initializeGame);
            console.log("- startGameLoop:", typeof startGameLoop);
            console.log("- startGame:", typeof startGame);
            console.log("- initializeInput:", typeof initializeInput);
            console.log("- handleKeydown:", typeof handleKeydown);
            
            // Inicializuj UI nejdřív
            if (typeof initializeUI === 'function') {
                console.log("🎨 Inicializuji UI...");
                initializeUI();
            }
            
            // Inicializuj ovládání
            if (typeof initializeInput === 'function') {
                console.log("⌨️ Inicializuji ovládání...");
                initializeInput();
            }
            
            // Spusť inicializaci hry
            console.log("🎮 Volám initializeGame...");
            initializeGame();
            
            console.log("🔄 Spouštím game loop...");
            startGameLoop();
            
            // Ujistíme se, že startGame je globálně dostupná pro HTML onclick
            if (typeof window.startGame !== 'function' && typeof startGame === 'function') {
                window.startGame = startGame;
                console.log("✅ StartGame exportována do window");
            }
            
            // Kontrola dostupnosti startGame
            console.log("🎯 StartGame je k dispozici:", typeof window.startGame);
            
            // Zkus najít tlačítko a přidat event listener jako zálohu
            const startButton = document.querySelector('.game-button');
            if (startButton) {
                startButton.addEventListener('click', function() {
                    console.log("🎯 Start button clicked via addEventListener");
                    if (typeof window.startGame === 'function') {
                        window.startGame();
                    } else if (typeof startGame === 'function') {
                        startGame();
                    } else {
                        console.error("❌ StartGame funkce nenalezena!");
                    }
                });
                console.log("✅ Event listener přidán na start button");
            }
            
            console.log("🎉 Hra úspěšně inicializována!");
            
        } catch (error) {
            console.error("❌ Chyba při inicializaci:", error);
            
            // Zobraz chybu na stránce
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
                <div style="position: fixed; top: 20px; left: 20px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">
                    <strong>CHYBA:</strong> ${error.message}<br>
                    <small>Zkontrolujte konzoli pro více informací</small>
                </div>
            `;
            document.body.appendChild(errorDiv);
        }
    }).catch(error => {
        console.error("❌ Chyba při čekání na moduly:", error);
        
        // Zobraz chybu na stránce
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="position: fixed; top: 20px; left: 20px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">
                <strong>CHYBA:</strong> ${error.message}<br>
                <small>Zkontrolujte konzoli pro více informací</small>
            </div>
        `;
        document.body.appendChild(errorDiv);
    });
});

console.log("📦 Debug script loaded, čekám na DOM...");
