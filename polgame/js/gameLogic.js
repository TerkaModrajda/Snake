// ============================================
// HERNÍ LOGIKA
// ============================================

// Konfigurace zpráv
const CONFIG = {
    getMessage: function(key) {
        const messages = {
            'MOVING_FOOD': {
                icon: '🏃',
                title: 'POHYBLIVÉ JÍDLO!',
                text: 'Jídlo se teď pohybuje!',
                color: '#9b59b6'
            },
            'ARROW_HIDE': {
                icon: '👻',
                title: 'ŠIPKA ZMIZELA!',
                text: 'Šipka směru už se nezobrazuje!',
                color: '#95a5a6'
            },
            'FAST_FOOD': {
                icon: '💨',
                title: 'RYCHLÉ JÍDLO!',
                text: 'Jídlo se pohybuje rychleji!',
                color: '#d35400'
            },
            'MULTI_FOOD': {
                icon: '🍎🍎',
                title: 'VÍCE JÍDLA!',
                text: 'Teď je na mapě více jídel současně!',
                color: '#27ae60'
            },
            'TRIPLE_FOOD': {
                icon: '🍎🍎🍎',
                title: 'TŘI JÍDLA!',
                text: 'Teď jsou na mapě 3 jídla!',
                color: '#16a085'
            },
            'QUAD_FOOD': {
                icon: '🍎🍎🍎🍎',
                title: 'ČTYŘI JÍDLA!',
                text: 'Teď jsou na mapě 4 jídla!',
                color: '#2980b9'
            },
            'PENTA_FOOD': {
                icon: '🍎🍎🍎🍎🍎',
                title: 'PĚT JÍDEL!',
                text: 'Teď je na mapě 5 jídel!',
                color: '#8e44ad'
            },
            'SLOW_BONUS_ACTIVATED': {
                icon: '🐌',
                title: 'ZPOMALENÍ!',
                text: 'Had se pohybuje pomaleji na 8 sekund!',
                color: '#3498db'
            },
            'MAGNET_BONUS_ACTIVATED': {
                icon: '🧲',
                title: 'MAGNET!',
                text: 'Všechna jídla přitážena k hadovi!',
                color: '#e74c3c'
            },
            'PENALTY_BONUS_ACTIVATED': {
                icon: '💀',
                title: 'TREST!',
                text: 'Ztráta 50 bodů!',
                color: '#c0392b'
            },
            'SPEED_BONUS_ACTIVATED': {
                icon: '⚡',
                title: 'ZRYCHLENÍ!',
                text: 'Had se pohybuje rychleji na 8 sekund!',
                color: '#f39c12'
            },
            'FRENZY_START': {
                icon: '🍎💥',
                title: 'FOOD FRENZY!',
                text: 'Objevilo se mnoho jídel na 10 sekund!',
                color: '#e67e22'
            },
            'BONUS_ENDED': {
                icon: '⏰',
                title: 'BONUS UKONČEN',
                text: 'Efekt bonusu vypršel',
                color: '#95a5a6'
            },
            'FRENZY_END': {
                icon: '⏰',
                title: 'FRENZY KONEC!',
                text: 'Food Frenzy skončil!',
                color: '#95a5a6'
            }
        };
        return messages[key] || { icon: '❓', title: 'Neznámá zpráva', text: '', color: '#95a5a6' };
    }
};

