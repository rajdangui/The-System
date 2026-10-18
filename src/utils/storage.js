const STORAGE_KEY = 'strict_tracker_sentinel_v1';

export const getTodayKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_STATE = {
  settings: {
    userName: 'Soldier',
    waterGoal: 3200, // mL
    sugarLimit: 25, // grams
    startWeight: 84.5, // kg
    targetWeight: 75.0, // kg
    heightCm: 178,
    unit: 'kg', // 'kg' or 'lbs'
    persona: 'steel', // 'steel' (Brutal), 'coach' (Firm), 'stoic' (Stoic)
    soundEnabled: true,
    reminderIntervalMins: 60,
    reminderActive: true,
  },
  streak: {
    current: 4,
    best: 12,
    shields: 1, // Shield protects streak once
    lastCompletedDate: null,
  },
  today: {
    date: getTodayKey(),
    waterConsumed: 1750, // ml
    waterLogs: [
      { id: '1', time: '08:15', amount: 500, label: 'Morning Hydration' },
      { id: '2', time: '11:30', amount: 500, label: 'Work Bottle' },
      { id: '3', time: '14:20', amount: 500, label: 'Post-Lunch Flask' },
      { id: '4', time: '16:45', amount: 250, label: 'Cup' },
    ],
    sugarConsumed: 12, // grams
    sugarLogs: [
      { id: 's1', time: '09:00', grams: 4, item: 'Oatmeal honey' },
      { id: 's2', time: '13:30', grams: 8, item: 'Salad vinaigrette' },
    ],
    cravingResistedCount: 2,
    weightLoggedToday: true,
    penalties: [
      {
        id: 'p-1',
        title: 'Chug 350ml Cold Water',
        reason: 'Hydration behind 2 PM checkpoint',
        completed: true,
        reps: '350 ml',
      },
    ],
  },
  weightLogs: [
    { date: '2026-10-04', weight: 84.5, note: 'Strict journey started' },
    { date: '2026-10-07', weight: 84.0, note: 'Cut out sodas' },
    { date: '2026-10-10', weight: 83.2, note: 'Water intake on track' },
    { date: '2026-10-14', weight: 82.6, note: 'Consistent zero-sugar days' },
    { date: '2026-10-17', weight: 81.9, note: 'Steady progress' },
    { date: getTodayKey(), weight: 81.7, note: 'Morning weigh-in' },
  ],
  badges: [
    { id: 'b1', name: 'First Gallon', desc: 'Drank 3,000ml in one day', unlocked: true, icon: 'Droplets' },
    { id: 'b2', name: 'Sugar Assassin', desc: '3 consecutive days with <20g sugar', unlocked: true, icon: 'ShieldAlert' },
    { id: 'b3', name: 'Iron Scale', desc: '5 consecutive morning weigh-ins', unlocked: true, icon: 'Scale' },
    { id: 'b4', name: 'Drill Sergeant Respect', desc: 'Maintain 7-day discipline streak', unlocked: false, icon: 'Award' },
    { id: 'b5', name: 'Sub-80 Vanguard', desc: 'Reach below 80 kg milestone', unlocked: false, icon: 'Flame' },
  ],
  history: [],
};

export const loadStoredData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    const today = getTodayKey();

    // If day changed, roll over today's state
    if (parsed.today && parsed.today.date !== today) {
      const prev = parsed.today;
      const waterSuccess = prev.waterConsumed >= (parsed.settings.waterGoal || 3000);
      const sugarSuccess = prev.sugarConsumed <= (parsed.settings.sugarLimit || 25);
      const daySuccess = waterSuccess && sugarSuccess;

      // Update streak
      let currentStreak = parsed.streak?.current || 0;
      let shields = parsed.streak?.shields || 0;

      if (daySuccess) {
        currentStreak += 1;
      } else {
        if (shields > 0) {
          shields -= 1; // Shield absorbed penalty
        } else {
          currentStreak = 0;
        }
      }

      parsed.history = [
        {
          date: prev.date,
          waterConsumed: prev.waterConsumed,
          sugarConsumed: prev.sugarConsumed,
          success: daySuccess,
        },
        ...(parsed.history || []).slice(0, 30),
      ];

      parsed.streak = {
        current: currentStreak,
        best: Math.max(parsed.streak?.best || 0, currentStreak),
        shields,
        lastCompletedDate: daySuccess ? prev.date : parsed.streak?.lastCompletedDate,
      };

      parsed.today = {
        date: today,
        waterConsumed: 0,
        waterLogs: [],
        sugarConsumed: 0,
        sugarLogs: [],
        cravingResistedCount: 0,
        weightLoggedToday: false,
        penalties: [],
      };
    }

    return { ...DEFAULT_STATE, ...parsed };
  } catch (e) {
    console.error('Failed to load storage, using default', e);
    return DEFAULT_STATE;
  }
};

export const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};
