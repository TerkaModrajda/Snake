// ============================================
// SPRÁVA BONUSŮ
// ============================================

/**
 * Centrální správa všech bonusů v hře
 * Koordinuje generování, timery a efekty bonusů
 */

/**
 * Aktualizace všech bonusových systémů
 * @param {number} currentTime Aktuální čas
 */
function updateBonuses(currentTime) {
    // Pouze pokud je alespoň 5 snědených jídel
    if (gameState.foodEaten < GAME_CONFIG.PROGRESSION.BONUS_START) {
        return;
    }

    const deltaTime = currentTime - gameState.lastUpdateTime;
    
    // Debug při dosažení 5. jídla
    if (gameState.foodEaten === 5 && gameState.score % 50 === 0) {
        console.log(`[DEBUG] Bonusový systém: foodEaten=${gameState.foodEaten}, bonusů na mapě: ${gameState.bonuses.length}, maxBonusů: ${gameState.maxBonusesOnMap}, cooldown: ${gameState.bonusCooldownTimer}`);
    }

    // Nastav maximální počet bonusů podle progrese
    gameState.maxBonusesOnMap = gameState.foodEaten >= 25 ? 2 : 1;

    // 1. Správa efektů bonusů (slow, speed, penalty)
    manageBonusEffects(deltaTime);

    // 2. Správa magnet efektu (nezávisle)
    manageMagnetEffect(currentTime);

    // 3. Správa bonusů na mapě
    manageBonusesOnMap(deltaTime);

    // 4. Správa cooldownu
    manageBonusCooldown(deltaTime);

    // 5. Generování nových bonusů
    tryGenerateNewBonus(currentTime);
}

/**
 * Správa standardních bonusových efektů
 * @param {number} deltaTime Čas od posledního updatu
 */
function manageBonusEffects(deltaTime) {
    if (gameState.bonusEffectActive) {
        gameState.bonusEffectTimer -= deltaTime;

        // Pokud efekt vypršel, deaktivuj ho
        if (gameState.bonusEffectTimer <= 0) {
            deactivateBonusEffect();
        }
    }
}

/**
 * Správa magnet efektu
 * @param {number} currentTime Aktuální čas
 */
function manageMagnetEffect(currentTime) {
    if (gameState.magnetEffectActive) {
        const elapsed = currentTime - gameState.magnetEffectStartTime;

        // Pokud magnet efekt vypršel, deaktivuj ho
        if (elapsed > GAME_CONFIG.TIMINGS.BONUS_EFFECT) {
            deactivateMagnetEffect();
        }
    }
}

/**
 * Správa bonusů na mapě (countdown jejich zmizení)
 * @param {number} deltaTime Čas od posledního updatu
 */
function manageBonusesOnMap(deltaTime) {
    if (gameState.bonuses.length > 0 && deltaTime > 100) {
        console.log(`[DEBUG] manageBonusesOnMap: deltaTime=${deltaTime}, bonusů=${gameState.bonuses.length}`);
    }
    
    for (let i = gameState.bonuses.length - 1; i >= 0; i--) {
        const bonus = gameState.bonuses[i];
        bonus.timer -= deltaTime;

        // Debug při rychlém mizení
        if (bonus.timer <= 0 && deltaTime > 1000) {
            console.log(`[WARNING] Bonus ${bonus.type} zmizel kvůli velkému deltaTime: ${deltaTime}ms`);
        }

        // Pokud čas vypršel, odstraň bonus
        if (bonus.timer <= 0) {
            gameState.bonuses.splice(i, 1);
            console.log(`[BonusManager] Bonus ${bonus.type} zmizel z mapy (zbývalo ${bonus.timer}ms)`);
        }
    }
}

/**
 * Správa cooldownu pro generování bonusů
 * @param {number} deltaTime Čas od posledního updatu
 */
function manageBonusCooldown(deltaTime) {
    if (gameState.bonusCooldownTimer > 0) {
        gameState.bonusCooldownTimer -= deltaTime;
    }
}

/**
 * Pokus o vygenerování nového bonusu
 * @param {number} currentTime Aktuální čas
 */
function tryGenerateNewBonus(currentTime) {
    // Kontroly pro generování bonusu
    const canGenerate = 
        gameState.bonuses.length < gameState.maxBonusesOnMap &&
        gameState.bonusCooldownTimer <= 0;

    // Debug log pokusů o generování (každých 2 sekundy)
    if (gameState.foodEaten >= 5 && Math.floor(currentTime / 2000) > Math.floor((currentTime - 100) / 2000)) {
        console.log(`[BONUS] Stav systému: bonuses=${gameState.bonuses.length}/${gameState.maxBonusesOnMap}, cooldown=${Math.max(0, gameState.bonusCooldownTimer).toFixed(0)}ms, canGenerate=${canGenerate}`);
    }

    if (canGenerate) {
        const bonusType = selectRandomBonusType();
        console.log(`[BONUS] Generuji bonus typu: ${bonusType}`);
        generateBonus(bonusType);
        
        gameState.lastBonusSpawn = currentTime;
        gameState.bonusCooldownTimer = GAME_CONFIG.TIMINGS.BONUS_COOLDOWN;
        
        console.log(`[BONUS] Bonus ${bonusType} vygenerován! Celkem bonusů na mapě: ${gameState.bonuses.length}`);
    }
}

/**
 * Výběr náhodného typu bonusu
 * @returns {string} Typ bonusu
 */
function selectRandomBonusType() {
    const bonusTypes = ['slow', 'magnet', 'frenzy', 'penalty', 'speed'];
    return bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
}

/**
 * Generování bonusu na mapě
 * @param {string} bonusType Typ bonusu
 */
