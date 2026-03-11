// ============================================
// VYKRESLOVÁNÍ
// ============================================

// Hlavní vykreslení hry
function draw() {
    if (!ctx) {
        console.error('Canvas kontext není dostupný!');
        return;
    }
    
    // Vymazání canvasu
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Vykreslení mřížky
    drawGrid();
    
    // Vykreslení hada
    drawSnake();
    
    // Vykreslení jídla
    drawFood();
    
    // NOVÉ - Vykreslení frenzy jídel
    if (gameState.frenzyActive && gameState.frenzyFoods.length > 0) {
        drawFrenzyFoods();
    }

    // NOVÉ - Vykreslení super jídla
    if (gameState.superFoodActive && gameState.superFood) {
        drawSuperFood();
    }

    // NOVÉ - Vykreslení bonusů (může být více současně)
    if (gameState.bonuses && gameState.bonuses.length > 0) {
        drawBonuses();
    }

    // Vykreslení floating textů
    drawFloatingTexts();
    
    // NOVÉ - Vykreslení frenzy timeru (i když už nejsou jídla)
    if (gameState.frenzyActive) {
        drawFrenzyTimer();
    }
    
    // Vykreslení magnet efektu
    drawMagnetEffect();

    // Vykreslení kamenů (rocks)
    if (gameState.rocks && gameState.rocks.length > 0) {
        drawRocks();
    }
}

// NOVÁ funkce - vykreslení super jídla (2x2)
function drawSuperFood() {
    const superFood = gameState.superFood;
    const superFoodImg = window.superFoodImage || (window.superFoodImage = new Image());
    if (!superFoodImg.src) superFoodImg.src = 'img/superFood.png';
    // Vykresli obrázek 2x2 grid (zabírá 2x2 políčka)
    const x = superFood.x * GRID_SIZE;
    const y = superFood.y * GRID_SIZE;
    const size = GRID_SIZE * 2;
    if (superFoodImg.complete && superFoodImg.naturalWidth > 0) {
        ctx.drawImage(
            superFoodImg,
            x,
            y,
            size,
            size
        );
    } else {
        // Fallback: původní zlaté čtverečky
        const time = Date.now();
        const alpha = (Math.sin(time / 100) + 1) / 2;
        const goldColor = `rgba(${241 + alpha * 14}, ${196 + alpha * 59}, ${15 + alpha * 240}, 1)`;
        ctx.fillStyle = goldColor;
        for (let dx = 0; dx < 2; dx++) {
            for (let dy = 0; dy < 2; dy++) {
                ctx.shadowColor = goldColor;
                ctx.shadowBlur = 15;
                ctx.fillRect(
                    (superFood.x + dx) * GRID_SIZE + 1,
                    (superFood.y + dy) * GRID_SIZE + 1,
                    GRID_SIZE - 2,
                    GRID_SIZE - 2
                );
            }
        }
        ctx.shadowBlur = 0;
        // Hvězdička uprostřed
        const centerX = (superFood.x + 0.5) * GRID_SIZE + GRID_SIZE / 2;
        const centerY = (superFood.y + 0.5) * GRID_SIZE + GRID_SIZE / 2;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('★', centerX, centerY + 6);
    }
    // Timer kruh kolem super jídla
    drawSuperFoodTimer();
}

// Timer pro super jídlo
function drawSuperFoodTimer() {
    const superFood = gameState.superFood;
    const centerX = (superFood.x + 0.5) * GRID_SIZE + GRID_SIZE / 2;
    const centerY = (superFood.y + 0.5) * GRID_SIZE + GRID_SIZE / 2;
    const radius = GRID_SIZE + 5;
    
    const timePercent = Math.max(0, gameState.superFoodTimer / gameState.superFoodMaxTime);
    
    // Pozadí kruhu
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Progress kruh
    let progressColor = '#f1c40f';
    let lineWidth = 6;
    
    if (timePercent <= 0.3) {
        const blinkAlpha = (Math.sin(Date.now() / 100) + 1) / 2;
        progressColor = `rgba(241, 196, 15, ${0.7 + blinkAlpha * 0.3})`;
        lineWidth = 8;
    }
    
    ctx.strokeStyle = progressColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, 
           -Math.PI / 2 + (2 * Math.PI * timePercent));
    ctx.stroke();
}

// NOVÁ funkce - vykreslení všech bonusů
function drawBonuses() {
    if (gameState.bonuses.length > 0) {
        console.log(`[RENDER] Kreslím ${gameState.bonuses.length} bonusů:`, gameState.bonuses.map(b => `${b.type}[${b.x},${b.y}]`));
    }
    gameState.bonuses.forEach(bonus => {
        drawSingleBonus(bonus);
    });
}

