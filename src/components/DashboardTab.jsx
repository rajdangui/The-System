import React from 'react';
import { Droplets, Candy, Scale, Flame, ShieldAlert, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { playSound } from '../utils/audio';

export const DashboardTab = ({
  state,
  sergeant,
  onNavigate,
  onAddWater,
  onOpenCravingModal,
  onTogglePenalty,
}) => {
  const { waterConsumed, sugarConsumed, penalties } = state.today;
  const { waterGoal, sugarLimit, startWeight, targetWeight } = state.settings;
  const latestWeight = state.weightLogs?.[state.weightLogs.length - 1]?.weight || startWeight;

  const waterPct = Math.min(100, Math.round((waterConsumed / waterGoal) * 100));
  const sugarRemaining = Math.max(0, sugarLimit - sugarConsumed);
  const sugarPct = Math.min(100, Math.round((sugarConsumed / sugarLimit) * 100));

  // Weight progress
  const totalWeightToLose = Math.max(0.1, startWeight - targetWeight);
  const weightLost = Math.max(0, startWeight - latestWeight);
  const weightProgressPct = Math.min(100, Math.round((weightLost / totalWeightToLose) * 100));

  const isSugarDanger = sugarConsumed >= sugarLimit;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 3 Metric Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Water Card */}
        <div
          className="glass-card"
          onClick={() => onNavigate('hydration')}
          style={{ cursor: 'pointer', padding: 14 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-core)', textTransform: 'uppercase' }}>
              Hydration
            </span>
            <Droplets size={16} color="var(--cyan-core)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            {waterConsumed} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {waterGoal} ml</span>
          </div>
          <div className="progress-rail" style={{ marginTop: 8 }}>
            <div className="progress-fill cyan" style={{ width: `${waterPct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>{waterPct}%</span>
            <span>Target: {sergeant.expectedPct}%</span>
          </div>
        </div>

        {/* Sugar Card */}
        <div
          className={`glass-card ${isSugarDanger ? 'critical-alert' : ''}`}
          onClick={() => onNavigate('sugar')}
          style={{ cursor: 'pointer', padding: 14 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isSugarDanger ? 'var(--crimson-core)' : 'var(--amber-core)',
                textTransform: 'uppercase',
              }}
            >
              Sugar Warden
            </span>
            <Candy size={16} color={isSugarDanger ? 'var(--crimson-core)' : 'var(--amber-core)'} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            {sugarConsumed}g <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {sugarLimit}g</span>
          </div>
          <div className="progress-rail" style={{ marginTop: 8 }}>
            <div
              className={`progress-fill ${isSugarDanger ? 'crimson' : 'amber'}`}
              style={{ width: `${sugarPct}%` }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>{isSugarDanger ? 'OVER LIMIT' : `${sugarRemaining}g left`}</span>
            <span>Max {sugarLimit}g</span>
          </div>
        </div>
      </div>

      {/* Weight Tracker Highlight Card */}
      <div
        className="glass-card"
        onClick={() => onNavigate('weight')}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Scale size={16} color="var(--emerald-core)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-core)', textTransform: 'uppercase' }}>
              Scale Sentinel
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>
            {latestWeight} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{state.settings.unit}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {weightLost.toFixed(1)} {state.settings.unit} dropped ({weightProgressPct}% of goal reached)
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Goal</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--emerald-core)' }}>
            {targetWeight} {state.settings.unit}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--cyan-core)', marginTop: 2 }}>
            Tap for Projections →
          </div>
        </div>
      </div>

      {/* Craving SOS Emergency Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255, 42, 95, 0.15), rgba(157, 78, 221, 0.15))',
          border: '1px solid rgba(255, 42, 95, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>
            <ShieldAlert size={18} color="var(--crimson-core)" />
            <span>Craving Sugar or Snacks?</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Trigger the 3-Minute Dopamine Reset
          </div>
        </div>
        <button className="btn btn-danger btn-pill" onClick={onOpenCravingModal}>
          SOS Reset
        </button>
      </div>

      {/* Quick Water Logging Bar */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Hydration Log
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--cyan-core)' }}>Tap to Add</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[250, 350, 500, 750].map((amt) => (
            <button
              key={amt}
              className="quick-btn"
              onClick={() => onAddWater(amt, `Quick +${amt}ml`)}
            >
              <div className="quick-btn-amount">+{amt}</div>
              <div className="quick-btn-label">mL</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Penalties Box */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={16} color="var(--crimson-core)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--crimson-core)', textTransform: 'uppercase' }}>
              Discipline & Penalty Box
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {penalties.filter((p) => !p.completed).length} Pending
          </span>
        </div>

        {penalties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            ✨ No active penalties. Clean discipline record today!
          </div>
        ) : (
          penalties.map((pen) => (
            <div
              key={pen.id}
              className={`penalty-item ${pen.completed ? 'cleared' : ''}`}
              onClick={() => onTogglePenalty(pen.id)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', textDecoration: pen.completed ? 'line-through' : 'none' }}>
                  {pen.title} ({pen.reps})
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Reason: {pen.reason}
                </div>
              </div>
              <div style={{ color: pen.completed ? 'var(--emerald-core)' : 'var(--crimson-core)' }}>
                {pen.completed ? <CheckCircle size={20} /> : <div style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid var(--crimson-core)' }} />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
