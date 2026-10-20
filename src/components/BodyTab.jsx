import React, { useState } from 'react';
import { Scale, Trash2, Calendar, TrendingDown } from 'lucide-react';

export const BodyTab = ({
  state,
  onLogWeight,
  onDeleteWeightLog,
}) => {
  const { user, streakDays, weightHistory = [] } = state;
  const [inputWeight, setInputWeight] = useState('');
  const [showAllHistory, setShowAllHistory] = useState(true);

  const start = user.startWeight;
  const current = user.currentWeight;
  const target = user.targetWeight;

  const totalToLose = Math.max(0.1, start - target);
  const currentLost = Math.max(0, start - current);
  const remaining = Math.max(0, current - target);
  const progressPct = Math.min(100, Math.max(0, Math.round((currentLost / totalToLose) * 100)));

  // Estimate days remaining based on a steady healthy rate (~0.5 kg/week = ~0.07 kg/day)
  const daysToGoal = Math.round(remaining / 0.071);

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(inputWeight);
    if (!w || w <= 0) return;
    onLogWeight(w);
    setInputWeight('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Main Transformation Card */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Scale size={18} color="var(--calm-green)" />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--calm-green)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Body Composition & Weight
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                Physical Transformation
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--sovereign-gold)', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '3px 8px', background: 'rgba(251, 191, 36, 0.08)', borderRadius: 4 }}>
            {streakDays}d Streak
          </span>
        </div>

        {/* Start / Current / Goal 3-Column Grid */}
        <div className="deck-grid-3" style={{ marginBottom: 14 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 6px', borderRadius: 6, border: '1px solid var(--border-dormant)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.66rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>STARTING</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#cbd5e1' }}>
              {start} {user.unit}
            </div>
          </div>

          <div style={{ background: 'rgba(0, 240, 255, 0.04)', border: '1px solid var(--border-active-cyan)', padding: '12px 6px', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>CURRENT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
              {current} {user.unit}
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 6px', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--calm-green)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>TARGET</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--calm-green)' }}>
              {target} {user.unit}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="laser-meter-track" style={{ height: 8, marginBottom: 8 }}>
          <div
            className="laser-meter-fill"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #0284c7 0%, var(--calm-green) 100%)',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'var(--font-mono)', marginBottom: 14 }}>
          <span style={{ color: 'var(--calm-green)', fontWeight: 600 }}>
            <TrendingDown size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
            -{currentLost.toFixed(1)} {user.unit} shed ({progressPct}%)
          </span>
          <span>
            {remaining > 0 ? `${remaining.toFixed(1)} ${user.unit} remaining (~${daysToGoal} days)` : 'Goal Reached!'}
          </span>
        </div>

        {/* Log Weigh-In Form */}
        <form onSubmit={handleWeightSubmit} style={{ display: 'flex', gap: 6 }}>
          <input
            type="number"
            step="0.1"
            placeholder={`Log weigh-in today (${user.unit})...`}
            value={inputWeight}
            onChange={(e) => setInputWeight(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
          />
          <button type="submit" className="btn-sovereign" style={{ padding: '0 16px' }}>
            Record Weigh-In
          </button>
        </form>
      </div>

      {/* 2. Historical Weigh-in Timeline Table */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={15} color="var(--electric-cyan)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#cbd5e1', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Weigh-In History Archive ({weightHistory.length})
            </span>
          </div>
          <button
            onClick={() => setShowAllHistory(!showAllHistory)}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
          >
            {showAllHistory ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {showAllHistory && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {weightHistory.slice().reverse().map((wh, idx, arr) => {
              const prev = arr[idx + 1];
              const diff = prev ? (wh.weight - prev.weight).toFixed(1) : null;
              return (
                <div
                  key={wh.date}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem',
                    padding: '8px 10px',
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-dormant)',
                  }}
                >
                  <span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{wh.date}</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      {wh.weight} {user.unit}
                    </span>
                    {diff !== null && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          color: parseFloat(diff) <= 0 ? 'var(--calm-green)' : 'var(--lethal-red)',
                          minWidth: 46,
                          textAlign: 'right',
                        }}
                      >
                        {parseFloat(diff) > 0 ? `+${diff}` : diff}
                      </span>
                    )}
                    {weightHistory.length > 1 && (
                      <button
                        onClick={() => onDeleteWeightLog(wh.date)}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                        title="Delete log entry"
                        aria-label={`Delete entry for ${wh.date}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
