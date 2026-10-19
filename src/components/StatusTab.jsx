import React, { useState } from 'react';
import { Heart, Droplets, Zap, Award, Scale, Trash2, Plus, Calendar, TrendingDown } from 'lucide-react';
import { getRankFromLevel, getTodayKey } from '../utils/soloStorage';

export const StatusTab = ({ state, onAllocateStat, onLogWeight, onDeleteWeightLog }) => {
  const { player, stats, today, streakDays, weightHistory } = state;
  const rank = getRankFromLevel(player.level);

  const [inputWeight, setInputWeight] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // MP is directly linked to Water intake
  const mpPct = Math.min(100, Math.round((today.waterMl / player.waterGoalMl) * 100));
  const expPct = Math.min(100, Math.round((player.exp / player.expNext) * 100));

  // Weight Progress Calculations
  const totalDifference = Math.max(0.1, player.startWeight - player.targetWeight);
  const currentLost = Math.max(0, player.startWeight - player.currentWeight);
  const remaining = Math.max(0, player.currentWeight - player.targetWeight);
  const progressPct = Math.min(100, Math.round((currentLost / totalDifference) * 100));

  // Days to target estimate at strict pace (0.75 kg/week)
  const daysToGoal = Math.ceil(remaining / (0.75 / 7));

  const statItems = [
    { key: 'str', label: 'STR', name: 'Strength', val: stats.str, desc: 'Conditioning, pushups & raw output' },
    { key: 'agi', label: 'AGI', name: 'Agility', val: stats.agi, desc: 'Movement pace & running endurance' },
    { key: 'vit', label: 'VIT', name: 'Vitality', val: stats.vit, desc: 'Hydration absorption & recovery rate' },
    { key: 'int', label: 'INT', name: 'Intelligence', val: stats.int, desc: 'Poison defense & sugar resistance' },
    { key: 'sen', label: 'SEN', name: 'Perception', val: stats.sen, desc: 'Discipline radar & scale vigilance' },
  ];

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(inputWeight);
    if (!w || w <= 0) return;
    onLogWeight(w);
    setInputWeight('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Player Header Card */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em' }}>
              STATUS // AWAKENED
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
              {player.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Title: <strong style={{ color: 'var(--sovereign-gold)' }}>{rank.title}</strong> • Job: <span style={{ color: '#fff' }}>{player.job}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              className="hunter-rank-pill"
              style={{
                borderColor: rank.color,
                color: rank.color,
                background: `${rank.color}15`,
              }}
            >
              {rank.rank}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--calm-green)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
              OPTIMAL
            </div>
          </div>
        </div>

        {/* Laser-Wireframe Gauges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {/* HP */}
          <div className="laser-meter">
            <div className="laser-meter-label">
              <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Heart size={12} fill="#38bdf8" /> HP (VITAL ENERGY)
              </span>
              <span style={{ color: '#fff' }}>{player.hp} / {player.maxHp}</span>
            </div>
            <div className="laser-meter-track">
              <div className="laser-meter-fill hp" style={{ width: `${(player.hp / player.maxHp) * 100}%` }} />
            </div>
          </div>

          {/* MP (Water Mana) */}
          <div className="laser-meter">
            <div className="laser-meter-label">
              <span style={{ color: 'var(--sovereign-violet)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Droplets size={12} fill="var(--sovereign-violet)" /> MP (WATER MANA CORE)
              </span>
              <span style={{ color: '#fff' }}>{today.waterMl} / {player.waterGoalMl} mL ({mpPct}%)</span>
            </div>
            <div className="laser-meter-track">
              <div className="laser-meter-fill mp" style={{ width: `${mpPct}%` }} />
            </div>
          </div>

          {/* EXP */}
          <div className="laser-meter">
            <div className="laser-meter-label">
              <span style={{ color: 'var(--ethereal-sky)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Zap size={12} fill="var(--ethereal-sky)" /> EXP (EXPERIENCE MATRIX)
              </span>
              <span style={{ color: '#fff' }}>{player.exp} / {player.expNext} ({expPct}%)</span>
            </div>
            <div className="laser-meter-track">
              <div className="laser-meter-fill exp" style={{ width: `${expPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Unallocated Stat Points Banner */}
      {player.unallocatedStats > 0 && (
        <div
          style={{
            background: 'rgba(251, 191, 36, 0.08)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={16} color="var(--sovereign-gold)" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>
              UNALLOCATED STAT POINTS: <span style={{ color: 'var(--sovereign-gold)' }}>+{player.unallocatedStats}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            Tap [+] to assign
          </span>
        </div>
      )}

      {/* Hunter Parameters (Stats) */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em' }}>
            HUNTER PARAMETERS
          </span>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Base Matrix
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {statItems.map((st) => (
            <div key={st.key} className="interactive-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem', color: '#fff', width: 34 }}>
                  {st.label}
                </span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8ea' }}>{st.name}</div>
                  <div style={{ fontSize: '0.66rem', color: '#64748b' }}>{st.desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--electric-cyan)' }}>
                  {st.val}
                </span>
                {player.unallocatedStats > 0 && (
                  <button
                    className="btn-sovereign"
                    style={{ minHeight: 26, width: 26, padding: 0, fontSize: '0.88rem' }}
                    onClick={() => onAllocateStat(st.key)}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Weight Metamorphosis Card */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Scale size={16} color="var(--electric-cyan)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em' }}>
              SCALE OF TRUTH // WEIGHT LOSS
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--sovereign-gold)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {streakDays}d Streak
          </span>
        </div>

        {/* Start, Current, Goal Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center', marginBottom: 12 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 4px', borderRadius: 6, border: '1px solid var(--border-dormant)' }}>
            <div style={{ fontSize: '0.64rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>INITIAL</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>
              {player.startWeight} {player.unit}
            </div>
          </div>

          <div style={{ background: 'rgba(0, 240, 255, 0.05)', border: '1px solid var(--border-active-cyan)', padding: '10px 4px', borderRadius: 6 }}>
            <div style={{ fontSize: '0.64rem', color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>CURRENT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              {player.currentWeight} {player.unit}
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 4px', borderRadius: 6 }}>
            <div style={{ fontSize: '0.64rem', color: 'var(--calm-green)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>TARGET</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--calm-green)' }}>
              {player.targetWeight} {player.unit}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="laser-meter-track" style={{ height: 6, marginBottom: 8 }}>
          <div className="laser-meter-fill exp" style={{ width: `${progressPct}%` }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
          <span style={{ color: 'var(--calm-green)' }}>-{currentLost.toFixed(1)} {player.unit} shed ({progressPct}%)</span>
          <span>~{daysToGoal} days to target</span>
        </div>

        {/* Dynamic Log Weigh-In Form */}
        <form onSubmit={handleWeightSubmit} style={{ display: 'flex', gap: 6 }}>
          <input
            type="number"
            step="0.1"
            placeholder={`Log weigh-in (${player.unit})`}
            value={inputWeight}
            onChange={(e) => setInputWeight(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(7, 9, 14, 0.8)',
              border: '1px solid var(--border-dormant)',
              borderRadius: 6,
              padding: '8px 12px',
              color: '#fff',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
            }}
          />
          <button type="submit" className="btn-sovereign" style={{ padding: '0 16px' }}>
            Record
          </button>
        </form>

        {/* History Toggle */}
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
          >
            {showHistory ? 'Hide Weigh-in Log ▲' : `View Weigh-in Log (${(weightHistory || []).length}) ▼`}
          </button>
        </div>

        {/* Weigh-in History List */}
        {showHistory && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, borderTop: '1px solid var(--border-dormant)', paddingTop: 10 }}>
            {(weightHistory || []).slice().reverse().map((wh) => (
              <div key={wh.date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '4px 6px' }}>
                <span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{wh.date}</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{wh.weight} {player.unit}</span>
                {weightHistory.length > 1 && (
                  <button
                    onClick={() => onDeleteWeightLog(wh.date)}
                    style={{ background: 'none', border: 'none', color: 'var(--lethal-red)', cursor: 'pointer', padding: 2 }}
                    title="Delete record"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