// Handling vstupů z klávesnice
function handleKeydown(e) {
    // Zabránění scrollování při používání šipek a mezerníku
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
    
    // Pokud hra ještě nezačala - jen ENTER spustí hru
    if (!gameState.gameStarted) {
        if (e.key === 'Enter') {
            startGame();
        }
        return;
    }
    
    // Pokud je hra ukončena - jen ENTER restartuje
    if (!gameState.gameRunning && !gameState.gamePaused && gameState.gameStarted) {
        if (e.key === 'Enter') {
            restartGame();
        }
        return;
    }
    
    // Mezerník pro pauzu
    if (e.key === ' ') {
        togglePause();
        return;
    }
    
    // Pohyb hada (pouze pokud hra běží a není pozastavena)
    if (gameState.gameRunning && !gameState.gamePaused) {
        // Normální ovládání hada - šipky vždy ovládají jen hada
        switch (e.key) {
            case 'ArrowUp':
                if (gameState.direction.y === 0) {
                    gameState.direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (gameState.direction.y === 0) {
                    gameState.direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (gameState.direction.x === 0) {
                    gameState.direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (gameState.direction.x === 0) {
                    gameState.direction = { x: 1, y: 0 };
                }
                break;
        }
    }
}

// Handling směrových inputů
function handleDirectionInput(direction) {
    // Pokud hra nezačala, spusť ji
    if (!gameState.gameStarted) {
        startGame();
        return;
    }
    
    // Pokud je konec hry, ignoruj tlačítka
    if (!gameState.gameRunning && !gameState.gamePaused && gameState.gameStarted) {
        return;
    }
    
    // Pokud hra neběží, spusť ji
    if (!gameState.gameRunning) {
        startGame();
    }

    // Změna směru (jen pokud hra běží a není pozastavena)
    if (gameState.gameRunning && !gameState.gamePaused) {
        switch (direction) {
            case 'up':
                if (gameState.direction.y === 0) {
                    gameState.direction = { x: 0, y: -1 };
                }
                break;
            case 'down':
                if (gameState.direction.y === 0) {
                    gameState.direction = { x: 0, y: 1 };
                }
                break;
            case 'left':
                if (gameState.direction.x === 0) {
                    gameState.direction = { x: -1, y: 0 };
                }
                break;
            case 'right':
                if (gameState.direction.x === 0) {
                    gameState.direction = { x: 1, y: 0 };
                }
                break;
        }
    }
}

// Inicializace hry
function initGame() {
    // Nastavení počátečního stavu
    gameState.snake = [{ x: 10, y: 10 }];
    gameState.food = generateFood();
    gameState.foods = [];
    gameState.multiFood = false;
    gameState.direction = { x: 0, y: 0 };
    gameState.score = 0;
    gameState.gameRunning = false;
    gameState.gamePaused = false;
    gameState.gameStarted = false;
    gameState.foodEaten = 0;
    gameState.timedFood = false;
    gameState.foodTimer = 0;
    gameState.gameSpeed = gameState.baseSpeed;
    gameState.lastUpdateTime = 0;
    gameState.lastMoveTime = 0;
    gameState.movingFood = false;
    gameState.food.direction = { x: 0, y: 0 };
    gameState.lastFoodMoveTime = 0;
    
    // KOMPLETNÍ RESET super jídla
    gameState.superFood = null;
    gameState.superFoodActive = false;
    gameState.superFoodTimer = 0;
    gameState.lastSuperFoodSpawn = 0;
    
    // KOMPLETNÍ RESET bonusového systému
    gameState.bonuses = [];
    gameState.bonusEffectActive = false;
    gameState.bonusEffectTimer = 0;
    gameState.bonusCooldownTimer = 0;
    gameState.speedBeforeBonus = 0;
    gameState.lastBonusSpawn = 0;
    gameState.maxBonusesOnMap = 1;
    
    // KOMPLETNÍ RESET magnet efektů
    gameState.magnetEffectActive = false;
    gameState.magnetEffectStartTime = 0;
    gameState.magnetAnimations = [];
    
    // KOMPLETNÍ RESET Food Frenzy systému
    gameState.frenzyActive = false;
    gameState.frenzyTimer = 0;
    gameState.frenzyFoods = [];
    gameState.normalFoodCountBeforeFrenzy = 0;
    
    // RESET starého bonus zpomalení (pro kompatibilitu)
    gameState.slowBonus = null;
    
    console.log("[DEBUG] initGame: Kompletní reset všech bonusových efektů dokončen");
    
    // VYČIŠTĚNÍ VIZUÁLNÍCH INDIKÁTORŮ
    clearAllVisualEffects();
    
    // Odeber třídu pro rozjasnění bočních kontejnerů
    document.body.classList.remove('game-active');
    
    updateScore();
    updateHighScore();
    hideGameOver();
    showStartPopup();
    draw();
}

// Hlavní herní smyčka
function gameLoop() {
    if (!gameState.gameRunning || gameState.gamePaused) {
        return;
    }
    
    const currentTime = Date.now();
    
    // Debug log při vysokém skóre
    if (gameState.score >= 80 && gameState.score % 10 === 0) {
        console.log(`[DEBUG] gameLoop: score=${gameState.score}, gameSpeed=${gameState.gameSpeed}, snake.length=${gameState.snake.length}, direction=(${gameState.direction.x},${gameState.direction.y})`);
    }
    
    // Pohyb hada podle gameSpeed
    if (currentTime - gameState.lastMoveTime >= gameState.gameSpeed) {
        update();
        gameState.lastMoveTime = currentTime;
    }
    
    // Timer aktualizace (nezávisle na pohybu hada)
    updateTimers(currentTime);
    
    // Aktualizace bonusů (s nastaveným lastUpdateTime)
    if (typeof updateBonuses === 'function') {
        updateBonuses(currentTime);
        gameState.lastUpdateTime = currentTime;
    }
    
    // Pohyb pohybujícího se jídla
    if (typeof moveFoodIfNeeded === 'function') {
        moveFoodIfNeeded(currentTime);
    }
    
    // Aktualizace magnet efektu
    if (typeof updateMagnetAttraction === 'function') {
        updateMagnetAttraction();
    }
    
    draw();
}

// Aktualizace herního stavu
function update() {
    // Debug log při vysokém skóre
    if (gameState.score >= 80 && gameState.score % 10 === 0) {
        console.log(`[DEBUG] update() start: direction=(${gameState.direction.x},${gameState.direction.y}), head=(${gameState.snake[0].x},${gameState.snake[0].y})`);
    }
    
    // Kontrola, zda má had platný směr
    if (gameState.direction.x === 0 && gameState.direction.y === 0) {
        // Had se nepohybuje - tohle by se nemělo stát během hry
        if (gameState.score >= 80) {
            console.error(`[ERROR] Had nemá nastavený směr! direction=(${gameState.direction.x},${gameState.direction.y})`);
        }
        return; // Nepohybuj hadem, pokud nemá směr
    }
    
    // Pohyb hlavy hada
    const head = { ...gameState.snake[0] };
    head.x += gameState.direction.x;
    head.y += gameState.direction.y;
    
    // Kontrola kolize se stěnami
    if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT) {
        gameOver();
        return;
    }
    
    // Kontrola kolize se sebou samým
    if (gameState.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    gameState.snake.unshift(head);
    
    // Kontrola kolize se super jídlem
    if (checkSuperFoodCollision(head)) {
        // Super jídlo snědeno - +50 bodů, žádné prodloužení hada
        gameState.score += GAME_CONFIG.SCORING.SUPER_FOOD;
        updateScore();
        
        // Deaktivuj super jídlo
        gameState.superFoodActive = false;
        gameState.superFood = null;
        
        // Obnov správný počet normálních jídel
        restoreCorrectFoodCount();
        
        showGameNotification('🌟 SUPER JÍDLO!', '+50 bodů za super jídlo!', '#f1c40f');
        console.log('[SCORE] Super jídlo: +50');
        animateScore();
        
        // Neukončuj funkci - pokračuj v normální logice (zkrátí se had)
    }
    
    // Kontrola kolize s bonusy (může být více současně)
    for (let i = gameState.bonuses.length - 1; i >= 0; i--) {
        const bonus = gameState.bonuses[i];
        if (head.x === bonus.x && head.y === bonus.y) {
            // Bonus sebrán
            const bonusType = bonus.type;
            gameState.bonuses.splice(i, 1);
            
            // Aktivuj efekt bonusu
            activateBonusEffect(bonusType);
            
            console.log(`Bonus ${bonusType} sebrán! Zbývá ${gameState.bonuses.length} bonusů na mapě.`);
            break; // Jeden bonus za frame
        }
    }
    
    // NOVÉ - Kontrola kolize s frenzy jídly
    if (gameState.frenzyActive && gameState.frenzyFoods.length > 0) {
        for (let i = 0; i < gameState.frenzyFoods.length; i++) {
            const frenzyFood = gameState.frenzyFoods[i];
            if (head.x === frenzyFood.x && head.y === frenzyFood.y) {
                // Odstraň snědené frenzy jídlo
                gameState.frenzyFoods.splice(i, 1);
                
                // Přidej body za frenzy jídlo (stejně jako normální)
                gameState.score += GAME_CONFIG.SCORING.NORMAL_FOOD;
                updateScore();
                
                // Zobraz floating text
                console.log('[SCORE] Normální jídlo: +' + GAME_CONFIG.SCORING.NORMAL_FOOD);
                
                // Zvětši hada
                gameState.snake.push({...gameState.snake[gameState.snake.length - 1]});
                
                console.log(`Frenzy jídlo snědeno! Zbývá ${gameState.frenzyFoods.length} frenzy jídel`);
                return;
            }
        }
    }
    
    // Kontrola, zda had snědl hlavní jídlo
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        handleFoodEaten(true); // true = hlavní jídlo
        
        // Resetuj timer pro všechna zbývající jídla
        resetTimerForAllFoods();
        
        return;
    }

    // Kontrola, zda had snědl některé z více jídel
    if (gameState.multiFood && gameState.foods.length > 0) {
        console.log(`[DEBUG] Kontrola multi jídel: ${gameState.foods.length} jídel k dispozici`);
        for (let i = 0; i < gameState.foods.length; i++) {
            const food = gameState.foods[i];
            if (head.x === food.x && head.y === food.y) {
                console.log(`[DEBUG] Multi jídlo ${i} snědeno!`);
                // Odstraň snědené jídlo
                gameState.foods.splice(i, 1);
                
                // Zpracuj snědení vedlejšího jídla
                handleFoodEaten(false); // false = vedlejší jídlo
                
                // Přidej nové jídlo na místo snědeného s pohybem
                const newFood = generateFood();
                if (gameState.movingFood) {
                    newFood.direction = getRandomDirection();
                    newFood.lastMoveTime = Date.now();
                }
                gameState.foods.push(newFood);
                console.log(`[DEBUG] Nové multi jídlo přidáno, celkem: ${gameState.foods.length}`);
                
                // Resetuj timer pro všechna zbývající jídla
                resetTimerForAllFoods();
                
                return; // Zabráníme zkrácení hada
            }
        }
    } else if (gameState.foodEaten >= 15) {
        console.log(`[DEBUG] Multi jídla nejsou k dispozici: multiFood=${gameState.multiFood}, foods.length=${gameState.foods.length}`);
    }
    
    // Pokud nic nebylo snědeno, zkrať hada
    gameState.snake.pop();
    
}

// Handling snědení jídla
function handleFoodEaten(isMainFood = true) {
    gameState.score += 10;
    gameState.foodEaten++;
    updateScore();
    
    // Generuj nové hlavní jídlo pouze pokud se snědlo hlavní jídlo
    if (isMainFood) {
        gameState.food = generateFood();
    }

    // Timer od 3. jídla - zobraz notifikaci jen jednou
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.TIMER_START) {
        gameState.timedFood = true;
        gameState.foodTimer = gameState.foodMaxTime;
        showGameNotification('⏰ ČASOVANÉ JÍDLO!', 'Od teď má jídlo časový limit!', '#e67e22');
    } else if (gameState.foodEaten >= GAME_CONFIG.PROGRESSION.TIMER_START) {
        gameState.foodTimer = gameState.foodMaxTime;
    }

    // Aktivace bonusového systému od 5. jídla
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.BONUS_START) {
        showGameNotification('🎁 BONUSY!', 'Od teď se mohou objevovat bonusy!', '#9b59b6');
        console.log('[BONUS] Bonusový systém aktivován od 5. jídla!');
        
        // Vynuť vygenerování prvního bonusu
        if (typeof generateBonus === 'function' && typeof selectRandomBonusType === 'function') {
            const bonusType = selectRandomBonusType();
            generateBonus(bonusType);
            console.log(`[BONUS] První bonus (${bonusType}) vygenerován!`);
        }
    }

    // Plynulé zrychlování od 5. jídla
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.SPEED_UP_START) {
        gameState.gameSpeed = Math.max(50, gameState.baseSpeed - (gameState.foodEaten - 5) * 10);
        showGameNotification('⚡ ZRYCHLENÍ!', 'Had se pohybuje rychleji!', '#f39c12');
    } else if (gameState.foodEaten > GAME_CONFIG.PROGRESSION.SPEED_UP_START) {
        gameState.gameSpeed = Math.max(50, gameState.baseSpeed - (gameState.foodEaten - 5) * 10);
    }

    // Pohybující se jídlo od 5. jídla
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.MOVING_FOOD_START) {
        gameState.movingFood = true;
        gameState.lastFoodMoveTime = Date.now();
        setRandomFoodDirection();
        const msg = CONFIG.getMessage('MOVING_FOOD');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
    }

    // Skrytí šipky směru po 8. jídle
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.ARROW_HIDE) {
        const msg = CONFIG.getMessage('ARROW_HIDE');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
        console.log('[FOOD] Šipky směru skryty');
    }
    
    // Zrychlování pohybu jídla od 12. jídla
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.FAST_FOOD_START) {
        const msg = CONFIG.getMessage('FAST_FOOD');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
    } else if (gameState.foodEaten > GAME_CONFIG.PROGRESSION.FAST_FOOD_START && gameState.foodEaten % 3 === 0) {
        // Každé třetí jídlo od 12. ukáže upozornění o dalším zrychlení
        showGameNotification('🔥⚡ SPEED UP!', `Jídlo je ještě rychlejší! (${gameState.foodEaten})`, '#d35400');
    }

    // Více jídel od 12. jídla
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.MULTI_FOOD_START) {
        console.log("[DEBUG] Aktivuji multiFood systém!");
        gameState.multiFood = true;
        gameState.foods = generateMultipleFoods(1); // Přidej 1 další jídlo (celkem 2)
        console.log(`[DEBUG] multiFood aktivováno: foods.length=${gameState.foods.length}`);
        const msg = CONFIG.getMessage('MULTI_FOOD');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
    }

    // Třetí jídlo od 20. jídla
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.TRIPLE_FOOD_START) {
        // Přidej další jídlo (celkem 3)
        const newFood = generateFood();
        if (gameState.movingFood) {
            newFood.direction = getRandomDirection();
            newFood.lastMoveTime = Date.now();
        }
        gameState.foods.push(newFood);
        
        const msg = CONFIG.getMessage('TRIPLE_FOOD');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
    }

    // Více bonusů současně od 25. jídla
    if (gameState.foodEaten === 25) {
        showGameNotification('🎁🎁 VÍCE BONUSŮ!', 'Teď se mohou objevit 2 bonusy současně!', '#9b59b6');
    }

    // Čtvrté jídlo od 35. jídla
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.QUAD_FOOD_START) {
        // Přidej další jídlo (celkem 4)
        const newFood = generateFood();
        if (gameState.movingFood) {
            newFood.direction = getRandomDirection();
            newFood.lastMoveTime = Date.now();
        }
        gameState.foods.push(newFood);
        
        const msg = CONFIG.getMessage('QUAD_FOOD');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
    }

    // Páté jídlo od 50. jídla
    if (gameState.foodEaten === GAME_CONFIG.PROGRESSION.PENTA_FOOD_START) {
        // Přidej další jídlo (celkem 5)
        const newFood = generateFood();
        if (gameState.movingFood) {
            newFood.direction = getRandomDirection();
            newFood.lastMoveTime = Date.now();
        }
        gameState.foods.push(newFood);
        
        const msg = CONFIG.getMessage('PENTA_FOOD');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
    }

    animateScore();
    
    // Debug log stavu na konci handleFoodEaten
    if (gameState.foodEaten >= 15) {
        console.log(`[DEBUG] handleFoodEaten konec: foodEaten=${gameState.foodEaten}, multiFood=${gameState.multiFood}, foods.length=${gameState.foods.length}`);
    }
}

