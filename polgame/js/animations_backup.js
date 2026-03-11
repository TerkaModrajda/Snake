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

// Animace při zmizení jídla
function animateMissedFood() {
    console.log("Jídlo zmizelo! Nové jídlo se objevilo.");
}

// Aktivace magnet efektu - spustí průběžné přitahování
function activateMagnetEffect() {
    gameState.magnetEffectActive = true;
    gameState.magnetEffectStartTime = Date.now();
    
    // Vymaž staré animace
    if (gameState.magnetAnimations) {
        gameState.magnetAnimations = [];
    }
    
    console.log('Magnet efekt aktivován na 8 sekund');
}

// Deaktivace magnet efektu
function deactivateMagnetEffect() {
    gameState.magnetEffectActive = false;
    gameState.magnetAnimations = [];
    console.log('Magnet efekt deaktivován');
}

// Průběžné přitahování jídel k hadovi (volá se každý frame)
function updateMagnetAttraction() {
    if (!gameState.magnetEffectActive) return;
    
    // Zkontroluj, jestli magnet efekt nevypršel (8 sekund)
    const elapsed = Date.now() - gameState.magnetEffectStartTime;
    if (elapsed > GAME_CONFIG.TIMINGS.BONUS_EFFECT) {
        deactivateMagnetEffect();
        return;
    }
    
    const head = gameState.snake[0];
    const attractionRange = 2; // Rozmezí 4x4 (2 pole na všechny strany od hlavy)
    const attractionStrength = 0.5; // Síla přitažení (půl pole za frame)
    
    // Přitáhni hlavní jídlo
    if (gameState.food) {
        gameState.food = attractFoodToSnake(gameState.food, head, attractionRange, attractionStrength);
    }
    
    // Přitáhni všechna multi jídla
    if (gameState.multiFood && gameState.foods.length > 0) {
        for (let i = 0; i < gameState.foods.length; i++) {
            gameState.foods[i] = attractFoodToSnake(gameState.foods[i], head, attractionRange, attractionStrength);
        }
    }
    
    // Přitáhni super jídlo
    if (gameState.superFoodActive && gameState.superFood) {
        gameState.superFood = attractFoodToSnake(gameState.superFood, head, attractionRange, attractionStrength);
    }
}

// Funkce pro postupné přitahování jídla k hadovi (pouze v rozmezí 4x4)
function attractFoodToSnake(food, head, maxRange, strength) {
    // Vypočítaj rozdíl pozic
    const dx = Math.abs(head.x - food.x);
    const dy = Math.abs(head.y - food.y);
    
    // Zkontroluj, zda je jídlo v rozmezí 4x4 (2 pole na všechny strany)
    if (dx > maxRange || dy > maxRange) {
        return food; // Jídlo je příliš daleko, neovlivňuj ho
    }
    
    // Pokud je jídlo příliš blízko (1 pole), nech ho být (aby se dal sníst)
    if (dx <= 1 && dy <= 1) {
        return food;
    }
    
    // Vypočítaj směr k hadovi
    let moveX = 0;
    let moveY = 0;
    
    if (food.x < head.x) {
        moveX = strength;  // Pohyb doprava
    } else if (food.x > head.x) {
        moveX = -strength; // Pohyb doleva
    }
    
    if (food.y < head.y) {
        moveY = strength;  // Pohyb dolů
    } else if (food.y > head.y) {
        moveY = -strength; // Pohyb nahoru
    }
    
    // Aplikuj přitažení s omezeními hranic
    const newX = Math.max(0, Math.min(GAME_CONFIG.CANVAS.GRID_COUNT - 1, food.x + moveX));
    const newY = Math.max(0, Math.min(GAME_CONFIG.CANVAS.GRID_COUNT - 1, food.y + moveY));
    
    return {
        x: Math.round(newX),
        y: Math.round(newY)
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
