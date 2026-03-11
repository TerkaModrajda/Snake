// ============================================
// TIMER SYSTÉM
// ============================================

// Aktualizace timerů (nezávisle na pohybu hada)
function updateTimers(currentTime) {
    // Timer pro jídlo (pokud je aktivní)
    if (gameState.timedFood && gameState.gameRunning && !gameState.gamePaused) {
        const deltaTime = currentTime - gameState.lastUpdateTime;
        gameState.foodTimer -= deltaTime;

        // Pokud čas vypršel, přesuň všechna jídla
        if (gameState.foodTimer <= 0) {
            console.log(`[DEBUG] Timer vypršel! Přesouvám jídla. multiFood=${gameState.multiFood}, foods.length=${gameState.foods.length}`);
            
            // Přesuň hlavní jídlo
            gameState.food = generateFood();
            
            // Přesuň všechna další jídla (pokud existují)
            if (gameState.multiFood && gameState.foods.length > 0) {
                const oldCount = gameState.foods.length;
                gameState.foods = generateMultipleFoods(gameState.foods.length);
                console.log(`[DEBUG] Přesunul jsem ${oldCount} jídel, nový počet: ${gameState.foods.length}`);
            }
            
            gameState.foodTimer = gameState.foodMaxTime;
            penalizeMissedFood();
            animateMissedFood();
        }
    }
    
    // NOVÉ - Správa super jídla
    manageSuperFood(currentTime);
    
    // NOVÉ - Správa bonus zpomalení
    manageBonuses(currentTime);
    
    // NOVÉ - Správa Food Frenzy (vždy, aby fungoval countdown)
    manageFoodFrenzy(currentTime);
    
    // === Správa kamenů (rocks) ===
    manageRocks(currentTime);
    
    moveFoodIfNeeded(currentTime);
    gameState.lastUpdateTime = currentTime;
}

// NOVÁ funkce - správa super jídla
function manageSuperFood(currentTime) {
    // Pouze pokud je alespoň 5 snědených jídel
    if (gameState.foodEaten < 5) {
        return;
    }
    
    // Pokud je super jídlo aktivní, odpočítávej čas
    if (gameState.superFoodActive && gameState.superFood) {
        const deltaTime = currentTime - gameState.lastUpdateTime;
        gameState.superFoodTimer -= deltaTime;
        
        // Pokud čas vypršel, deaktivuj super jídlo
        if (gameState.superFoodTimer <= 0) {
            gameState.superFoodActive = false;
            gameState.superFood = null;
            gameState.lastSuperFoodSpawn = currentTime;
            
            // Obnov správný počet normálních jídel
            restoreCorrectFoodCount();
            
            console.log("Super jídlo zmizelo!");
        }
    } 
    // Pokud není aktivní, zkontroluj, zda je čas na nové
    else if (currentTime - gameState.lastSuperFoodSpawn >= gameState.superFoodSpawnInterval) {
        // Vytvoř nové super jídlo
        gameState.superFood = generateSuperFood();
        gameState.superFoodActive = true;
        gameState.superFoodTimer = gameState.superFoodMaxTime;
        
        showGameNotification('🌟✨ SUPER JÍDLO!', 'Rychle! Zmizí za 5 sekund!', '#f1c40f');
        console.log("Super jídlo se objevilo!");
    }
}

