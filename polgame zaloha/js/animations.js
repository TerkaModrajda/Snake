// ============================================
// ANIMACE A EFEKTY
// ============================================

// Animace skóre při získání bodů
function animateScore() {
    currentScoreElement.style.animation = 'scoreUp 0.3s ease';
    setTimeout(() => {
        currentScoreElement.style.animation = '';
    }, 300);
}

// Animace ztráty bodů
function animateScoreLoss() {
    currentScoreElement.style.animation = 'scoreDown 0.5s ease';
    currentScoreElement.style.color = '#e74c3c';
    
    setTimeout(() => {
        currentScoreElement.style.animation = '';
        currentScoreElement.style.color = '';
    }, 500);
}

// Animace zkrácení hada
function animateShrink() {
    ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    setTimeout(() => {
        draw();
    }, 200);
}

// Floating text efekt
function showFloatingText(text, gridX, gridY, color = '#fff') {
    const floatingText = {
        text: text,
        x: gridX * GRID_SIZE + GRID_SIZE / 2,
        y: gridY * GRID_SIZE + GRID_SIZE / 2,
        startTime: Date.now(),
        duration: 1000,
        color: color
    };
    
    if (!window.floatingTexts) {
        window.floatingTexts = [];
    }
    window.floatingTexts.push(floatingText);
}

// Vykreslení floating textů
function drawFloatingTexts() {
    if (!window.floatingTexts) return;
    
    const currentTime = Date.now();
    
    window.floatingTexts = window.floatingTexts.filter(floatingText => {
        const elapsed = currentTime - floatingText.startTime;
        const progress = elapsed / floatingText.duration;
        
        if (progress >= 1) {
            return false;
        }
        
        const alpha = 1 - progress;
        const offsetY = progress * -30;
        
        ctx.save();
        ctx.fillStyle = floatingText.color;
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        
        ctx.strokeText(floatingText.text, floatingText.x, floatingText.y + offsetY);
        ctx.fillText(floatingText.text, floatingText.x, floatingText.y + offsetY);
        
        ctx.restore();
        
        return true;
    });
}

// Univerzální herní notifikace
function showGameNotification(title, subtitle, color = '#e74c3c') {
    let notification = document.getElementById('game-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'game-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #001a33;
            border: 2px solid #0099ff;
            color: #0099ff;
            padding: 12px 16px;
            border-radius: 0px;
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 1px 1px 0px #000000;
            box-shadow: 0 0 15px #0099ff;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    // Ignorujeme color parameter a používáme vždy modrou
    notification.style.background = '#001a33';
    notification.style.borderColor = '#0099ff';
    notification.style.boxShadow = '0 0 15px #0099ff';
    
    notification.innerHTML = `
        <div style="font-size: 8px; margin-bottom: 4px; color: #0099ff; font-family: 'Press Start 2P', monospace; text-transform: uppercase; letter-spacing: 1px;">${title}</div>
        <div style="font-size: 6px; color: #ffffff; font-family: 'Press Start 2P', monospace; line-height: 1.4;">${subtitle}</div>
    `;
    
    notification.style.transform = 'translateX(0)';
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
    }, 3000);
}

