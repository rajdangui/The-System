import React from 'react';
import { Skull, AlertOctagon, CheckCircle2, ShieldCheck, Siren } from 'lucide-react';

export const SergeantBanner = ({ sergeant, persona = 'steel', onFastLogWater }) => {
  const { mood, headline, subtext, waterDeficit, isSugarBreached } = sergeant;

  let borderColor = 'var(--border-subtle)';
  let tagColor = 'var(--cyan-core)';
  let Icon = ShieldCheck;
  let tagText = 'SENTINEL ON PATROL';

  if (mood === 'critical') {
    borderColor = 'var(--crimson-core)';
    tagColor = 'var(--crimson-core)';
    Icon = isSugarBreached ? Siren : Skull;
    tagText = isSugarBreached ? 'SUGAR BREACH LEVEL 1' : 'SEVERE DEFICIT ALERT';
  } else if (mood === 'warning') {
    borderColor = 'var(--amber-core)';
    tagColor = 'var(--amber-core)';
    Icon = AlertOctagon;
    tagText = 'BORDERLINE DISCIPLINE';
  } else if (mood === 'proud') {
    borderColor = 'var(--emerald-core)';
    tagColor = 'var(--emerald-core)';
    Icon = CheckCircle2;
    tagText = 'TARGET ANNIHILATED';
  }

  const personaLabel =
    persona === 'steel'
      ? 'SGT. STEEL (BRUTAL)'
      : persona === 'coach'
      ? 'COACH VANCE'
      : 'STOIC SENTINEL';

  return (
    <div
      className={`sergeant-card ${mood === 'critical' ? 'critical-alert' : ''} ${
        mood === 'warning' ? 'warning-alert' : ''
      }`}
      style={{ borderColor }}
    >
      <div className="sergeant-header">
        <div className="sergeant-tag" style={{ color: tagColor }}>
          <Icon size={14} />
          <span>{tagText}</span>
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          {personaLabel}
        </div>
      </div>

      <div className="sergeant-body">
        <div className="sergeant-quote">{headline}</div>
        <div className="sergeant-subquote">{subtext}</div>

        {mood === 'critical' && !isSugarBreached && (
          <div style={{ marginTop: 12 }}>
            <button
              className="btn btn-primary-cyan btn-pill"
              onClick={() => onFastLogWater(500)}
            >
              Chug 500 mL Immediate Rescue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
