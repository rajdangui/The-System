import React from 'react';
import { Shield, Volume2, VolumeX, Coins, Sparkles } from 'lucide-react';
import { getRankFromLevel } from '../utils/soloStorage';
import { playSystemSound } from '../utils/audio';

export const SystemHeader = ({ player, soundEnabled, onToggleSound, onTriggerDing }) => {
  const currentRank = getRankFromLevel(player.level);

  return (
    <header className="system-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={onTriggerDing}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="Trigger System Ding"
        >
          <div className="system-title-tag">
            <span>[THE SYSTEM]</span>
          </div>
        </button>

        {/* Hunter Rank Badge */}
        <div
          className="hunter-rank-badge"
          style={{
            borderColor: currentRank.color,
            color: currentRank.color,
            background: `${currentRank.color}15`,
            boxShadow: `0 0 10px ${currentRank.color}30`,
          }}
        >
          {currentRank.rank}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Level */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '0.82rem',
            color: 'var(--sys-cyan)',
          }}
        >
          LV.{player.level}
        </div>

        {/* Gold */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--sys-gold)',
            fontWeight: 700,
          }}
        >
          <Coins size={14} />
          <span>{player.gold.toLocaleString()}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          style={{
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid var(--sys-border)',
            borderRadius: 6,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: soundEnabled ? 'var(--sys-cyan)' : '#64748b',
            cursor: 'pointer',
          }}
          title={soundEnabled ? 'Mute System Sounds' : 'Unmute System Sounds'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>
    </header>
  );
};
