import React, { useState } from 'react';
import { Candy, AlertTriangle, ShieldCheck, Plus, Trash2, Zap, HeartPulse, Flame, Skull } from 'lucide-react';
import { playSound, triggerHaptic } from '../utils/audio';

export const SugarTab = ({ state, sergeant, onAddSugar, onRemoveSugarLog, onOpenCravingModal }) => {
  const { sugarConsumed, sugarLogs, cravingResistedCount } = state.today;
  const { sugarLimit, soundEnabled } = state.settings;

  const [customItem, setCustomItem] = useState('');
  const [customGrams, setCustomGrams] = useState('');

  const remaining = Math.max(0, sugarLimit - sugarConsumed);
  const isOver = sugarConsumed > sugarLimit;
  const pct = Math.min(100, Math.round((sugarConsumed / sugarLimit) * 100));

  // High Sugar Presets
  const sugarTraps = [
    { name: 'Soda Can (330ml)', grams: 39, icon: '🥤', penalty: 'High Danger' },
    { name: 'Boba / Milk Tea', grams: 45, icon: '🧋', penalty: 'Immediate Breach' },
    { name: 'Chocolate Bar', grams: 24, icon: '🍫', penalty: 'Daily Limit' },
    { name: 'Donut / Pastry', grams: 28, icon: '🍩', penalty: 'High Sugar' },
    { name: 'Energy Drink', grams: 29, icon: '⚡', penalty: 'Spike Risk' },
    { name: 'Flavored Latte', grams: 22, icon: '☕', penalty: 'Hidden Trap' },
    { name: 'Ice Cream Scoop', grams: 21, icon: '🍨', penalty: 'High Fat+Sugar' },
    { name: 'Fruit Juice Box', grams: 26, icon: '🧃', penalty: 'Liquid Fructose' },
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const g = parseFloat(customGrams);
    if (!g || g <= 0) return;
    onAddSugar(g, customItem || 'Sweet Snack');
    setCustomItem('');
    setCustomGrams('');
  };

  // Estimate calories spared (assuming standard baseline would have been ~60g sugar per day without tracking)
  const estimatedSugarAvoidedGrams = Math.max(0, 60 - sugarConsumed);
  const caloriesSpared = estimatedSugarAvoidedGrams * 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Gauge Card */}
      <div className={`glass-card ${isOver ? 'critical-alert shake-active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Candy size={18} color={isOver ? 'var(--crimson-core)' : 'var(--amber-core)'} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Sugar Warden
            </span>
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 4,
              background: isOver ? 'rgba(255, 42, 95, 0.2)' : 'rgba(255, 184, 0, 0.15)',
              color: isOver ? 'var(--crimson-core)' : 'var(--amber-core)',
            }}
          >
            {isOver ? 'BREACH ACTIVE' : 'MONITORED'}
          </span>
        </div>

        {/* Big Numbers */}
        <div style={{ textAlign: 'center', margin: '14px 0' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              fontWeight: 900,
              color: isOver ? 'var(--crimson-core)' : '#fff',
            }}
          >
            {sugarConsumed} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {sugarLimit} g</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: isOver ? 'var(--crimson-core)' : 'var(--text-secondary)' }}>
            {isOver
              ? `🚨 BREACH: ${sugarConsumed - sugarLimit}g over strict daily limit!`
              : `🛡️ ${remaining}g allowance remaining today`}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-rail" style={{ height: 14 }}>
          <div
            className={`progress-fill ${isOver ? 'crimson' : pct > 75 ? 'amber' : 'emerald'}`}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>0g Clean</span>
          <span>Warning: {Math.round(sugarLimit * 0.75)}g</span>
          <span>Max Limit: {sugarLimit}g</span>
        </div>
      </div>

      {/* Craving Buster Emergency SOS Button */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 42, 95, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          borderColor: 'rgba(255, 42, 95, 0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
              Craving Sugar Right Now?
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Stop the impulse before you regret it.
            </div>
          </div>
          <button className="btn btn-danger" onClick={onOpenCravingModal}>
            <Zap size={16} />
            SOS Delay
          </button>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Cravings Crushed Today: <strong style={{ color: 'var(--emerald-core)' }}>{cravingResistedCount}</strong>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Est. Calories Spared: <strong style={{ color: 'var(--cyan-core)' }}>~{caloriesSpared} kcal</strong>
          </div>
        </div>
      </div>

      {/* Traps Presets */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Sugar Traps & Hidden Offenders
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--crimson-core)' }}>Tap to log</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {sugarTraps.map((trap) => (
            <button
              key={trap.name}
              className="quick-btn"
              style={{ alignItems: 'flex-start', padding: '10px 12px' }}
              onClick={() => onAddSugar(trap.grams, trap.name)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: '1.3rem' }}>{trap.icon}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: trap.grams >= sugarLimit ? 'var(--crimson-core)' : 'var(--amber-core)',
                  }}
                >
                  +{trap.grams}g
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', textAlign: 'left', marginTop: 4 }}>
                {trap.name}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{trap.penalty}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Sugar Log */}
      <div className="glass-card">
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 10 }}>
          Custom Sugar Entry
        </div>
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Item (e.g. Cookie)"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            style={{
              flex: 1.2,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.9rem',
            }}
          />
          <input
            type="number"
            step="0.5"
            placeholder="Grams (g)"
            value={customGrams}
            onChange={(e) => setCustomGrams(e.target.value)}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-display)',
            }}
          />
          <button type="submit" className="btn btn-ghost" style={{ padding: '0 14px' }}>
            <Plus size={18} />
          </button>
        </form>
      </div>

      {/* Sugar Logs Archive */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Today's Sugar Records ({sugarLogs.length})
          </span>
        </div>

        {sugarLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--emerald-core)', fontSize: '0.85rem', fontWeight: 600 }}>
            🛡️ Flawless zero-sugar day so far. Keep this shield guarded!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sugarLogs.slice().reverse().map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--amber-core)' }}>
                    +{log.grams}g
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#fff', marginLeft: 8 }}>{log.item}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.time}</span>
                  <button
                    onClick={() => onRemoveSugarLog(log.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--crimson-core)', cursor: 'pointer', padding: 2 }}
                    title="Delete log"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
