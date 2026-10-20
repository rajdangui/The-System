import React from 'react';
import { Volume2, VolumeX, Sliders, Flame } from 'lucide-react';
import { calculateDisciplineScore } from '../utils/systemStorage';

export const SystemHeader = ({ state, soundEnabled, onToggleSound, onTriggerDing, onOpenSettings }) => {
  const { user, today, streakDays } = state;
  const score = calculateDisciplineScore(today, user);

  const getScoreColor = (s) => {
    if (s >= 80) return 'var(--calm-green)';
    if (s >= 50) return 'var(--electric-cyan)';
    if (s >= 30) return 'var(--sovereign-gold)';
    return 'var(--lethal-red)';
  };

  return (
    <header className="sovereign-header" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onTriggerDing}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
          title="Diagnostic Chime (Click)"
          aria-label="The System Home"
        >
          <div className="sovereign-title">
            <span>THE SYSTEM</span>
          </div>
          <div style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Discipline Operating System
          </div>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Daily Discipline Score Badge */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.74rem',
            padding: '3px 8px',
            borderRadius: 4,
            border: `1px solid ${getScoreColor(score)}40`,
            background: `${getScoreColor(score)}12`,
            color: getScoreColor(score),
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          title="Today's Total Discipline Score (0-100%)"
        >
          <span>{score}%</span>
          <span style={{ fontSize: '0.64rem', opacity: 0.8 }}>SCORE</span>
        </div>

        {/* Streak Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--sovereign-gold)',
            fontWeight: 700,
            padding: '3px 7px',
            background: 'rgba(251, 191, 36, 0.08)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            borderRadius: 4,
          }}
          title="Active Discipline Streak"
        >
          <Flame size={13} />
          <span>{streakDays}d</span>
        </div>

        {/* Audio Toggle */}
        <button
          id="sound-toggle-btn"
          onClick={onToggleSound}
          style={{
            background: soundEnabled ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${soundEnabled ? 'var(--border-active-cyan)' : 'var(--border-dormant)'}`,
            borderRadius: 'var(--radius-sm)',
            color: soundEnabled ? 'var(--electric-cyan)' : '#64748b',
            cursor: 'pointer',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          title={soundEnabled ? 'Mute Audio [Hotkey: M]' : 'Unmute Audio [Hotkey: M]'}
          aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Settings Button */}
        <button
          id="settings-trigger-btn"
          onClick={onOpenSettings}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-dormant)',
            borderRadius: 'var(--radius-sm)',
            color: '#cbd5e1',
            cursor: 'pointer',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          title="System Settings & Goals"
          aria-label="Settings"
        >
          <Sliders size={15} />
        </button>
      </div>
    </header>
  );
};
