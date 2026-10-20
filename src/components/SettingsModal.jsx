import React, { useState } from 'react';
import { X, Sliders, Save, RotateCcw, Download } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose, state, onSaveUserSettings, onResetAll }) => {
  const { user } = state;
  const [formData, setFormData] = useState({
    name: user.name || 'Operator',
    waterGoalMl: user.waterGoalMl || 3000,
    sugarLimitG: user.sugarLimitG || 25,
    startWeight: user.startWeight || 84.5,
    targetWeight: user.targetWeight || 75.0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveUserSettings(formData);
    onClose();
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `the_system_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sliders size={18} color="var(--electric-cyan)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.86rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em' }}>
              SYSTEM CONFIGURATION
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} aria-label="Close settings">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>PROFILE / USERNAME</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>

          <div className="deck-grid-2">
            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>DAILY WATER (mL)</label>
              <input
                type="number"
                value={formData.waterGoalMl}
                onChange={(e) => setFormData({ ...formData, waterGoalMl: parseInt(e.target.value, 10) || 0 })}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>SUGAR CAP (g)</label>
              <input
                type="number"
                value={formData.sugarLimitG}
                onChange={(e) => setFormData({ ...formData, sugarLimitG: parseInt(e.target.value, 10) || 0 })}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>
          </div>

          <div className="deck-grid-2">
            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>START WEIGHT ({user.unit})</label>
              <input
                type="number"
                step="0.1"
                value={formData.startWeight}
                onChange={(e) => setFormData({ ...formData, startWeight: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>TARGET WEIGHT ({user.unit})</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetWeight}
                onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-sovereign"
            style={{ width: '100%', minHeight: 40, marginTop: 6 }}
          >
            <Save size={15} /> Save Configuration
          </button>
        </form>

        <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-dormant)' }}>
          <button
            type="button"
            className="btn-sovereign btn-sovereign-ghost"
            style={{ flex: 1, fontSize: '0.74rem' }}
            onClick={handleExportData}
          >
            <Download size={13} /> Export Backup
          </button>

          <button
            type="button"
            className="btn-sovereign btn-sovereign-danger"
            style={{ flex: 1, fontSize: '0.74rem' }}
            onClick={() => {
              if (window.confirm('Reset all System data back to factory defaults?')) {
                onResetAll();
                onClose();
              }
            }}
          >
            <RotateCcw size={13} /> Factory Reset
          </button>
        </div>
      </div>
    </div>
  );
};
