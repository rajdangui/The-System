import React, { useState } from 'react';
import { Swords, Sparkles, Crown, Crosshair, Skull } from 'lucide-react';

const BossCrest = ({ sigilType }) => {
  if (sigilType === 'monarch') {
    return <Crown size={32} color="var(--sovereign-violet)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 10px var(--sovereign-violet))' }} />;
  }
  if (sigilType === 'knight') {
    return <Swords size={32} color="var(--lethal-red)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 10px var(--lethal-red))' }} />;
  }
  if (sigilType === 'fang') {
    return <Crosshair size={32} color="var(--ethereal-sky)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 10px var(--ethereal-sky))' }} />;
  }
  return <Skull size={32} color="var(--sovereign-gold)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 10px var(--sovereign-gold))' }} />;
};

export const DungeonTab = ({ state, onAttackBoss, onExtractShadow, onAddCustomBoss }) => {
  const { bosses } = state;
  const [weighInInput, setWeighInInput] = useState('');
  const [customName, setCustomName] = useState('');
  const [customGrams, setCustomGrams] = useState('');
  const [showAddBoss, setShowAddBoss] = useState(false);

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

  const handleCreateBoss = (e) => {
    e.preventDefault();
    const g = parseInt(customGrams, 10);
    if (!customName.trim() || !g || g <= 0) return;
    onAddCustomBoss(customName.trim(), g);
    setCustomName('');
    setCustomGrams('');
    setShowAddBoss(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Active Raid Card */}
      <div className="sovereign-card danger">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Swords size={15} color="var(--lethal-red)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--lethal-red)', fontWeight: 600, letterSpacing: '0.08em' }}>
              DUNGEON RAID IN PROGRESS
            </span>
          </div>

          <span
            className="hunter-rank-pill"
            style={{
              borderColor: 'var(--lethal-red)',
              color: 'var(--lethal-red)',
              background: 'rgba(255, 51, 102, 0.1)',
            }}
          >
            {currentBoss.rank} BOSS
          </span>
        </div>

        {/* Boss Insignia Display */}
        <div style={{ textAlign: 'center', margin: '12px 0' }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              margin: '0 auto',
              background: 'radial-gradient(circle, rgba(255, 51, 102, 0.2) 0%, rgba(18, 26, 43, 0.8) 70%)',
              border: '1px solid rgba(255, 51, 102, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(255, 51, 102, 0.2)',
            }}
          >
            <BossCrest sigilType={currentBoss.sigilType} />
          </div>

          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginTop: 10 }}>
            {currentBoss.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {currentBoss.title}
          </div>
        </div>

        {/* Laser Wireframe Boss HP Meter */}
        <div className="laser-meter" style={{ margin: '14px 0' }}>
          <div className="laser-meter-label">
            <span style={{ color: 'var(--lethal-red)', fontWeight: 600 }}>
              BOSS MASS (Fat to Incinerate)
            </span>
            <span style={{ color: '#fff' }}>{hpRemaining} / {currentBoss.maxGrams} g ({bossHpPct}%)</span>
          </div>
          <div className="laser-meter-track" style={{ height: 8 }}>
            <div className="laser-meter-fill boss" style={{ width: `${bossHpPct}%` }} />
          </div>
        </div>

        {/* Boss Actions */}
        {hpRemaining === 0 && !currentBoss.defeated ? (
          <div style={{ marginTop: 12 }}>
            <button
              className="btn-sovereign btn-sovereign-violet"
              style={{ width: '100%', minHeight: 44, fontSize: '0.95rem', letterSpacing: '0.06em' }}
              onClick={() => onExtractShadow(currentBoss.id)}
            >
              <Sparkles size={18} />
              "ARISE!" EXTRACT {currentBoss.shadow.toUpperCase()}
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 12, borderTop: '1px solid var(--border-dormant)', paddingTop: 10 }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: 8, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Swords size={13} color="var(--electric-cyan)" /> Strike damage from burned calories, grams & workouts:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
              <button className="btn-sovereign" style={{ fontSize: '0.74rem', padding: '6px 4px' }} onClick={() => onAttackBoss(currentBoss.id, 100)}>
                -100g Strike
              </button>
              <button className="btn-sovereign" style={{ fontSize: '0.74rem', padding: '6px 4px' }} onClick={() => onAttackBoss(currentBoss.id, 250)}>
                -250g Cleave
              </button>
              <button className="btn-sovereign btn-sovereign-danger" style={{ fontSize: '0.74rem', padding: '6px 4px' }} onClick={() => onAttackBoss(currentBoss.id, 500)}>
                -500g Slash
              </button>
            </div>

            <form onSubmit={handleCustomAttack} style={{ display: 'flex', gap: 6 }}>
              <input
                type="number"
                placeholder="Log grams burned (g)"
                value={weighInInput}
                onChange={(e) => setWeighInInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(7, 9, 14, 0.8)',
                  border: '1px solid var(--border-dormant)',
                  borderRadius: 6,
                  padding: '6px 10px',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                }}
              />
              <button type="submit" className="btn-sovereign" style={{ padding: '0 12px', fontSize: '0.76rem' }}>
                Slash
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Gates Roster & Custom Boss Adder */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em' }}>
            DUNGEON GATES ROSTER ({bosses.length})
          </span>
          <button
            onClick={() => setShowAddBoss(!showAddBoss)}
            style={{ background: 'none', border: 'none', color: 'var(--electric-cyan)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
          >
            {showAddBoss ? 'Cancel' : '+ Add Custom Boss'}
          </button>
        </div>

        {/* Add Custom Boss Form */}
        {showAddBoss && (
          <form onSubmit={handleCreateBoss} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12, padding: 10, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, border: '1px solid var(--border-dormant)' }}>
            <input
              type="text"
              placeholder="Boss Name (e.g. Cerberus of the Gate)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              style={{ background: 'rgba(7, 9, 14, 0.8)', border: '1px solid var(--border-dormant)', borderRadius: 6, padding: '6px 10px', color: '#fff', fontSize: '0.8rem' }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="number"
                placeholder="Grams to lose (e.g. 2000)"
                value={customGrams}
                onChange={(e) => setCustomGrams(e.target.value)}
                style={{ flex: 1, background: 'rgba(7, 9, 14, 0.8)', border: '1px solid var(--border-dormant)', borderRadius: 6, padding: '6px 10px', color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
              />
              <button type="submit" className="btn-sovereign" style={{ fontSize: '0.76rem', padding: '0 14px' }}>
                Create Gate
              </button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {bosses.map((b) => (
            <div
              key={b.id}
              className="interactive-item"
              style={{
                borderColor: b.defeated ? 'rgba(16, 185, 129, 0.3)' : b.id === currentBoss.id ? 'var(--border-active-cyan)' : 'var(--border-dormant)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BossCrest sigilType={b.sigilType} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.84rem', color: '#fff' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    Mass: {b.maxGrams}g • Shadow: {b.shadow}
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: b.defeated ? 'var(--calm-green)' : b.id === currentBoss.id ? 'var(--electric-cyan)' : '#64748b',
                }}
              >
                {b.defeated ? 'CLEARED ✓' : b.id === currentBoss.id ? 'ACTIVE' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
