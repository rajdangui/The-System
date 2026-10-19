const STORAGE_KEY = 'solo_leveling_system_v3';

export const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const RANKS = [
  { minLvl: 1, rank: 'E-RANK', title: 'The Weakest Hunter', color: '#94a3b8' },
  { minLvl: 6, rank: 'D-RANK', title: 'Novice Raider', color: '#38bdf8' },
  { minLvl: 13, rank: 'C-RANK', title: 'Awakened Striker', color: '#10b981' },
  { minLvl: 21, rank: 'B-RANK', title: 'Dungeon Vanguard', color: '#a855f7' },
  { minLvl: 31, rank: 'A-RANK', title: 'High-Rank Slayer', color: '#f59e0b' },
  { minLvl: 46, rank: 'S-RANK', title: 'Calamity Hunter', color: '#ef4444' },
  { minLvl: 61, rank: 'MONARCH', title: 'Shadow Monarch', color: '#c084fc' },
];

export const getRankFromLevel = (level) => {
  let matched = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.minLvl) matched = r;
  }
  return matched;
};

export const INITIAL_BOSSES = [
  {
    id: 'boss_1',
    name: 'Brutal Goblin Chieftain',
    rank: 'E-RANK',
    title: 'Warden of the First Gate',
    maxGrams: 1000, // 1 kg target to lose
    damageTaken: 450, // 450g lost so far
    sigilType: 'skull',
    shadow: 'Goblin Scout',
    defeated: false,
    rewardExp: 500,
    rewardGold: 1000,
  },
  {
    id: 'boss_2',
    name: 'Razan the Poison Fang',
    rank: 'D-RANK',
    title: 'Serpent of the Blue Mire',
    maxGrams: 1500, // 1.5 kg
    damageTaken: 0,
    sigilType: 'fang',
    shadow: 'Viper Assassin',
    defeated: false,
    rewardExp: 900,
    rewardGold: 2500,
  },
  {
    id: 'boss_3',
    name: 'Blood-Red Commander Igris',
    rank: 'B-RANK',
    title: 'Knight of the Empty Throne',
    maxGrams: 3000, // 3 kg
    damageTaken: 0,
    sigilType: 'knight',
    shadow: 'Commander Igris',
    defeated: false,
    rewardExp: 2500,
    rewardGold: 10000,
  },
  {
    id: 'boss_4',
    name: 'Ant King Beru',
    rank: 'S-RANK',
    title: 'Apex Predator of Jeju Island',
    maxGrams: 5000, // 5 kg
    damageTaken: 0,
    sigilType: 'monarch',
    shadow: 'Marshal Beru',
    defeated: false,
    rewardExp: 6000,
    rewardGold: 50000,
  },
];

export const DEFAULT_SOLO_STATE = {
  player: {
    name: 'Sung Jin-woo',
    job: 'None (Monarch Candidate)',
    level: 14,
    exp: 780,
    expNext: 1200,
    unallocatedStats: 3,
    gold: 5800,
    hp: 100,
    maxHp: 100,
    // Custom Daily Goals
    waterGoalMl: 3000,
    sugarLimitG: 25,
    startWeight: 84.5,
    targetWeight: 75.0,
    currentWeight: 81.5,
    unit: 'kg',
  },
  stats: {
    str: 42,
    agi: 36,
    vit: 45,
    int: 28,
    sen: 31,
  },
  today: {
    date: getTodayKey(),
    waterMl: 2100,
    sugarG: 14,
    sugarItems: [
      { id: '1', name: 'Oatmeal honey', grams: 5, time: '08:30' },
      { id: '2', name: 'Dark chocolate bite', grams: 9, time: '13:15' },
    ],
    weightLogged: true,
    exercises: {
      pushups: 60,
      situps: 70,
      squats: 80,
      runningKm: 3.2,
    },
    customQuests: [
      { id: 'cq_1', title: '15-Minute Sunlight Walk', rewardExp: 100, completed: true },
      { id: 'cq_2', title: 'Zero Sugary Beverages', rewardExp: 150, completed: false },
    ],
    cravingsCrushed: 3,
    penaltiesCompleted: false,
  },
  bosses: INITIAL_BOSSES,
  shadows: [
    {
      id: 'sh_1',
      name: 'Shadow Soldier Alpha',
      rank: 'E-Rank Elite',
      ability: '+5% Mana Absorption from Water',
      extractedAt: '2026-10-14',
      type: 'soldier',
    },
  ],
  inventory: [
    { id: 'inv_1', name: 'Mana Core Elixir', desc: 'Instantly restores +500 mL Water Mana', count: 2, type: 'potion' },
    { id: 'inv_2', name: 'Detox Talisman', desc: 'Neutralizes 10g of consumed sugar', count: 1, type: 'scroll' },
  ],
  weightHistory: [
    { date: '2026-10-01', weight: 84.5 },
    { date: '2026-10-07', weight: 83.8 },
    { date: '2026-10-14', weight: 82.6 },
    { date: '2026-10-19', weight: 81.5 },
  ],
  streakDays: 6,
  bestStreak: 14,
  soundEnabled: true,
};

export const loadSoloState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SOLO_STATE;
    const parsed = JSON.parse(raw);
    const today = getTodayKey();

    if (parsed.today && parsed.today.date !== today) {
      const prev = parsed.today;
      const questsCompleted =
        prev.waterMl >= parsed.player.waterGoalMl &&
        prev.sugarG <= parsed.player.sugarLimitG &&
        prev.exercises.pushups >= 100 &&
        prev.exercises.situps >= 100 &&
        prev.exercises.squats >= 100;

      let newStreak = parsed.streakDays || 0;
      if (questsCompleted) newStreak += 1;

      parsed.streakDays = newStreak;
      parsed.bestStreak = Math.max(parsed.bestStreak || 0, newStreak);

      parsed.today = {
        date: today,
        waterMl: 0,
        sugarG: 0,
        sugarItems: [],
        weightLogged: false,
        exercises: {
          pushups: 0,
          situps: 0,
          squats: 0,
          runningKm: 0,
        },
        customQuests: (parsed.today.customQuests || []).map((q) => ({ ...q, completed: false })),
        cravingsCrushed: 0,
        penaltiesCompleted: false,
      };
    }

    return { ...DEFAULT_SOLO_STATE, ...parsed };
  } catch (e) {
    console.error('Failed to load state', e);
    return DEFAULT_SOLO_STATE;
  }
};

export const saveSoloState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
};
