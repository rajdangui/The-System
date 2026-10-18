import React, { useState } from 'react';
import { X, Settings, RotateCcw, Save, ShieldAlert } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose, settings, onSave, onResetAll }) => {
  const [form, setForm] = useState({ ...settings });

  if (!isOpen) return null;

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Settings size={20} color="var(--cyan-core)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
              SENTINEL CONFIGURATION
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* User Name */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              SOLDIER / CALLSIGN
            </label>
            <input
              type="text"
              value={form.userName || ''}
              onChange={(e) => handleChange('userName', e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                color: '#fff',
                marginTop: 4,
              }}
            />
          </div>

          {/* Water Goal */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-core)' }}>
              DAILY WATER MANDATE (mL)
            </label>
            <input
              type="number"
              step="100"
              value={form.waterGoal}
              onChange={(e) => handleChange('waterGoal', parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                color: '#fff',
                marginTop: 4,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
              }}
            />
          </div>

          {/* Sugar Limit */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-core)' }}>
              MAX DAILY SUGAR CEILING (Grams)
            </label>
            <input
              type="number"
              step="1"
              value={form.sugarLimit}
              onChange={(e) => handleChange('sugarLimit', parseFloat(e.target.value))}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                color: '#fff',
                marginTop: 4,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
              }}
            />
          </div>

          {/* Weight Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                START WEIGHT ({form.unit})
              </label>
              <input
                type="number"
                step="0.1"
                value={form.startWeight}
                onChange={(e) => handleChange('startWeight', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  color: '#fff',
                  marginTop: 4,
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--emerald-core)' }}>
                GOAL WEIGHT ({form.unit})
              </label>
              <input
                type="number"
                step="0.1"
                value={form.targetWeight}
                onChange={(e) => handleChange('targetWeight', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  color: '#fff',
                  marginTop: 4,
                }}
              />
            </div>
          </div>

          {/* Height and Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                HEIGHT (cm)
              </label>
              <input
                type="number"
                value={form.heightCm || 178}
                onChange={(e) => handleChange('heightCm', parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  color: '#fff',
                  marginTop: 4,
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                UNIT PREFERENCE
              </label>
              <select
                value={form.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  color: '#fff',
                  marginTop: 4,
                }}
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="lbs">lbs (Pounds)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ flex: 1, fontSize: '0.8rem', color: 'var(--crimson-core)' }}
              onClick={() => {
                if (window.confirm('Reset all tracker records to default state?')) {
                  onResetAll();
                  onClose();
                }
              }}
            >
              <RotateCcw size={14} />
              Reset Data
            </button>
            <button type="submit" className="btn btn-primary-cyan" style={{ flex: 1.5 }}>
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
