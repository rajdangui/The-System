import React, { useState, useEffect } from 'react';
import { X, Droplets, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

export const CravingModal = ({ isOpen, onClose, onResisted, soundEnabled }) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [waterChugged, setWaterChugged] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(180);
      setIsRunning(true);
      setWaterChugged(false);
      playSystemSound('danger', soundEnabled);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playSystemSound('level_up', soundEnabled);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, soundEnabled]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPct = ((180 - timeLeft) / 180) * 100;

  const handleClaimVictory = () => {
    playSystemSound('ding', soundEnabled);
    onResisted();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldAlert size={20} color="var(--crimson-core)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
              3-MINUTE CRAVING INTERCEPT
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          {/* Animated Countdown Circle */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              margin: '0 auto',
              border: '4px solid rgba(255, 42, 95, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle, rgba(255, 42, 95, 0.15) 0%, transparent 70%)',
              boxShadow: '0 0 30px rgba(255, 42, 95, 0.2)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: '#fff' }}>
              {minutes}:{String(seconds).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Dopamine Delay
            </div>
          </div>
        </div>

        {/* Tactical Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <div
            onClick={() => setWaterChugged(!waterChugged)}
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: waterChugged ? 'rgba(0, 255, 157, 0.1)' : 'rgba(0, 240, 255, 0.08)',
              border: `1px solid ${waterChugged ? 'var(--emerald-core)' : 'rgba(0, 240, 255, 0.3)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Droplets size={20} color="var(--cyan-core)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>1. Chug 300ml Cold Water Immediately</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Dehydration often masquerades as intense sugar cravings.
                </div>
              </div>
            </div>
            <div style={{ color: waterChugged ? 'var(--emerald-core)' : 'var(--text-muted)' }}>
              {waterChugged ? <CheckCircle2 size={20} /> : <div style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid var(--border-bright)' }} />}
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Zap size={20} color="var(--amber-core)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>2. 15 Bodyweight Squats or Brisk Walk</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Physical movement triggers adrenaline which suppresses hunger hormones.
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-ghost"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Dismiss
          </button>
          <button
            className="btn btn-primary-cyan"
            style={{ flex: 1.5 }}
            onClick={handleClaimVictory}
          >
            <CheckCircle2 size={18} />
            I Resisted The Craving!
          </button>
        </div>
      </div>
    </div>
  );
};
