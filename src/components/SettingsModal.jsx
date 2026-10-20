import React, { useState } from 'react';
import { X, Sliders, Save, RotateCcw, Download } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose, state, onSavePlayerSettings, onResetAll }) => {
  const [formData, setFormData] = useState({
    name: state.player.name,
    job: state.player.job,
    waterGoalMl: state.player.waterGoalMl,
    sugarLimitG: state.player.sugarLimitG,
    startWeight: state.player.startWeight,
    targetWeight: state.player.targetWeight,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSavePlayerSettings(formData);
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
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>HUNTER CALLSIGN</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', background: 'rgba(7, 9, 14, 0.8)', border: '1px solid var(--border-dormant)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: '0.85rem', marginTop: 4 }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>JOB DESIGNATION</label>
            <input
              type="text"
              value={formData.job}
              onChange={(e) => setFormData({ ...formData, job: e.target.value })}
              style={{ width: '100%', background: 'rgba(7, 9, 14, 0.8)', border: '1px solid var(--border-dormant)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: '0.85rem', marginTop: 4 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)' }}>WATER MANDATE (mL)</label>
              <input
                type="number"
                step="100"
                value={formData.waterGoalMl}
                onChange={(e) => setFormData({ ...formData, waterGoalMl: parseInt(e.target.value, 10) })}
                style={{ width: '100%', background: 'rgba(7, 9, 14, 0.8)', border: '1px solid var(--border-dormant)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginTop: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--sovereign-gold)', fontFamily: 'var(--font-mono)' }}>SUGAR CAP (g)</label>
              <input
                type="number"
                step="1"
                value={formData.sugarLimitG}
                onChange={(e) => setFormData({ ...formData, sugarLimitG: parseFloat(e.target.value) })}
                style={{ width: '100%', background: 'rgba(7, 9, 14, 0.8)', border: '1px solid var(--border-dormant)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginTop: 4 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>START WEIGHT ({state.player.unit})</label>
              <input
                type="number"
                step="0.1"
                value={formData.startWeight}
                onChange={(e) => setFormData({ ...formData, startWeight: parseFloat(e.target.value) })}
                style={{ width: '100%', background: 'rgba(7, 9, 14, 0.8)', border: '1px solid var(--border-dormant)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: '0.85rem', marginTop: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--calm-green)', fontFamily: 'var(--font-mono)' }}>TARGET WEIGHT ({state.player.unit})</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetWeight}
                onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) })}
                style={{ width: '100%', background: 'rgba(7, 9, 14, 0.8)', border: '1px solid var(--border-dormant)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: '0.85rem', marginTop: 4 }}
              />
            </div>
          </div>

          <button type="submit" className="btn-sovereign" style={{ width: '100%', minHeight: 38, marginTop: 4 }}>
            <Save size={15} /> Save Parameters
          </button>

          {/* Backup & Reset actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 10, borderTop: '1px solid var(--border-dormant)', paddingTop: 12 }}>
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
                if (window.confirm('Reset all Hunter progression and state to default?')) {
                  onResetAll();
                  onClose();
                }
              }}
            >
              <RotateCcw size={13} /> Factory Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