// NOVÁ funkce - Vyčištění všech vizuálních efektů při restartu
function clearAllVisualEffects() {
    // Vyčisti notifikaci
    const notification = document.getElementById('game-notification');
    if (notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Vyčisti speed-info
    const speedInfo = document.getElementById('speed-info');
    if (speedInfo) {
        speedInfo.classList.add('hidden');
    }
    
    // Vyčisti všechny animace
    gameState.magnetAnimations = [];
    
    console.log("[DEBUG] clearAllVisualEffects: Všechny vizuální efekty vyčištěny");
}

// Animace při zmizení jídla
function animateMissedFood() {
    console.log("Jídlo zmizelo! Nové jídlo se objevilo.");
}

// Aktivace magnet efektu - spustí průběžné přitahování
function activateMagnetEffect() {
    const currentTime = Date.now();
    console.log(`[MAGNET AKTIVACE] Čas: ${currentTime}, předchozí startTime: ${gameState.magnetEffectStartTime}`);
    
    gameState.magnetEffectActive = true;
    gameState.magnetEffectStartTime = currentTime;
    
    console.log('=== MAGNET EFEKT AKTIVOVÁN ===');
    console.log('gameState.magnetEffectActive:', gameState.magnetEffectActive);
    console.log('gameState.magnetEffectStartTime:', gameState.magnetEffectStartTime);
    console.log('GAME_CONFIG.TIMINGS.BONUS_EFFECT:', GAME_CONFIG.TIMINGS.BONUS_EFFECT);
    console.log('Magnet bude aktivní po dobu:', GAME_CONFIG.TIMINGS.BONUS_EFFECT / 1000, 'sekund');
    
    // Debug: Zkontroluj, jaké objekty jsou dostupné
    console.log(`[MAGNET DEBUG] Stav objektů při aktivaci: food=${!!gameState.food}, snake.length=${gameState.snake?.length}, bonusy=${gameState.bonuses?.length}`);
}

// Deaktivace magnet efektu
function deactivateMagnetEffect() {
    gameState.magnetEffectActive = false;
    console.log('=== MAGNET EFEKT DEAKTIVOVÁN ===');
}

// Průběžné přitahování jídel k hadovi (volá se každý frame)
function updateMagnetAttraction() {
    if (!gameState.magnetEffectActive) {
        // Debug: Zkontroluj, proč magnet není aktivní
        console.log(`[MAGNET DEBUG] Magnet není aktivní. magnetEffectActive: ${gameState.magnetEffectActive}`);
        return;
    }
    
    const head = gameState.snake[0];
    const attractionRange = 2; // Rozmezí 4x4 (2 pole na všechny strany od hlavy)
    const elapsed = Date.now() - gameState.magnetEffectStartTime;
    
    // Debug info s více detaily
    console.log(`[MAGNET AKTIVNÍ] Zbývá ${Math.ceil((GAME_CONFIG.TIMINGS.BONUS_EFFECT - elapsed) / 1000)}s, had na [${head.x},${head.y}]`);
    console.log(`[MAGNET DEBUG] Objekty ke kontrole: jídlo=${!!gameState.food}, multiFood=${gameState.multiFood && gameState.foods?.length}, superFood=${gameState.superFoodActive}, bonusy=${gameState.bonuses?.length}, frenzy=${gameState.frenzyActive && gameState.frenzyFoods?.length}`);
    
    // Přitáhni hlavní jídlo
    if (gameState.food) {
        console.log(`Kontroluji hlavní jídlo na pozici [${gameState.food.x},${gameState.food.y}]`);
        const originalPos = { x: gameState.food.x, y: gameState.food.y };
        gameState.food = attractFoodToSnake(gameState.food, head, attractionRange);
        if (originalPos.x !== gameState.food.x || originalPos.y !== gameState.food.y) {
            console.log(`Hlavní jídlo se pohnulo z [${originalPos.x},${originalPos.y}] na [${gameState.food.x},${gameState.food.y}]`);
        }
        
        // Kontrola, zda se jídlo přitáhlo přímo k hadovi (snědení)
        if (gameState.food.x === head.x && gameState.food.y === head.y) {
            console.log('MAGNET: Hlavní jídlo se přitáhlo k hadovi - spouštím snědení!');
            handleFoodEaten(true); // true = hlavní jídlo
            // Resetuj timer pro všechna zbývající jídla
            resetTimerForAllFoods();
        }
    }
    
    // Přitáhni všechna multi jídla
    if (gameState.multiFood && gameState.foods && gameState.foods.length > 0) {
        for (let i = gameState.foods.length - 1; i >= 0; i--) {
            const originalPos = { x: gameState.foods[i].x, y: gameState.foods[i].y };
            gameState.foods[i] = attractFoodToSnake(gameState.foods[i], head, attractionRange);
            if (originalPos.x !== gameState.foods[i].x || originalPos.y !== gameState.foods[i].y) {
                console.log(`Multi jídlo ${i} se pohnulo z [${originalPos.x},${originalPos.y}] na [${gameState.foods[i].x},${gameState.foods[i].y}]`);
            }
            
            // Kontrola, zda se multi jídlo přitáhlo přímo k hadovi (snědení)
            if (gameState.foods[i].x === head.x && gameState.foods[i].y === head.y) {
                console.log(`MAGNET: Multi jídlo ${i} se přitáhlo k hadovi - spouštím snědení!`);
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
                
                // Resetuj timer pro všechna zbývající jídla
                resetTimerForAllFoods();
            }
        }
    }
    
    // Přitáhni super jídlo
    if (gameState.superFoodActive && gameState.superFood) {
        const originalPos = { x: gameState.superFood.x, y: gameState.superFood.y };
        gameState.superFood = attractFoodToSnake(gameState.superFood, head, attractionRange);
        if (originalPos.x !== gameState.superFood.x || originalPos.y !== gameState.superFood.y) {
            console.log(`Super jídlo se pohnulo z [${originalPos.x},${originalPos.y}] na [${gameState.superFood.x},${gameState.superFood.y}]`);
        }
        
        // Kontrola, zda se super jídlo přitáhlo přímo k hadovi (snědení)
        if (gameState.superFood.x === head.x && gameState.superFood.y === head.y) {
            console.log('MAGNET: Super jídlo se přitáhlo k hadovi - spouštím snědení!');
            // Super jídlo snědeno - +50 bodů, žádné prodloužení hada
            gameState.score += GAME_CONFIG.SCORING.SUPER_FOOD;
            updateScore();
            
            // Deaktivuj super jídlo
            gameState.superFoodActive = false;
            gameState.superFood = null;
            
            // Obnov správný počet normálních jídel
            restoreCorrectFoodCount();
            
            showGameNotification('🌟 SUPER JÍDLO!', '+50 bodů za super jídlo!', '#f1c40f');
            showFloatingText('+50', head.x, head.y, '#f1c40f');
            animateScore();
        }
    }
    
    // Přitáhni všechny bonusy
    if (gameState.bonuses && gameState.bonuses.length > 0) {
        for (let i = gameState.bonuses.length - 1; i >= 0; i--) {
            const originalPos = { x: gameState.bonuses[i].x, y: gameState.bonuses[i].y };
            gameState.bonuses[i] = attractFoodToSnake(gameState.bonuses[i], head, attractionRange);
            if (originalPos.x !== gameState.bonuses[i].x || originalPos.y !== gameState.bonuses[i].y) {
                console.log(`Bonus ${gameState.bonuses[i].type} se pohnul z [${originalPos.x},${originalPos.y}] na [${gameState.bonuses[i].x},${gameState.bonuses[i].y}]`);
            }
            
            // Okamžitá kontrola kolize po přitažení
            if (gameState.bonuses[i].x === head.x && gameState.bonuses[i].y === head.y) {
                console.log(`MAGNET: Bonus ${gameState.bonuses[i].type} se přitáhl přímo k hadovi - okamžitě aktivuji!`);
                const bonusType = gameState.bonuses[i].type;
                gameState.bonuses.splice(i, 1);
                
                // Aktivuj efekt bonusu okamžitě
                if (typeof activateBonusEffect === 'function') {
                    activateBonusEffect(bonusType);
                }
            }
        }
    }
    
    // Přitáhni všechna frenzy jídla
    if (gameState.frenzyActive && gameState.frenzyFoods && gameState.frenzyFoods.length > 0) {
        for (let i = gameState.frenzyFoods.length - 1; i >= 0; i--) {
            const originalPos = { x: gameState.frenzyFoods[i].x, y: gameState.frenzyFoods[i].y };
            gameState.frenzyFoods[i] = attractFoodToSnake(gameState.frenzyFoods[i], head, attractionRange);
            if (originalPos.x !== gameState.frenzyFoods[i].x || originalPos.y !== gameState.frenzyFoods[i].y) {
                console.log(`Frenzy jídlo ${i} se pohnulo z [${originalPos.x},${originalPos.y}] na [${gameState.frenzyFoods[i].x},${gameState.frenzyFoods[i].y}]`);
            }
            
            // Okamžitá kontrola kolize po přitažení
            if (gameState.frenzyFoods[i].x === head.x && gameState.frenzyFoods[i].y === head.y) {
                console.log(`MAGNET: Frenzy jídlo ${i} se přitáhlo přímo k hadovi - okamžitě zpracovávám!`);
                
                // Odstraň snědené frenzy jídlo
                gameState.frenzyFoods.splice(i, 1);
                
                // Zpracuj snědení frenzy jídla (stejná logika jako v gameLogic.js)
                gameState.score += GAME_CONFIG.SCORING.NORMAL_FOOD;
                gameState.foodEaten++;
                gameState.snake.push({ x: -1, y: -1 }); // Prodlouž hada
                updateScore();
                showFloatingText('+10', head.x, head.y, '#2ecc71');
                animateScore();
                
                console.log(`MAGNET: Frenzy jídlo snědeno! Zbývá ${gameState.frenzyFoods.length} frenzy jídel`);
            }
        }
    }
}

// Funkce pro postupné přitahování jídla k hadovi (pouze v rozmezí 4x4)
function attractFoodToSnake(food, head, maxRange) {
    // Vypočítaj rozdíl pozic
    const dx = Math.abs(head.x - food.x);
    const dy = Math.abs(head.y - food.y);
    
    console.log(`  Kontrola jídla: food[${food.x},${food.y}] vs head[${head.x},${head.y}], dx=${dx}, dy=${dy}, maxRange=${maxRange}`);
    
    // Zkontroluj, zda je jídlo v rozmezí 4x4 (2 pole na všechny strany)
    if (dx > maxRange || dy > maxRange) {
        console.log('  -> Jídlo je příliš daleko, neovlivňuji');
        return food;
    }
    
    console.log('  -> Jídlo je v dosahu magnet efektu, přitahuji!');
    
    // Přesuň jídlo přímo k hadovi (o 1 pole blíž)
    let newX = food.x;
    let newY = food.y;
    
    if (food.x < head.x) {
        newX = food.x + 1;  // Pohyb doprava
    } else if (food.x > head.x) {
        newX = food.x - 1;  // Pohyb doleva
    }
    
    if (food.y < head.y) {
        newY = food.y + 1;  // Pohyb dolů
    } else if (food.y > head.y) {
        newY = food.y - 1;  // Pohyb nahoru
    }
    
    // Omeď hranice hrací plochy
    newX = Math.max(0, Math.min(GAME_CONFIG.CANVAS.GRID_COUNT - 1, newX));
    newY = Math.max(0, Math.min(GAME_CONFIG.CANVAS.GRID_COUNT - 1, newY));
    
    // Pokud se jídlo přitáhne přímo na pozici hada, vrať ho na pozici hada (zachovaj původní vlastnosti)
    if (newX === head.x && newY === head.y) {
        console.log('  -> Jídlo se přitáhlo přímo k hadovi!');
        return { ...food, x: head.x, y: head.y };
    }
    
    console.log(`  -> Nová pozice: [${newX},${newY}]`);
    
    // Zachovej všechny původní vlastnosti objektu, změň jen pozici
    return {
        ...food,
        x: newX,
        y: newY
    };
}

// Vykreslení magnet efektu (magnetické pole kolem hada)
function drawMagnetEffect() {
    if (!gameState.magnetEffectActive) return;
    
    const head = gameState.snake[0];
    const centerX = head.x * GAME_CONFIG.CANVAS.GRID_SIZE + GAME_CONFIG.CANVAS.GRID_SIZE / 2;
    const centerY = head.y * GAME_CONFIG.CANVAS.GRID_SIZE + GAME_CONFIG.CANVAS.GRID_SIZE / 2;
    
    // Vypočítej zbývající čas
    const elapsed = Date.now() - gameState.magnetEffectStartTime;
    const remaining = GAME_CONFIG.TIMINGS.BONUS_EFFECT - elapsed;
    const progress = remaining / GAME_CONFIG.TIMINGS.BONUS_EFFECT;
    
    // Animovaný kruh kolem hlavy hada
    const time = Date.now() * 0.005;
    const radius1 = (40 + Math.sin(time) * 10) * progress;
    const radius2 = (60 + Math.cos(time * 1.2) * 15) * progress;
    
    ctx.save();
    
    // Vnější kruh - slábne s časem
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius2, 0, Math.PI * 2);
    ctx.strokeStyle = '#9b59b6';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3 * progress;
    ctx.stroke();
    
    // Vnitřní kruh
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius1, 0, Math.PI * 2);
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5 * progress;
    ctx.stroke();
    
    // Magnetické částice - méně s časem
    const particleCount = Math.max(2, Math.floor(8 * progress));
    for (let i = 0; i < particleCount; i++) {
        const angle = (time + i * Math.PI / 4) % (Math.PI * 2);
        const particleX = centerX + Math.cos(angle) * (30 + Math.sin(time * 2) * 20) * progress;
        const particleY = centerY + Math.sin(angle) * (30 + Math.sin(time * 2) * 20) * progress;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#f39c12';
        ctx.globalAlpha = (0.7 + Math.sin(time * 3 + i) * 0.3) * progress;
        ctx.fill();
    }
    
    // Časovač
    ctx.fillStyle = '#9b59b6';
    ctx.globalAlpha = 0.8;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(Math.ceil(remaining / 1000) + 's', centerX, centerY - 80);
    
    ctx.restore();
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.activateMagnetEffect = activateMagnetEffect;
    window.deactivateMagnetEffect = deactivateMagnetEffect;
    window.updateMagnetAttraction = updateMagnetAttraction;
    window.attractFoodToSnake = attractFoodToSnake;
    window.showGameNotification = showGameNotification;
    window.animateScore = animateScore;
    window.animateScoreLoss = animateScoreLoss;
    window.animateMissedFood = animateMissedFood;
    window.clearAllVisualEffects = clearAllVisualEffects;
}

console.log("[Animations] Animační systém načten");
