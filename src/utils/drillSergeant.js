// Dynamic contextual accountability generator for the "Strict" mindset

export const getSergeantAnalysis = (state) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const waterConsumed = state.today.waterConsumed || 0;
  const waterGoal = state.settings.waterGoal || 3200;
  const waterPct = Math.round((waterConsumed / waterGoal) * 100);

  const sugarConsumed = state.today.sugarConsumed || 0;
  const sugarLimit = state.settings.sugarLimit || 25;
  const sugarRemaining = sugarLimit - sugarConsumed;

  const persona = state.settings.persona || 'steel'; // 'steel', 'coach', 'stoic'

  // Expected water by hour:
  // 8 AM: 15%, 11 AM: 35%, 2 PM: 55%, 5 PM: 75%, 8 PM: 95%, 10 PM: 100%
  let expectedPct = 0;
  if (currentHour < 8) expectedPct = 10;
  else if (currentHour < 11) expectedPct = 30;
  else if (currentHour < 14) expectedPct = 50;
  else if (currentHour < 17) expectedPct = 70;
  else if (currentHour < 20) expectedPct = 85;
  else expectedPct = 100;

  const waterDeficit = expectedPct - waterPct;
  const isSevereWaterDeficit = waterDeficit > 25;
  const isSugarBreached = sugarConsumed > sugarLimit;
  const isSugarWarning = sugarRemaining <= 5 && !isSugarBreached;
  const isGoalAccomplished = waterPct >= 100 && !isSugarBreached;

  let mood = 'neutral'; // 'critical' | 'warning' | 'vigilant' | 'proud'
  let headline = '';
  let subtext = '';
  let penaltyTriggered = false;

  if (isSugarBreached) {
    mood = 'critical';
    penaltyTriggered = true;
    if (persona === 'steel') {
      headline = 'SUGAR BREACH DETECTED! DROP AND GIVE ME 25!';
      subtext = `You injected ${sugarConsumed}g sugar into your veins (${Math.abs(sugarRemaining)}g over limit). Do 25 pushups or burn it with a 20-min brisk march now!`;
    } else if (persona === 'coach') {
      headline = 'Sugar Threshold Exceeded';
      subtext = `You went over by ${Math.abs(sugarRemaining)}g. No more carbs or snacks tonight. Put in a 15-minute recovery walk.`;
    } else {
      headline = 'Discipline Compromised';
      subtext = `Impulse triumphed over intention. Acknowledge the misstep and reset immediately.`;
    }
  } else if (isSevereWaterDeficit && currentHour >= 12) {
    mood = 'critical';
    if (persona === 'steel') {
      headline = `BEHIND SCHEDULE! DRINK WATER OR SUFFER!`;
      subtext = `It is ${currentHour}:${String(currentMinutes).padStart(2, '0')} and you've only hit ${waterPct}%. Your kidneys are crying out for hydration! Grab 500ml right now!`;
    } else if (persona === 'coach') {
      headline = `Hydration Lagging (${waterPct}% vs ${expectedPct}% Target)`;
      subtext = `You are trailing behind your daily hydration pace. Chug 2 full glasses before your next task.`;
    } else {
      headline = `Water Deficit Accumulating`;
      subtext = `Physical lethargy follows dehydration. Drink 400ml to restore equilibrium.`;
    }
  } else if (isSugarWarning) {
    mood = 'warning';
    if (persona === 'steel') {
      headline = 'DANGER ZONE: ONLY ' + sugarRemaining + 'g SUGAR LEFT!';
      subtext = `One bite of junk food and your strict streak is in the incinerator. Lock your jaws!`;
    } else if (persona === 'coach') {
      headline = `Sugar Margin Critical: ${sugarRemaining}g Remaining`;
      subtext = `You have almost hit your daily ceiling. Stick purely to water, black coffee, or tea.`;
    } else {
      headline = `Sugar Boundary Approached`;
      subtext = `Temptation rises as margins shrink. Guard your threshold.`;
    }
  } else if (isGoalAccomplished) {
    mood = 'proud';
    if (persona === 'steel') {
      headline = 'STAND TALL! TARGET ANNIHILATED TODAY!';
      subtext = `${waterConsumed}ml locked in and sugar kept under ${sugarLimit}g. You proved you have iron discipline. Don't ruin it tonight.`;
    } else if (persona === 'coach') {
      headline = 'Flawless Daily Execution!';
      subtext = `All targets fulfilled. Your recovery and metabolic rate are at peak state. Maintain this momentum.`;
    } else {
      headline = 'Mastery Achieved';
      subtext = `Consistency is the foundation of transformation. Another day secured.`;
    }
  } else {
    mood = 'vigilant';
    if (persona === 'steel') {
      headline = `SENTINEL ON PATROL: ${waterPct}% HYDRATED`;
      subtext = `Keep sipping, soldier. We don't wait until dehydration strikes. Next checkpoint approaching.`;
    } else if (persona === 'coach') {
      headline = `On Pace: ${waterConsumed} / ${waterGoal} mL`;
      subtext = `Smooth steady intake throughout the day prevents evening water bloating. Keep it up!`;
    } else {
      headline = `Steady Hydration Flow`;
      subtext = `Progress is quiet and persistent. Continue logging every drop.`;
    }
  }

  // Calculate Overall Discipline Score for today (0 - 100)
  // Water score: 50% max, Sugar score: 30% max, Weight logged: 20% max
  const waterScore = Math.min(50, (waterPct / 100) * 50);
  const sugarRatio = sugarConsumed / sugarLimit;
  let sugarScore = 30;
  if (sugarRatio > 1) {
    sugarScore = Math.max(0, 30 - (sugarRatio - 1) * 30);
  }
  const weightScore = state.today.weightLoggedToday ? 20 : 5;
  const disciplineScore = Math.round(waterScore + sugarScore + weightScore);

  return {
    mood,
    headline,
    subtext,
    waterPct,
    expectedPct,
    waterDeficit,
    isSugarBreached,
    sugarRemaining,
    disciplineScore,
    penaltyTriggered,
  };
};