// NOVÁ funkce - vykreslení jednoho bonusu
function drawSingleBonus(bonus) {
    const bonusType = bonus.type;
    
    // Barva podle typu bonusu
    const time = Date.now();
    const alpha = (Math.sin(time / 150) + 1) / 2;
    
    let color, emoji;
    if (bonusType === 'slow') {
        color = `rgba(${52 + alpha * 100}, ${152 + alpha * 100}, ${219 + alpha * 36}, 1)`;
        emoji = '🐌';
    } else if (bonusType === 'magnet') {
        color = `rgba(${155 + alpha * 50}, ${89 + alpha * 80}, ${182 + alpha * 50}, 1)`;
        emoji = '🧲';
    } else if (bonusType === 'frenzy') {
        color = `rgba(${243 + alpha * 12}, ${156 + alpha * 99}, ${18 + alpha * 237}, 1)`;
        emoji = '🍎';
    } else if (bonusType === 'penalty') {
        color = `rgba(${231 + alpha * 24}, ${76 + alpha * 179}, ${60 + alpha * 195}, 1)`;
        emoji = '💸';
    } else if (bonusType === 'speed') {
        color = `rgba(${243 + alpha * 12}, ${156 + alpha * 99}, ${18 + alpha * 237}, 1)`;
        emoji = '⚡';
    }
    
    // Vykreslení bonusu
    ctx.fillStyle = color;
    
    // Glowing efekt
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    
    ctx.fillRect(
        bonus.x * GRID_SIZE + 3,
        bonus.y * GRID_SIZE + 3,
        GRID_SIZE - 6,
        GRID_SIZE - 6
    );
    
    // Resetuj shadow
    ctx.shadowBlur = 0;
    
    // Timer kruh kolem bonusu
    drawBonusTimer(bonus);
    
    // Symbol uprostřed
    const centerX = bonus.x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = bonus.y * GRID_SIZE + GRID_SIZE / 2;
    if (bonusType === 'slow') {
        // Draw slow.png instead of emoji
        const slowImg = window.slowImage || (window.slowImage = new Image());
        if (!slowImg.src) slowImg.src = 'img/slow.png';
        const imgSize = GRID_SIZE - 4; // Zvětšeno z -10 na -4 pro podobnou velikost jako jídlo
        if (slowImg.complete && slowImg.naturalWidth > 0) {
            ctx.drawImage(slowImg, centerX - imgSize/2, centerY - imgSize/2, imgSize, imgSize);
        } else {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🐌', centerX, centerY + 4);
        }
    } else if (bonusType === 'frenzy') {
        // Draw a readable background for the frenzy bonus icon
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, GRID_SIZE / 2 - 4, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0,0,0,0.85)'; // dark background for contrast
        ctx.shadowColor = '#e67e22';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
        // Draw frenzy.png instead of emoji
        const frenzyImg = window.frenzyImage || (window.frenzyImage = new Image());
        if (!frenzyImg.src) frenzyImg.src = 'img/frenzy.png';
        const imgSize = GRID_SIZE - 4; // Zvětšeno z -10 na -4 pro podobnou velikost jako jídlo
        if (frenzyImg.complete && frenzyImg.naturalWidth > 0) {
            ctx.drawImage(frenzyImg, centerX - imgSize/2, centerY - imgSize/2, imgSize, imgSize);
        } else {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🍎', centerX, centerY + 4);
        }
    } else if (bonusType === 'magnet') {
        // Draw magnet.png instead of emoji
        const magnetImg = window.magnetImage || (window.magnetImage = new Image());
        if (!magnetImg.src) magnetImg.src = 'img/magnet.png';
        const imgSize = GRID_SIZE - 4; // Zvětšeno z -10 na -4 pro podobnou velikost jako jídlo
        if (magnetImg.complete && magnetImg.naturalWidth > 0) {
            ctx.drawImage(magnetImg, centerX - imgSize/2, centerY - imgSize/2, imgSize, imgSize);
        } else {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🧲', centerX, centerY + 4);
        }
    } else if (bonusType === 'speed') {
        // Draw speedReal.png instead of emoji
        const speedImg = window.speedImage || (window.speedImage = new Image());
        if (!speedImg.src) speedImg.src = 'img/speedReal.png';
        const imgSize = GRID_SIZE - 4; // Stejná velikost jako ostatní bonusy
        if (speedImg.complete && speedImg.naturalWidth > 0) {
            ctx.drawImage(speedImg, centerX - imgSize/2, centerY - imgSize/2, imgSize, imgSize);
        } else {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚡', centerX, centerY + 4);
        }
    } else if (bonusType === 'penalty') {
        // Draw penalization.png instead of emoji
        const penaltyImg = window.penaltyImage || (window.penaltyImage = new Image());
        if (!penaltyImg.src) penaltyImg.src = 'img/penalization.png';
        const imgSize = GRID_SIZE - 4; // Stejná velikost jako ostatní bonusy
        if (penaltyImg.complete && penaltyImg.naturalWidth > 0) {
            ctx.drawImage(penaltyImg, centerX - imgSize/2, centerY - imgSize/2, imgSize, imgSize);
        } else {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('💸', centerX, centerY + 4);
        }
    } else {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(emoji, centerX, centerY + 4);
    }
}