// NOVÁ funkce - správa bonusů (více bonusů současně)
function manageBonuses(currentTime) {
    // Pouze pokud je alespoň 5 snědených jídel
    if (gameState.foodEaten < GAME_CONFIG.PROGRESSION.BONUS_START) {
        return;
    }
    
    const deltaTime = currentTime - gameState.lastUpdateTime;
    
    // Nastav maximální počet bonusů podle progrese
    gameState.maxBonusesOnMap = gameState.foodEaten >= 25 ? 2 : 1;
    
    // 1. Správa efektu bonusu (pokud je aktivní) - trvá 8 sekund
    if (gameState.bonusEffectActive) {
        gameState.bonusEffectTimer -= deltaTime;
        
        // Pokud efekt vypršel (8 sekund), deaktivuj ho
        if (gameState.bonusEffectTimer <= 0) {
            deactivateBonusEffect();
            console.log("Efekt bonusu skončil");
        }
    }
    
    // 1b. Správa magnet efektu (nezávisle na ostatních bonusech)
    if (gameState.magnetEffectActive) {
        const elapsed = Date.now() - gameState.magnetEffectStartTime;
        
        // Pokud magnet efekt vypršel (8 sekund), deaktivuj ho
        if (elapsed > GAME_CONFIG.TIMINGS.BONUS_EFFECT) {
            console.log('MAGNET: Čas vypršel, efekt se vypíná...');
            deactivateMagnetEffect();
        }
    }
    
    // 2. Správa bonusů na mapě (odpočítávej čas pro všechny)
    for (let i = gameState.bonuses.length - 1; i >= 0; i--) {
        const bonus = gameState.bonuses[i];
        bonus.timer -= deltaTime;
        
        // Pokud čas vypršel (5 sekund), odstraň bonus
        if (bonus.timer <= 0) {
            gameState.bonuses.splice(i, 1);
            console.log(`Bonus ${bonus.type} zmizelo z mapy!`);
        }
    }
    
    // 3. Správa cooldownu (3 sekundy mezi bonusy)
    if (gameState.bonusCooldownTimer > 0) {
        gameState.bonusCooldownTimer -= deltaTime;
    }
    
    // 4. Spawnutí nového bonusu (pokud je místo a není cooldown)
    if (gameState.bonuses.length < gameState.maxBonusesOnMap && 
        gameState.bonusCooldownTimer <= 0) {
        
        // Náhodná šance na spawn (základní 2% šance každý frame)
        const randomChance = Math.random();
        const spawnChance = GAME_CONFIG.PROBABILITY.BONUS_BASE_CHANCE;
        
        if (randomChance < spawnChance) {
            // Náhodně vyber typ bonusu
            const bonusTypes = ['slow', 'magnet', 'frenzy', 'penalty', 'speed'];
            const selectedType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
            
            // Vytvoř nový bonus
            const newBonus = generateBonus(selectedType);
            newBonus.type = selectedType;
            newBonus.timer = GAME_CONFIG.TIMINGS.BONUS_DURATION; // 5 sekund
            
            gameState.bonuses.push(newBonus);
            gameState.bonusCooldownTimer = GAME_CONFIG.TIMINGS.BONUS_COOLDOWN; // používá konfiguraci
            
            let msgKey;
            if (selectedType === 'slow') {
                msgKey = 'SLOW_BONUS_SPAWN';
            } else if (selectedType === 'magnet') {
                msgKey = 'MAGNET_BONUS_SPAWN';
            } else if (selectedType === 'frenzy') {
                msgKey = 'FRENZY_BONUS_SPAWN';
            } else if (selectedType === 'penalty') {
                msgKey = 'PENALTY_BONUS_SPAWN';
            } else if (selectedType === 'speed') {
                msgKey = 'SPEED_BONUS_SPAWN';
            }
            const msg = CONFIG.getMessage(msgKey);
            showGameNotification(`${msg.icon} ${msg.title}`, 'Rychle! Zmizí za 5 sekund!', msg.color);
            console.log(`Bonus ${selectedType} se objevil na 5 sekund! (${gameState.bonuses.length}/${gameState.maxBonusesOnMap})`);
        }
    }
}

