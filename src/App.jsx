import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SystemHeader } from './components/SystemHeader';
import { StatusTab } from './components/StatusTab';
import { QuestsTab } from './components/QuestsTab';
import { DungeonTab } from './components/DungeonTab';
import { ShadowsTab } from './components/ShadowsTab';
import { Navigation } from './components/Navigation';
import { PenaltyModal } from './components/PenaltyModal';
import { CravingModal } from './components/CravingModal';
import { SettingsModal } from './components/SettingsModal';
import { loadSoloState, saveSoloState, DEFAULT_SOLO_STATE, getTodayKey } from './utils/soloStorage';
import { playSystemSound, triggerSystemVibration } from './utils/audio';

export function App() {
  const [state, setState] = useState(() => loadSoloState());
  const [activeTab, setActiveTab] = useState('status');
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [isCravingModalOpen, setIsCravingModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    saveSoloState(state);
  }, [state]);

  const soundEnabled = state.soundEnabled;

  // Sound Toggle
  const handleToggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleTriggerDing = () => {
    playSystemSound('ding', soundEnabled);
    triggerSystemVibration([30, 20, 30]);
  };

  // Add EXP and handle Level Up
  const addExp = (amount) => {
    setState((prev) => {
      let newExp = prev.player.exp + amount;
      let newLevel = prev.player.level;
      let newExpNext = prev.player.expNext;
      let unallocated = prev.player.unallocatedStats;
      let leveledUp = false;

      while (newExp >= newExpNext) {
        newExp -= newExpNext;
        newLevel += 1;
        newExpNext = Math.round(newExpNext * 1.25);
        unallocated += 3;
        leveledUp = true;
      }

      if (leveledUp) {
        playSystemSound('level_up', soundEnabled);
        triggerSystemVibration([60, 40, 80]);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#38bdf8', '#a855f7', '#fbbf24'],
          });
        } catch {}
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          level: newLevel,
          exp: newExp,
          expNext: newExpNext,
          unallocatedStats: unallocated,
        },
      };
    });
  };

  // Water Actions (Mana Recovery)
  const handleAddWater = (amt) => {
    playSystemSound('water', soundEnabled);
    triggerSystemVibration();
    addExp(40);

    setState((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        waterMl: prev.today.waterMl + amt,
      },
    }));
  };

  // Sugar Actions (Poison defense)
  const handleAddSugar = (grams, name) => {
    const prevSugar = state.today.sugarG;
    const newSugar = prevSugar + grams;

    if (newSugar > state.player.sugarLimitG) {
      playSystemSound('danger', soundEnabled);
      triggerSystemVibration([80, 50, 80]);
    } else {
      playSystemSound('ding', soundEnabled);
    }

    const newSugarItem = {
      id: Date.now().toString(),
      name,
      grams,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setState((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        sugarG: newSugar,
        sugarItems: [...(prev.today.sugarItems || []), newSugarItem],
      },
    }));
  };

  const handleDeleteSugar = (id) => {
    playSystemSound('click', soundEnabled);
    setState((prev) => {
      const item = (prev.today.sugarItems || []).find((s) => s.id === id);
      const deductGrams = item ? item.grams : 0;
      return {
        ...prev,
        today: {
          ...prev.today,
          sugarG: Math.max(0, prev.today.sugarG - deductGrams),
          sugarItems: prev.today.sugarItems.filter((s) => s.id !== id),
        },
      };
    });
  };

  // Exercise Conditioning
  const handleAddExercise = (type, amt) => {
    playSystemSound('ding', soundEnabled);
    triggerSystemVibration();
    addExp(25);

    setState((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        exercises: {
          ...prev.today.exercises,
          [type]: prev.today.exercises[type] + amt,
        },
      },
      stats: {
        ...prev.stats,
        str: prev.stats.str + (type === 'pushups' ? 1 : 0),
        agi: prev.stats.agi + (type === 'runningKm' ? 1 : 0),
      },
    }));
  };

  // Custom Daily Quests
  const handleToggleCustomQuest = (id) => {
    playSystemSound('ding', soundEnabled);
    setState((prev) => {
      let expBonus = 0;
      const updated = (prev.today.customQuests || []).map((q) => {
        if (q.id === id) {
          const nextCompleted = !q.completed;
          if (nextCompleted) expBonus = q.rewardExp || 100;
          return { ...q, completed: nextCompleted };
        }
        return q;
      });

      if (expBonus > 0) addExp(expBonus);

      return {
        ...prev,
        today: {
          ...prev.today,
          customQuests: updated,
        },
      };
    });
  };

  const handleAddCustomQuest = (title) => {
    playSystemSound('ding', soundEnabled);
    const newQuest = {
      id: `cq_${Date.now()}`,
      title,
      rewardExp: 100,
      completed: false,
    };
    setState((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        customQuests: [...(prev.today.customQuests || []), newQuest],
      },
    }));
  };

  const handleDeleteCustomQuest = (id) => {
    playSystemSound('click', soundEnabled);
    setState((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        customQuests: (prev.today.customQuests || []).filter((q) => q.id !== id),
      },
    }));
  };

  // Stat Allocation
  const handleAllocateStat = (key) => {
    if (state.player.unallocatedStats <= 0) return;
    playSystemSound('ding', soundEnabled);

    setState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        unallocatedStats: prev.player.unallocatedStats - 1,
      },
      stats: {
        ...prev.stats,
        [key]: prev.stats[key] + 1,
      },
    }));
  };

  // Weight Logging & History
  const handleLogWeight = (weight) => {
    playSystemSound('level_up', soundEnabled);
    triggerSystemVibration([40, 20, 60]);
    addExp(150);

    const today = getTodayKey();
    setState((prev) => {
      const existing = (prev.weightHistory || []).filter((wh) => wh.date !== today);
      return {
        ...prev,
        player: {
          ...prev.player,
          currentWeight: weight,
        },
        today: {
          ...prev.today,
          weightLogged: true,
        },
        weightHistory: [...existing, { date: today, weight }],
      };
    });
  };

  const handleDeleteWeightLog = (date) => {
    playSystemSound('click', soundEnabled);
    setState((prev) => {
      const filtered = (prev.weightHistory || []).filter((wh) => wh.date !== date);
      const latest = filtered[filtered.length - 1];
      return {
        ...prev,
        player: {
          ...prev.player,
          currentWeight: latest ? latest.weight : prev.player.currentWeight,
        },
        weightHistory: filtered,
      };
    });
  };

  // Dungeon Boss Attacks
  const handleAttackBoss = (bossId, grams) => {
    playSystemSound('attack', soundEnabled);
    triggerSystemVibration([50, 30, 70]);
    addExp(grams * 2);

    setState((prev) => {
      const updatedBosses = prev.bosses.map((b) => {
        if (b.id !== bossId) return b;
        const newDmg = Math.min(b.maxGrams, b.damageTaken + grams);
        return { ...b, damageTaken: newDmg };
      });

      const newWeight = Math.max(prev.player.targetWeight, prev.player.currentWeight - grams / 1000);

      return {
        ...prev,
        player: {
          ...prev.player,
          currentWeight: parseFloat(newWeight.toFixed(2)),
        },
        bosses: updatedBosses,
      };
    });
  };

  const handleExtractShadow = (bossId) => {
    playSystemSound('level_up', soundEnabled);
    triggerSystemVibration([100, 50, 150]);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#00f0ff', '#38bdf8', '#ffffff'],
      });
    } catch {}

    setState((prev) => {
      const targetBoss = prev.bosses.find((b) => b.id === bossId);
      if (!targetBoss) return prev;

      const newShadow = {
        id: `sh_${Date.now()}`,
        name: `Shadow ${targetBoss.shadow}`,
        rank: `${targetBoss.rank} Elite`,
        ability: `+10% EXP & Guards Streak`,
        extractedAt: getTodayKey(),
        type: 'elite',
      };

      const updatedBosses = prev.bosses.map((b) =>
        b.id === bossId ? { ...b, defeated: true } : b
      );

      return {
        ...prev,
        bosses: updatedBosses,
        shadows: [...prev.shadows, newShadow],
        player: {
          ...prev.player,
          exp: prev.player.exp + targetBoss.rewardExp,
          gold: prev.player.gold + targetBoss.rewardGold,
        },
      };
    });
  };

  const handleAddCustomBoss = (name, maxGrams) => {
    playSystemSound('ding', soundEnabled);
    const newBoss = {
      id: `boss_${Date.now()}`,
      name,
      rank: 'A-RANK',
      title: 'Custom Calamity Gate',
      maxGrams,
      damageTaken: 0,
      sigilType: 'knight',
      shadow: name.split(' ')[0],
      defeated: false,
      rewardExp: Math.round(maxGrams * 1.5),
      rewardGold: maxGrams * 5,
    };

    setState((prev) => ({
      ...prev,
      bosses: [...prev.bosses, newBoss],
    }));
  };

  // Inventory & Shop
  const handleUseItem = (itemId) => {
    playSystemSound('ding', soundEnabled);
    setState((prev) => {
      const item = prev.inventory.find((i) => i.id === itemId);
      if (!item || item.count <= 0) return prev;

      let waterBonus = 0;
      let sugarDeduct = 0;

      if (itemId === 'inv_1') waterBonus = 500;
      if (itemId === 'inv_2') sugarDeduct = 10;

      return {
        ...prev,
        today: {
          ...prev.today,
          waterMl: prev.today.waterMl + waterBonus,
          sugarG: Math.max(0, prev.today.sugarG - sugarDeduct),
        },
        inventory: prev.inventory
          .map((i) => (i.id === itemId ? { ...i, count: i.count - 1 } : i))
          .filter((i) => i.count > 0),
      };
    });
  };

  const handleBuyItem = (itemId, price) => {
    if (state.player.gold < price) return;
    playSystemSound('ding', soundEnabled);

    setState((prev) => {
      const existing = prev.inventory.find((i) => i.id === itemId);
      let newInv;
      if (existing) {
        newInv = prev.inventory.map((i) =>
          i.id === itemId ? { ...i, count: i.count + 1 } : i
        );
      } else {
        const itemInfo =
          itemId === 'inv_1'
            ? { id: 'inv_1', name: 'Mana Core Elixir', desc: '+500 mL Water Mana recovery', type: 'potion', count: 1 }
            : { id: 'inv_2', name: 'Detox Talisman', desc: 'Neutralizes 10g of consumed sugar', type: 'scroll', count: 1 };
        newInv = [...prev.inventory, itemInfo];
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          gold: prev.player.gold - price,
        },
        inventory: newInv,
      };
    });
  };

  // Player Settings & Reset
  const handleSavePlayerSettings = (formData) => {
    playSystemSound('ding', soundEnabled);
    setState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        name: formData.name,
        job: formData.job,
        waterGoalMl: formData.waterGoalMl,
        sugarLimitG: formData.sugarLimitG,
        startWeight: formData.startWeight,
        targetWeight: formData.targetWeight,
      },
    }));
  };

  const handleResetAll = () => {
    setState(DEFAULT_SOLO_STATE);
  };

  const handleClearPenalty = () => {
    setState((prev) => ({
      ...prev,
      today: { ...prev.today, penaltiesCompleted: true },
      player: { ...prev.player, hp: prev.player.maxHp },
    }));
  };

  return (
    <div className="app-viewport">
      <div className="mobile-frame">
        {/* Minimalist Sovereign Header */}
        <SystemHeader
          player={state.player}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onTriggerDing={handleTriggerDing}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Scrollable Main Viewport */}
        <main className="app-content">
          {activeTab === 'status' && (
            <StatusTab
              state={state}
              onAllocateStat={handleAllocateStat}
              onLogWeight={handleLogWeight}
              onDeleteWeightLog={handleDeleteWeightLog}
            />
          )}

          {activeTab === 'quests' && (
            <QuestsTab
              state={state}
              onAddWater={handleAddWater}
              onAddSugar={handleAddSugar}
              onDeleteSugar={handleDeleteSugar}
              onAddExercise={handleAddExercise}
              onToggleCustomQuest={handleToggleCustomQuest}
              onAddCustomQuest={handleAddCustomQuest}
              onDeleteCustomQuest={handleDeleteCustomQuest}
              onOpenPenaltyModal={() => setIsPenaltyModalOpen(true)}
              onOpenCravingModal={() => setIsCravingModalOpen(true)}
            />
          )}

          {activeTab === 'dungeons' && (
            <DungeonTab
              state={state}
              onAttackBoss={handleAttackBoss}
              onExtractShadow={handleExtractShadow}
              onAddCustomBoss={handleAddCustomBoss}
            />
          )}

          {activeTab === 'shadows' && (
            <ShadowsTab
              state={state}
              onUseItem={handleUseItem}
              onBuyItem={handleBuyItem}
            />
          )}
        </main>

        {/* Floating Sovereign Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          soundEnabled={soundEnabled}
        />

        {/* Modals */}
        <PenaltyModal
          isOpen={isPenaltyModalOpen}
          onClose={() => setIsPenaltyModalOpen(false)}
          onClearPenalty={handleClearPenalty}
          soundEnabled={soundEnabled}
        />

        <CravingModal
          isOpen={isCravingModalOpen}
          onClose={() => setIsCravingModalOpen(false)}
          onResisted={() => {
            addExp(100);
            setState((prev) => ({
              ...prev,
              today: { ...prev.today, cravingsCrushed: (prev.today.cravingsCrushed || 0) + 1 },
            }));
          }}
          soundEnabled={soundEnabled}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          state={state}
          onSavePlayerSettings={handleSavePlayerSettings}
          onResetAll={handleResetAll}
        />
      </div>
    </div>
  );
}

export default App;
