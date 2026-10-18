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
import { loadSoloState, saveSoloState, getRankFromLevel } from './utils/soloStorage';
import { playSystemSound, triggerSystemVibration } from './utils/audio';

export function App() {
  const [state, setState] = useState(() => loadSoloState());
  const [activeTab, setActiveTab] = useState('status');
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [isCravingModalOpen, setIsCravingModalOpen] = useState(false);

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
            colors: ['#00e5ff', '#38bdf8', '#c084fc', '#fbbf24'],
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

    setState((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        sugarG: newSugar,
        sugarItems: [
          ...prev.today.sugarItems,
          { id: Date.now().toString(), name, grams, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ],
      },
    }));
  };

  // Exercise Actions
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

  // Allocate Stat Points
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

  // Attack Dungeon Boss with Weight Loss
  const handleAttackBoss = (bossId, grams) => {
    playSystemSound('attack', soundEnabled);
    triggerSystemVibration([50, 30, 70]);
    addExp(grams * 2);

    setState((prev) => {
      const updatedBosses = prev.bosses.map((b) => {
        if (b.id !== bossId) return b;
        const newDmg = Math.min(b.maxGrams, b.damageTaken + grams);
        return {
          ...b,
          damageTaken: newDmg,
        };
      });

      // Update current weight accordingly
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

  // Extract Shadow upon defeating Boss
  const handleExtractShadow = (bossId) => {
    playSystemSound('level_up', soundEnabled);
    triggerSystemVibration([100, 50, 150]);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#c084fc', '#a855f7', '#38bdf8', '#ffffff'],
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
        extractedAt: new Date().toISOString().split('T')[0],
        icon: targetBoss.avatar,
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

  // Use Inventory Item
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
        inventory: prev.inventory.map((i) =>
          i.id === itemId ? { ...i, count: i.count - 1 } : i
        ).filter((i) => i.count > 0),
      };
    });
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
        {/* Top Holographic System Header */}
        <SystemHeader
          player={state.player}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onTriggerDing={handleTriggerDing}
        />

        {/* Content View */}
        <main className="app-content">
          {activeTab === 'status' && (
            <StatusTab
              state={state}
              onAllocateStat={handleAllocateStat}
            />
          )}

          {activeTab === 'quests' && (
            <QuestsTab
              state={state}
              onAddWater={handleAddWater}
              onAddSugar={handleAddSugar}
              onAddExercise={handleAddExercise}
              onOpenPenaltyModal={() => setIsPenaltyModalOpen(true)}
              onOpenCravingModal={() => setIsCravingModalOpen(true)}
            />
          )}

          {activeTab === 'dungeons' && (
            <DungeonTab
              state={state}
              onAttackBoss={handleAttackBoss}
              onExtractShadow={handleExtractShadow}
            />
          )}

          {activeTab === 'shadows' && (
            <ShadowsTab
              state={state}
              onUseItem={handleUseItem}
            />
          )}
        </main>

        {/* Fixed System Navigation Bar */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          soundEnabled={soundEnabled}
        />

        {/* System Modals */}
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
      </div>
    </div>
  );
}

export default App;