// NOVÁ funkce - správa Food Frenzy
function manageFoodFrenzy(currentTime) {
    // Pouze pokud je alespoň 5 snědených jídel
    if (gameState.foodEaten < GAME_CONFIG.FRENZY.START_AFTER) {
        return;
    }
    
    // Debug při prvním volání
    if (gameState.foodEaten === 5 && !gameState.frenzyActive) {
        console.log('[DEBUG] manageFoodFrenzy: Frenzy systém je aktivní od 5. jídla');
    }
    
    const deltaTime = currentTime - gameState.lastUpdateTime;
    
    // 1. Správa aktivní Food Frenzy (pokud běží)
    if (gameState.frenzyActive) {
        gameState.frenzyTimer -= deltaTime;
        
        // Debug log každou sekundu
        if (Math.floor(gameState.frenzyTimer / 1000) !== Math.floor((gameState.frenzyTimer + deltaTime) / 1000)) {
            console.log(`[DEBUG] Frenzy timer: ${Math.ceil(gameState.frenzyTimer / 1000)} sekund zbývá`);
        }
        
        // Pokud frenzy skončilo (10 sekund)
        if (gameState.frenzyTimer <= 0) {
            endFoodFrenzy();
        }
    }
    

}

// Spuštění Food Frenzy
function startFoodFrenzy() {
    if (gameState.frenzyActive) {
        // Pokud je frenzy už aktivní, pouze resetuj timer
        gameState.frenzyTimer = gameState.frenzyDuration; // Reset na plných 10 sekund
        console.log(`[FRENZY] Frenzy prodlouženo - timer resetován na ${gameState.frenzyDuration / 1000}s`);
        return;
    }
    
    console.log("Spouští se Food Frenzy!");
    
    // Aktivuj nový frenzy
    gameState.frenzyActive = true;
    gameState.frenzyTimer = gameState.frenzyDuration; // 10 sekund
    
    // OPRAVA: Ujisti se, že lastUpdateTime je nastaven správně
    if (gameState.lastUpdateTime === 0) {
        gameState.lastUpdateTime = Date.now();
    }
    
    console.log(`[DEBUG] Frenzy timer nastaven na ${gameState.frenzyTimer}ms, lastUpdateTime=${gameState.lastUpdateTime}`);
    
    // Ulož současný počet jídel
    gameState.normalFoodCountBeforeFrenzy = gameState.foods.length;
    
    // Vygeneruj 15 jídel pro frenzy
    gameState.frenzyFoods = [];
    console.log(`[FRENZY] Generuji ${GAME_CONFIG.FRENZY.FOOD_COUNT} frenzy jídel`);
    
    for (let i = 0; i < GAME_CONFIG.FRENZY.FOOD_COUNT; i++) {
        const frenzyFood = generateFood();
        if (frenzyFood) {
            gameState.frenzyFoods.push(frenzyFood);
            console.log(`[FRENZY] Jídlo ${i+1} vygenerováno na [${frenzyFood.x}, ${frenzyFood.y}]`);
        } else {
            console.error(`[FRENZY] Nepodařilo se vygenerovat jídlo ${i+1}`);
        }
    }
    
    console.log(`[FRENZY] Celkem vygenerováno ${gameState.frenzyFoods.length} frenzy jídel`);
    
    // Zobraz notifikaci
    showGameNotification('🍎💥 FOOD FRENZY!', 'Objevilo se mnoho jídel na 10 sekund!', '#e67e22');
    
    console.log(`Food Frenzy aktivováno s ${gameState.frenzyFoods.length} jídly na ${gameState.frenzyDuration / 1000} sekund!`);
}

// Ukončení Food Frenzy
function endFoodFrenzy() {
    if (!gameState.frenzyActive) return;
    
    console.log("Food Frenzy končí!");
    
    // Deaktivuj frenzy
    gameState.frenzyActive = false;
    gameState.frenzyTimer = 0;
    gameState.frenzyFoods = [];
    
    // Vrať normální počet jídel podle aktuální úrovně
    resetFoodsToNormalCount();
    
    // Zobraz notifikaci
    showGameNotification('⏰ FRENZY KONEC!', 'Food Frenzy skončil!', '#95a5a6');
    
    console.log("Food Frenzy ukončeno, návrat k normálnímu režimu");
}