// Timer pro bonus
function drawBonusTimer(bonus) {
    const centerX = bonus.x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = bonus.y * GRID_SIZE + GRID_SIZE / 2;
    const radius = GRID_SIZE / 2 + 4;
    
    const timePercent = Math.max(0, bonus.timer / GAME_CONFIG.TIMINGS.BONUS_DURATION);
    
    // Pozadí kruhu
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Progress kruh - barva podle typu bonusu
    const bonusType = bonus.type;
    let progressColor;
    if (bonusType === 'slow') {
        progressColor = '#3498db';
    } else if (bonusType === 'magnet') {
        progressColor = '#9b59b6';
    } else if (bonusType === 'frenzy') {
        progressColor = '#f39c12';
    } else if (bonusType === 'penalty') {
        progressColor = '#e74c3c';
    } else if (bonusType === 'speed') {
        progressColor = '#f39c12';
    } else {
        progressColor = '#f39c12'; // default
    }
    let lineWidth = 4;
    
    if (timePercent <= 0.3) {
        const blinkAlpha = (Math.sin(Date.now() / 120) + 1) / 2;
        if (bonusType === 'slow') {
            progressColor = `rgba(52, 152, 219, ${0.7 + blinkAlpha * 0.3})`;
        } else if (bonusType === 'magnet') {
            progressColor = `rgba(155, 89, 182, ${0.7 + blinkAlpha * 0.3})`;
        } else if (bonusType === 'frenzy') {
            progressColor = `rgba(243, 156, 18, ${0.7 + blinkAlpha * 0.3})`;
        } else if (bonusType === 'penalty') {
            progressColor = `rgba(231, 76, 60, ${0.7 + blinkAlpha * 0.3})`;
        } else if (bonusType === 'speed') {
            progressColor = `rgba(243, 156, 18, ${0.7 + blinkAlpha * 0.3})`;
        }
        lineWidth = 5;
    }
    
    ctx.strokeStyle = progressColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, 
           -Math.PI / 2 + (2 * Math.PI * timePercent));
    ctx.stroke();
}

// NOVÁ funkce - vykreslení frenzy jídel
function drawFrenzyFoods() {
    if (gameState.frenzyFoods.length > 0) {
        console.log(`[RENDER] Kreslím ${gameState.frenzyFoods.length} frenzy jídel`);
    }
    // Use silenstvi.png for frenzy foods
    const silenstviImg = window.silenstviImage || (window.silenstviImage = new Image());
    if (!silenstviImg.src) silenstviImg.src = 'img/silenstvi.png';
    gameState.frenzyFoods.forEach(food => {
        const x = food.x * GRID_SIZE + 2;
        const y = food.y * GRID_SIZE + 2;
        const size = GRID_SIZE - 4;
        // Draw readable background behind the image
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.shadowColor = '#e67e22';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
        if (silenstviImg.complete && silenstviImg.naturalWidth > 0) {
            ctx.drawImage(silenstviImg, x, y, size, size);
        } else {
            // Fallback: gold color with sparkle
            const time = Date.now();
            const alpha = (Math.sin(time / 100) + 1) / 2;
            const goldColor = `rgba(${255}, ${215 + alpha * 40}, ${0 + alpha * 100}, 1)`;
            ctx.shadowColor = goldColor;
            ctx.shadowBlur = 10;
            ctx.fillStyle = goldColor;
            ctx.fillRect(x, y, size, size);
            ctx.shadowBlur = 0;
            const centerX = food.x * GRID_SIZE + GRID_SIZE / 2;
            const centerY = food.y * GRID_SIZE + GRID_SIZE / 2;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('💰', centerX, centerY + 3);
        }
    });
}

