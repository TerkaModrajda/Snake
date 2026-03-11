# 🐍 Snake Hra - Rychlý přehled

## 🎮 Jak hrát
1. **Spusť**: Enter nebo klikni na šipky
2. **Pohyb**: Šipky nebo WASD  
3. **Pauza**: Mezerník

## 📊 Progrese hry

| Level | Co se stane |
|-------|-------------|
| 3 🍎 | ⏰ Timer jídla (10s) |
| 5 🍎 | ⚡ Zrychlování + 🐌 Bonus zpomalení |
| 8 🍎 | 🏃 Pohybující se jídlo |
| 10 🍎 | 🎯 Šipka zmizí |
| 12 🍎 | 💨 Rychlejší jídlo + 🌟 Super jídlo |
| 15 🍎 | 🍎🍎 Dvě jídla najednou |

## 🎁 Bonusy

### 🌟 Super jídlo (2x2)
- **Kdy**: Od 12. jídla, každých 20s
- **Trvání**: 3 sekundy  
- **Bonus**: +50 bodů
- **Pohyb**: Ano (od 12. jídla)

### 🐌 Bonus zpomalení 
- **Kdy**: Od 5. jídla, náhodně po 17s+
- **Trvání**: 5s na mapě, efekt 8s
- **Efekt**: Zpomalí hada na 8s

### 🧲 Magnet bonus
- **Kdy**: Od 5. jídla, náhodně po 17s+
- **Trvání**: 5s na mapě, efekt 8s
- **Efekt**: Přitáhne všechna jídla k hadovi

### 🍎 Food Frenzy bonus
- **Kdy**: Od 5. jídla, náhodně po 17s+
- **Trvání**: 5s na mapě
- **Efekt**: Objeví se 15 jídel na 10s

### 💸 Penalty bonus (NEBEZPEČNÝ!)
- **Kdy**: Od 5. jídla, náhodně po 17s+
- **Trvání**: 5s na mapě
- **Efekt**: Odečte 50 bodů!

### ⚡ Speed bonus (NEBEZPEČNÝ!)
- **Kdy**: Od 5. jídla, náhodně po 17s+
- **Trvání**: 5s na mapě, efekt 8s
- **Efekt**: Zrychlí hada na 8s!

## 📁 Soubory

### 🔧 Konfigurace
- `js/config.js` - **Všechna nastavení zde!**

### 🎯 Hlavní logika
- `js/gameLogic.js` - Pohyb, kolize, level-upy
- `js/movingFood.js` - Jídla a bonusy
- `js/timers.js` - Časovače

### 🎨 Grafika
- `js/rendering.js` - Vykreslování
- `js/skins.js` - Skiny hada
- `js/animations.js` - Efekty

### 📋 Data a UI  
- `js/gameState.js` - Herní stav
- `js/domElements.js` - UI funkce

## ⚙️ Rychlé úpravy

**Chcete změnit něco ve hře?** → Editujte `js/config.js`

```javascript
// Příklady úprav v config.js:
PROGRESSION: {
    TIMER_START: 2,        // Timer od 2. jídla místo 3.
    MULTI_FOOD_START: 10   // Více jídel od 10. místo 15.
}

TIMINGS: {
    FOOD_MAX_TIME: 15000   // 15 sekund místo 10
}

SCORING: {
    SUPER_FOOD: 100        // 100 bodů místo 50
}
```

## 🚀 Další vývoj

### Snadné přidání
1. **Nový bonus** → Přidat do `movingFood.js` + `timers.js`
2. **Nový skin** → Přidat do `skins.js` 
3. **Nová mechanika** → Upravit `gameLogic.js`

### Doporučené vylepšení
- [ ] Rozdělení `gameLogic.js` (je moc dlouhý)
- [ ] Přidání unit testů
- [ ] Lepší error handling
- [ ] Lokální multiplayer

---

**💡 TIP**: Pro debugging otevřete konzoli (F12) a sledujte výpisy funkcí.
