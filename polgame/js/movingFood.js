// ============================================
// POHYBUJÍCÍ SE JÍDLO
// ============================================

// Nastavení náhodného směru pohybu jídla
function setRandomFoodDirection() {
    gameState.food.direction = getRandomDirection();
    console.log("Hlavní jídlo se bude pohybovat směrem:", gameState.food.direction);
}

// Kontrola, zda je pozice jídla platná
function isFoodPositionValid(position) {
    // Zkontroluj hranice
    if (position.x < 0 || position.x >= GRID_COUNT || 
        position.y < 0 || position.y >= GRID_COUNT) {
        return false;
    }
    
    // Zkontroluj kolizi s hadem
    for (let segment of gameState.snake) {
        if (segment.x === position.x && segment.y === position.y) {
            return false;
        }
    }
    
    return true;
}

// Pohyb jídla, pokud je povoleno
function moveFoodIfNeeded(currentTime) {
    if (!gameState.movingFood || gameState.gamePaused || !gameState.gameRunning) {
        return;
    }
    
// Progresivní zrychlování pohybu jídla od 12. jídla
    let currentFoodSpeed = gameState.foodMoveSpeed;
    if (gameState.foodEaten >= 12) {
        // Zrychlování: každé jídlo od 12. zmenší interval o 300ms
        const speedReduction = (gameState.foodEaten - 11) * 300;
        currentFoodSpeed = Math.max(800, gameState.foodMoveSpeed - speedReduction); // Minimálně 800ms
        console.log(`Jídlo #${gameState.foodEaten}: pohyb každých ${currentFoodSpeed}ms`);
    }

    // Zkontroluj, jestli je čas na pohyb jídla
    if (currentTime - gameState.food.lastMoveTime >= currentFoodSpeed) {
        const newFoodPosition = {
            x: gameState.food.x + gameState.food.direction.x,
            y: gameState.food.y + gameState.food.direction.y
        };
        
        // Zkontroluj kolize se zdí nebo hadem
        if (isFoodPositionValid(newFoodPosition)) {
            gameState.food.x = newFoodPosition.x;
            gameState.food.y = newFoodPosition.y;
            gameState.food.lastMoveTime = currentTime;
        } else {
            gameState.food.direction = getRandomDirection();
            gameState.food.lastMoveTime = currentTime - currentFoodSpeed + 500;
        }
    }

    // NOVÉ - Pohyb více jídel (pokud jsou aktivní)
    if (gameState.multiFood && gameState.foods.length > 0) {
        gameState.foods.forEach((food, index) => {
            if (currentTime - food.lastMoveTime >= currentFoodSpeed) {
                const newFoodPosition = {
                    x: food.x + food.direction.x,
                    y: food.y + food.direction.y
                };
                
                if (isFoodPositionValidForMultiple(newFoodPosition, gameState.foods.filter((_, i) => i !== index))) {
                    food.x = newFoodPosition.x;
                    food.y = newFoodPosition.y;
                    food.lastMoveTime = currentTime;
                } else {
                    food.direction = getRandomDirection();
                    food.lastMoveTime = currentTime - currentFoodSpeed + 500;
                }
            }
        });
    }

    // NOVÉ - Pohyb super jídla (od 12. jídla)
    if (gameState.superFoodActive && gameState.superFood && 
        gameState.movingFood && gameState.foodEaten >= 12) {
        
        if (currentTime - gameState.superFood.lastMoveTime >= currentFoodSpeed) {
            const newSuperFoodPosition = {
                x: gameState.superFood.x + gameState.superFood.direction.x,
                y: gameState.superFood.y + gameState.superFood.direction.y
            };
            
            if (isSuperFoodPositionValid(newSuperFoodPosition)) {
                gameState.superFood.x = newSuperFoodPosition.x;
                gameState.superFood.y = newSuperFoodPosition.y;
                gameState.superFood.lastMoveTime = currentTime;
            } else {
                gameState.superFood.direction = getRandomDirection();
                gameState.superFood.lastMoveTime = currentTime - currentFoodSpeed + 500;
            }
        }
    }
}

