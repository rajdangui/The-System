import React, { useState, useEffect } from 'react';
import { Droplets, Candy, Dumbbell, CheckCircle2, Clock, Plus, Zap, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
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
      {/* Penalty Countdown Card */}
      <div className="hud-card danger">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Clock size={15} color="var(--health-crimson)" />
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.74rem', color: 'var(--health-crimson)', fontWeight: 700, letterSpacing: '0.06em' }}>
                PENALTY ZONE ENFORCEMENT
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.45rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
              {timeLeftStr}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Incomplete objectives at 00:00 trigger mandatory survival trials.
            </div>
          </div>

          <button
            className="btn-hud btn-hud-danger"
            style={{ fontSize: '0.74rem', padding: '7px 11px' }}
            onClick={onOpenPenaltyModal}
          >
            <AlertTriangle size={13} />
            Test Penalty
          </button>
        </div>
      </div>

      {/* Daily Quest Classified Directive */}
      <div className="hud-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.74rem', color: 'var(--mana-cyan)', letterSpacing: '0.06em' }}>
              DIRECTIVE // DAILY QUEST
            </div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
              PREPARING TO BECOME STRONG
            </div>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 4,
              background: allQuestsDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 229, 255, 0.1)',
              color: allQuestsDone ? 'var(--clear-green)' : 'var(--mana-cyan)',
              border: `1px solid ${allQuestsDone ? 'var(--clear-green)' : 'var(--hud-border-cyan)'}`,
            }}
          >
            {allQuestsDone ? 'CLEARED' : 'IN PROGRESS'}
          </span>
        </div>

        {/* 1. Water Mana Core */}
        <div style={{ borderTop: '1px solid var(--hud-border-dark)', paddingTop: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Droplets size={16} color="var(--mana-cyan)" />
              <div>
                <div style={{ fontFamily: 'var(--font-hud)', fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>
                  1. Mana Core Hydration
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Poured: <strong style={{ color: 'var(--mana-cyan)' }}>{today.waterMl}</strong> / {player.waterGoalMl} mL
                </div>
              </div>
            </div>
            {waterDone ? (
              <CheckCircle2 size={18} color="var(--clear-green)" />
            ) : (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-hud)' }}>PENDING</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 10 }}>
            {[250, 350, 500, 750].map((amt) => (
              <button
                key={amt}
                className="btn-hud"
                style={{ padding: '6px 4px', fontSize: '0.75rem' }}
                onClick={() => onAddWater(amt)}
              >
                +{amt}ml
              </button>
            ))}
          </div>
        </div>

        {/* 2. Poison Immunity (Sugar Cap) */}
        <div style={{ borderTop: '1px solid var(--hud-border-dark)', paddingTop: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Candy size={16} color={today.sugarG > player.sugarLimitG ? 'var(--health-crimson)' : 'var(--gold-amber)'} />
              <div>
                <div style={{ fontFamily: 'var(--font-hud)', fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>
                  2. Refined Poison Neutralization
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Intake: <strong style={{ color: today.sugarG > player.sugarLimitG ? 'var(--health-crimson)' : 'var(--gold-amber)' }}>{today.sugarG}g</strong> / Max {player.sugarLimitG}g
                </div>
              </div>
            </div>

            <button
              className="btn-hud btn-hud-danger"
              style={{ fontSize: '0.7rem', padding: '4px 10px' }}
              onClick={onOpenCravingModal}
            >
              Craving SOS
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 10 }}>
            <button className="btn-hud" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(5, 'Light Sweet Snack')}>
              +5g Snack
            </button>
            <button className="btn-hud" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(15, 'Dessert Beverage')}>
              +15g Drink
            </button>
            <button className="btn-hud btn-hud-danger" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(35, 'Soda / Pastry Trap')}>
              +35g Breach
            </button>
          </div>
        </div>

        {/* 3. Physical Conditioning */}
        <div style={{ borderTop: '1px solid var(--hud-border-dark)', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Dumbbell size={16} color="var(--mana-cyan)" />
            <span style={{ fontFamily: 'var(--font-hud)', fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>
              3. Hunter Conditioning Routine
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Pushups */}
            <div className="stat-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Push-ups</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: pushupsDone ? 'var(--clear-green)' : 'var(--mana-cyan)', fontWeight: 600 }}>
                  {exercises.pushups} / 100 {pushupsDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 10)}>+10</button>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 25)}>+25</button>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('pushups', 50)}>+50</button>
              </div>
            </div>

            {/* Situps */}
            <div className="stat-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Sit-ups</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: situpsDone ? 'var(--clear-green)' : 'var(--mana-cyan)', fontWeight: 600 }}>
                  {exercises.situps} / 100 {situpsDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 10)}>+10</button>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 25)}>+25</button>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('situps', 50)}>+50</button>
              </div>
            </div>

            {/* Squats */}
            <div className="stat-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Squats</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: squatsDone ? 'var(--clear-green)' : 'var(--mana-cyan)', fontWeight: 600 }}>
                  {exercises.squats} / 100 {squatsDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 10)}>+10</button>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 25)}>+25</button>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('squats', 50)}>+50</button>
              </div>
            </div>

            {/* Running */}
            <div className="stat-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Running / Walk</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: runDone ? 'var(--clear-green)' : 'var(--mana-cyan)', fontWeight: 600 }}>
                  {exercises.runningKm.toFixed(1)} / 5.0 km {runDone && '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('runningKm', 0.5)}>+0.5km</button>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('runningKm', 1.0)}>+1.0km</button>
                <button className="btn-hud" style={{ flex: 1, padding: 4, fontSize: '0.72rem' }} onClick={() => onAddExercise('runningKm', 2.0)}>+2.0km</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
