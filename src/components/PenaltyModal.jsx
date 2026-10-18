import React, { useState } from 'react';
import { X, AlertOctagon, Skull, CheckCircle2, ShieldAlert } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

export const PenaltyModal = ({ isOpen, onClose, onClearPenalty, soundEnabled }) => {
  const [task1, setTask1] = useState(false);
  const [task2, setTask2] = useState(false);
  const [task3, setTask3] = useState(false);

  if (!isOpen) return null;

  const allChecked = task1 && task2 && task3;

  const handleSurvive = () => {
    playSystemSound('ding', soundEnabled);
    onClearPenalty();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          border: '2px solid var(--sys-red)',
          boxShadow: '0 0 50px var(--sys-red-glow)',
          background: 'linear-gradient(180deg, #1c070c 0%, #0a0205 100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Skull size={20} color="var(--sys-red)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: '0.88rem', color: 'var(--sys-red)' }}>
              [EMERGENCY PENALTY QUEST]
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '14px 0' }}>
          <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 15px var(--sys-red-glow))' }}>
            🦂
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>
            SURVIVE THE PENALTY WASTES
          </div>
          <div style={{ fontSize: '0.74rem', color: '#f87171', marginTop: 2 }}>
            The System has detected incomplete daily targets. You must complete the survival tasks below to escape the penalty zone!
          </div>
        </div>

        {/* Survival Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0' }}>
          <div
            onClick={() => setTask1(!task1)}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: task1 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 42, 95, 0.08)',
              border: `1px solid ${task1 ? 'var(--sys-green)' : 'rgba(255, 42, 95, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#fff' }}>1. 30 Bodyweight Squats / Burpees</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Outrun the giant poison centipedes</div>
            </div>
            {task1 ? <CheckCircle2 size={18} color="var(--sys-green)" /> : <div style={{ width: 16, height: 16, border: '1px solid #64748b', borderRadius: 4 }} />}
          </div>

          <div
            onClick={() => setTask2(!task2)}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: task2 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 42, 95, 0.08)',
              border: `1px solid ${task2 ? 'var(--sys-green)' : 'rgba(255, 42, 95, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#fff' }}>2. Chug 500 mL Cold Water Immediately</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Quench severe dehydration in the desert heat</div>
            </div>
            {task2 ? <CheckCircle2 size={18} color="var(--sys-green)" /> : <div style={{ width: 16, height: 16, border: '1px solid #64748b', borderRadius: 4 }} />}
          </div>

          <div
            onClick={() => setTask3(!task3)}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: task3 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 42, 95, 0.08)',
              border: `1px solid ${task3 ? 'var(--sys-green)' : 'rgba(255, 42, 95, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#fff' }}>3. 15-Minute Recovery Walk or March</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Survive until the System extraction portal opens</div>
            </div>
            {task3 ? <CheckCircle2 size={18} color="var(--sys-green)" /> : <div style={{ width: 16, height: 16, border: '1px solid #64748b', borderRadius: 4 }} />}
          </div>
        </div>

        <button
          className={`btn-system ${allChecked ? 'btn-monarch-system' : 'btn-danger-system'}`}
          style={{ width: '100%', padding: '12px 0', fontSize: '0.92rem' }}
          disabled={!allChecked}
          onClick={handleSurvive}
        >
          {allChecked ? 'SURVIVAL CONFIRMED // EXIT PENALTY ZONE' : 'COMPLETE ALL SURVIVAL TASKS FIRST'}
        </button>
      </div>
    </div>
  );
};
