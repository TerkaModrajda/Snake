# Snake Hra - Kompletní Dokumentace

Pokročilá implementace klasické hry Snake s modulární architekturou a mnoha vylepšeními.

## 📁 Struktura Projektu

```
📦 Snake Hra
├── 📄 index.html          # HTML struktura hry
├── 📄 style.css           # CSS styly a animace
├── 📄 script.js          # Hlavní inicializační soubor
├── 📄 README.md          # Tato dokumentace
└── 📂 js/                # JavaScriptové moduly
    ├── 📄 gameState.js   # Herní stav a konstanty
    ├── 📄 domElements.js # DOM elementy a UI funkce
    ├── 📄 gameLogic.js   # Hlavní herní logika
    ├── 📄 rendering.js   # Vykreslování na canvas
    ├── 📄 animations.js  # Animace a vizuální efekty
    ├── 📄 movingFood.js  # Logika pohybujícího se jídla
    ├── 📄 timers.js      # Časovače a penalizace
    └── 📄 skins.js       # Skin systém a achievementy
```

## 🎮 Herní Funkce

### Základní Mechaniky
- **Klasická Snake hra** s moderním designem
- **Responzivní ovládání** (klávesnice + touch tlačítka)
- **Plynulé animace** a vizuální efekty (60 FPS)

### Pokročilé Funkce
- **🎨 Skin systém** - 5 různých vzhledů hada
- **⏰ Časované jídlo** - od 3. jídla máte 10 sekund na snědení
- **⚡ Plynulé zrychlování** - hra se postupně zrychluje od 5. jídla
- **🏃‍♂️ Pohybující se jídlo** - od 12. jídla se jídlo začne pohybovat
- **💥 Penalizace** - při nestihlém jídlu se had zkrátí a ztratí 5 bodů
- **📊 Historie her** - sledování posledních 5 her
- **🏆 Achievementy** - odemykatelné úspěchy
- **🔥 Vizuální timer** - barevný ukazatel zbývajícího času

## 📋 Popis Modulů

### 🎯 gameState.js
**Účel:** Centrální úložiště všech herních dat
- Herní konstanty (CANVAS_SIZE, GRID_SIZE, GRID_COUNT)
- Aktuální stav hry (pozice hada, jídla, skóre, rychlost)
- Definice všech skinů hada
- Historie her a statistiky

### 🖥️ domElements.js
**Účel:** Správa DOM elementů a UI funkcí
- Reference na všechny HTML elementy
- UI funkce (updateScore, showGameOver, togglePause)
- Správa popup oken (start, game over)
- Herní ovládání (startGame, restartGame, gameOver)

### 🎮 gameLogic.js
**Účel:** Hlavní herní logika a ovládání
- Hlavní herní smyčka (gameLoop)
- Aktualizace pozice hada (update)
- Zpracování vstupů z klávesnice a touch ovládání
- Logika při snědení jídla (level systém)
- 60 FPS herní smyčka (smoothGameLoop)

### 🎨 rendering.js
**Účel:** Vykreslování všech herních elementů na canvas
- Hlavní vykreslovací funkce (draw)
- Vykreslení hada s různými skiny a efekty
- Vykreslení jídla s časovým timerem
- Vykreslení herní mřížky
- Floating text efekty na canvasu

### ✨ animations.js
**Účel:** Animace a vizuální efekty
- Animace skóre při získání bodů
- Floating text efekty s fade out animací
- Animace zkrácení hada při penalizaci
- Herní notifikace s slide-in efektem
- Vizuální feedback pro různé akce

### 🏃‍♂️ movingFood.js
**Účel:** Logika pohybujícího se jídla (od 12. jídla)
- Pohyb jídla podle časování
- Náhodné změny směru pohybu
- Generování nových pozic jídla
- Kontrola kolizí s hadem a hranicami
- Trail efekt za pohybujícím se jídlem

### ⏱️ timers.js
**Účel:** Časovače a penalizační systém
- Aktualizace timerů pro časované jídlo
- Penalizace za nestihlé jídlo (zkrácení + body)
- Vizuální timer s barevným indikátorem
- Urgentní varování při nízkém času
- Správa všech časových mechanik

### 🎨 skins.js
**Účel:** Skin systém a achievementy
- Změna a odemykání skinů hada
- Správa historie her a statistik
- Systém achievementů
- Aktualizace UI pro skiny a úspěchy
- Persistence dat v localStorage

## 🎛️ Ovládání

### ⌨️ Klávesnice
- **←↑↓→** Šipky - pohyb hada
- **Enter** - start/restart hry
- **Mezerník** - pauza/pokračování

