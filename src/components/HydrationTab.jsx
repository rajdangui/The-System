import React, { useState } from 'react';
import { Droplets, Bell, Clock, Trash2, Plus, Check, RefreshCw, Award } from 'lucide-react';
import { playSound } from '../utils/audio';

export const HydrationTab = ({ state, sergeant, onAddWater, onRemoveWaterLog, onUpdateGoal }) => {
  const { waterConsumed, waterLogs } = state.today;
  const { waterGoal, reminderIntervalMins, reminderActive, soundEnabled } = state.settings;
  const [customAmount, setCustomAmount] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [reminderTestMsg, setReminderTestMsg] = useState('');

  const pct = Math.min(100, Math.round((waterConsumed / waterGoal) * 100));
  const remaining = Math.max(0, waterGoal - waterConsumed);

  // Hourly checkpoints
  const checkpoints = [
    { time: '09:00', targetPct: 20, label: 'Morning Kickoff' },
    { time: '12:00', targetPct: 40, label: 'Mid-Day Hydration' },
    { time: '15:00', targetPct: 65, label: 'Afternoon Slump Defense' },
    { time: '18:00', targetPct: 85, label: 'Evening Peak' },
    { time: '21:00', targetPct: 100, label: 'Final Flush' },
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(customAmount, 10);
    if (!val || val <= 0) return;
    onAddWater(val, customLabel || 'Custom Drink');
    setCustomAmount('');
    setCustomLabel('');
  };

  const testReminder = () => {
    playSound('whistle', soundEnabled);
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('STRICT // Water Sentinel', {
          body: `ATTENTION! Checkpoint alert: You have ${remaining} mL remaining to reach today's goal!`,
          icon: '/favicon.svg',
        });
        setReminderTestMsg('🔔 Test notification fired!');
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('STRICT // Water Sentinel', {
              body: `Sentinel active. Drink water on schedule, soldier!`,
              icon: '/favicon.svg',
            });
            setReminderTestMsg('✅ Notifications enabled & alert fired!');
          } else {
            setReminderTestMsg('⚠️ Notification permission was blocked.');
          }
        });
      }
    } else {
      setReminderTestMsg('🔔 Alarm sound test complete!');
    }
    setTimeout(() => setReminderTestMsg(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Animated Water Cylinder Container */}
      <div className="glass-card water-cylinder-card">
        <div className="water-cap" />
        <div className="water-bottle-container">
          {/* Tick marks */}
          <div className="water-tick-marks">
            <span>{waterGoal}ml</span>
            <span>{Math.round(waterGoal * 0.75)}ml</span>
            <span>{Math.round(waterGoal * 0.5)}ml</span>
            <span>{Math.round(waterGoal * 0.25)}ml</span>
            <span>0</span>
          </div>

          {/* Fluid fill */}
          <div className="water-fluid" style={{ height: `${pct}%` }}>
            <div className="water-wave" />
          </div>

          {/* Inner status text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              pointerEvents: 'none',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
              {pct}%
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-core)', textTransform: 'uppercase' }}>
              {remaining === 0 ? 'GOAL MET' : `${remaining} ml left`}
            </span>
          </div>
        </div>

        {/* Big Volume Label */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>
            {waterConsumed} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {waterGoal} mL</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Daily Water Requirement
          </div>
        </div>

        {/* Quick Add Grid */}
        <div className="quick-add-grid">
          {[
            { amount: 200, label: 'Cup' },
            { amount: 350, label: 'Glass' },
            { amount: 500, label: 'Bottle' },
            { amount: 750, label: 'Shaker' },
            { amount: 1000, label: 'Pitcher' },
            { amount: -250, label: 'Undo/Sub' },
          ].map((item) => (
            <button
              key={item.label}
              className="quick-btn"
              onClick={() => {
                if (item.amount < 0) {
                  onAddWater(item.amount, 'Correction');
                } else {
                  onAddWater(item.amount, item.label);
                }
              }}
            >
              <div
                className="quick-btn-amount"
                style={{ color: item.amount < 0 ? 'var(--crimson-core)' : 'var(--cyan-core)' }}
              >
                {item.amount > 0 ? `+${item.amount}` : item.amount}
              </div>
              <div className="quick-btn-label">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Volume Add Modal Form */}
      <div className="glass-card">
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 10 }}>
          Custom Water Amount
        </div>
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            placeholder="Amount in mL"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
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
          <input
            type="text"
            placeholder="Note (e.g., Cold Lemon)"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
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
          <button type="submit" className="btn btn-primary-cyan" style={{ padding: '0 14px' }}>
            <Plus size={18} />
          </button>
        </form>
      </div>

      {/* Hourly Schedule Checkpoint Tracker */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={16} color="var(--cyan-core)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Hourly Discipline Checkpoints
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Required Pace</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {checkpoints.map((cp) => {
            const isMet = pct >= cp.targetPct;
            return (
              <div
                key={cp.time}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: isMet ? 'rgba(0, 255, 157, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isMet ? 'rgba(0, 255, 157, 0.25)' : 'var(--border-subtle)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.88rem', color: isMet ? 'var(--emerald-core)' : '#fff' }}>
                    {cp.time}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{cp.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Target: {Math.round((cp.targetPct / 100) * waterGoal)} mL ({cp.targetPct}%)
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isMet ? 'var(--emerald-core)' : 'var(--text-muted)' }}>
                  {isMet ? 'PASSED ✓' : 'PENDING'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reminder Setting & Test Alarm */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Bell size={16} color="var(--amber-core)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Strict Nudge Reminders
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--emerald-core)', fontWeight: 700 }}>
            Every {reminderIntervalMins} Mins
          </span>
        </div>

        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Triggers audio whistles & notification banners to enforce your hydration cadence.
        </div>

        <button className="btn btn-ghost" style={{ width: '100%', fontSize: '0.85rem' }} onClick={testReminder}>
          <Bell size={15} color="var(--amber-core)" />
          Test Drill Alert Alarm Now
        </button>

        {reminderTestMsg && (
          <div style={{ marginTop: 8, fontSize: '0.76rem', textAlign: 'center', color: 'var(--cyan-core)', fontWeight: 600 }}>
            {reminderTestMsg}
          </div>
        )}
      </div>

      {/* Today's Intake History Log */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Today's Log Archive ({waterLogs.length})
          </span>
        </div>

        {waterLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            No logs recorded yet today. First drink counts double towards discipline!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {waterLogs.slice().reverse().map((log) => (
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
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>+{log.amount} mL</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                    {log.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{log.time}</span>
                  <button
                    onClick={() => onRemoveWaterLog(log.id)}
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
