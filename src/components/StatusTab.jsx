import React from 'react';
import { Shield, Sparkles, Droplets, Heart, Zap, Award, Flame, ChevronRight } from 'lucide-react';
import { getRankFromLevel } from '../utils/soloStorage';

export const StatusTab = ({ state, onAllocateStat, onTriggerLevelUp }) => {
  const { player, stats, today, streakDays } = state;
  const rank = getRankFromLevel(player.level);

  // MP is directly linked to Water intake
  const mpPct = Math.min(100, Math.round((today.waterMl / player.waterGoalMl) * 100));
  const expPct = Math.min(100, Math.round((player.exp / player.expNext) * 100));

  const statItems = [
    { key: 'str', label: 'STR (Strength)', val: stats.str, desc: 'Conditioning, pushups & power' },
    { key: 'agi', label: 'AGI (Agility)', val: stats.agi, desc: 'Speed, running & daily steps' },
    { key: 'vit', label: 'VIT (Vitality)', val: stats.vit, desc: 'Hydration absorption & stamina' },
    { key: 'int', label: 'INT (Intelligence)', val: stats.int, desc: 'Poison defense & sugar control' },
    { key: 'sen', label: 'SEN (Perception)', val: stats.sen, desc: 'Scale truth & discipline radar' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* System Notification Box */}
      <div className="system-dialog-box">
        <div className="system-dialog-header">
          <Sparkles size={13} />
          <span>[SYSTEM NOTICE]</span>
        </div>
        <div className="system-dialog-msg">
          Welcome back, Player <strong style={{ color: 'var(--sys-cyan)' }}>{player.name}</strong>. Daily Quests are currently active. Failure to complete will result in a Penalty Quest.
        </div>
      </div>

      {/* Main Status Window */}
      <div className="system-card">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--sys-cyan)', letterSpacing: '0.06em' }}>
              [PLAYER STATUS]
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginTop: 2 }}>
              {player.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Title: <strong style={{ color: 'var(--sys-gold)' }}>{rank.title}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              className="hunter-rank-badge"
              style={{
                borderColor: rank.color,
                color: rank.color,
                background: `${rank.color}15`,
                fontSize: '0.85rem',
              }}
            >
              {rank.rank}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
              Job: {player.job}
            </div>
          </div>
        </div>

        {/* HP, MP, EXP Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '14px 0' }}>
          {/* HP */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
              <span style={{ color: 'var(--sys-red)', fontWeight: 700 }}>HP (Health Points)</span>
              <span>{player.hp} / {player.maxHp}</span>
            </div>
            <div className="stat-rail">
              <div className="stat-fill hp" style={{ width: `${(player.hp / player.maxHp) * 100}%` }} />
            </div>
          </div>

          {/* MP (Water Mana) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
              <span style={{ color: 'var(--sys-cyan)', fontWeight: 700 }}>
                MP (Water Mana Reservoir)
              </span>
              <span>{today.waterMl} / {player.waterGoalMl} mL</span>
            </div>
            <div className="stat-rail">
              <div className="stat-fill mp" style={{ width: `${mpPct}%` }} />
            </div>
          </div>

          {/* EXP */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
              <span style={{ color: 'var(--sys-purple)', fontWeight: 700 }}>EXP (Experience)</span>
              <span>{player.exp} / {player.expNext} ({expPct}%)</span>
            </div>
            <div className="stat-rail">
              <div className="stat-fill exp" style={{ width: `${expPct}%` }} />
            </div>
          </div>
        </div>

        {/* Unallocated Stat Points Alert */}
        {player.unallocatedStats > 0 && (
          <div
            style={{
              background: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: 8,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--sys-gold)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              ★ Unallocated Stat Points: {player.unallocatedStats}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#fff', opacity: 0.8 }}>Tap [+] to assign</span>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {statItems.map((st) => (
            <div
              key={st.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 8,
                background: 'rgba(0, 229, 255, 0.04)',
                border: '1px solid var(--sys-border-subtle)',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.84rem', color: '#fff' }}>
                  {st.label}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{st.desc}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', color: 'var(--sys-cyan)' }}>
                  {st.val}
                </span>
                {player.unallocatedStats > 0 && (
                  <button
                    className="btn-stat-plus"
                    onClick={() => onAllocateStat(st.key)}
                    title={`Increase ${st.key.toUpperCase()} +1`}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hunter Conditioning & Physical Metrics */}
      <div className="system-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--sys-cyan)', letterSpacing: '0.06em' }}>
            [PHYSICAL ATTRIBUTES]
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--sys-gold)', fontWeight: 700 }}>
            {streakDays} Day Awakening Streak
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
          <div style={{ background: 'rgba(0, 229, 255, 0.05)', padding: '10px 4px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>START WEIGHT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900 }}>
              {player.startWeight} {player.unit}
            </div>
          </div>

          <div style={{ background: 'rgba(0, 229, 255, 0.12)', border: '1px solid var(--sys-border)', padding: '10px 4px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--sys-cyan)', fontWeight: 700 }}>CURRENT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
              {player.currentWeight} {player.unit}
            </div>
          </div>

          <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '10px 4px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--sys-green)', fontWeight: 700 }}>TARGET GOAL</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: 'var(--sys-green)' }}>
              {player.targetWeight} {player.unit}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, textAlign: 'center', fontSize: '0.76rem', color: '#94a3b8' }}>
          Metamorphosis: <strong style={{ color: 'var(--sys-cyan)' }}>{(player.startWeight - player.currentWeight).toFixed(1)} {player.unit}</strong> shed from mortal vessel!
        </div>
      </div>
    </div>
  );
};