function generateBonus(bonusType) {
    const position = generateFood(); // Použije stejnou logiku jako jídlo
    
    if (position) {
        const bonus = {
            x: position.x,
            y: position.y,
            type: bonusType,
            timer: GAME_CONFIG.TIMINGS.BONUS_DURATION,
            createdAt: Date.now()
        };
        
        gameState.bonuses.push(bonus);
        
        // Zobraz notifikaci o spawnu bonusu
        const msg = getBonusSpawnMessage(bonusType);
        showGameNotification(`${msg.icon} ${msg.title}`, 'Rychle! Zmizí za 5 sekund!', msg.color);
        
        console.log(`[BonusManager] Bonus ${bonusType} vygenerován na [${bonus.x}, ${bonus.y}]`);
        console.log(`[BonusManager] Celkem bonusů na mapě: ${gameState.bonuses.length}`);
    }
}

/**
 * Aktivace efektu bonusu
 * @param {string} bonusType Typ bonusu
 */
function activateBonusEffect(bonusType) {
    if (bonusType === 'frenzy') {
        startFoodFrenzy();
        showBonusActivationMessage(bonusType);
        return;
    }

    if (bonusType === 'magnet') {
        activateMagnetEffect();
        showBonusActivationMessage(bonusType);
        return;
    }

    // Standardní bonusy (slow, speed, penalty)
    if (!gameState.bonusEffectActive) {
        gameState.bonusEffectActive = true;
        gameState.bonusEffectTimer = GAME_CONFIG.TIMINGS.BONUS_EFFECT;

        applyBonusEffect(bonusType);
        showBonusActivationMessage(bonusType);
        
        console.log(`[BonusManager] Efekt ${bonusType} aktivován na ${GAME_CONFIG.TIMINGS.BONUS_EFFECT / 1000}s`);
    }
}

/**
 * Aplikuje efekt konkrétního bonusu
 * @param {string} bonusType Typ bonusu
 */
function applyBonusEffect(bonusType) {
    switch (bonusType) {
        case 'slow':
            gameState.speedBeforeBonus = gameState.gameSpeed;
            gameState.gameSpeed += GAME_CONFIG.SPEED.SLOW_BONUS_INCREASE;
            break;
            
        case 'speed':
            gameState.speedBeforeBonus = gameState.gameSpeed;
            gameState.gameSpeed = Math.max(gameState.gameSpeed - 50, 50);
            break;
            
        case 'penalty':
            gameState.score = Math.max(gameState.score - 50, 0);
            shortenSnake();
            updateScore();
            break;
    }
}

/**
 * Deaktivace bonusového efektu
 */
function deactivateBonusEffect() {
    if (gameState.speedBeforeBonus > 0) {
        gameState.gameSpeed = gameState.speedBeforeBonus;
        gameState.speedBeforeBonus = 0;
    }
    
    gameState.bonusEffectActive = false;
    gameState.bonusEffectTimer = 0;
    
    console.log("[BonusManager] Bonusový efekt deaktivován");
}

/**
 * Zobrazí zprávu o aktivaci bonusu
 * @param {string} bonusType Typ bonusu
 */
function showBonusActivationMessage(bonusType) {
    const msg = getBonusActivationMessage(bonusType);
    showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
    showFloatingText(msg.floatingText, gameState.snake[0].x, gameState.snake[0].y, msg.color);
}

/**
 * Vrací zprávu pro spawn bonusu
 * @param {string} bonusType Typ bonusu
 * @returns {Object} Zpráva
 */
function getBonusSpawnMessage(bonusType) {
    const messages = {
        slow: { icon: '🐌', title: 'ZPOMALENÍ', color: '#3498db' },
        magnet: { icon: '🧲', title: 'MAGNET', color: '#9b59b6' },
        frenzy: { icon: '💰', title: 'FRENZY', color: '#f39c12' },
        penalty: { icon: '💀', title: 'PENALTA', color: '#e74c3c' },
        speed: { icon: '⚡', title: 'RYCHLOST', color: '#f39c12' }
    };
    return messages[bonusType] || messages.slow;
}

/**
 * Vrací zprávu pro aktivaci bonusu
 * @param {string} bonusType Typ bonusu
 * @returns {Object} Zpráva
 */
function getBonusActivationMessage(bonusType) {
    const messages = {
        slow: { 
            icon: '🐌', title: 'ZPOMALENÍ!', 
            text: 'Had se zpomalí na 8 sekund!', 
            color: '#3498db', floatingText: 'SLOW!' 
        },
        magnet: { 
            icon: '🧲', title: 'MAGNET!', 
            text: 'Jídla se přitahují k hadovi!', 
            color: '#9b59b6', floatingText: 'MAGNET!' 
        },
        frenzy: { 
            icon: '💰', title: 'FOOD FRENZY!', 
            text: '15 jídel na 10 sekund!', 
            color: '#f39c12', floatingText: 'FRENZY!' 
        },
        penalty: { 
            icon: '💀', title: 'PENALTA!', 
            text: '-50 bodů a zkrácení!', 
            color: '#e74c3c', floatingText: '-50!' 
        },
        speed: { 
            icon: '⚡', title: 'RYCHLOST!', 
            text: 'Had se zrychlí na 8 sekund!', 
            color: '#f39c12', floatingText: 'SPEED!' 
        }
    };
    return messages[bonusType] || messages.slow;
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.activateBonusEffect = activateBonusEffect;
    window.deactivateBonusEffect = deactivateBonusEffect;
    window.updateBonuses = updateBonuses;
    window.getBonusActivationMessage = getBonusActivationMessage;
    window.generateBonus = generateBonus;
    window.selectRandomBonusType = selectRandomBonusType;
}

console.log("[BonusManager] Správa bonusů načtena");
