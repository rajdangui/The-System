const STORAGE_KEY = 'solo_leveling_system_v2';

export const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const RANKS = [
  { minLvl: 1, rank: 'E-Rank', title: 'The Weakest Hunter', color: '#94a3b8' },
  { minLvl: 6, rank: 'D-Rank', title: 'Novice Hunter', color: '#38bdf8' },
  { minLvl: 13, rank: 'C-Rank', title: 'Awakened Raider', color: '#22c55e' },
  { minLvl: 21, rank: 'B-Rank', title: 'Dungeon Vanguard', color: '#a855f7' },
  { minLvl: 31, rank: 'A-Rank', title: 'High-Rank Slayer', color: '#f59e0b' },
  { minLvl: 46, rank: 'S-Rank', title: 'Calamity Hunter', color: '#ef4444' },
  { minLvl: 61, rank: 'Shadow Monarch', title: 'Ruler of the Dead', color: '#a855f7' },
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
    rank: 'E-Rank',
    title: 'Warden of the First Gate',
    maxGrams: 1000, // 1 kg target to lose
    damageTaken: 450, // 450g lost so far
    avatar: '👹',
    shadow: 'Goblin Scout',
    defeated: false,
    rewardExp: 500,
    rewardGold: 1000,
  },
  {
    id: 'boss_2',
    name: 'Razan the Blue Poison Fang',
    rank: 'D-Rank',
    title: 'Swamp Terror',
    maxGrams: 1500, // 1.5 kg
    damageTaken: 0,
    avatar: '🐍',
    shadow: 'Viper Assassin',
    defeated: false,
    rewardExp: 900,
    rewardGold: 2500,
  },
  {
    id: 'boss_3',
    name: 'Blood-Red Commander Igris',
    rank: 'B-Rank',
    title: 'Guardian of the Empty Throne',
    maxGrams: 3000, // 3 kg
    damageTaken: 0,
    avatar: '⚔️',
    shadow: 'Commander Igris',
    defeated: false,
    rewardExp: 2500,
    rewardGold: 10000,
  },
  {
    id: 'boss_4',
    name: 'Ant King Beru',
    rank: 'S-Rank',
    title: 'Apex Predator of Jeju Island',
    maxGrams: 5000, // 5 kg
    damageTaken: 0,
    avatar: '👑',
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
    // Daily water goal (Mana Points)
    waterGoalMl: 3000,
    sugarLimitG: 25,
    startWeight: 84.5,
    targetWeight: 75.0,
    currentWeight: 81.5,
    unit: 'kg',
  },
  stats: {
    str: 42, // Strength (Workouts)
    agi: 36, // Agility (Movement / Steps)
    vit: 45, // Vitality (Water & Sleep)
    int: 28, // Intelligence (Sugar control & Strategy)
    sen: 31, // Perception (Scale weigh-ins)
  },
  today: {
    date: getTodayKey(),
    waterMl: 2100, // 2100/3000
    sugarG: 14, // 14/25
    sugarItems: [
      { id: '1', name: 'Oatmeal honey', grams: 5, time: '08:30' },
      { id: '2', name: 'Dark chocolate bite', grams: 9, time: '13:15' },
    ],
    weightLogged: true,
    exercises: {
      pushups: 60, // goal 100
      situps: 70, // goal 100
      squats: 80, // goal 100
      runningKm: 3.2, // goal 5.0
    },
    cravingsCrushed: 3,
    penaltiesCompleted: false,
  },
  bosses: INITIAL_BOSSES,
  shadows: [
    {
      id: 'sh_1',
      name: 'Shadow Soldier Alpha',
      rank: 'E-Rank Elite',
      ability: '+5% Mana Recovery from Water',
      extractedAt: '2026-10-14',
      icon: '🛡️',
    },
  ],
  inventory: [
    { id: 'inv_1', name: 'Cure-All Potion', desc: 'Instantly replenishes 500ml Water Mana', count: 2, icon: '🧪' },
    { id: 'inv_2', name: 'Curse Purge Talisman', desc: 'Neutralizes 10g of consumed sugar', count: 1, icon: '📜' },
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

    // Reset daily quests if date changed
    if (parsed.today && parsed.today.date !== today) {
      // Check if previous day quests completed
      const prev = parsed.today;
      const questsCompleted =
        prev.waterMl >= parsed.player.waterGoalMl &&
        prev.sugarG <= parsed.player.sugarLimitG &&
        prev.exercises.pushups >= 100 &&
        prev.exercises.situps >= 100 &&
        prev.exercises.squats >= 100;

      let newStreak = parsed.streakDays || 0;
      if (questsCompleted) {
        newStreak += 1;
      }

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
        cravingsCrushed: 0,
        penaltiesCompleted: false,
      };
    }

    return { ...DEFAULT_SOLO_STATE, ...parsed };
  } catch (e) {
    console.error('Failed to parse Solo State, using fallback', e);
    return DEFAULT_SOLO_STATE;
  }
};

export const saveSoloState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save Solo State', e);
  }
};
