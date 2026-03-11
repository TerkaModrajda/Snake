// ============================================
// SKIN SYSTÉM
// ============================================

// Změna skinu
function changeSkin(skinId) {
    if (snakeSkins[skinId] && snakeSkins[skinId].unlocked) {
        gameState.currentSkin = skinId;
        localStorage.setItem('snakeCurrentSkin', skinId);
    }
}

// Save unlocked skins to localStorage
function saveUnlockedSkins() {
    const unlocked = Object.keys(snakeSkins).filter(skinId => snakeSkins[skinId].unlocked);
    localStorage.setItem('snakeUnlockedSkins', JSON.stringify(unlocked));
}

// Load unlocked skins from localStorage
function loadUnlockedSkins() {
    const unlocked = JSON.parse(localStorage.getItem('snakeUnlockedSkins') || '[]');
    unlocked.forEach(skinId => {
        if (snakeSkins[skinId]) snakeSkins[skinId].unlocked = true;
    });
}

// Odemknutí skinů podle skóre
function unlockSkins(score) {
    let newUnlocks = false;
    Object.keys(snakeSkins).forEach(skinId => {
        const skin = snakeSkins[skinId];
        if (!skin.unlocked && skin.unlockCondition && score >= skin.unlockCondition) {
            skin.unlocked = true;
            newUnlocks = true;
            
            // Animuj nově odemknuté skiny ve všech gridech
            ['start-skins-grid', 'gameover-skins-grid'].forEach(gridId => {
                const grid = document.getElementById(gridId);
                if (grid) {
                    const skinElement = grid.querySelector(`[data-skin="${skinId}"]`);
                    if (skinElement) {
                        skinElement.classList.remove('locked');
                        skinElement.style.animation = 'popupFadeIn 0.5s ease';
                    }
                }
            });
        }
    });
    
    if (newUnlocks) {
        saveUnlockedSkins();
        updateAllSkinGrids();
    }
}

// Always reset skins to only basic unlocked on load
function resetBasicSkins() {
    Object.keys(snakeSkins).forEach(skinId => {
        if (skinId === 'classic' || skinId === 'rainbow' || skinId === 'neon') {
            snakeSkins[skinId].unlocked = true;
        } else {
            snakeSkins[skinId].unlocked = false;
        }
    });
    saveUnlockedSkins();
}

// Call unlockSkins with high score after each game
if (typeof window !== 'undefined') {
    resetBasicSkins();
    loadUnlockedSkins();
    window.unlockSkins = unlockSkins;
}

// Inicializace skinů UI v popup oknech
function initializeSkins() {
    // Inicializace pro oba gridy (start a game-over)
    ['start-skins-grid', 'gameover-skins-grid'].forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        
        Object.keys(snakeSkins).forEach(skinId => {
            const skin = snakeSkins[skinId];
            const skinElement = grid.querySelector(`[data-skin="${skinId}"]`);
            
            if (skinElement) {
                if (skin.unlocked) {
                    skinElement.classList.remove('locked');
                }
                
                if (skinId === gameState.currentSkin) {
                    skinElement.classList.add('active');
                }
            }
        });
    });
}

// Inicializace event listenerů pro skiny v popup oknech
function initializeSkinListeners() {
    console.log("🎨 Inicializuji skin event listeners...");
    // Pro oba gridy
    ['start-skins-grid', 'gameover-skins-grid'].forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (!grid) {
            console.log(`❌ Grid ${gridId} nenalezen`);
            return;
        }
        
        // Přidej event listenery na všechny skin items v tomto gridu
        const skinItems = grid.querySelectorAll('.skin-item');
        console.log(`🎨 Nalezeno ${skinItems.length} skin items v ${gridId}`);
        skinItems.forEach(item => {
            item.addEventListener('click', () => {
                const skinId = item.dataset.skin;
                console.log(`🎨 Kliknuto na skin: ${skinId}`);
                if (snakeSkins[skinId] && snakeSkins[skinId].unlocked) {
                    console.log(`✅ Skin ${skinId} je odemčený, měním...`);
                    changeSkin(skinId);
                    updateAllSkinGrids(); // Aktualizuj všechny gridy
                } else {
                    console.log(`❌ Skin ${skinId} je zamčený nebo neexistuje`);
                }
            });
        });
    });
}

