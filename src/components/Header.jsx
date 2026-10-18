import React from 'react';
import { Shield, Flame, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { playSound } from '../utils/audio';

export const Header = ({ state, sergeant, onToggleSound, onOpenSettings }) => {
  const { soundEnabled, persona } = state.settings;
  const streak = state.streak?.current || 0;
  const shields = state.streak?.shields || 0;
  const score = sergeant.disciplineScore;

  // Determine score color
  let scoreColor = 'var(--emerald-core)';
  if (score < 40) scoreColor = 'var(--crimson-core)';
  else if (score < 70) scoreColor = 'var(--amber-core)';

  return (
    <header className="app-header">
      <div className="brand-badge" onClick={onOpenSettings} style={{ cursor: 'pointer' }}>
        <div className="brand-icon-box">
          <Shield size={20} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <h1>STRICT</h1>
          <div className="brand-subtitle">Health Sentinel</div>
        </div>
      </div>

      <div className="header-actions">
        {/* Streak Counter */}
        <div className="streak-pill" title={`${streak} Day Streak (${shields} Shield saved)`}>
          <Flame size={16} fill="var(--amber-core)" />
          <span>{streak}d</span>
          {shields > 0 && <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>🛡️</span>}
        </div>

        {/* Discipline Score Indicator */}
        <div
          className="discipline-circle"
          style={{
            border: `2px solid ${scoreColor}`,
            boxShadow: `0 0 10px ${scoreColor}40`,
            color: scoreColor,
          }}
          title="Daily Discipline Score (0-100)"
        >
          {score}%
        </div>

        {/* Audio Toggle */}
        <button
          className="btn btn-ghost"
          style={{ width: 36, height: 36, padding: 0, borderRadius: '50%' }}
          onClick={() => {
            playSound('click', !soundEnabled);
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute Audio Alerts' : 'Enable Audio Alerts'}
        >
          {soundEnabled ? (
            <Volume2 size={17} color="var(--cyan-core)" />
          ) : (
            <VolumeX size={17} color="var(--text-muted)" />
          )}
        </button>
      </div>
    </header>
  );
};