// Vrácení k normálnímu počtu jídel podle úrovně
function resetFoodsToNormalCount() {
    // Určit správný počet jídel podle progress
    let normalCount = 1; // základní jídlo
    
    if (gameState.foodEaten >= GAME_CONFIG.PROGRESSION.PENTA_FOOD_START) {
        normalCount = 5;
    } else if (gameState.foodEaten >= GAME_CONFIG.PROGRESSION.QUAD_FOOD_START) {
        normalCount = 4;
    } else if (gameState.foodEaten >= GAME_CONFIG.PROGRESSION.TRIPLE_FOOD_START) {
        normalCount = 3;
    } else if (gameState.foodEaten >= GAME_CONFIG.PROGRESSION.MULTI_FOOD_START) {
        normalCount = 2;
    }
    
    // Vygeneruj správný počet normálních jídel
    gameState.foods = [];
    for (let i = 0; i < normalCount; i++) {
        const food = generateFood();
        if (food) {
            gameState.foods.push(food);
        }
    }
    
    console.log(`Obnoveno ${normalCount} normálních jídel podle úrovně ${gameState.foodEaten}`);
}

// Penalizace za nestihlé jídlo
function penalizeMissedFood() {
    if (gameState.snake.length > 1) {
        gameState.snake.pop();
        gameState.score = Math.max(0, gameState.score - 5);
        // Make the snake slower
        gameState.gameSpeed = Math.min(gameState.gameSpeed + 30, 400); // Increase speed value (slower), max 400ms
        updateScore();
        showGameNotification('💥 ZKRÁCEN!', 'Nestihl jsi to včas - ztratil jsi kostičku, 5 bodů a zpomalil!', '#e74c3c');
        animateShrink();
        animateScoreLoss();
        showFloatingText('-5', gameState.food.x, gameState.food.y, '#e74c3c');
        console.log(`Had se zkrátil! Délka: ${gameState.snake.length}, Skóre: ${gameState.score}, Speed: ${gameState.gameSpeed}`);
    } else {
        endGame();
        showGameNotification('💀 GAME OVER!', 'Byl jsi příliš pomalý!', '#c0392b');
    }
}

function animateMissedFood() {
    console.log("Jídlo zmizelo! Nové jídlo se objevilo.");
}

// === Správa kamenů (rocks) ===
function manageRocks(currentTime) {
    // Only if game is running and not paused
    if (!gameState.gameRunning || gameState.gamePaused) return;

    // Use elapsed time since game start for rocks
    const elapsed = gameState.rockStartTime ? currentTime - gameState.rockStartTime : 0;

    // Stage progression: 1 rock at 1:00, 3 rocks at 1:30, 5 rocks at 2:00, wall at 2:30
    if (elapsed < 60000) {
        // Before 1 minute, no rocks
        gameState.rockStage = 0;
        gameState.rockCount = 0;
        gameState.rocks = [];
        return;
    }
    if (gameState.rockStage === 0 && elapsed >= 60000) {
        gameState.rockStage = 1;
        gameState.rockCount = 1;
        gameState.rocks = generateRocks(gameState.rockCount);
        gameState.lastRockMoveTime = currentTime;
    } else if (gameState.rockStage === 1 && elapsed >= 90000) {
        gameState.rockStage = 2;
        gameState.rockCount = 3;
        gameState.rocks = generateRocks(gameState.rockCount);
        gameState.lastRockMoveTime = currentTime;
    } else if (gameState.rockStage === 2 && elapsed >= 120000) {
        gameState.rockStage = 3;
        gameState.rockCount = 5;
        gameState.rocks = generateRocks(gameState.rockCount);
        gameState.lastRockMoveTime = currentTime;
    } else if (gameState.rockStage === 3 && elapsed >= 150000) {
        gameState.rockStage = 4;
        gameState.rockCount = 6; // 3 rocks as wall + 3 singles
        gameState.rocks = generateRocksWithWall();
        gameState.lastRockMoveTime = currentTime;
    }

    // Move rocks every 15 seconds
    if (gameState.rockStage > 0 && currentTime - gameState.lastRockMoveTime >= 15000) {
        if (gameState.rockStage === 4) {
            gameState.rocks = generateRocksWithWall();
        } else {
            gameState.rocks = generateRocks(gameState.rockCount);
        }
        gameState.lastRockMoveTime = currentTime;
    }
}

