# 🐍 Snake Hra - Kompletní dokumentace

## 📋 Obsah
1. [Přehled hry](#přehled-hry)
2. [Struktura projektu](#struktura-projektu)
3. [Herní mechaniky](#herní-mechaniky)
4. [Moduly a jejich funkce](#moduly-a-jejich-funkce)
5. [Herní progrese](#herní-progrese)
6. [Bonusy a speciální jídla](#bonusy-a-speciální-jídla)

## 🎮 Přehled hry

Moderní verze klasické hry Snake s progresivními mechaniky, bonusy a několika skiny pro hada.

### Základní ovládání
- **Šipky** / **WASD**: Pohyb hada
- **Mezerník**: Pauza/Pokračování
- **Enter**: Start/Restart hry

## 📁 Struktura projektu

```
/
├── index.html              # Hlavní HTML soubor
├── style.css              # CSS styly
├── script.js              # Hlavní inicializační script
├── js/
│   ├── gameState.js       # Herní stav a konstanty
│   ├── domElements.js     # DOM elementy a UI funkce
│   ├── gameLogic.js       # Hlavní herní logika
│   ├── movingFood.js      # Logika pohybujícího se jídla a bonusů
│   ├── timers.js          # Timer systém (jídlo, bonusy)
│   ├── rendering.js       # Vykreslování grafiky
│   ├── animations.js      # Animace a efekty
│   └── skins.js           # Systém skinů pro hada
├── README.md              # Základní informace
└── DOKUMENTACE.md         # Tato dokumentace
```

## 🕹️ Herní mechaniky

### Základní hra
- **Had**: Začína s jedním segmentem, roste při snědení jídla
- **Jídlo**: +10 bodů, prodlouží hada o jeden segment
- **Kolize**: Se stěnami nebo sebou samým = konec hry

### Progresivní systém (podle počtu snědených jídel)

| Jídlo | Mechanika | Popis |
|-------|-----------|-------|
| 3 | ⏱️ **Timer jídla** | Jídlo musí být snědeno do 10 sekund |
| 5 | ⚡ **Zrychlování** | Had se postupně zrychluje |
| 8 | 🏃 **Pohybující se jídlo** | Jídlo se začne pohybovat |
| 10 | 🎯 **Skrytí šipky** | Směrová šipka zmizí |
| 12 | 💨 **Rychlejší jídlo** | Pohyb jídla se zrychluje |
| 15 | 🍎🍎 **Více jídel** | Objeví se 2 jídla současně |

## 🏗️ Moduly a jejich funkce

### 📊 gameState.js
**Účel**: Centrální úložiště všech herních dat
```javascript
// Obsahuje:
- Základní herní stav (had, skóre, rychlost)
- Konfigurace jídel a bonusů  
- Nastavení timerů a intervalů
- Aktuální skin hada
```

### 🎯 gameLogic.js
**Účel**: Hlavní herní logika a kontroly
```javascript
// Klíčové funkce:
- update(): Pohyb hada a kolize
- handleFoodEaten(): Zpracování snědených jídel
- checkCollisions(): Kontrola všech kolizí
- activateSlowBonusEffect(): Aktivace zpomalení
```

### 🍎 movingFood.js
**Účel**: Správa jídel a bonusů
```javascript
// Klíčové funkce:
- generateFood(): Vytvoření nového jídla
- moveFoodIfNeeded(): Pohyb všech jídel
- generateSuperFood(): Vytvoření super jídla
- generateSlowBonus(): Vytvoření bonus zpomalení
```

### ⏰ timers.js
**Účel**: Správa všech časovačů
```javascript
// Klíčové funkce:
- updateTimers(): Hlavní timer loop
- manageSuperFood(): Správa super jídla
- manageSlowBonus(): Správa bonus zpomalení
```

### 🎨 rendering.js
**Účel**: Vykreslování všech grafických prvků
```javascript
// Klíčové funkce:
- draw(): Hlavní vykreslovací funkce
- drawSingleFood(): Vykreslení jednoho jídla
- drawSuperFood(): Vykreslení super jídla (2x2)
- drawSlowBonus(): Vykreslení bonus zpomalení
```

### 🎭 skins.js & animations.js
**Účel**: Vizuální efekty a personalizace
```javascript
// Obsahuje:
- Definice skinů hada
- Animace skóre a efektů
- Floating texty
- Notifikace systém
```

## 📈 Herní progrese

### Fáze 1: Základní hra (1-2 jídla)
- ✅ Jednoduchý Snake gameplay
- ✅ Statické jídlo
- ✅ Konstantní rychlost

### Fáze 2: Timer systém (3-4 jídla)
- ✅ Časování jídla (10 sekund)
- ✅ Penalizace za nestihlé jídlo (-5 bodů, zkrácení)

### Fáze 3: Zrychlování (5-7 jídel)
- ✅ Progresivní zrychlování hada
- ✅ Možnost získat bonus zpomalení

### Fáze 4: Pohybující se jídlo (8-11 jídel)
- ✅ Jídlo se pohybuje po mapě
- ✅ Směrová šipka (do 9. jídla)
- ✅ Kolize jídla se stěnami

### Fáze 5: Rychlé jídlo (12-14 jídel)
- ✅ Progresivní zrychlování pohybu jídla
- ✅ Super jídlo bonusy (od 12. jídla)

### Fáze 6: Více jídel (15+ jídel)
- ✅ Dvě jídla současně
- ✅ Nezávislý pohyb každého jídla
- ✅ Chytré nahrazování (jen snědené se obnoví)

## 🎁 Bonusy a speciální jídla

### 🌟 Super jídlo
- **Velikost**: 2x2 čtverce
- **Frekvence**: Každých 20 sekund (od 12. jídla)
- **Doba**: 3 sekundy na mapě
- **Bonus**: +50 bodů
- **Pohyb**: Ano (od 12. jídla)
- **Vizuál**: Zlaté s hvězdičkou ★

### 🐌 Bonus zpomalení
- **Velikost**: 1x1 čtverec
- **Frekvence**: Náhodně po 17+ sekundách (od 5. jídla)
- **Doba**: 8 sekund na mapě
- **Efekt**: Zpomalí hada na 8 sekund
- **Vizuál**: Modré s emoji šneka 🐌

## 🎨 Systém skinů

### Dostupné skiny
1. **Klasický** 🟢 - Zelený had (výchozí)
2. **Duha** 🌈 - Měnící se barvy  
3. **Neon** 💡 - Svítící efekt
4. **Zlatý** 🏆 - Odemkne se při 200+ bodech
5. **Ohnivý** 🔥 - Odemkne se při 500+ bodech

## 🔧 Technické detaily

### Důležité konstanty
```javascript
CANVAS_SIZE = 600px      // Velikost herního pole
GRID_SIZE = 20px         // Velikost jednoho čtverce
GRID_COUNT = 30          // Počet čtverců (30x30)
```

### Timer intervaly
```javascript
foodMaxTime = 10000ms           // Čas na snědení jídla
superFoodSpawnInterval = 20000ms // Interval super jídla
minSlowBonusInterval = 17000ms   // Min. interval bonus zpomalení
slowBonusEffectDuration = 8000ms // Doba efektu zpomalení
```

## 🐛 Řešení problémů

### Časté problémy
1. **Hra se nezobrazuje**: Zkontrolujte konzoli prohlížeče (F12)
2. **Jídlo zmizí**: Normální - časovač vypršel po 10 sekundách
3. **Had nejde ovládat**: Zkontrolujte, zda hra běží (není pozastavená)

### Debug informace
Otevřete konzoli (F12) pro sledování:
- Pohybu jídel
- Spawnutí bonusů
- Změn rychlosti
- Timer událostí

---

**Vytvořeno**: Prosinec 2024  
**Verze**: 2.0 (Pokročilá s bonusy)  
**Autor**: [Vaše jméno]
