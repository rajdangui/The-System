# THE SYSTEM // Solo Leveling Real-Life Awakening & Health Tracker

> **"Welcome, Player. You have been selected by The System."**  
> A mobile-first Progressive Web App (PWA) that transforms your daily hydration, diet, workout habits, and weight loss into the authentic **Solo Leveling "SYSTEM"** RPG.

---

## ⚔️ The System Architecture

### 1. 📜 The Status Window (`[STATUS]`)
- **Player Awakening Profile**: Displays your Hunter Name (*Sung Jin-woo*), Job Title, Level, and Gold.
- **Dynamic Hunter Ranks**:
  - `E-Rank` ➔ `D-Rank` ➔ `C-Rank` ➔ `B-Rank` ➔ `A-Rank` ➔ `S-Rank` ➔ `Shadow Monarch`
  - Unlocked automatically as you gain EXP and level up!
- **HP & MP Pools**:
  - **HP (Health Points)**: Depleted by breaking dietary rules or failing daily quotas.
  - **MP (Water Mana Reservoir)**: Linked directly to your daily water intake (e.g., 3,000 mL = 100% Mana).
- **EXP & Stat Points**:
  - Every Level-Up awards **+3 Unallocated Stat Points**.
  - Tap `[+]` to allocate into **STR** (Strength), **AGI** (Agility), **VIT** (Vitality), **INT** (Intelligence), or **SEN** (Perception).

---

### 2. ⚡ Daily Quest Board (`[QUESTS]`)
`[DAILY QUEST: PREPARING TO BECOME STRONG]`
- **1. Quench the Mana Core**: 3,000 mL Water goal with one-tap potions (+250ml, +350ml, +500ml, +750ml).
- **2. Refined Poison Defense**: Strictly cap daily added sugar under 25g. Includes a **Craving Intercept** 3-minute reset.
- **3. Hunter Conditioning Routine**:
  - [ ] 100 Push-ups
  - [ ] 100 Sit-ups
  - [ ] 100 Squats
  - [ ] 5.0 km Running / Walk
- **Penalty Zone Countdown**:
  - Live ticking timer to midnight (`02:08:44 BEFORE PENALTY ZONE`).
  - Missing the deadline teleports the player into the **Emergency Penalty Quest: Survive the Centipede Wastes**.

---

### 3. 👹 Dungeon Raids & Boss Battles (`[RAIDS]`)
- **Weight Loss Raid Campaign**: Every 100g of body weight burned strikes direct damage to the active Dungeon Boss!
  - **E-Rank**: *Brutal Goblin Chieftain* (1,000g HP)
  - **D-Rank**: *Razan the Poison Fang* (1,500g HP)
  - **B-Rank**: *Blood-Red Commander Igris* (3,000g HP)
  - **S-Rank**: *Ant King Beru* (5,000g HP)
- **The "ARISE!" Prompt**: When a Boss reaches 0 HP, extract their soul into your loyal Shadow Army!

---

### 4. 🔮 Shadow Army & Inventory (`[SHADOWS]`)
- **Extracted Shadows**: Command Commander Igris, Iron, and Tank. Each shadow grants passive perks (e.g. protecting your daily streak from breaking).
- **System Inventory**: Consumable items like *Cure-All Potions* (+500ml Water Mana) and *Curse Purge Talismans* (resets accidental sugar spikes).

---

### 🔊 Iconic System Audio Synthesizer
Built-in Web Audio API reproduces authentic anime sound effects:
- **System Notification**: The iconic high-pitch *"DING!"*
- **Level Up**: Majestic fanfare
- **Emergency Penalty Siren**: Red warning alarm
- **Boss Strike**: High-impact weapon hit

---

## 📱 How to Run & Install as PWA

```bash
# Start local dev server
npm run dev -- --host
```

Open `http://localhost:5173` on desktop or mobile:
- **iOS Safari**: Tap **Share** ➔ **"Add to Home Screen"**.
- **Android Chrome**: Tap **Options (⋮)** ➔ **"Install App"**.