// Resetování timeru pro všechna jídla
function resetTimerForAllFoods() {
    if (gameState.timedFood) {
        gameState.foodTimer = gameState.foodMaxTime;
        console.log("Timer resetován pro všechna jídla");
    }
}

// Aktivace efektu bonusu (zpomalení nebo magnet)
function activateBonusEffect(bonusType) {
    if (bonusType === 'frenzy') {
        // Frenzy bonus má svou vlastní logiku - nepoužívá bonusEffectActive
        startFoodFrenzy();
        
        const msg = CONFIG.getMessage('FRENZY_START');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
        console.log('[BONUS] FRENZY aktivován!');
        
        console.log('Food Frenzy aktivován! Objevilo se 15 jídel na 10 sekund!');
        return;
    }
    
    if (!gameState.bonusEffectActive) {
        // Aktivuj efekt na 8 sekund
        gameState.bonusEffectActive = true;
        gameState.bonusEffectTimer = gameState.bonusEffectDuration; // 8 sekund
        gameState.bonusType = bonusType;
        
        if (bonusType === 'slow') {
            // Ulož současnou rychlost a zpomali hada
            gameState.speedBeforeBonus = gameState.gameSpeed;
            gameState.gameSpeed = Math.min(gameState.baseSpeed, gameState.gameSpeed + GAME_CONFIG.SPEED.SLOW_BONUS_INCREASE);
            
            const msg = CONFIG.getMessage('SLOW_BONUS_ACTIVATED');
            showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
            console.log('[BONUS] SLOW aktivován!');
            
            console.log(`Zpomalení aktivováno! Rychlost z ${gameState.speedBeforeBonus} na ${gameState.gameSpeed} na 8 sekund`);
            
        } else if (bonusType === 'magnet') {
            // Magnet má svou vlastní logiku aktivace
            activateMagnetEffect();
            
            const msg = CONFIG.getMessage('MAGNET_BONUS_ACTIVATED');
            showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
            console.log('[BONUS] MAGNET aktivován!');
            
            console.log('Magnetismus aktivován! Všechna jídla přitážena k hadovi!');
            
        } else if (bonusType === 'speed') {
            // Ulož současnou rychlost a zrychli hada
            gameState.speedBeforeBonus = gameState.gameSpeed;
            gameState.gameSpeed = Math.max(50, gameState.gameSpeed - 30); // Větší zrychlení
            
            const msg = CONFIG.getMessage('SPEED_BONUS_ACTIVATED');
            showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
            console.log('[BONUS] SPEED bonus aktivován!');
            
            console.log(`Zrychlení aktivováno! Rychlost z ${gameState.speedBeforeBonus} na ${gameState.gameSpeed} na 8 sekund`);
        }
    }
    
    // Penalty bonus - nezávislý na bonusEffectActive
    if (bonusType === 'penalty') {
        // Odečti body
        gameState.score += GAME_CONFIG.SCORING.PENALTY_BONUS; // -50 bodů
        // Zajisti, že skóre neklesne pod nulu
        gameState.score = Math.max(0, gameState.score);
        updateScore();
        
        const msg = CONFIG.getMessage('PENALTY_BONUS_ACTIVATED');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
        console.log('[PENALTY] -50 bodů za trest');
        animateScoreLoss();
        
        console.log('Penalty bonus aktivován! -50 bodů!');
    }
}

