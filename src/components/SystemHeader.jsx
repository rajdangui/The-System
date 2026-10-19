import React from 'react';
import { Volume2, VolumeX, Coins, Sliders, Shield } from 'lucide-react';
import { getRankFromLevel } from '../utils/soloStorage';

export const SystemHeader = ({ player, soundEnabled, onToggleSound, onTriggerDing, onOpenSettings }) => {
  const currentRank = getRankFromLevel(player.level);

  return (
    <header className="sovereign-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={onTriggerDing}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="System Sound Diagnostic"
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
        >
          {currentRank.rank}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Hunter Level */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            fontSize: '0.8rem',
            color: 'var(--electric-cyan)',
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
            fontWeight: 600,
          }}
        >
          <Coins size={13} />
          <span>{player.gold.toLocaleString()}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          style={{
            background: 'none',
            border: 'none',
            color: soundEnabled ? 'var(--electric-cyan)' : '#64748b',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Settings & Configuration Modal Button */}
        <button
          onClick={onOpenSettings}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          title="System Settings & Data"
        >
          <Sliders size={16} />
        </button>
      </div>
    </header>
  );
};
