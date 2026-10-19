import React, { useState } from 'react';
import { Swords, Sparkles, Shield, Skull, Flame, Crown, Crosshair, ChevronRight } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

// Clean SVG Boss Crests
const BossCrest = ({ sigilType, rank }) => {
  if (sigilType === 'monarch') {
    return <Crown size={38} color="var(--monarch-purple)" strokeWidth={2.2} style={{ filter: 'drop-shadow(0 0 12px var(--monarch-purple))' }} />;
  }
  if (sigilType === 'knight') {
    return <Swords size={38} color="#ef4444" strokeWidth={2.2} style={{ filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.6))' }} />;
  }
  if (sigilType === 'fang') {
    return <Crosshair size={38} color="#38bdf8" strokeWidth={2.2} style={{ filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.6))' }} />;
  }
  return <Skull size={38} color="var(--gold-amber)" strokeWidth={2.2} style={{ filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.6))' }} />;
};

export const DungeonTab = ({ state, onAttackBoss, onExtractShadow }) => {
  const { bosses, player } = state;
  const [weighInInput, setWeighInInput] = useState('');

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
      {/* Active Raid Encounter Card */}
      <div className="hud-card danger">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Swords size={16} color="var(--health-crimson)" />
            <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.74rem', color: 'var(--health-crimson)', fontWeight: 700, letterSpacing: '0.06em' }}>
              DUNGEON BOSS ENCOUNTER
            </span>
          </div>

          <span
            className="hunter-rank-crest"
            style={{
              borderColor: 'var(--health-crimson)',
              color: 'var(--health-crimson)',
              background: 'rgba(255, 42, 95, 0.15)',
              fontSize: '0.75rem',
            }}
          >
            {currentBoss.rank}
          </span>
        </div>

        {/* Boss Visual Insignia Arena */}
        <div style={{ textAlign: 'center', margin: '14px 0' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              margin: '0 auto',
              background: 'radial-gradient(circle, rgba(255, 42, 95, 0.25) 0%, rgba(14, 20, 32, 0.8) 70%)',
              border: '1px solid rgba(255, 42, 95, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(255, 42, 95, 0.2)',
            }}
          >
            <BossCrest sigilType={currentBoss.sigilType} rank={currentBoss.rank} />
          </div>

          <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginTop: 10, letterSpacing: '0.02em' }}>
            {currentBoss.name}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: 2 }}>
            {currentBoss.title}
          </div>
        </div>

        {/* Chamfered Segmented Boss HP Gauge */}
        <div className="gauge-container" style={{ margin: '12px 0' }}>
          <div className="gauge-header">
            <span style={{ color: 'var(--health-crimson)', fontWeight: 700 }}>
              BOSS INTEGRITY (Caloric Mass)
            </span>
            <span style={{ color: '#fff' }}>{hpRemaining} / {currentBoss.maxGrams} g</span>
          </div>
          <div className="gauge-rail-chamfer" style={{ height: 12 }}>
            <div className="gauge-fill boss" style={{ width: `${bossHpPct}%` }} />
          </div>
        </div>

        {/* Action Controls */}
        {hpRemaining === 0 && !currentBoss.defeated ? (
          <div style={{ marginTop: 14 }}>
            <button
              className="btn-hud btn-hud-monarch"
              style={{ width: '100%', padding: '12px 0', fontSize: '1.05rem', letterSpacing: '0.08em' }}
              onClick={() => onExtractShadow(currentBoss.id)}
            >
              <Sparkles size={18} />
              "ARISE!" EXTRACT {currentBoss.shadow.toUpperCase()}
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 12 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
              ⚔️ Log real weight shed to inflict proportional strike damage:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
              <button className="btn-hud" style={{ fontSize: '0.75rem', padding: '8px 4px' }} onClick={() => onAttackBoss(currentBoss.id, 100)}>
                -100g Strike
              </button>
              <button className="btn-hud" style={{ fontSize: '0.75rem', padding: '8px 4px' }} onClick={() => onAttackBoss(currentBoss.id, 250)}>
                -250g Cleave
              </button>
              <button className="btn-hud btn-hud-danger" style={{ fontSize: '0.75rem', padding: '8px 4px' }} onClick={() => onAttackBoss(currentBoss.id, 500)}>
                -500g Surge
              </button>
            </div>

            <form onSubmit={handleCustomAttack} style={{ display: 'flex', gap: 6 }}>
              <input
                type="number"
                placeholder="Custom weight burned (grams)"
                value={weighInInput}
                onChange={(e) => setWeighInInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--hud-border-cyan)',
                  borderRadius: 6,
                  padding: '8px 12px',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                }}
              />
              <button type="submit" className="btn-hud" style={{ padding: '8px 14px' }}>
                Slash
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Dungeon Gates Roster */}
      <div className="hud-card">
        <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.78rem', color: 'var(--mana-cyan)', letterSpacing: '0.06em', marginBottom: 12 }}>
          DUNGEON CAMPAIGN PROGRESSION
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
                borderRadius: 6,
                background: b.defeated ? 'rgba(16, 185, 129, 0.06)' : b.id === currentBoss.id ? 'rgba(255, 42, 95, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${b.defeated ? 'rgba(16, 185, 129, 0.3)' : b.id === currentBoss.id ? 'var(--hud-border-cyan)' : 'var(--hud-border-dark)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 4, background: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BossCrest sigilType={b.sigilType} rank={b.rank} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-hud)', fontWeight: 600, fontSize: '0.86rem', color: '#fff' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                    Gate HP: {b.maxGrams}g Mass • Reward: +{b.rewardExp} EXP
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: b.defeated ? 'var(--clear-green)' : b.id === currentBoss.id ? 'var(--mana-cyan)' : 'var(--text-faint)',
                }}
              >
                {b.defeated ? 'CLEARED ✓' : b.id === currentBoss.id ? 'ENGAGED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
