import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SystemHeader } from './components/SystemHeader';
import { DashboardTab } from './components/DashboardTab';
import { HabitsTab } from './components/HabitsTab';
import { NutritionTab } from './components/NutritionTab';
import { BodyTab } from './components/BodyTab';
import { Navigation } from './components/Navigation';
import { CravingModal } from './components/CravingModal';
import { SettingsModal } from './components/SettingsModal';
import {
  loadSystemState,
  saveSystemState,
  DEFAULT_SYSTEM_STATE,
  getTodayKey,
} from './utils/systemStorage';
import { playSystemSound, triggerSystemVibration } from './utils/audio';

export function App() {
  const [state, setState] = useState(() => loadSystemState());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCravingModalOpen, setIsCravingModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    saveSystemState(state);
  }, [state]);

  const soundEnabled = state.soundEnabled;

  // Sound Toggle
  const handleToggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Keyboard Shortcuts (1, 2, 3, 4, M, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      if (e.key === 'Escape') {
        setIsCravingModalOpen(false);
        setIsSettingsOpen(false);
      } else if (e.key === '1') {
        setActiveTab('dashboard');
      } else if (e.key === '2') {
        setActiveTab('habits');
      } else if (e.key === '3') {
        setActiveTab('nutrition');
      } else if (e.key === '4') {
        setActiveTab('body');
      } else if (e.key === 'm' || e.key === 'M') {
        setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTriggerDing = () => {
    playSystemSound('ding', soundEnabled);
    triggerSystemVibration([30, 20, 30]);
  };

  // 1. Water Tracking
  const handleAddWater = (amount) => {
    playSystemSound('click', soundEnabled);
    triggerSystemVibration([25]);

    setState((prev) => {
      const newWater = (prev.today.waterMl || 0) + amount;
      const reachedGoal = newWater >= prev.user.waterGoalMl && prev.today.waterMl < prev.user.waterGoalMl;

      if (reachedGoal) {
        playSystemSound('level_up', soundEnabled);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#38bdf8', '#10b981'],
          });
        } catch {}
      }

      return {
        ...prev,
        today: {
          ...prev.today,
          waterMl: newWater,
        },
      };
    });
  };

  // 2. Sugar & Nutrition Tracking
  const handleAddSugar = (grams, name = 'Food Item') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newItem = {
      id: Date.now().toString(),
      name,
      grams,
      time: timeStr,
    };

    setState((prev) => {
      const newTotal = (prev.today.sugarG || 0) + grams;
      if (newTotal > prev.user.sugarLimitG && prev.today.sugarG <= prev.user.sugarLimitG) {
        playSystemSound('danger', soundEnabled);
        triggerSystemVibration([100, 50, 100]);
      } else {
        playSystemSound('click', soundEnabled);
      }

      return {
        ...prev,
        today: {
          ...prev.today,
          sugarG: newTotal,
          sugarItems: [...(prev.today.sugarItems || []), newItem],
        },
      };
    });
  };

  const handleDeleteSugar = (id) => {
    playSystemSound('click', soundEnabled);
    setState((prev) => {
      const itemToDelete = (prev.today.sugarItems || []).find((i) => i.id === id);
      const deduct = itemToDelete ? itemToDelete.grams : 0;
      return {
        ...prev,
        today: {
          ...prev.today,
          sugarG: Math.max(0, (prev.today.sugarG || 0) - deduct),
          sugarItems: (prev.today.sugarItems || []).filter((i) => i.id !== id),
        },
      };
    });
  };

  // 3. Conditioning Exercises
  const handleAddExercise = (exerciseKey, amount) => {
    playSystemSound('click', soundEnabled);
    triggerSystemVibration([30]);

    setState((prev) => {
      const current = prev.today.conditioning[exerciseKey] || 0;
      return {
        ...prev,
        today: {
          ...prev.today,
          conditioning: {
            ...prev.today.conditioning,
            [exerciseKey]: parseFloat((current + amount).toFixed(1)),
          },
        },
      };
    });
  };

  // 4. Habits Checklist
  const handleToggleHabit = (id) => {
    setState((prev) => {
      const habit = (prev.today.habits || []).find((h) => h.id === id);
      const isNowCompleted = habit ? !habit.completed : false;

      if (isNowCompleted) {
        playSystemSound('ding', soundEnabled);
        triggerSystemVibration([40]);
      } else {
        playSystemSound('click', soundEnabled);
      }

      const updatedHabits = (prev.today.habits || []).map((h) => {
        if (h.id === id) {
          const nextStreak = isNowCompleted ? (h.streak || 0) + 1 : Math.max(0, (h.streak || 1) - 1);
          return { ...h, completed: isNowCompleted, streak: nextStreak };
        }
        return h;
      });

      return {
        ...prev,
        today: {
          ...prev.today,
          habits: updatedHabits,
        },
      };
    });
  };

  const handleAddHabit = (title) => {
    playSystemSound('ding', soundEnabled);
    const newH = {
      id: `h_${Date.now()}`,
      title,
      completed: false,
      streak: 0,
    };
    setState((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        habits: [...(prev.today.habits || []), newH],
      },
    }));
  };

  const handleDeleteHabit = (id) => {
    playSystemSound('click', soundEnabled);
    setState((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        habits: (prev.today.habits || []).filter((h) => h.id !== id),
      },
    }));
  };

  // 5. Weight & Transformation
  const handleLogWeight = (newWeight) => {
    playSystemSound('ding', soundEnabled);
    triggerSystemVibration([50]);
    const todayKey = getTodayKey();

    setState((prev) => {
      const existingHistory = prev.weightHistory || [];
      const updatedHistory = existingHistory.some((w) => w.date === todayKey)
        ? existingHistory.map((w) => (w.date === todayKey ? { ...w, weight: newWeight } : w))
        : [...existingHistory, { date: todayKey, weight: newWeight }];

      return {
        ...prev,
        user: {
          ...prev.user,
          currentWeight: newWeight,
        },
        today: {
          ...prev.today,
          weightLogged: true,
        },
        weightHistory: updatedHistory,
      };
    });
  };

  const handleDeleteWeightLog = (date) => {
    playSystemSound('click', soundEnabled);
    setState((prev) => {
      const filtered = (prev.weightHistory || []).filter((w) => w.date !== date);
      const latest = filtered[filtered.length - 1];
      return {
        ...prev,
        user: {
          ...prev.user,
          currentWeight: latest ? latest.weight : prev.user.startWeight,
        },
        weightHistory: filtered,
      };
    });
  };

  // 6. User Settings & Reset
  const handleSaveUserSettings = (formData) => {
    playSystemSound('ding', soundEnabled);
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        name: formData.name,
        waterGoalMl: formData.waterGoalMl,
        sugarLimitG: formData.sugarLimitG,
        startWeight: formData.startWeight,
        targetWeight: formData.targetWeight,
      },
    }));
  };

  const handleResetAll = () => {
    setState(DEFAULT_SYSTEM_STATE);
  };

  return (
    <div className="app-viewport">
      <div className="mobile-frame">
        {/* Executive Header */}
        <SystemHeader
          state={state}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onTriggerDing={handleTriggerDing}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Scrollable Main Viewport */}
        <main className="app-content">
          {activeTab === 'dashboard' && (
            <DashboardTab
              state={state}
              onNavigateTab={setActiveTab}
              onAddWater={handleAddWater}
              onToggleHabit={handleToggleHabit}
              onOpenCravingModal={() => setIsCravingModalOpen(true)}
            />
          )}

          {activeTab === 'habits' && (
            <HabitsTab
              state={state}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
              onAddExercise={handleAddExercise}
            />
          )}

          {activeTab === 'nutrition' && (
            <NutritionTab
              state={state}
              onAddWater={handleAddWater}
              onAddSugar={handleAddSugar}
              onDeleteSugar={handleDeleteSugar}
              onOpenCravingModal={() => setIsCravingModalOpen(true)}
            />
          )}

          {activeTab === 'body' && (
            <BodyTab
              state={state}
              onLogWeight={handleLogWeight}
              onDeleteWeightLog={handleDeleteWeightLog}
            />
          )}
        </main>

        {/* Floating Bottom Navigation / Desktop Segmented Dock */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          soundEnabled={soundEnabled}
        />

        {/* Modals */}
        <CravingModal
          isOpen={isCravingModalOpen}
          onClose={() => setIsCravingModalOpen(false)}
          onResisted={() => {
            playSystemSound('level_up', soundEnabled);
            setState((prev) => ({
              ...prev,
              today: {
                ...prev.today,
                cravingsResisted: (prev.today.cravingsResisted || 0) + 1,
              },
            }));
          }}
          soundEnabled={soundEnabled}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          state={state}
          onSaveUserSettings={handleSaveUserSettings}
          onResetAll={handleResetAll}
        />
      </div>
    </div>
  );
}

export default App;
