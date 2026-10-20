import React from 'react';
import { Droplets, ShieldCheck, Dumbbell, Scale, CheckSquare, Square, Plus, ArrowRight, Flame } from 'lucide-react';
import { calculateDisciplineScore } from '../utils/systemStorage';

export const DashboardTab = ({
  state,
  onNavigateTab,
  onAddWater,
  onToggleHabit,
  onOpenCravingModal,
}) => {
  const { user, today, streakDays, weightHistory } = state;
  const score = calculateDisciplineScore(today, user);

  const waterPct = Math.min(100, Math.round((today.waterMl / user.waterGoalMl) * 100));
  const sugarRemaining = Math.max(0, user.sugarLimitG - today.sugarG);
  const sugarExceeded = today.sugarG > user.sugarLimitG;

  const cond = today.conditioning || {};
  const pushDone = cond.pushups >= (cond.pushupsTarget || 100);
  const sitDone = cond.situps >= (cond.situpsTarget || 100);
  const squatDone = cond.squats >= (cond.squatsTarget || 100);
  const runDone = cond.runningKm >= (cond.runningKmTarget || 5);
  const completedWorkoutsCount = [pushDone, sitDone, squatDone, runDone].filter(Boolean).length;

  const habits = today.habits || [];
  const completedHabitsCount = habits.filter((h) => h.completed).length;

  const weightLost = Math.max(0, user.startWeight - user.currentWeight);

  const getScoreHeadline = (s) => {
    if (s >= 90) return 'PEAK DISCIPLINE';
    if (s >= 75) return 'SOLID TRAJECTORY';
    if (s >= 50) return 'MIDWAY TARGETS';
    return 'STANDARDS NOT MET';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Hero Discipline Card */}
      <div className="sovereign-card" style={{ borderTop: '2px solid var(--electric-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Daily Accountability Score
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginTop: 2 }}>
              {getScoreHeadline(score)}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 2 }}>
              {score >= 75 ? 'Standards maintained. Continue relentless execution.' : 'Immediate action required on remaining daily protocols.'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 900, color: score >= 75 ? 'var(--calm-green)' : 'var(--electric-cyan)', lineHeight: 1 }}>
              {score}%
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
              DAY {streakDays} ACTIVE
            </div>
          </div>
        </div>

        {/* Linear Laser Meter */}
        <div className="laser-meter-track" style={{ height: 8, marginBottom: 8 }}>
          <div
            className="laser-meter-fill"
            style={{
              width: `${score}%`,
              background: score >= 75 ? 'linear-gradient(90deg, #059669 0%, #10b981 100%)' : 'linear-gradient(90deg, #0284c7 0%, var(--electric-cyan) 100%)',
              boxShadow: score >= 75 ? '0 0 12px rgba(16, 185, 129, 0.45)' : '0 0 12px rgba(0, 240, 255, 0.45)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
          <span>0%</span>
          <span>50% BASELINE</span>
          <span>100% UNCOMPROMISED</span>
        </div>
      </div>

      {/* 4 Core Vital Signs Grid */}
      <div className="deck-grid-2">
        {/* 1. Hydration Target */}
        <div className="sovereign-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Droplets size={16} color="var(--electric-cyan)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600 }}>
                HYDRATION
              </span>
            </div>
            <button
              onClick={() => onAddWater(250)}
              className="btn-sovereign"
              style={{ padding: '3px 8px', minHeight: 26, fontSize: '0.7rem' }}
              title="Quick log +250 mL"
            >
              +250ml
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
              {today.waterMl.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              / {user.waterGoalMl.toLocaleString()} mL ({waterPct}%)
            </span>
          </div>

          <div className="laser-meter-track" style={{ height: 5 }}>
            <div className="laser-meter-fill hp" style={{ width: `${waterPct}%` }} />
          </div>
        </div>

        {/* 2. Sugar & Nutrition Cap */}
        <div className="sovereign-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} color={sugarExceeded ? 'var(--lethal-red)' : 'var(--sovereign-gold)'} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600 }}>
                SUGAR DEFENSE
              </span>
            </div>
            <button
              onClick={onOpenCravingModal}
              className="btn-sovereign btn-sovereign-danger"
              style={{ padding: '3px 8px', minHeight: 26, fontSize: '0.7rem' }}
              title="Delay dopamine craving for 3 minutes"
            >
              Craving SOS
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: sugarExceeded ? 'var(--lethal-red)' : '#fff' }}>
              {today.sugarG}g
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              / {user.sugarLimitG}g cap {sugarExceeded ? '(BREACHED)' : `(${sugarRemaining}g left)`}
            </span>
          </div>

          <div className="laser-meter-track" style={{ height: 5 }}>
            <div
              className="laser-meter-fill"
              style={{
                width: `${Math.min(100, (today.sugarG / user.sugarLimitG) * 100)}%`,
                background: sugarExceeded ? 'var(--lethal-red)' : 'var(--sovereign-gold)',
              }}
            />
          </div>
        </div>

        {/* 3. Daily Conditioning Routine */}
        <div className="sovereign-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dumbbell size={16} color="var(--electric-cyan)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600 }}>
                CONDITIONING
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('habits')}
              className="btn-sovereign btn-sovereign-ghost"
              style={{ padding: '3px 8px', minHeight: 26, fontSize: '0.7rem' }}
            >
              Log <ArrowRight size={11} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: completedWorkoutsCount === 4 ? 'var(--calm-green)' : '#fff' }}>
              {completedWorkoutsCount} / 4
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              Protocols Cleared
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, fontSize: '0.66rem', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
            <div style={{ padding: '3px 2px', borderRadius: 3, background: pushDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)', color: pushDone ? 'var(--calm-green)' : '#64748b' }}>
              Push: {cond.pushups}
            </div>
            <div style={{ padding: '3px 2px', borderRadius: 3, background: sitDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)', color: sitDone ? 'var(--calm-green)' : '#64748b' }}>
              Sit: {cond.situps}
            </div>
            <div style={{ padding: '3px 2px', borderRadius: 3, background: squatDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)', color: squatDone ? 'var(--calm-green)' : '#64748b' }}>
              Squat: {cond.squats}
            </div>
            <div style={{ padding: '3px 2px', borderRadius: 3, background: runDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)', color: runDone ? 'var(--calm-green)' : '#64748b' }}>
              {cond.runningKm}km
            </div>
          </div>
        </div>

        {/* 4. Body Metamorphosis Target */}
        <div className="sovereign-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Scale size={16} color="var(--calm-green)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600 }}>
                BODY METRICS
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('body')}
              className="btn-sovereign btn-sovereign-ghost"
              style={{ padding: '3px 8px', minHeight: 26, fontSize: '0.7rem' }}
            >
              Weigh-in <ArrowRight size={11} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
              {user.currentWeight} {user.unit}
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--calm-green)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              -{weightLost.toFixed(1)} {user.unit} lost
            </span>
          </div>

          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            Goal: <strong style={{ color: '#fff' }}>{user.targetWeight} {user.unit}</strong> • {weightHistory.length} weigh-ins logged
          </div>
        </div>
      </div>

      {/* Priority Habits Quick Checklist */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckSquare size={16} color="var(--electric-cyan)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em' }}>
              TODAY'S HABITS & PROTOCOLS ({completedHabitsCount}/{habits.length})
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('habits')}
            className="btn-sovereign btn-sovereign-ghost"
            style={{ padding: '3px 8px', minHeight: 26, fontSize: '0.7rem' }}
          >
            Manage <Plus size={12} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {habits.slice(0, 4).map((h) => (
            <div
              key={h.id}
              className="interactive-item"
              onClick={() => onToggleHabit(h.id)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {h.completed ? (
                  <CheckSquare size={17} color="var(--calm-green)" />
                ) : (
                  <Square size={17} color="#64748b" />
                )}
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: h.completed ? '#64748b' : '#fff',
                    textDecoration: h.completed ? 'line-through' : 'none',
                  }}
                >
                  {h.title}
                </span>
              </div>

              {h.streak > 0 && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--sovereign-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Flame size={12} /> {h.streak}d
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