// Generování jídla na náhodné pozici
function generateFood() {
    let newFood;
    let attempts = 0;
    
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_COUNT),
            y: Math.floor(Math.random() * GRID_COUNT),
            direction: { x: 0, y: 0 },
            lastMoveTime: Date.now()
        };
        attempts++;
    } while (!isFoodPositionValid(newFood) && attempts < 100);

    // Pokud se nepodařilo najít validní pozici
    if (attempts >= 100) {
        console.error("CHYBA: Nepodařilo se najít volné místo pro jídlo po 100 pokusech!");
        console.log(`Snake délka: ${gameState.snake.length}, Grid velikost: ${GRID_COUNT}x${GRID_COUNT}`);
        
        // Vrať jídlo na náhodné místo (může být na hadovi - emergency fallback)
        newFood = {
            x: Math.floor(Math.random() * GRID_COUNT),
            y: Math.floor(Math.random() * GRID_COUNT),
            direction: { x: 0, y: 0 },
            lastMoveTime: Date.now()
        };
    }

    if (gameState.movingFood) {
        newFood.direction = getRandomDirection();
        newFood.lastMoveTime = Date.now();
    }
    
    // Resetuj čas pohybu jídla při vygenerování nového
    if (gameState.movingFood) {
        newFood.lastMoveTime = Date.now();
        newFood.direction = getRandomDirection();
    }
    
    return newFood;
}

// NOVÁ funkce - generování více jídel
function generateMultipleFoods(count = 2) {
    const foods = [];
    
    for (let i = 0; i < count; i++) {
        let newFood;
        let attempts = 0;
        
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_COUNT),
                y: Math.floor(Math.random() * GRID_COUNT),
                direction: { x: 0, y: 0 },
                lastMoveTime: Date.now()
            };
            attempts++;
        } while (!isFoodPositionValidForMultiple(newFood, foods) && attempts < 100);
         // Nastav náhodný směr
        if (gameState.movingFood) {
            newFood.direction = getRandomDirection();
            newFood.lastMoveTime = Date.now();
        }
        
        foods.push(newFood);
    }
    
    return foods;
}

// NOVÁ funkce - validace pozice pro více jídel
function isFoodPositionValidForMultiple(position, existingFoods) {
    // Zkontroluj hranice
    if (position.x < 0 || position.x >= GRID_COUNT || 
        position.y < 0 || position.y >= GRID_COUNT) {
        return false;
    }
    
    // Zkontroluj kolizi s hadem
    for (let segment of gameState.snake) {
        if (segment.x === position.x && segment.y === position.y) {
            return false;
        }
    }
    
    // Zkontroluj kolizi s existujícími jídly
    for (let food of existingFoods) {
        if (food.x === position.x && food.y === position.y) {
            return false;
        }
    }
    
    // Zkontroluj kolizi s hlavním jídlem (pokud existuje)
    if (gameState.food && gameState.food.x === position.x && gameState.food.y === position.y) {
        return false;
    }
    
    return true;
}

// NOVÁ funkce - náhodný směr
function getRandomDirection() {
    const directions = [
        { x: 1, y: 0 },   // Doprava
        { x: -1, y: 0 },  // Doleva
        { x: 0, y: 1 },   // Dolů
        { x: 0, y: -1 }   // Nahoru
    ];
    
    return directions[Math.floor(Math.random() * directions.length)];
}

// Generování super jídla (2x2 čtverečky)
function generateSuperFood() {
    let superFood;
    let attempts = 0;
    
    do {
        superFood = {
            x: Math.floor(Math.random() * (GRID_COUNT - 1)), // -1 protože zabírá 2x2
            y: Math.floor(Math.random() * (GRID_COUNT - 1)),
            direction: { x: 0, y: 0 },
            lastMoveTime: Date.now()
        };
        attempts++;
    } while (!isSuperFoodPositionValid(superFood) && attempts < 100);

    // Pokud je pohyb aktivní a je alespoň 12 jídel
    if (gameState.movingFood && gameState.foodEaten >= 12) {
        superFood.direction = getRandomDirection();
        superFood.lastMoveTime = Date.now();
    }
    
    return superFood;
}

