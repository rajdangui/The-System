import React from 'react';
import { Volume2, VolumeX, Coins, Sparkles, Activity } from 'lucide-react';
import { getRankFromLevel } from '../utils/soloStorage';

export const SystemHeader = ({ player, soundEnabled, onToggleSound, onTriggerDing }) => {
  const currentRank = getRankFromLevel(player.level);

  return (
    <header className="hud-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={onTriggerDing}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="System Sound Diagnostic"
        >
          <div className="hud-title-tag">
            <span>THE SYSTEM</span>
          </div>
        </button>

        {/* Chamfered Hunter Rank Crest */}
        <div
          className="hunter-rank-crest"
          style={{
            borderColor: currentRank.color,
            color: currentRank.color,
            background: `linear-gradient(135deg, ${currentRank.color}25 0%, transparent 100%)`,
            textShadow: `0 0 10px ${currentRank.color}`,
          }}
        >
          <Activity size={12} strokeWidth={2.5} />
          <span>{currentRank.rank}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hunter Level */}
        <div
          style={{
            fontFamily: 'var(--font-hud)',
            fontWeight: 700,
            fontSize: '0.84rem',
            color: 'var(--mana-cyan)',
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
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--gold-amber)',
            fontWeight: 700,
          }}
        >
          <Coins size={14} />
          <span>{player.gold.toLocaleString()}</span>
        </div>

        {/* Tactile Audio Switch */}
        <button
          onClick={onToggleSound}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--hud-border-dark)',
            borderRadius: 4,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: soundEnabled ? 'var(--mana-cyan)' : 'var(--text-faint)',
            cursor: 'pointer',
          }}
          title={soundEnabled ? 'Mute System FX' : 'Enable System FX'}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
      </div>
    </header>
  );
};