### 📱 Touch Ovládání
- **Směrová tlačítka** - pohyb hada (mobilní zařízení)
- **Herní tlačítka** - restart, pauza

## 🏆 Herní Progrese a Levely

### Level 1: Základní Hra (0-2 jídla)
- Klasický Snake gameplay
- Konstantní rychlost hry

### Level 2: Časované Jídlo (3+ jídla)
- **⏰ 10 sekund** na snědení každého jídla
- **Vizuální timer** s barevným indikátorem
- **Penalizace** při nestihlém jídlu

### Level 3: Zrychlování (5+ jídla)
- **⚡ Postupné zrychlování** hry
- Každé jídlo zvýší rychlost
- Maximální rychlost při 60ms intervalu

### Level 4: Pohybující se Jídlo (12+ jídla)
- **🏃‍♂️ Jídlo se pohybuje** po mapě
- **Náhodné směry** pohybu
- **Trail efekt** za jídlem
- **Šipka směru** ukazující pohyb

## 🎨 Skin Systém

### Dostupné Skiny
1. **🟢 Klasický** - základní zelený had (odemčený)
2. **🌈 Duha** - duhové barvy s animací (odemčený)
3. **💚 Neon** - svítící efekt (odemčený)
4. **🟡 Zlatý** - zlatá barva (skóre 200+)
5. **🔥 Ohnivý** - červený s glow efektem (skóre 500+)

### Speciální Efekty
- **Rainbow skin**: Animované duhové barvy
- **Neon & Fire skin**: Svítící glow efekt
- **Oči hada**: Měnící se podle směru pohybu

## 🏆 Achievement Systém

### Dostupné Úspěchy
- **🎮 První Hra** - zahrajte si poprvé
- **💯 Skóre 100** - dosáhněte 100 bodů
- **🔥 Skóre 500** - dosáhněte 500 bodů

## 📊 Statistiky a Historie

### Sledované Metriky
- **Celkový počet her**
- **Průměrné skóre** 
- **Nejlepší série**
- **Historie posledních 5 her** s datem a časem

## 🔧 Technické Detaily

### Výkonnost
- **60 FPS** pomocí `requestAnimationFrame`
- **Modulární architektura** pro snadnou údržbu
- **Efektivní vykreslování** s canvas optimalizacemi
- **Responsive design** pro všechny velikosti obrazovek

### Persistence
- **localStorage** pro uložení:
  - Nejlepší skóre
  - Vybraný skin
  - Historie her
  - Odemčené achievementy
  - Herní statistiky

### Browser Kompatibilita
- Moderní webové prohlížeče s HTML5 Canvas podporou
- Touch události pro mobilní zařízení
- CSS3 animace a přechody

## 🚀 Instalace a Spuštění

1. **Stažení**: Stáhněte všechny soubory do jedné složky
2. **Spuštění**: Otevřete `index.html` v prohlížeči
3. **Hra**: Stiskněte Enter nebo směrové tlačítko pro start

```bash
# Struktura souborů
├── index.html
├── style.css  
├── script.js
├── README.md
└── js/
    ├── gameState.js
    ├── domElements.js
    ├── gameLogic.js
    ├── rendering.js
    ├── animations.js
    ├── movingFood.js
    ├── timers.js
    └── skins.js
```

## 🛠️ Budoucí Vylepšení

Modulární struktura umožňuje snadné rozšíření:

### Plánované Funkce
- **🔊 Zvukové efekty** - hudba a zvuky
- **🌍 Různé mapy** - překážky a speciální políčka  
- **👥 Multiplayer** - hra pro více hráčů
- **📱 PWA** - instalovatelná aplikace
- **🏅 Online žebříček** - globální high score

### Snadné Rozšíření
- **Nové skiny**: Přidání do `snakeSkins` objektu
- **Nové achievementy**: Rozšíření `checkAchievements()` 
- **Nové mechaniky**: Nové moduly v `/js/` složce
- **Vizuální efekty**: Rozšíření `animations.js`

## 📝 Changelog

### Verze 2.0 - Modulární Architektura
- ✅ Rozdělení kódu do 8 specializovaných modulů
- ✅ Kompletní dokumentace všech funkcí
- ✅ Zachování všech herních funkcí
- ✅ Lepší organizace a údržbovatelnost

### Verze 1.0 - Původní Funkce
- ✅ Základní Snake mechanika
- ✅ Skin systém s 5 skiny
- ✅ Časované jídlo s penalizacemi
- ✅ Pohybující se jídlo
- ✅ Achievement systém
- ✅ Historie her a statistiky
- ✅ Responzivní design

---

**🎮 Užijte si hru!** 

*Vytvořeno s ❤️ pomocí GitHub Copilot v roce 2024*