// Deaktivace efektu bonusu
function deactivateBonusEffect() {
    if (gameState.bonusEffectActive) {
        const bonusType = gameState.bonusType;
        
        if (bonusType === 'slow' || bonusType === 'speed') {
            // Vrať původní rychlost
            gameState.gameSpeed = gameState.speedBeforeBonus;
            const effect = bonusType === 'slow' ? 'Zpomalení' : 'Zrychlení';
            console.log(`${effect} ukončeno! Rychlost vrácena na ${gameState.gameSpeed}`);
        }
        
        // Deaktivuj efekt
        gameState.bonusEffectActive = false;
        gameState.bonusEffectTimer = 0;
        gameState.bonusType = null;
        
        const msg = CONFIG.getMessage('BONUS_ENDED');
        showGameNotification(`${msg.icon} ${msg.title}`, msg.text, msg.color);
    }
}

// Funkce pro aktivaci magnet bonusu
function magnetizeFood() {
    // Aktivuj magnet efekt na 8 sekund
    activateMagnetEffect();
}

// Helper funkce pro přitažení jednoho jídla k pozici
function attractFoodToPosition(food, target, radius) {
    const directions = [
        {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
        {x: -1, y: 0},                 {x: 1, y: 0},
        {x: -1, y: 1},  {x: 0, y: 1},  {x: 1, y: 1}
    ];
    
    // Najdi nejbližší volnou pozici kolem hada
    for (let r = 1; r <= radius; r++) {
        for (let dir of directions) {
            const newPos = {
                x: target.x + (dir.x * r),
                y: target.y + (dir.y * r)
            };
            
            // Zkontroluj, zda je pozice validní
            if (newPos.x >= 0 && newPos.x < GRID_COUNT && 
                newPos.y >= 0 && newPos.y < GRID_COUNT) {
                
                // Zkontroluj kolizi s hadem
                let collision = false;
                for (let segment of gameState.snake) {
                    if (segment.x === newPos.x && segment.y === newPos.y) {
                        collision = true;
                        break;
                    }
                }
                
                if (!collision) {
                    return newPos;
                }
            }
        }
    }
    
    // Pokud se nepodařilo najít volnou pozici, vrať původní
    return food;
}

// Herní smyčka - 60 FPS
function smoothGameLoop() {
    gameLoop();
    requestAnimationFrame(smoothGameLoop);
}

// Funkce pro obnovení správného počtu jídel podle progrese
function restoreCorrectFoodCount() {
    const currentFoodCount = gameState.foodEaten;
    
    console.log(`[DEBUG] restoreCorrectFoodCount: foodEaten=${currentFoodCount}, multiFood=${gameState.multiFood}, foods.length=${gameState.foods.length}`);
    
    // Zkontroluj, jestli by mělo být aktivní multiFood
    if (currentFoodCount >= GAME_CONFIG.PROGRESSION.MULTI_FOOD_START) {
        if (!gameState.multiFood) {
            console.log("Obnovuji multiFood stav...");
            gameState.multiFood = true;
        }
        
        // Spočítej správný počet extra jídel (bez hlavního jídla)
        let targetFoodCount = 0; // Počet extra jídel
        if (currentFoodCount >= GAME_CONFIG.PROGRESSION.MULTI_FOOD_START) targetFoodCount = 1;  // 2 jídla celkem (1 hlavní + 1 extra)
        if (currentFoodCount >= GAME_CONFIG.PROGRESSION.TRIPLE_FOOD_START) targetFoodCount = 2; // 3 jídla celkem (1 hlavní + 2 extra)
        if (currentFoodCount >= GAME_CONFIG.PROGRESSION.QUAD_FOOD_START) targetFoodCount = 3;   // 4 jídla celkem (1 hlavní + 3 extra)
        if (currentFoodCount >= 50) targetFoodCount = 4; // 5 jídel celkem (1 hlavní + 4 extra)
        
        console.log(`[DEBUG] targetFoodCount=${targetFoodCount} pro foodEaten=${currentFoodCount}`);
        
        // Doplň chybějící jídla
        const currentExtraFoods = gameState.foods.length;
        if (currentExtraFoods < targetFoodCount) {
            const missingFoods = targetFoodCount - currentExtraFoods;
            console.log(`Doplňuji ${missingFoods} chybějících jídel (aktuálně ${currentExtraFoods}, mělo by být ${targetFoodCount})`);
            
            // Zabráň nekonečné smyčce
            if (missingFoods > 10) {
                console.error("CHYBA: Příliš mnoho chybějících jídel, přeskakuji!");
                return;
            }
            
            for (let i = 0; i < missingFoods; i++) {
                const newFood = generateFood();
                if (!newFood) {
                    console.error("CHYBA: Nepodařilo se vygenerovat nové jídlo!");
                    break;
                }
                if (gameState.movingFood) {
                    newFood.direction = getRandomDirection();
                    newFood.lastMoveTime = Date.now();
                }
                gameState.foods.push(newFood);
            }
        }
    }
    
    console.log(`[DEBUG] restoreCorrectFoodCount konec: foods.length=${gameState.foods.length}`);
}

// Funkce pro ukončení hry
function endGame() {
    console.log("🛑 Hra ukončena!");
    if (typeof gameOver === 'function') {
        gameOver();
    } else if (typeof window.gameOver === 'function') {
        window.gameOver();
    } else {
        // Fallback
        gameState.gameRunning = false;
        gameState.gamePaused = false;
        console.log("⚠️ Fallback ukončení hry");
    }
}

// Tyto funkce jsou nyní v animations.js

// Exporty pro globální dostupnost
window.startGame = startGame;
window.togglePause = togglePause;
window.restartGame = restartGame;
window.handleKeydown = handleKeydown;
window.handleDirectionInput = handleDirectionInput;
window.gameLoop = gameLoop;
window.endGame = endGame;
window.update = update;
window.initGame = initGame;
