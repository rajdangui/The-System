import React, { useState, useEffect } from 'react';
import { ShieldAlert, Droplets, Candy, Scale, Dumbbell, CheckCircle2, Clock, Plus, Zap, AlertTriangle } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

export const QuestsTab = ({
  state,
  onAddWater,
  onAddSugar,
  onAddExercise,
  onOpenPenaltyModal,
  onOpenCravingModal,
}) => {
  const { today, player } = state;
  const { exercises } = today;

  // Calculate time remaining until midnight
  const [timeLeftStr, setTimeLeftStr] = useState('');

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

  // Completion statuses
  const waterDone = today.waterMl >= player.waterGoalMl;
  const sugarDone = today.sugarG <= player.sugarLimitG;
  const pushupsDone = exercises.pushups >= 100;
  const situpsDone = exercises.situps >= 100;
  const squatsDone = exercises.squats >= 100;
  const runDone = exercises.runningKm >= 5.0;

  const allConditioningDone = pushupsDone && situpsDone && squatsDone && runDone;
  const allQuestsDone = waterDone && sugarDone && allConditioningDone && today.weightLogged;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* System Warning Banner - Countdown to Penalty */}
      <div
        className="system-card danger"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 42, 95, 0.15) 0%, rgba(20, 8, 14, 0.9) 100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={16} color="var(--sys-red)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--sys-red)', fontWeight: 800 }}>
                [WARNING: PENALTY COUNTDOWN]
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 900, color: '#fff', marginTop: 2 }}>
              {timeLeftStr}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Failure to complete all daily quests before 00:00 will trigger the <strong>Penalty Zone</strong>.
            </div>
          </div>

          <button
            className="btn-system btn-danger-system"
            style={{ fontSize: '0.75rem', padding: '8px 12px' }}
            onClick={onOpenPenaltyModal}
          >
            <AlertTriangle size={14} />
            Test Penalty
          </button>
        </div>
      </div>

      {/* Quest Title Card */}
      <div className="system-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--sys-cyan)', letterSpacing: '0.06em' }}>
              [QUEST INFO]
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: '#fff' }}>
              DAILY QUEST: PREPARING TO BECOME STRONG
            </div>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 8px',
              borderRadius: 6,
              background: allQuestsDone ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0, 229, 255, 0.15)',
              color: allQuestsDone ? 'var(--sys-green)' : 'var(--sys-cyan)',
              border: `1px solid ${allQuestsDone ? 'var(--sys-green)' : 'var(--sys-cyan)'}`,
            }}
          >
            {allQuestsDone ? 'QUEST CLEARED ✓' : 'IN PROGRESS'}
          </span>
        </div>

        {/* 1. Water Mana Core */}
        <div style={{ borderTop: '1px solid var(--sys-border-subtle)', paddingTop: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Droplets size={18} color="var(--sys-cyan)" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>
                  1. Quench the Mana Core (Water Intake)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Current: <strong style={{ color: 'var(--sys-cyan)' }}>{today.waterMl}</strong> / {player.waterGoalMl} mL
                </div>
              </div>
            </div>
            {waterDone && <CheckCircle2 size={20} color="var(--sys-green)" />}
          </div>

          {/* Quick Add Potions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 10 }}>
            {[250, 350, 500, 750].map((amt) => (
              <button
                key={amt}
                className="btn-system"
                style={{ padding: '6px 4px', fontSize: '0.76rem' }}
                onClick={() => onAddWater(amt)}
              >
                +{amt}ml
              </button>
            ))}
          </div>
        </div>

        {/* 2. Poison Immunity (Sugar Ceiling) */}
        <div style={{ borderTop: '1px solid var(--sys-border-subtle)', paddingTop: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Candy size={18} color={today.sugarG > player.sugarLimitG ? 'var(--sys-red)' : 'var(--sys-gold)'} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>
                  2. Refined Poison Defense (Sugar Cap)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Consumed: <strong style={{ color: today.sugarG > player.sugarLimitG ? 'var(--sys-red)' : 'var(--sys-gold)' }}>{today.sugarG}g</strong> / Max {player.sugarLimitG}g
                </div>
              </div>
            </div>

            <button
              className="btn-system btn-danger-system"
              style={{ fontSize: '0.7rem', padding: '4px 10px' }}
              onClick={onOpenCravingModal}
            >
              Craving Intercept
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 10 }}>
            <button className="btn-system" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(5, 'Light Sweet Snack')}>
              +5g Snack
            </button>
            <button className="btn-system" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(15, 'Dessert / Sweet Beverage')}>
              +15g Drink
            </button>
            <button className="btn-system btn-danger-system" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(35, 'Full Soda / Pastry Trap')}>
              +35g Soda
            </button>
          </div>
        </div>

        {/* 3. Physical Conditioning (The Sung Jin-woo Routine) */}
        <div style={{ borderTop: '1px solid var(--sys-border-subtle)', paddingTop: 12 }}>
          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Dumbbell size={16} color="var(--sys-cyan)" />
            <span>3. Hunter Conditioning Protocol</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Push-ups */}
            <div style={{ background: 'rgba(0, 229, 255, 0.04)', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--sys-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>[ ] Push-ups</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: pushupsDone ? 'var(--sys-green)' : 'var(--sys-cyan)' }}>
                  {exercises.pushups} / 100 {pushupsDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 10)}>+10</button>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 25)}>+25</button>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 50)}>+50</button>
              </div>
            </div>

            {/* Sit-ups */}
            <div style={{ background: 'rgba(0, 229, 255, 0.04)', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--sys-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>[ ] Sit-ups</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: situpsDone ? 'var(--sys-green)' : 'var(--sys-cyan)' }}>
                  {exercises.situps} / 100 {situpsDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 10)}>+10</button>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 25)}>+25</button>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 50)}>+50</button>
              </div>
            </div>

            {/* Squats */}
            <div style={{ background: 'rgba(0, 229, 255, 0.04)', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--sys-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>[ ] Squats</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: squatsDone ? 'var(--sys-green)' : 'var(--sys-cyan)' }}>
                  {exercises.squats} / 100 {squatsDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 10)}>+10</button>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 25)}>+25</button>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 50)}>+50</button>
              </div>
            </div>

            {/* Running */}
            <div style={{ background: 'rgba(0, 229, 255, 0.04)', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--sys-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>[ ] Running / Walk</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: runDone ? 'var(--sys-green)' : 'var(--sys-cyan)' }}>
                  {exercises.runningKm.toFixed(1)} / 5.0 km {runDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('runningKm', 0.5)}>+0.5km</button>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('runningKm', 1.0)}>+1.0km</button>
                <button className="btn-system" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('runningKm', 2.0)}>+2.0km</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
