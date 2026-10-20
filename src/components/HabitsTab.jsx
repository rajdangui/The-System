import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, Dumbbell, Flame } from 'lucide-react';

export const HabitsTab = ({
  state,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  onAddExercise,
}) => {
  const { today } = state;
  const habits = today.habits || [];
  const cond = today.conditioning || {};

  const [newHabitTitle, setNewHabitTitle] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    onAddHabit(newHabitTitle.trim());
    setNewHabitTitle('');
  };

  const pushupsDone = cond.pushups >= (cond.pushupsTarget || 100);
  const situpsDone = cond.situps >= (cond.situpsTarget || 100);
  const squatsDone = cond.squats >= (cond.squatsTarget || 100);
  const runDone = cond.runningKm >= (cond.runningKmTarget || 5.0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Daily Habits Matrix */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Execution Protocol
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              Daily Habit Directives ({habits.filter((h) => h.completed).length}/{habits.length})
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Daily Reset at 00:00
          </span>
        </div>

        {/* Add Habit Form */}
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Add new daily habit (e.g. 10 Pages Reading, Cold Shower)..."
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
          />
          <button type="submit" className="btn-sovereign" style={{ padding: '0 14px' }}>
            Add Habit
          </button>
        </form>

        {/* Habits Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {habits.map((h) => (
            <div
              key={h.id}
              className="interactive-item"
              style={{
                borderColor: h.completed ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-dormant)',
                background: h.completed ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}
                onClick={() => onToggleHabit(h.id)}
              >
                {h.completed ? (
                  <CheckSquare size={18} color="var(--calm-green)" />
                ) : (
                  <Square size={18} color="#64748b" />
                )}
                <div>
                  <div
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: h.completed ? '#64748b' : '#fff',
                      textDecoration: h.completed ? 'line-through' : 'none',
                    }}
                  >
                    {h.title}
                  </div>
                  {h.streak > 0 && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--sovereign-gold)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Flame size={11} /> {h.streak} day streak
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteHabit(h.id)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
                title="Delete habit"
                aria-label={`Delete ${h.title}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Physical Conditioning & Training Routine */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dumbbell size={18} color="var(--electric-cyan)" />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Physical Calisthenics & Cardio
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                Conditioning Protocols
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            Daily Target
          </span>
        </div>

        <div className="deck-grid-2">
          {/* Push-ups */}
          <div className="interactive-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
                Push-ups
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: pushupsDone ? 'var(--calm-green)' : 'var(--electric-cyan)' }}>
                {cond.pushups} / {cond.pushupsTarget || 100} {pushupsDone && '✓'}
              </span>
            </div>
            <div className="laser-meter-track" style={{ height: 4 }}>
              <div
                className="laser-meter-fill hp"
                style={{ width: `${Math.min(100, (cond.pushups / (cond.pushupsTarget || 100)) * 100)}%` }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 10)}>+10</button>
              <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 25)}>+25</button>
              <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 50)}>+50</button>
            </div>
          </div>

          {/* Sit-ups */}
          <div className="interactive-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
                Sit-ups
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: situpsDone ? 'var(--calm-green)' : 'var(--electric-cyan)' }}>
                {cond.situps} / {cond.situpsTarget || 100} {situpsDone && '✓'}
              </span>
            </div>
            <div className="laser-meter-track" style={{ height: 4 }}>
              <div
                className="laser-meter-fill hp"
                style={{ width: `${Math.min(100, (cond.situps / (cond.situpsTarget || 100)) * 100)}%` }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 10)}>+10</button>
              <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 25)}>+25</button>
              <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 50)}>+50</button>
            </div>
          </div>

          {/* Squats */}
          <div className="interactive-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
                Squats
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: squatsDone ? 'var(--calm-green)' : 'var(--electric-cyan)' }}>
                {cond.squats} / {cond.squatsTarget || 100} {squatsDone && '✓'}
              </span>
            </div>
            <div className="laser-meter-track" style={{ height: 4 }}>
              <div
                className="laser-meter-fill hp"
                style={{ width: `${Math.min(100, (cond.squats / (cond.squatsTarget || 100)) * 100)}%` }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 10)}>+10</button>
              <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 25)}>+25</button>
              <button className="btn-sovereign" style={{ flex: 1, padding: 4, minHeight: 28, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 50)}>+50</button>
            </div>
          </div>

          {/* Running / Cardio */}
          <div className="interactive-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
                Running / Cardio
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: runDone ? 'var(--calm-green)' : 'var(--electric-cyan)' }}>
                {cond.runningKm.toFixed(1)} / {(cond.runningKmTarget || 5.0).toFixed(1)} km {runDone && '✓'}
              </span>
            </div>
            <div className="laser-meter-track" style={{ height: 4 }}>
              <div
                className="laser-meter-fill hp"
                style={{ width: `${Math.min(100, (cond.runningKm / (cond.runningKmTarget || 5.0)) * 100)}%` }}
              />
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
  );
};
