# 🏗️ Architektura Snake hry

## 📊 Datový tok

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │───▶│   Game Logic    │───▶│   Rendering     │
│  (keyboard)     │    │   (update)      │    │   (canvas)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Game State    │
                       │  (centrální     │
                       │   úložiště)     │
                       └─────────────────┘
                              ▲
                              │
                       ┌─────────────────┐
                       │    Timers       │
                       │ (food, bonuses) │
                       └─────────────────┘
```

## 🔄 Herní smyčka (60 FPS)

```javascript
function smoothGameLoop() {
    gameLoop();                    // Hlavní herní logika
    requestAnimationFrame(smoothGameLoop); // 60 FPS
}

function gameLoop() {
    if (čas_pro_pohyb_hada) {
        update();                  // Pohyb hada + kolize
    }
    updateTimers(currentTime);     // Timery (nezávisle)
    draw();                        // Vykreslení
}
```

## 🧩 Moduly a jejich závislosti

### gameState.js (Základ)
```
┌─────────────────────────────────────────┐
│              GAME STATE                 │
│  ┌─────────────────────────────────────┐ │
│  │ • snake[]     • foods[]            │ │
│  │ • food{}      • superFood{}        │ │  
│  │ • score       • slowBonus{}        │ │
│  │ • gameSpeed   • timers             │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### gameLogic.js (Řídící logika)
```
Závislosti: gameState, movingFood, timers, rendering

Klíčové funkce:
├── update()
│   ├── checkCollisions()
│   ├── handleFoodEaten()
│   └── moveSnake()
├── handleKeydown()
└── activateEffects()
```

### movingFood.js (Jídla a bonusy)
```
Závislosti: gameState

Funkce:
├── generateFood()
├── generateSuperFood()  
├── generateSlowBonus()
├── moveFoodIfNeeded()
└── validationFunctions()
```

### timers.js (Časovače)
```
Závislosti: gameState, movingFood, gameLogic

Funkce:
├── updateTimers()
├── manageSuperFood()
└── manageSlowBonus()
```

### rendering.js (Grafika)
```
Závislosti: gameState

Funkce:
├── draw()
├── drawSingleFood()
├── drawSuperFood()
├── drawSlowBonus()
└── drawTimers()
```

## 🎯 Návrhy na zlepšení

### 1. Rozdělení gameLogic.js
```javascript
// Současnost: gameLogic.js (400+ řádků)
// Návrh:
├── gameLogic.js      // Základní logika (150 řádků)
├── collisions.js     // Detekce kolizí (100 řádků)  
├── gameProgression.js // Level up mechaniky (100 řádků)
└── effects.js        // Bonusové efekty (50 řádků)
```

### 2. Centralizace konfigurece
```javascript
// config.js
const GAME_CONFIG = {
    TIMINGS: {
        foodMaxTime: 10000,
        superFoodInterval: 20000,
        slowBonusInterval: 17000
    },
    PROGRESSION: {
        timerStart: 3,
        speedUpStart: 5,  
        movingFoodStart: 8,
        multiFoodStart: 15
    }
};
```

### 3. Lepší error handling
```javascript
// Přidat try-catch bloky
// Validace dat před použitím  
// Graceful degradation při chybách
```

## 🔧 Refaktoring priorita

### Vysoká priorita
1. ✅ **Dokumentace** - Hotovo
2. 🔄 **Rozdělení gameLogic.js** - Doporučuji
3. 🔄 **Config soubor** - Pro snadné úpravy

### Střední priorita  
1. **Error handling** - Stabilita
2. **Unit testy** - Pro složitější logiku
3. **Performance optimalizace** - Při růstu složitosti

### Nízká priorita
1. **TypeScript** - Lepší typování
2. **Module bundler** - Webpack/Vite
3. **Service Worker** - Offline hra

---

**Závěr**: Kód je funkční, ale pro další vývoj doporučuji rozdělit gameLogic.js a vytvořit config soubor pro snadnější úpravy mechanik.
