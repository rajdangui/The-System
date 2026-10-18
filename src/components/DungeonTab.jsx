import React, { useState } from 'react';
import { Skull, Swords, Award, Shield, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

export const DungeonTab = ({ state, onAttackBoss, onExtractShadow }) => {
  const { bosses, player } = state;
  const [weighInInput, setWeighInInput] = useState('');

  // Find current active boss (first non-defeated)
  const currentBoss = bosses.find((b) => !b.defeated) || bosses[bosses.length - 1];
  const hpRemaining = Math.max(0, currentBoss.maxGrams - currentBoss.damageTaken);
  const bossHpPct = Math.min(100, Math.round((hpRemaining / currentBoss.maxGrams) * 100));

  const handleCustomAttack = (e) => {
    e.preventDefault();
    const g = parseInt(weighInInput, 10);
    if (!g || g <= 0) return;
    onAttackBoss(currentBoss.id, g);
    setWeighInInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Active Dungeon Raid Header */}
      <div className="system-card danger">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Swords size={18} color="var(--sys-red)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--sys-red)', fontWeight: 800 }}>
              [DUNGEON RAID IN PROGRESS]
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(255, 42, 95, 0.2)',
              color: 'var(--sys-red)',
              border: '1px solid var(--sys-red)',
            }}
          >
            {currentBoss.rank} BOSS
          </span>
        </div>

        {/* Boss Center Arena */}
        <div style={{ textAlign: 'center', margin: '14px 0' }}>
          <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 20px rgba(255,42,95,0.4))' }}>
            {currentBoss.avatar}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>
            {currentBoss.name}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{currentBoss.title}</div>
        </div>

        {/* Boss HP Bar */}
        <div style={{ margin: '10px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.76rem', marginBottom: 4 }}>
            <span style={{ color: 'var(--sys-red)', fontWeight: 800 }}>BOSS HEALTH (Weight to Burn)</span>
            <span>{hpRemaining} / {currentBoss.maxGrams} g</span>
          </div>
          <div className="stat-rail" style={{ height: 12 }}>
            <div className="stat-fill boss" style={{ width: `${bossHpPct}%` }} />
          </div>
        </div>

        {/* Defeat & Extract Action if 0 HP */}
        {hpRemaining === 0 && !currentBoss.defeated ? (
          <div style={{ marginTop: 14 }}>
            <button
              className="btn-system btn-monarch-system"
              style={{ width: '100%', padding: '12px 0', fontSize: '1.05rem', letterSpacing: '0.08em' }}
              onClick={() => onExtractShadow(currentBoss.id)}
            >
              <Sparkles size={18} />
              "ARISE!" EXTRACT SHADOW ({currentBoss.shadow})
            </button>
          </div>
        ) : (
          /* Deal Weight Damage Form */
          <div style={{ marginTop: 14, borderTop: '1px solid rgba(255, 42, 95, 0.2)', paddingTop: 12 }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 8 }}>
              ⚔️ <strong>Every gram of fat dropped deals direct strike damage to the Dungeon Boss.</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
              <button className="btn-system" style={{ fontSize: '0.75rem', padding: '8px 4px' }} onClick={() => onAttackBoss(currentBoss.id, 100)}>
                -100g Hit
              </button>
              <button className="btn-system" style={{ fontSize: '0.75rem', padding: '8px 4px' }} onClick={() => onAttackBoss(currentBoss.id, 250)}>
                -250g Strike
              </button>
              <button className="btn-system btn-danger-system" style={{ fontSize: '0.75rem', padding: '8px 4px' }} onClick={() => onAttackBoss(currentBoss.id, 500)}>
                -500g Slash
              </button>
            </div>

            <form onSubmit={handleCustomAttack} style={{ display: 'flex', gap: 6 }}>
              <input
                type="number"
                placeholder="Log weight drop (grams)"
                value={weighInInput}
                onChange={(e) => setWeighInInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--sys-border)',
                  borderRadius: 6,
                  padding: '8px 12px',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                }}
              />
              <button type="submit" className="btn-system" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                Strike
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Dungeon Gates Roster */}
      <div className="system-card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--sys-cyan)', letterSpacing: '0.06em', marginBottom: 10 }}>
          [DUNGEON GATES ROSTER]
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bosses.map((b) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 8,
                background: b.defeated ? 'rgba(34, 197, 94, 0.08)' : b.id === currentBoss.id ? 'rgba(255, 42, 95, 0.08)' : 'rgba(0, 229, 255, 0.03)',
                border: `1px solid ${b.defeated ? 'rgba(34, 197, 94, 0.3)' : b.id === currentBoss.id ? 'var(--sys-red)' : 'var(--sys-border-subtle)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>{b.avatar}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    Target: {b.maxGrams}g Weight Loss • Shadow: {b.shadow}
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: b.defeated ? 'var(--sys-green)' : b.id === currentBoss.id ? 'var(--sys-red)' : '#64748b',
                }}
              >
                {b.defeated ? 'CLEARED ✓' : b.id === currentBoss.id ? 'ENGAGED' : 'LOCKED 🔒'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