// Validace pozice pro super jídlo (2x2)
function isSuperFoodPositionValid(superFood) {
    // Zkontroluj všechny 4 pozice super jídla
    for (let dx = 0; dx < 2; dx++) {
        for (let dy = 0; dy < 2; dy++) {
            const x = superFood.x + dx;
            const y = superFood.y + dy;
            
            // Zkontroluj hranice
            if (x < 0 || x >= GRID_COUNT || y < 0 || y >= GRID_COUNT) {
                return false;
            }
            
            // Zkontroluj kolizi s hadem
            for (let segment of gameState.snake) {
                if (segment.x === x && segment.y === y) {
                    return false;
                }
            }
            
            // Zkontroluj kolizi s hlavním jídlem
            if (gameState.food && gameState.food.x === x && gameState.food.y === y) {
                return false;
            }
            
            // Zkontroluj kolizi s dalšími jídly
            if (gameState.multiFood && gameState.foods.length > 0) {
                for (let food of gameState.foods) {
                    if (food.x === x && food.y === y) {
                        return false;
                    }
                }
            }
        }
    }
    
    return true;
}

// Kontrola kolize hada se super jídlem (2x2)
function checkSuperFoodCollision(head) {
    if (!gameState.superFoodActive || !gameState.superFood) {
        return false;
    }
    
    // Zkontroluj kolizi s kterýmkoliv ze 4 čtverečků super jídla
    for (let dx = 0; dx < 2; dx++) {
        for (let dy = 0; dy < 2; dy++) {
            if (head.x === gameState.superFood.x + dx && 
                head.y === gameState.superFood.y + dy) {
                return true;
            }
        }
    }
    
    return false;
}

// Generování bonusu (zpomalení nebo magnet)
function generateBonus(type) {
    let bonus;
    let attempts = 0;
    
    do {
        bonus = {
            x: Math.floor(Math.random() * GRID_COUNT),
            y: Math.floor(Math.random() * GRID_COUNT),
            type: type
        };
        attempts++;
    } while (!isBonusPositionValid(bonus) && attempts < 100);
    
    return bonus;
}

// Validace pozice pro bonus
function isBonusPositionValid(bonus) {
    // Zkontroluj hranice
    if (bonus.x < 0 || bonus.x >= GRID_COUNT || 
        bonus.y < 0 || bonus.y >= GRID_COUNT) {
        return false;
    }
    
    // Zkontroluj kolizi s hadem
    for (let segment of gameState.snake) {
        if (segment.x === bonus.x && segment.y === bonus.y) {
            return false;
        }
    }
    
    // Zkontroluj kolizi s hlavním jídlem
    if (gameState.food && gameState.food.x === bonus.x && gameState.food.y === bonus.y) {
        return false;
    }
    
    // Zkontroluj kolizi s dalšími jídly
    if (gameState.multiFood && gameState.foods.length > 0) {
        for (let food of gameState.foods) {
            if (food.x === bonus.x && food.y === bonus.y) {
                return false;
            }
        }
    }
    
    // Zkontroluj kolizi se super jídlem
    if (gameState.superFoodActive && gameState.superFood) {
        for (let dx = 0; dx < 2; dx++) {
            for (let dy = 0; dy < 2; dy++) {
                if (bonus.x === gameState.superFood.x + dx && 
                    bonus.y === gameState.superFood.y + dy) {
                    return false;
                }
            }
        }
    }
    
    return true;
}

// Kontrola kolize s bonusem
function checkBonusCollision(head) {
    if (!gameState.bonusActive || !gameState.bonus) {
        return false;
    }
    
    return head.x === gameState.bonus.x && head.y === gameState.bonus.y;
}

// Exporty funkcí
window.generateFood = generateFood;
window.isFoodPositionValid = isFoodPositionValid;
window.checkBonusCollision = checkBonusCollision;
window.moveFoodIfNeeded = moveFoodIfNeeded;
window.setRandomFoodDirection = setRandomFoodDirection;
window.getRandomDirection = getRandomDirection;
window.generateMultipleFoods = generateMultipleFoods;