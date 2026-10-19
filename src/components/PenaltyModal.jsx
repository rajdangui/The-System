import React, { useState } from 'react';
import { X, Skull, CheckCircle2, AlertOctagon, Activity, ShieldAlert } from 'lucide-react';
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
          border: '1px solid var(--health-crimson)',
          boxShadow: '0 0 50px rgba(255, 42, 95, 0.3)',
          background: 'linear-gradient(180deg, #18080f 0%, #0a0306 100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertOctagon size={18} color="var(--health-crimson)" />
            <span style={{ fontFamily: 'var(--font-hud)', fontWeight: 700, fontSize: '0.86rem', color: 'var(--health-crimson)', letterSpacing: '0.06em' }}>
              PENALTY QUEST // RED ZONE ENFORCEMENT
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '14px 0' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              margin: '0 auto',
              background: 'radial-gradient(circle, rgba(255, 42, 95, 0.3) 0%, transparent 70%)',
              border: '1px solid rgba(255, 42, 95, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Skull size={30} color="var(--health-crimson)" />
          </div>

          <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: 8 }}>
            SURVIVE THE PENALTY WASTES
          </div>
          <div style={{ fontSize: '0.74rem', color: '#f87171', marginTop: 2 }}>
            Unfinished daily quotas detected. Complete physical survival trials to escape the penalty zone.
          </div>
        </div>

        {/* Survival Trials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0' }}>
          <div
            onClick={() => setTask1(!task1)}
            style={{
              padding: '10px 12px',
              borderRadius: 6,
              background: task1 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${task1 ? 'var(--clear-green)' : 'rgba(255, 42, 95, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-hud)', fontWeight: 600, fontSize: '0.84rem', color: '#fff' }}>1. 30 Bodyweight Squats or Burpees</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Outpace the venom centipede pack</div>
            </div>
            {task1 ? <CheckCircle2 size={18} color="var(--clear-green)" /> : <div style={{ width: 16, height: 16, border: '1px solid var(--hud-border-dark)', borderRadius: 4 }} />}
          </div>

          <div
            onClick={() => setTask2(!task2)}
            style={{
              padding: '10px 12px',
              borderRadius: 6,
              background: task2 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${task2 ? 'var(--clear-green)' : 'rgba(255, 42, 95, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-hud)', fontWeight: 600, fontSize: '0.84rem', color: '#fff' }}>2. Drink 500 mL Cold Water Immediately</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Neutralize systemic dehydration in desert heat</div>
            </div>
            {task2 ? <CheckCircle2 size={18} color="var(--clear-green)" /> : <div style={{ width: 16, height: 16, border: '1px solid var(--hud-border-dark)', borderRadius: 4 }} />}
          </div>

          <div
            onClick={() => setTask3(!task3)}
            style={{
              padding: '10px 12px',
              borderRadius: 6,
              background: task3 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${task3 ? 'var(--clear-green)' : 'rgba(255, 42, 95, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-hud)', fontWeight: 600, fontSize: '0.84rem', color: '#fff' }}>3. 15-Minute Recovery Walk or March</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Hold perimeter until extraction gateway unlocks</div>
            </div>
            {task3 ? <CheckCircle2 size={18} color="var(--clear-green)" /> : <div style={{ width: 16, height: 16, border: '1px solid var(--hud-border-dark)', borderRadius: 4 }} />}
          </div>
        </div>

        <button
          className={`btn-hud ${allChecked ? 'btn-hud-monarch' : 'btn-hud-danger'}`}
          style={{ width: '100%', padding: '11px 0', fontSize: '0.88rem' }}
          disabled={!allChecked}
          onClick={handleSurvive}
        >
          {allChecked ? 'SURVIVAL VERIFIED // EXIT PENALTY ZONE' : 'COMPLETE ALL SURVIVAL TRIALS FIRST'}
        </button>
      </div>
    </div>
  );
};