// Timer pro Food Frenzy
function drawFrenzyTimer() {
    const timeLeft = Math.max(0, gameState.frenzyTimer / 1000);
    const timePercent = timeLeft / (gameState.frenzyDuration / 1000);
    
    // Pozadí timeru
    const timerX = GAME_CONFIG.CANVAS.SIZE / 2 - 100;
    const timerY = 20;
    const timerWidth = 200;
    const timerHeight = 20;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(timerX, timerY, timerWidth, timerHeight);
    
    // Progress bar
    const progressColor = timePercent > 0.3 ? '#f39c12' : '#e74c3c';
    ctx.fillStyle = progressColor;
    ctx.fillRect(timerX + 2, timerY + 2, (timerWidth - 4) * timePercent, timerHeight - 4);
    
    // Okraj
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(timerX, timerY, timerWidth, timerHeight);
    
    // Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`FRENZY: ${timeLeft.toFixed(1)}s`, timerX + timerWidth / 2, timerY + 14);
}

// Vykreslení mřížky
function drawGrid() {
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= GRID_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
        ctx.stroke();
    }
}

// Vykreslení hada
function drawSnake() {
    if (!gameState.snake || gameState.snake.length === 0) {
        return;
    }
    
    if (!snakeSkins || !snakeSkins[gameState.currentSkin]) {
        // Fallback na základní vykreslení
        ctx.fillStyle = '#27ae60';
        gameState.snake.forEach((segment, index) => {
            ctx.fillRect(
                segment.x * GRID_SIZE + 1,
                segment.y * GRID_SIZE + 1,
                GRID_SIZE - 2,
                GRID_SIZE - 2
            );
        });
        return;
    }
    
    const skin = snakeSkins[gameState.currentSkin];
    gameState.snake.forEach((segment, index) => {
        // Speciální efekt pro rainbow skin
        if (skin.isRainbow) {
            const rainbowColors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
            const colorIndex = (index + Math.floor(Date.now() / 200)) % rainbowColors.length;
            ctx.fillStyle = rainbowColors[colorIndex];
        } else if (skin.isGalaxy) {
            // Galaxy efekt - tmavé barvy s hvězdami
            const galaxyColors = ['#2d3436', '#636e72', '#74b9ff', '#0984e3'];
            const colorIndex = (index + Math.floor(Date.now() / 300)) % galaxyColors.length;
            ctx.fillStyle = galaxyColors[colorIndex];
        } else if (skin.isDiamond) {
            // Diamond efekt - blikající bílé/stříbrné
            const diamondColors = ['#fff', '#ddd', '#ecf0f1', '#bdc3c7'];
            const colorIndex = (index + Math.floor(Date.now() / 150)) % diamondColors.length;
            ctx.fillStyle = diamondColors[colorIndex];
        } else {
            ctx.fillStyle = index === 0 ? skin.head : skin.body;
        }
        
        // Glowing efekt pro neon, fire, ice a purple skiny
        if (skin.glowing) {
            ctx.shadowColor = skin.head;
            ctx.shadowBlur = 10;
        }

        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );

        // Resetuj shadow
        ctx.shadowBlur = 0;
        
        // Oči pro hlavu hada
        if (index === 0) {
            drawSnakeEyes(segment);
        }
    });
}

// Vykreslení očí hada
function drawSnakeEyes(segment) {
    ctx.fillStyle = '#fff';
    const eyeSize = 3;
    const eyeOffset = 5;
    
    if (gameState.direction.x === 1) { // Doprava
        ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (gameState.direction.x === -1) { // Doleva
        ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (gameState.direction.y === 1) { // Dolů
        ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset, eyeSize, eyeSize);
    } else if (gameState.direction.y === -1) { // Nahoru
        ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + 2, eyeSize, eyeSize);
        ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, segment.y * GRID_SIZE + 2, eyeSize, eyeSize);
    }
}

// Vykreslení jídla
function drawFood() {
    if (!gameState.food) {
        return;
    }
    
    // Vykreslení hlavního jídla
    drawSingleFood(gameState.food, true);

    // Vykreslení více jídel (pokud jsou aktivní)
    if (gameState.multiFood && gameState.foods.length > 0) {
        gameState.foods.forEach(food => {
            drawSingleFood(food, false);
        });
    }
}