// Helper: Generate rocks, ensuring snake is not fully blocked
function generateRocks(count) {
    // Try to place rocks randomly, but never block all escape paths
    let rocks = [];
    let attempts = 0;
    while (rocks.length < count && attempts < 100) {
        attempts++;
        const rx = Math.floor(Math.random() * GAME_CONFIG.CANVAS.GRID_COUNT);
        const ry = Math.floor(Math.random() * GAME_CONFIG.CANVAS.GRID_COUNT);
        // Don't place on snake, food, or another rock
        const onSnake = gameState.snake.some(seg => seg.x === rx && seg.y === ry);
        const onFood = (gameState.food && gameState.food.x === rx && gameState.food.y === ry);
        const onOtherRock = rocks.some(r => r.x === rx && r.y === ry);
        if (!onSnake && !onFood && !onOtherRock) {
            rocks.push({x: rx, y: ry});
        }
    }
    // TODO: Add pathfinding check to ensure snake is not fully blocked
    return rocks;
}

// New: Generate rocks with a wall (3 rocks in a row) and singles
function generateRocksWithWall() {
    const rocks = [];
    const grid = GAME_CONFIG.CANVAS.GRID_COUNT;
    let wallPlaced = false;
    let attempts = 0;
    // Try to place a wall (horizontal or vertical)
    while (!wallPlaced && attempts < 100) {
        attempts++;
        const horizontal = Math.random() < 0.5;
        if (horizontal) {
            const y = Math.floor(Math.random() * grid);
            const x = Math.floor(Math.random() * (grid - 2));
            // Check snake is not blocked
            const blocksSnake = gameState.snake.some(seg => seg.y === y && seg.x >= x && seg.x <= x + 2);
            if (!blocksSnake) {
                rocks.push({x: x, y: y});
                rocks.push({x: x + 1, y: y});
                rocks.push({x: x + 2, y: y});
                wallPlaced = true;
            }
        } else {
            const x = Math.floor(Math.random() * grid);
            const y = Math.floor(Math.random() * (grid - 2));
            const blocksSnake = gameState.snake.some(seg => seg.x === x && seg.y >= y && seg.y <= y + 2);
            if (!blocksSnake) {
                rocks.push({x: x, y: y});
                rocks.push({x: x, y: y + 1});
                rocks.push({x: x, y: y + 2});
                wallPlaced = true;
            }
        }
    }
    // Place remaining rocks as singles
    let singles = 3;
    let singleAttempts = 0;
    while (rocks.length < 6 && singleAttempts < 100) {
        singleAttempts++;
        const rx = Math.floor(Math.random() * grid);
        const ry = Math.floor(Math.random() * grid);
        // Don't place on snake, food, or another rock
        const onSnake = gameState.snake.some(seg => seg.x === rx && seg.y === ry);
        const onFood = (gameState.food && gameState.food.x === rx && gameState.food.y === ry);
        const onOtherRock = rocks.some(r => r.x === rx && r.y === ry);
        if (!onSnake && !onFood && !onOtherRock) {
            rocks.push({x: rx, y: ry});
        }
    }
    // TODO: Add pathfinding check to ensure snake is not fully blocked
    return rocks;
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.updateTimers = updateTimers;
    window.resetAllTimers = resetAllTimers;
    window.animateMissedFood = animateMissedFood;
    window.startFoodFrenzy = startFoodFrenzy;
    window.endFoodFrenzy = endFoodFrenzy;
}

console.log("[Timers] Timer systém načten");
