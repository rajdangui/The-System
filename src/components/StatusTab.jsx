import React from 'react';
import { Shield, Sparkles, Droplets, Heart, Zap, Award, Flame, ChevronRight, Activity, Target } from 'lucide-react';
import { getRankFromLevel } from '../utils/soloStorage';

export const StatusTab = ({ state, onAllocateStat }) => {
  const { player, stats, today, streakDays } = state;
  const rank = getRankFromLevel(player.level);

  // MP is directly linked to Water intake
  const mpPct = Math.min(100, Math.round((today.waterMl / player.waterGoalMl) * 100));
  const expPct = Math.min(100, Math.round((player.exp / player.expNext) * 100));

  const statItems = [
    { key: 'str', label: 'STR', name: 'Strength', val: stats.str, desc: 'Conditioning, pushups & raw output' },
    { key: 'agi', label: 'AGI', name: 'Agility', val: stats.agi, desc: 'Movement pace & running endurance' },
    { key: 'vit', label: 'VIT', name: 'Vitality', val: stats.vit, desc: 'Hydration absorption & recovery rate' },
    { key: 'int', label: 'INT', name: 'Intelligence', val: stats.int, desc: 'Poison defense & sugar resistance' },
    { key: 'sen', label: 'SEN', name: 'Perception', val: stats.sen, desc: 'Discipline radar & scale vigilance' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* System Status Banner */}
      <div
        className="hud-card"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 25, 42, 0.95) 0%, rgba(6, 12, 22, 0.95) 100%)',
          borderColor: 'rgba(0, 229, 255, 0.35)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mana-cyan)', boxShadow: '0 0 8px var(--mana-cyan)' }} />
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.72rem', color: 'var(--mana-cyan)', letterSpacing: '0.08em' }}>
                STATUS WINDOW ACTIVE
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.45rem', fontWeight: 700, color: '#fff', letterSpacing: '0.03em' }}>
              {player.name}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: 2 }}>
              Title: <strong style={{ color: 'var(--gold-amber)' }}>{rank.title}</strong> • Job: <span style={{ color: '#fff' }}>{player.job}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              className="hunter-rank-crest"
              style={{
                borderColor: rank.color,
                color: rank.color,
                background: `linear-gradient(135deg, ${rank.color}25 0%, transparent 100%)`,
                fontSize: '0.85rem',
              }}
            >
              {rank.rank}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--clear-green)', fontWeight: 600, marginTop: 4 }}>
              AWAKENED
            </div>
          </div>
        </div>

        {/* Chamfered RPG Gauges: HP, MP, EXP */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {/* HP Gauge */}
          <div className="gauge-container">
            <div className="gauge-header">
              <span style={{ color: 'var(--health-crimson)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Heart size={13} fill="var(--health-crimson)" /> HP (Health Points)
              </span>
              <span style={{ color: '#fff' }}>{player.hp} / {player.maxHp}</span>
            </div>
            <div className="gauge-rail-chamfer">
              <div className="gauge-fill hp" style={{ width: `${(player.hp / player.maxHp) * 100}%` }} />
            </div>
          </div>

          {/* MP Gauge (Water Mana) */}
          <div className="gauge-container">
            <div className="gauge-header">
              <span style={{ color: 'var(--mana-cyan)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Droplets size={13} fill="var(--mana-cyan)" /> MP (Water Mana Pool)
              </span>
              <span style={{ color: '#fff' }}>{today.waterMl} / {player.waterGoalMl} mL ({mpPct}%)</span>
            </div>
            <div className="gauge-rail-chamfer">
              <div className="gauge-fill mp" style={{ width: `${mpPct}%` }} />
            </div>
          </div>

          {/* EXP Gauge */}
          <div className="gauge-container">
            <div className="gauge-header">
              <span style={{ color: 'var(--monarch-purple)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Zap size={13} fill="var(--monarch-purple)" /> EXP (Experience Core)
              </span>
              <span style={{ color: '#fff' }}>{player.exp} / {player.expNext} ({expPct}%)</span>
            </div>
            <div className="gauge-rail-chamfer">
              <div className="gauge-fill exp" style={{ width: `${expPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Unallocated Stat Points Banner */}
      {player.unallocatedStats > 0 && (
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(14, 20, 32, 0.9) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={18} color="var(--gold-amber)" />
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.84rem', color: '#fff', fontWeight: 600 }}>
              UNALLOCATED POINTS: <span style={{ color: 'var(--gold-amber)' }}>+{player.unallocatedStats}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Tap [+] to assign
          </span>
        </div>
      )}

      {/* Stats Board */}
      <div className="hud-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.78rem', color: 'var(--mana-cyan)', letterSpacing: '0.06em' }}>
            HUNTER PARAMETERS
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Base Attribute Matrix
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {statItems.map((st) => (
            <div key={st.key} className="stat-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-hud)', fontWeight: 700, fontSize: '0.86rem', color: '#fff', width: 36 }}>
                  {st.label}
                </span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                    {st.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)' }}>{st.desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-hud)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--mana-cyan)' }}>
                  {st.val}
                </span>
                {player.unallocatedStats > 0 && (
                  <button
                    className="btn-stat-chamfer"
                    onClick={() => onAllocateStat(st.key)}
                    title={`Allocate +1 to ${st.label}`}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Metamorphosis Attributes */}
      <div className="hud-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.78rem', color: 'var(--mana-cyan)', letterSpacing: '0.06em' }}>
            VESSEL CALIBRATION
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--gold-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {streakDays} Day Awakening Streak
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 4px', borderRadius: 6, border: '1px solid var(--hud-border-dark)' }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-faint)', fontFamily: 'var(--font-hud)' }}>INITIAL</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-bright)' }}>
              {player.startWeight} {player.unit}
            </div>
          </div>

          <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid var(--hud-border-cyan)', padding: '10px 4px', borderRadius: 6 }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--mana-cyan)', fontFamily: 'var(--font-hud)', fontWeight: 700 }}>CURRENT</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              {player.currentWeight} {player.unit}
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 4px', borderRadius: 6 }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--clear-green)', fontFamily: 'var(--font-hud)', fontWeight: 700 }}>TARGET</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--clear-green)' }}>
              {player.targetWeight} {player.unit}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', borderTop: '1px solid var(--hud-border-dark)', paddingTop: 10 }}>
          Metamorphosis Progress: <strong style={{ color: 'var(--mana-cyan)' }}>{(player.startWeight - player.currentWeight).toFixed(1)} {player.unit}</strong> stripped from physical vessel.
        </div>
      </div>
    </div>
  );
};
