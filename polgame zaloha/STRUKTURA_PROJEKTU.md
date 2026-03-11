# 📁 Struktura Projektu Snake

Kompletně přeorganizovaný kód pro lepší čitelnost a údržbu.

## 🏗️ Nová Struktura Souborů

```
📁 js/
├── 📁 core/              # Základní systémy hry
│   ├── config.js         # Veškerá konfigurace
│   ├── gameState.js      # Centrální herní stav
│   ├── gameLoop.js       # Hlavní herní smyčka
│   └── input.js          # Ovládání klávesnice
│
├── 📁 gameplay/          # Herní mechaniky
│   ├── snake.js          # Logika hada
│   ├── food.js           # Správa jídel
│   └── progression.js    # Herní progrese
│
├── 📁 bonuses/           # Bonusový systém
│   ├── bonusManager.js   # Správa bonusů
│   ├── magnetBonus.js    # Magnet efekt
│   └── frenzyBonus.js    # Food Frenzy
│
├── 📁 ui/               # Uživatelské rozhraní
│   ├── rendering.js     # Vykreslování
│   ├── animations.js    # Animace a efekty
│   ├── ui.js           # UI elementy
│   └── skins.js        # Systém skinů
│
└── 📁 utils/           # Pomocné funkce
    ├── helpers.js      # Obecné pomocné funkce
    └── storage.js      # LocalStorage operace
```

## 📋 Popis Modulů

### 🔧 Core (Jádro)
- **config.js**: Centrální konfigurace všech herních hodnot
- **gameState.js**: Herní stav s jasně oddělenými sekcemi
- **gameLoop.js**: Hlavní smyčka, inicializace, start/stop
- **input.js**: Zpracování klávesnice oddělené od logiky

### 🎮 Gameplay (Herní Logika)
- **snake.js**: Pohyb hada, růst, kolize, snědení jídel
- **food.js**: Generování, pohyb všech typů jídel
- **progression.js**: Aktivace mechanik podle postupu

### 🎁 Bonuses (Bonusy)
- **bonusManager.js**: Centrální správa všech bonusů
- **magnetBonus.js**: Magnet efekt a přitahování
- **frenzyBonus.js**: Food Frenzy systém

### 🎨 UI (Rozhraní)
- **rendering.js**: Vykreslování všech herních prvků
- **animations.js**: Animace, efekty, notifikace
- **ui.js**: DOM manipulace, skóre, menu
- **skins.js**: Systém skinů a jejich správa

### 🔨 Utils (Nástroje)
- **helpers.js**: Pomocné matematické funkce
- **storage.js**: LocalStorage pro skóre, statistiky

## 🔄 Výhody Nové Struktury

### ✅ **Lepší Organizace**
- Každý soubor má jasnou odpovědnost
- Snadné nalezení konkrétní funkcionality
- Logické seskupení souvisejících funkcí

### ✅ **Snadnější Údržba**
- Změny v jedné oblasti neovlivní ostatní
- Jednoduché přidávání nových funkcí
- Menší riziko konfliktů v kódu

### ✅ **Čitelnost**
- Jasné názvy souborů a funkcí
- Komentáře vysvětlující účel každého modulu
- Konzistentní struktura napříč soubory

### ✅ **Rozšiřitelnost**
- Snadné přidání nových bonusů
- Modulární systém skinů
- Připraveno na další herní mechaniky

## 🚀 Jak Používat

### Přidání Nového Bonusu
1. Vytvořte soubor v `js/bonuses/`
2. Přidejte ho do `bonusManager.js`
3. Aktualizujte konfiguraci v `config.js`

### Přidání Nového Skinu
1. Definujte skin v `gameState.js`
2. Přidejte rendering v `ui/rendering.js`
3. Aktualizujte UI v `ui/skins.js`

### Ladění Problémů
- **Kolize**: Kontrola v `gameplay/snake.js`
- **Vykreslování**: Problém v `ui/rendering.js`
- **Bonusy**: Logika v `bonuses/`
- **Progrese**: Mechaniky v `gameplay/progression.js`

## 📝 Poznámky k Migraci

- Starý kód byl rozdělen podle logických celků
- Všechny funkce jsou zachovány
- Přidány nové helper funkce pro čistotu
- Lepší error handling a debugging

---

**Refaktorováno**: Prosinec 2024  
**Struktura**: Modulární architektura  
**Kompatibilita**: 100% se starou verzí
