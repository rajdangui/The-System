const STORAGE_KEY = 'the_system_os_v1';

export const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const DEFAULT_SYSTEM_STATE = {
  user: {
    name: 'Operator',
    waterGoalMl: 3000,
    sugarLimitG: 25,
    startWeight: 84.5,
    targetWeight: 75.0,
    currentWeight: 81.5,
    unit: 'kg',
  },
  today: {
    date: getTodayKey(),
    waterMl: 2350,
    sugarG: 14,
    sugarItems: [
      { id: '1', name: 'Oatmeal & honey', grams: 5, time: '08:30' },
      { id: '2', name: 'Dark chocolate (85%)', grams: 9, time: '13:15' },
    ],
    weightLogged: true,
    conditioning: {
      pushups: 60,
      pushupsTarget: 100,
      situps: 70,
      situpsTarget: 100,
      squats: 80,
      squatsTarget: 100,
      runningKm: 3.2,
      runningKmTarget: 5.0,
    },
    habits: [
      { id: 'h_1', title: 'Morning Hydration & Sunlight', completed: true, streak: 12 },
      { id: 'h_2', title: 'Zero Ultra-Processed Sugars', completed: true, streak: 8 },
      { id: 'h_3', title: 'Daily Conditioning Routine', completed: false, streak: 6 },
      { id: 'h_4', title: 'Post-Workout Mobility & Stretch', completed: true, streak: 5 },
      { id: 'h_5', title: '30-Minute Focused Deep Work', completed: false, streak: 9 },
    ],
    cravingsResisted: 3,
  },
  weightHistory: [
    { date: '2026-10-01', weight: 84.5 },
    { date: '2026-10-07', weight: 83.8 },
    { date: '2026-10-14', weight: 82.6 },
    { date: '2026-10-19', weight: 81.5 },
  ],
  streakDays: 12,
  bestStreak: 21,
  soundEnabled: true,
};

// Calculate today's discipline score (0 - 100%)
export const calculateDisciplineScore = (today, user) => {
  if (!today || !user) return 0;
  let score = 0;

  // 1. Hydration (25 points max)
  const waterPct = Math.min(1, (today.waterMl || 0) / (user.waterGoalMl || 3000));
  score += Math.round(waterPct * 25);

  // 2. Sugar Cap (25 points max)
  if ((today.sugarG || 0) <= (user.sugarLimitG || 25)) {
    score += 25;
  } else {
    // Diminishing penalty for breaching sugar cap
    const over = today.sugarG - user.sugarLimitG;
    const penalty = Math.min(25, Math.round((over / 20) * 25));
    score += Math.max(0, 25 - penalty);
  }

  // 3. Conditioning (25 points max)
  const cond = today.conditioning || {};
  const pushRatio = Math.min(1, (cond.pushups || 0) / (cond.pushupsTarget || 100));
  const sitRatio = Math.min(1, (cond.situps || 0) / (cond.situpsTarget || 100));
  const squatRatio = Math.min(1, (cond.squats || 0) / (cond.squatsTarget || 100));
  const runRatio = Math.min(1, (cond.runningKm || 0) / (cond.runningKmTarget || 5));
  const condAvg = (pushRatio + sitRatio + squatRatio + runRatio) / 4;
  score += Math.round(condAvg * 25);

  // 4. Daily Habits (25 points max)
  const habits = today.habits || [];
  if (habits.length > 0) {
    const completedCount = habits.filter((h) => h.completed).length;
    score += Math.round((completedCount / habits.length) * 25);
  } else {
    score += 25;
  }

  return Math.min(100, Math.max(0, score));
};

export const loadSystemState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check if we can migrate user profile & weight history from solo storage
      const legacyRaw = localStorage.getItem('solo_leveling_system_v3');
      if (legacyRaw) {
        try {
          const leg = JSON.parse(legacyRaw);
          return {
            ...DEFAULT_SYSTEM_STATE,
            user: {
              ...DEFAULT_SYSTEM_STATE.user,
              name: leg.player?.name === 'Sung Jin-woo' ? 'Operator' : leg.player?.name || 'Operator',
              waterGoalMl: leg.player?.waterGoalMl || 3000,
              sugarLimitG: leg.player?.sugarLimitG || 25,
              startWeight: leg.player?.startWeight || 84.5,
              targetWeight: leg.player?.targetWeight || 75.0,
              currentWeight: leg.player?.currentWeight || 81.5,
              unit: leg.player?.unit || 'kg',
            },
            weightHistory: leg.weightHistory || DEFAULT_SYSTEM_STATE.weightHistory,
            streakDays: leg.streakDays || 12,
            bestStreak: leg.bestStreak || 21,
            soundEnabled: leg.soundEnabled ?? true,
          };
        } catch {
          return DEFAULT_SYSTEM_STATE;
        }
      }
      return DEFAULT_SYSTEM_STATE;
    }

    const parsed = JSON.parse(raw);
    const today = getTodayKey();

    // Reset daily counters if date has rolled over to a new day
    if (parsed.today && parsed.today.date !== today) {
      const prevScore = calculateDisciplineScore(parsed.today, parsed.user);
      const daySuccessful = prevScore >= 75;

      let newStreak = parsed.streakDays || 0;
      if (daySuccessful) newStreak += 1;
      else newStreak = 0;

      parsed.streakDays = newStreak;
      parsed.bestStreak = Math.max(parsed.bestStreak || 0, newStreak);

      parsed.today = {
        date: today,
        waterMl: 0,
        sugarG: 0,
        sugarItems: [],
        weightLogged: false,
        conditioning: {
          pushups: 0,
          pushupsTarget: 100,
          situps: 0,
          situpsTarget: 100,
          squats: 0,
          squatsTarget: 100,
          runningKm: 0,
          runningKmTarget: 5.0,
        },
        habits: (parsed.today.habits || DEFAULT_SYSTEM_STATE.today.habits).map((h) => ({
          ...h,
          completed: false,
        })),
        cravingsResisted: 0,
      };
    }

    return { ...DEFAULT_SYSTEM_STATE, ...parsed };
  } catch (e) {
    console.error('Failed to load system state', e);
    return DEFAULT_SYSTEM_STATE;
  }
};

export const saveSystemState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save system state', e);
  }
};