// Vykreslení jednoho jídla
function drawSingleFood(food, isMainFood = true) {
    // Použij obrázek místo červeného čtverce
    const foodImg = window.foodImage || (window.foodImage = new Image());
    if (!foodImg.src) foodImg.src = 'img/food.png';
    let padding = 2;
    // Pokud obrázek je načten, vykresli ho, jinak fallback na červený čtverec
    if (foodImg.complete && foodImg.naturalWidth > 0) {
        ctx.drawImage(
            foodImg,
            food.x * GRID_SIZE + padding,
            food.y * GRID_SIZE + padding,
            GRID_SIZE - (padding * 2),
            GRID_SIZE - (padding * 2)
        );
    } else {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(
            food.x * GRID_SIZE + padding,
            food.y * GRID_SIZE + padding,
            GRID_SIZE - (padding * 2),
            GRID_SIZE - (padding * 2)
        );
    }
    // Směrová šipka (jen pro hlavní jídlo a jen do 8. jídla)
    if (gameState.movingFood && gameState.foodEaten < GAME_CONFIG.PROGRESSION.ARROW_HIDE && isMainFood) {
        drawFoodDirectionArrow(food);
    }
    // Timer pro časované jídlo - pro všechna jídla
    if (gameState.timedFood) {
        drawFoodTimer(food);
    }
}

// Vykreslení směrové šipky pro konkrétní jídlo
function drawFoodDirectionArrow(food) {
    const centerX = food.x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = food.y * GRID_SIZE + GRID_SIZE / 2;
    
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';

    let arrow = '';
    const direction = food.direction || gameState.food.direction;
    
    if (direction.x === 1) arrow = '→';
    else if (direction.x === -1) arrow = '←';
    else if (direction.y === 1) arrow = '↓';
    else if (direction.y === -1) arrow = '↑';
    
    // Černý obrys
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(arrow, centerX, centerY + 4);
    // Bílá šipka
    ctx.fillText(arrow, centerX, centerY + 4);
    
    ctx.restore();
}



// Vykreslení timeru jídla
function drawFoodTimer(food) {
    const centerX = food.x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = food.y * GRID_SIZE + GRID_SIZE / 2;
    const radius = GRID_SIZE / 2 + 3;
    
    const timePercent = Math.max(0, gameState.foodTimer / gameState.foodMaxTime);
    
    // Pozadí kruhu
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Progress kruh s barvou podle času
    let progressColor;
    let lineWidth = 5;
    
    if (timePercent > 0.5) {
        progressColor = '#2ecc71';
    } else if (timePercent > 0.3) {
        progressColor = '#f39c12';
    } else if (timePercent > 0.1) {
        progressColor = '#e74c3c';
        lineWidth = 6;
    } else {
        const blinkAlpha = (Math.sin(Date.now() / 150) + 1) / 2;
        progressColor = `rgba(192, 57, 43, ${0.7 + blinkAlpha * 0.3})`;
        lineWidth = 7;
    }
    
    ctx.strokeStyle = progressColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, 
           -Math.PI / 2 + (2 * Math.PI * timePercent));
    ctx.stroke();
}

// Urgentní varování při nízkém času
function drawUrgentWarning(food) {
    const centerX = food.x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = food.y * GRID_SIZE + GRID_SIZE / 2;
    
    const alpha = (Math.sin(Date.now() / 100) + 1) / 2;
    ctx.fillStyle = `rgba(231, 76, 60, ${alpha * 0.5})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, GRID_SIZE, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', centerX, centerY + 5);
}

// Vymazání canvasu při konci hry
function clearCanvas() {
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    drawGrid();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    
    ctx.font = '24px Arial';
    ctx.fillText('Stiskni ENTER pro restart', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 50);
}

// Funkce pro vykreslení kamenů
function drawRocks() {
    ctx.save();
    const rockImg = window.rockImage || (window.rockImage = new Image());
    if (!rockImg.src) rockImg.src = 'img/rock.png';
    for (let rock of gameState.rocks) {
        const x = rock.x * GRID_SIZE;
        const y = rock.y * GRID_SIZE;
        // Pokud obrázek je načten, vykresli ho, jinak fallback na šedý čtverec
        if (rockImg.complete && rockImg.naturalWidth > 0) {
            ctx.drawImage(
                rockImg,
                x + 2,
                y + 2,
                GRID_SIZE - 4,
                GRID_SIZE - 4
            );
        } else {
            ctx.fillStyle = '#888';
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4);
            ctx.fill();
            ctx.stroke();
        }
    }
    ctx.restore();
}

// Exporty a aliasy pro kompatibilitu
window.draw = draw;
window.drawGame = draw; // Alias pro kompatibilitu
window.clearCanvas = clearCanvas;
