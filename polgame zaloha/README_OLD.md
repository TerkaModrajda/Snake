# Snake Hra - Kompletní Dokumentace

Pokročilá implementace klasické hry Snake s modulární architekturou a mnoha vylepšeními.

## 🎮 Funkce

- **Klasická Snake mechanika** - Ovládej hada, sbírej jídlo a rostí
- **Moderní UI** - Krásný gradient design s průhlednými efekty
- **Responzivní design** - Funguje na desktopu i mobilních zařízeních
- **Skóre systém** - Sledování aktuálního a nejlepšího skóre (uloženo v local storage)
- **Pauza funkce** - Možnost pozastavit a pokračovat ve hře
- **Ovládání tlačítky** - Pro dotykové zařízení i počítač
- **Animace a efekty** - Plynulé animace a vizuální efekty

## 🎯 Jak hrát

1. **Spuštění hry**: Stiskni libovolnou šipku nebo klikni na ovládací tlačítka
2. **Ovládání**:
   - **Šipky na klávesnici** ⬅️ ➡️ ⬆️ ⬇️
   - **Ovládací tlačítka** na obrazovce
   - **Mezerník** pro pauzu
3. **Cíl**: Sbírej červené jídlo a vyhýbej se stěnám a vlastnímu tělu
4. **Skórování**: Za každé jídlo získáš 10 bodů

## 📁 Struktura souborů

```
snake-game/
├── index.html      # Hlavní HTML soubor
├── style.css       # Stylování a animace
├── script.js       # Herní logika
└── README.md       # Dokumentace
```

## 🚀 Spuštění

1. Stáhni všechny soubory do jedné složky
2. Otevři `index.html` v prohlížeči
3. Začni hrát!

## 🛠️ Technologie

- **HTML5 Canvas** - Pro vykreslování hry
- **Vanilla JavaScript** - Herní logika bez závislostí
- **CSS3** - Moderní styling s gradienty a efekty
- **Local Storage** - Ukládání nejlepšího skóre

## 🎨 Funkce kódu

### Herní mechanika
- **Kolize detekce** - Se stěnami a vlastním tělem
- **Náhodné generování jídla** - Vždy na volné pozici
- **Rostoucí had** - Každé jídlo prodlouží hada o jeden segment
- **Plynulý pohyb** - 60 FPS herní smyčka

### Vizuální prvky
- **Gradient pozadí** - Krásný fialovo-modrý gradient
- **Průhledné panely** - Glassmorphism efekt
- **Animované skóre** - Vizuální feedback při získání bodů
- **Responsivní design** - Automatické přizpůsobení velikosti

### Ovládání
- **Klávesnice** - Šipky pro směr, mezerník pro pauzu
- **Dotykové ovládání** - Tlačítka pro mobilní zařízení
- **Zabránění zpětnému pohybu** - Nelze se otočit přímo dozadu

## 🔧 Možné rozšíření

- Různé úrovně obtížnosti (rychlost)
- Power-upy a speciální jídlo
- Více druhů překážek
- Multiplayer režim
- Zvukové efekty
- Různé herní módy

## 📱 Kompatibilita

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Desktop a mobilní zařízení
- ✅ Tablets a dotykové displeje

---

Vytvořeno s ❤️ v JavaScriptu
