import React from 'react';
import { Shield, Flame, AlertOctagon, Award, CheckCircle, Volume2, Sparkles, Dumbbell, Zap } from 'lucide-react';
import { playSound } from '../utils/audio';

export const StrictRulesTab = ({
  state,
  sergeant,
  onTogglePenalty,
  onAddPenalty,
  onUpdatePersona,
  onClaimShield,
}) => {
  const { streak, badges, today, settings } = state;
  const { persona, soundEnabled } = settings;

  const activePenalties = today.penalties || [];

  const rules = [
    {
      id: 'r1',
      title: 'Hydration Mandate',
      desc: `Reach minimum ${settings.waterGoal} mL daily. No excuses.`,
      status: today.waterConsumed >= settings.waterGoal ? 'CLEARED' : 'IN PROGRESS',
    },
    {
      id: 'r2',
      title: 'Sugar Ceiling Guard',
      desc: `Never exceed ${settings.sugarLimit}g added sugar per day.`,
      status: today.sugarConsumed <= settings.sugarLimit ? 'CLEARED' : 'VIOLATION ACTIVE',
    },
    {
      id: 'r3',
      title: 'Morning Scale Accountability',
      desc: 'Step on the scale every single morning to face reality.',
      status: today.weightLoggedToday ? 'CLEARED' : 'PENDING',
    },
    {
      id: 'r4',
      title: 'Sugar Curfew: 7:30 PM',
      desc: 'Strict zero-sugar intake after 7:30 PM to protect sleep & insulin.',
      status: 'MONITORED',
    },
  ];

  const handleTestSound = (snd) => {
    playSound(snd, soundEnabled);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Streak & Shield Status */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.12), rgba(157, 78, 221, 0.12))',
          borderColor: 'rgba(255, 184, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flame size={20} color="var(--amber-core)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                {streak.current} DAY STREAK
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Best Record: <strong>{streak.best} Days</strong> • Shields: <strong>{streak.shields} Available</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '4px 8px',
                borderRadius: 9999,
                background: 'rgba(255, 184, 0, 0.18)',
                color: 'var(--amber-core)',
                fontWeight: 800,
              }}
            >
              DISCIPLINE ACTIVE
            </span>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          🛡️ A <strong>Streak Shield</strong> protects your streak from breaking on an accidental missed checkpoint. Maintain strict habits for 5 continuous days to earn bonus shields!
        </div>
      </div>

      {/* The 5 Strict Standing Rules */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={16} color="var(--cyan-core)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
              The Strict Directives
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Non-Negotiable</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rules.map((rule) => {
            const isCleared = rule.status === 'CLEARED';
            const isViolated = rule.status === 'VIOLATION ACTIVE';
            return (
              <div
                key={rule.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isViolated
                    ? 'rgba(255, 42, 95, 0.08)'
                    : isCleared
                    ? 'rgba(0, 255, 157, 0.05)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${
                    isViolated
                      ? 'rgba(255, 42, 95, 0.35)'
                      : isCleared
                      ? 'rgba(0, 255, 157, 0.25)'
                      : 'var(--border-subtle)'
                  }`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>{rule.title}</div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: isViolated
                        ? 'var(--crimson-core)'
                        : isCleared
                        ? 'var(--emerald-core)'
                        : 'var(--cyan-core)',
                    }}
                  >
                    {rule.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  {rule.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Penalty Debt Queue */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Dumbbell size={16} color="var(--crimson-core)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Penalty Debt Box
            </span>
          </div>
          <button
            className="btn btn-ghost btn-pill"
            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            onClick={() => onAddPenalty('20 Air Squats', 'Discipline Tune-Up', '20 reps')}
          >
            + Assign Self-Penalty
          </button>
        </div>

        {activePenalties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '14px 0', color: 'var(--emerald-core)', fontSize: '0.82rem' }}>
            🎉 No disciplinary debt on record!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activePenalties.map((pen) => (
              <div
                key={pen.id}
                className={`penalty-item ${pen.completed ? 'cleared' : ''}`}
                onClick={() => onTogglePenalty(pen.id)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: pen.completed ? 'line-through' : 'none',
                    }}
                  >
                    {pen.title} ({pen.reps})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Triggered by: {pen.reason}
                  </div>
                </div>
                <div style={{ color: pen.completed ? 'var(--emerald-core)' : 'var(--crimson-core)' }}>
                  {pen.completed ? (
                    <CheckCircle size={20} />
                  ) : (
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid var(--crimson-core)' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drill Sergeant Persona Chooser */}
      <div className="glass-card">
        <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>
          Accountability Voice Persona
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { id: 'steel', name: 'Sgt. Steel', label: 'Brutal / Savage' },
            { id: 'coach', name: 'Coach Vance', label: 'Firm / Athletic' },
            { id: 'stoic', name: 'Stoic Sentinel', label: 'Calm / Iron Will' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onUpdatePersona(item.id)}
              style={{
                background: persona === item.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${persona === item.id ? 'var(--cyan-core)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '10px 6px',
                cursor: 'pointer',
                color: persona === item.id ? '#fff' : 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.82rem' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tactical Soundboard */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Volume2 size={16} color="var(--cyan-core)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Tactical Audio Synthesizer
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tap to Audition</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <button className="btn btn-ghost" style={{ padding: '8px 4px', fontSize: '0.72rem' }} onClick={() => handleTestSound('whistle')}>
            Whistle
          </button>
          <button className="btn btn-ghost" style={{ padding: '8px 4px', fontSize: '0.72rem' }} onClick={() => handleTestSound('buzzer')}>
            Buzzer
          </button>
          <button className="btn btn-ghost" style={{ padding: '8px 4px', fontSize: '0.72rem' }} onClick={() => handleTestSound('water')}>
            Chug
          </button>
          <button className="btn btn-ghost" style={{ padding: '8px 4px', fontSize: '0.72rem' }} onClick={() => handleTestSound('victory')}>
            Victory
          </button>
        </div>
      </div>

      {/* Badges and Honors */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Award size={16} color="var(--violet-core)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Sentinel Badges & Achievements
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: b.unlocked ? 'rgba(157, 78, 221, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${b.unlocked ? 'rgba(157, 78, 221, 0.3)' : 'var(--border-subtle)'}`,
                opacity: b.unlocked ? 1 : 0.5,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: b.unlocked ? 'var(--violet-core)' : '#1e293b',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                }}
              >
                {b.unlocked ? '★' : '🔒'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: b.unlocked ? '#fff' : 'var(--text-muted)' }}>
                  {b.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{b.desc}</div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: b.unlocked ? 'var(--emerald-core)' : 'var(--text-muted)' }}>
                {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
