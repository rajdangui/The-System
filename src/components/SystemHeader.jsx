import React from 'react';
import { Volume2, VolumeX, Coins, Sliders } from 'lucide-react';
import { getRankFromLevel } from '../utils/soloStorage';

export const SystemHeader = ({ player, soundEnabled, onToggleSound, onTriggerDing, onOpenSettings }) => {
  const currentRank = getRankFromLevel(player.level);

  return (
    <header className="sovereign-header" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={onTriggerDing}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="Diagnostic Chime (Click)"
          aria-label="Diagnostic Chime"
        >
          <div className="sovereign-title">
            <span>THE SYSTEM</span>
          </div>
        </button>

        {/* Minimalist Hunter Rank Pill */}
        <div
          className="hunter-rank-pill"
          style={{
            borderColor: currentRank.color,
            color: currentRank.color,
            background: `${currentRank.color}15`,
          }}
          title={`Current Hunter Rank: ${currentRank.rank}`}
        >
          {currentRank.rank}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hunter Level */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.8rem',
            color: 'var(--electric-cyan)',
            letterSpacing: '0.04em',
          }}
        >
          LV.{player.level}
        </div>

        {/* Gold Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--sovereign-gold)',
            fontWeight: 700,
          }}
          title="Hunter Gold Balance"
        >
          <Coins size={14} />
          <span>{player.gold.toLocaleString()}</span>
        </div>

        {/* Sound Toggle Button */}
        <button
          id="sound-toggle-btn"
          onClick={onToggleSound}
          style={{
            background: soundEnabled ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${soundEnabled ? 'var(--border-active-cyan)' : 'var(--border-dormant)'}`,
            borderRadius: 'var(--radius-sm)',
            color: soundEnabled ? 'var(--electric-cyan)' : '#64748b',
            cursor: 'pointer',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          title={soundEnabled ? 'Mute Audio [Hotkey: M]' : 'Unmute Audio [Hotkey: M]'}
          aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
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
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          title="System Parameters & Configuration"
          aria-label="System Settings"
        >
          <Sliders size={16} />
        </button>
      </div>
    </header>
  );
};
