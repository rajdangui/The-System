import React, { useState, useEffect } from 'react';
import { Droplets, Candy, Dumbbell, CheckCircle2, Clock, Plus, AlertTriangle, Trash2, CheckSquare, Square } from 'lucide-react';

export const QuestsTab = ({
  state,
  onAddWater,
  onAddSugar,
  onDeleteSugar,
  onAddExercise,
  onToggleCustomQuest,
  onAddCustomQuest,
  onDeleteCustomQuest,
  onOpenPenaltyModal,
  onOpenCravingModal,
}) => {
  const { today, player } = state;
  const { exercises, customQuests = [], sugarItems = [] } = today;

  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newSugarName, setNewSugarName] = useState('');
  const [newSugarGrams, setNewSugarGrams] = useState('');
  const [customWater, setCustomWater] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight - now;

      if (diffMs <= 0) {
        setTimeLeftStr('00:00:00 (EXPIRED)');
      } else {
        const hrs = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
        const mins = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const secs = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');
        setTimeLeftStr(`${hrs}:${mins}:${secs}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const waterDone = today.waterMl >= player.waterGoalMl;
  const sugarDone = today.sugarG <= player.sugarLimitG;
  const pushupsDone = exercises.pushups >= 100;
  const situpsDone = exercises.situps >= 100;
  const squatsDone = exercises.squats >= 100;
  const runDone = exercises.runningKm >= 5.0;

  const allConditioningDone = pushupsDone && situpsDone && squatsDone && runDone;
  const allQuestsDone = waterDone && sugarDone && allConditioningDone && today.weightLogged;

  const handleCreateQuest = (e) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;
    onAddCustomQuest(newQuestTitle.trim());
    setNewQuestTitle('');
  };

  const handleCreateSugar = (e) => {
    e.preventDefault();
    const g = parseFloat(newSugarGrams);
    if (!g || g <= 0) return;
    onAddSugar(g, newSugarName.trim() || 'Sweet Item');
    setNewSugarName('');
    setNewSugarGrams('');
  };

  const handleCustomWaterSubmit = (e) => {
    e.preventDefault();
    const amt = parseInt(customWater, 10);
    if (!amt || amt <= 0) return;
    onAddWater(amt);
    setCustomWater('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Penalty Countdown Card */}
      <div className="sovereign-card danger">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Clock size={14} color="var(--lethal-red)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--lethal-red)', fontWeight: 600, letterSpacing: '0.06em' }}>
                PENALTY ENFORCEMENT COUNTDOWN
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.45rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
              {timeLeftStr}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              Incomplete objectives at 00:00 will initiate the <strong>Survival Trial</strong>.
            </div>
          </div>

          <button
            className="btn-sovereign btn-sovereign-danger"
            style={{ fontSize: '0.72rem', padding: '6px 10px' }}
            onClick={onOpenPenaltyModal}
          >
            <AlertTriangle size={13} />
            Test Penalty
          </button>
        </div>
      </div>

      {/* Main Quests Board */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em' }}>
              DIRECTIVE // DAILY QUESTS
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              PREPARING TO BECOME STRONG
            </div>
          </div>

          <span
            className="hunter-rank-pill"
            style={{
              borderColor: allQuestsDone ? 'var(--calm-green)' : 'var(--electric-cyan)',
              color: allQuestsDone ? 'var(--calm-green)' : 'var(--electric-cyan)',
              background: allQuestsDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 240, 255, 0.1)',
            }}
          >
            {allQuestsDone ? 'ALL CLEARED ✓' : 'IN PROGRESS'}
          </span>
        </div>

        {/* Responsive Dual Column for Hydration & Sugar Poison Defense */}
        <div className="deck-grid-2" style={{ borderTop: '1px solid var(--border-dormant)', paddingTop: 12, marginBottom: 14 }}>
          {/* 1. Water Mana Core */}
          <div style={{ paddingBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Droplets size={16} color="var(--electric-cyan)" />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.86rem', color: '#fff' }}>
                  1. Mana Core Hydration
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                  Intake: <strong style={{ color: 'var(--electric-cyan)' }}>{today.waterMl}</strong> / {player.waterGoalMl} mL
                </div>
              </div>
            </div>
            {waterDone && <CheckCircle2 size={16} color="var(--calm-green)" />}
          </div>

          {/* Quick Add Presets + Custom */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 10 }}>
            {[250, 350, 500, 750].map((amt) => (
              <button
                key={amt}
                className="btn-sovereign"
                style={{ padding: '6px 4px', fontSize: '0.74rem' }}
                onClick={() => onAddWater(amt)}
              >
                +{amt}ml
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomWaterSubmit} style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input
              type="number"
              placeholder="Custom water amount (mL)"
              value={customWater}
              onChange={(e) => setCustomWater(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(7, 9, 14, 0.8)',
                border: '1px solid var(--border-dormant)',
                borderRadius: 6,
                padding: '6px 10px',
                color: '#fff',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
              }}
            />
            <button type="submit" className="btn-sovereign" style={{ padding: '0 12px', fontSize: '0.76rem' }}>
              Add
            </button>
          </form>
        </div>

        {/* 2. Poison Immunity (Sugar Defense) */}
        <div style={{ borderTop: '1px solid var(--border-dormant)', paddingTop: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Candy size={16} color={today.sugarG > player.sugarLimitG ? 'var(--lethal-red)' : 'var(--sovereign-gold)'} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.86rem', color: '#fff' }}>
                  2. Refined Poison Neutralization
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                  Logged: <strong style={{ color: today.sugarG > player.sugarLimitG ? 'var(--lethal-red)' : 'var(--sovereign-gold)' }}>{today.sugarG}g</strong> / Max {player.sugarLimitG}g
                </div>
              </div>
            </div>

            <button
              className="btn-sovereign btn-sovereign-danger"
              style={{ fontSize: '0.7rem', padding: '4px 8px', minHeight: 30 }}
              onClick={onOpenCravingModal}
            >
              Craving SOS
            </button>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 10 }}>
            <button className="btn-sovereign" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(5, 'Light Snack')}>
              +5g Snack
            </button>
            <button className="btn-sovereign" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(15, 'Dessert Drink')}>
              +15g Drink
            </button>
            <button className="btn-sovereign btn-sovereign-danger" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(35, 'Soda / Pastry')}>
              +35g Breach
            </button>
          </div>

          {/* Custom Sugar Log Form */}
          <form onSubmit={handleCreateSugar} style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input
              type="text"
              placeholder="Food item name"
              value={newSugarName}
              onChange={(e) => setNewSugarName(e.target.value)}
              style={{
                flex: 1.2,
                background: 'rgba(7, 9, 14, 0.8)',
                border: '1px solid var(--border-dormant)',
                borderRadius: 6,
                padding: '6px 10px',
                color: '#fff',
                fontSize: '0.8rem',
              }}
            />
            <input
              type="number"
              step="0.5"
              placeholder="Grams (g)"
              value={newSugarGrams}
              onChange={(e) => setNewSugarGrams(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(7, 9, 14, 0.8)',
                border: '1px solid var(--border-dormant)',
                borderRadius: 6,
                padding: '6px 10px',
                color: '#fff',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
              }}
            />
            <button type="submit" className="btn-sovereign" style={{ padding: '0 12px', fontSize: '0.76rem' }}>
              Log
            </button>
          </form>

          {/* Sugar Items Archive */}
          {sugarItems.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              {sugarItems.map((si) => (
                <div key={si.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#94a3b8', padding: '2px 4px' }}>
                  <span>{si.name} (+{si.grams}g) • {si.time}</span>
                  <button onClick={() => onDeleteSugar(si.id)} style={{ background: 'none', border: 'none', color: 'var(--lethal-red)', cursor: 'pointer' }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>

        {/* 3. Hunter Conditioning Routine */}
        <div style={{ borderTop: '1px solid var(--border-dormant)', paddingTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Dumbbell size={15} color="var(--electric-cyan)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.86rem', color: '#fff' }}>
              3. Hunter Conditioning Routine
            </span>
          </div>

          <div className="deck-grid-2">
            {/* Pushups */}
            <div className="interactive-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Push-ups</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: pushupsDone ? 'var(--calm-green)' : 'var(--electric-cyan)', fontWeight: 600 }}>
                  {exercises.pushups} / 100 {pushupsDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 10)}>+10</button>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 25)}>+25</button>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 50)}>+50</button>
              </div>
            </div>

            {/* Situps */}
            <div className="interactive-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Sit-ups</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: situpsDone ? 'var(--calm-green)' : 'var(--electric-cyan)', fontWeight: 600 }}>
                  {exercises.situps} / 100 {situpsDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 10)}>+10</button>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 25)}>+25</button>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 50)}>+50</button>
              </div>
            </div>

            {/* Squats */}
            <div className="interactive-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Squats</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: squatsDone ? 'var(--calm-green)' : 'var(--electric-cyan)', fontWeight: 600 }}>
                  {exercises.squats} / 100 {squatsDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 10)}>+10</button>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 25)}>+25</button>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 50)}>+50</button>
              </div>
            </div>

            {/* Running */}
            <div className="interactive-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Running / Walk</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: runDone ? 'var(--calm-green)' : 'var(--electric-cyan)', fontWeight: 600 }}>
                  {exercises.runningKm.toFixed(1)} / 5.0 km {runDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('runningKm', 0.5)}>+0.5km</button>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('runningKm', 1.0)}>+1.0km</button>
                <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('runningKm', 2.0)}>+2.0km</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Custom Quests Card */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em' }}>
            CUSTOM HUNTER HABITS ({customQuests.length})
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            +100 EXP Each
          </span>
        </div>

        {/* Custom Quests List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {customQuests.map((q) => (
            <div
              key={q.id}
              className="interactive-item"
              onClick={() => onToggleCustomQuest(q.id)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {q.completed ? (
                  <CheckSquare size={16} color="var(--calm-green)" />
                ) : (
                  <Square size={16} color="#64748b" />
                )}
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: q.completed ? 'var(--calm-green)' : '#fff',
                    textDecoration: q.completed ? 'line-through' : 'none',
                  }}
                >
                  {q.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--sovereign-violet)', fontFamily: 'var(--font-mono)' }}>
                  +{q.rewardExp} EXP
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustomQuest(q.id);
                  }}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Custom Quest Form */}
        <form onSubmit={handleCreateQuest} style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <input
            type="text"
            placeholder="Add new daily quest (e.g., Cold Shower, Read 20m)"
            value={newQuestTitle}
            onChange={(e) => setNewQuestTitle(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(7, 9, 14, 0.8)',
              border: '1px solid var(--border-dormant)',
              borderRadius: 6,
              padding: '8px 12px',
              color: '#fff',
              fontSize: '0.82rem',
            }}
          />
          <button type="submit" className="btn-sovereign" style={{ padding: '0 14px' }}>
            <Plus size={15} /> Add
          </button>
        </form>
      </div>
    </div>
  );
};