// Aktualizace všech skin gridů
function updateAllSkinGrids() {
    ['start-skins-grid', 'gameover-skins-grid'].forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        
        // Odstraň aktivní třídu ze všech
        grid.querySelectorAll('.skin-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Přidej aktivní třídu k aktuálnímu skinu
        const activeItem = grid.querySelector(`[data-skin="${gameState.currentSkin}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Aktualizuj odemknuté skiny
        Object.keys(snakeSkins).forEach(skinId => {
            const skin = snakeSkins[skinId];
            const skinElement = grid.querySelector(`[data-skin="${skinId}"]`);
            
            if (skinElement) {
                if (skin.unlocked) {
                    skinElement.classList.remove('locked');
                } else {
                    skinElement.classList.add('locked');
                }
            }
        });
    });
}

// ============================================
// HISTORIE A ACHIEVEMENTY
// ============================================

// Aktualizace historie po skončení hry
function updateGameHistory(score) {
    const gameData = {
        score: score,
        date: new Date().toLocaleString('cs-CZ'),
        gameNumber: gameStats.totalGames + 1
    };
    
    gameHistory.unshift(gameData);
    if (gameHistory.length > 5) {
        gameHistory = gameHistory.slice(0, 5);
    }
    
    gameStats.totalGames++;
    gameStats.totalScore += score;
    
    checkAchievements(score);
    
    localStorage.setItem('snakeGameHistory', JSON.stringify(gameHistory));
    localStorage.setItem('snakeGameStats', JSON.stringify(gameStats));
    
    if (typeof updateHistoryUI === 'function') {
        updateHistoryUI();
    }
}

// Kontrola a odemykání úspěchů
function checkAchievements(score, snakeLength, speed) {
    const achievements = [
        { id: 'score-1000', condition: () => score >= 1000 }, // Mistrovský výkon
        { id: 'long-snake', condition: () => snakeLength >= 25 }, // Dlouhý had
        { id: 'speed-demon', condition: () => speed >= GAME_CONFIG.maxSpeed } // Rychlá blesk
    ];
    achievements.forEach(achievement => {
        if (!gameStats.achievements.includes(achievement.id) && achievement.condition()) {
            gameStats.achievements.push(achievement.id);
            unlockAchievement(achievement.id);
        }
    });
}

// Odemknutí úspěchu
function unlockAchievement(achievementId) {
    const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
    if (achievementElement) {
        achievementElement.classList.remove('locked');
        achievementElement.classList.add('unlocked');
        
        achievementElement.style.animation = 'popupFadeIn 0.5s ease';
    }
}

// Inicializace úspěchů při načtení
function initializeAchievements() {
    gameStats.achievements.forEach(achievementId => {
        unlockAchievement(achievementId);
    });
}

// Funkce pro nastavení aktuálního skinu
function setCurrentSkin(skinId) {
    if (snakeSkins[skinId] && snakeSkins[skinId].unlocked) {
        gameState.currentSkin = skinId;
        localStorage.setItem('snakeCurrentSkin', skinId);
        
        // Aktualizuj UI
        document.querySelectorAll('.skin-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedSkin = document.querySelector(`[data-skin="${skinId}"]`);
        if (selectedSkin) {
            selectedSkin.classList.add('active');
        }
        
        console.log(`[Skins] Skin změněn na: ${skinId}`);
        return true;
    }
    return false;
}

function loadCurrentSkin() {
    return localStorage.getItem('snakeCurrentSkin') || 'classic';
}

// TESTOVACÍ FUNKCE - přidá vzorové hry do historie
function addTestGameHistory() {
    const testGames = [
        { score: 150, date: new Date(Date.now() - 86400000).toLocaleString('cs-CZ'), gameNumber: 1 },
        { score: 280, date: new Date(Date.now() - 7200000).toLocaleString('cs-CZ'), gameNumber: 2 },
        { score: 90, date: new Date(Date.now() - 3600000).toLocaleString('cs-CZ'), gameNumber: 3 },
        { score: 320, date: new Date(Date.now() - 1800000).toLocaleString('cs-CZ'), gameNumber: 4 },
        { score: 210, date: new Date().toLocaleString('cs-CZ'), gameNumber: 5 }
    ];
    
    gameHistory = testGames;
    gameStats.totalGames = 5;
    gameStats.totalScore = testGames.reduce((sum, game) => sum + game.score, 0);
    gameStats.bestStreak = 4;
    
    localStorage.setItem('snakeGameHistory', JSON.stringify(gameHistory));
    localStorage.setItem('snakeGameStats', JSON.stringify(gameStats));
    
    if (typeof updateHistoryUI === 'function') {
        updateHistoryUI();
    }
    
    console.log("🧪 Testovací historie her přidána!");
}

// TESTOVACÍ FUNKCE - odemkne všechny úspěchy pro testování
function testUnlockAllAchievements() {
    const allAchievements = ['first-game', 'score-100', 'score-500'];
    allAchievements.forEach(achievementId => {
        if (!gameStats.achievements.includes(achievementId)) {
            gameStats.achievements.push(achievementId);
        }
        unlockAchievement(achievementId);
    });
    console.log("🏆 Všechny úspěchy testovací odemčeny!");
}

// Exporty pro globální dostupnost
window.setCurrentSkin = setCurrentSkin;
window.loadCurrentSkin = loadCurrentSkin;
window.snakeSkins = snakeSkins;
window.initializeAchievements = initializeAchievements;
window.checkAchievements = checkAchievements;
window.unlockAchievement = unlockAchievement;
window.testUnlockAllAchievements = testUnlockAllAchievements;
window.addTestGameHistory = addTestGameHistory;
window.updateGameHistory = updateGameHistory;
window.testUnlockAllAchievements = testUnlockAllAchievements;
