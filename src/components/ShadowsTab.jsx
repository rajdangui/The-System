import React from 'react';
import { Sparkles, Shield, Award, Package, ShoppingBag, Flame } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

export const ShadowsTab = ({ state, onUseItem }) => {
  const { shadows, inventory, player } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Monarch Throne Header */}
      <div className="system-card monarch">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--sys-purple)', letterSpacing: '0.06em' }}>
              [SHADOW EXTRACTION CHAMBER]
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginTop: 2 }}>
              THE SHADOW ARMY
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Soldiers extracted from conquered health hurdles & defeated dungeon bosses.
            </div>
          </div>

          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(192, 132, 252, 0.15)',
              border: '2px solid var(--sys-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--sys-purple-glow)',
            }}
          >
            <Sparkles size={22} color="var(--sys-purple)" />
          </div>
        </div>
      </div>

      {/* Extracted Shadows Roster */}
      <div className="system-card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--sys-cyan)', letterSpacing: '0.06em', marginBottom: 12 }}>
          [EXTRACTED SHADOW SOLDIERS ({shadows.length})]
        </div>

        {shadows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748b', fontSize: '0.82rem' }}>
            No shadows extracted yet. Conquer your first Dungeon Boss to command the dead!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {shadows.map((sh) => (
              <div
                key={sh.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(192, 132, 252, 0.08)',
                  border: '1px solid rgba(192, 132, 252, 0.3)',
                }}
              >
                <div style={{ fontSize: '1.8rem' }}>{sh.icon || '⚔️'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{sh.name}</span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--sys-purple)', padding: '1px 6px', borderRadius: 4, background: 'rgba(192,132,252,0.15)' }}>
                      {sh.rank}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--sys-cyan)', marginTop: 2 }}>
                    Passive: {sh.ability}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hunter Inventory */}
      <div className="system-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={16} color="var(--sys-gold)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--sys-gold)', letterSpacing: '0.06em' }}>
              [SYSTEM INVENTORY]
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tap to Consume</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {inventory.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 8,
                background: 'rgba(251, 191, 36, 0.05)',
                border: '1px solid rgba(251, 191, 36, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#fff' }}>
                    {item.name} <span style={{ color: 'var(--sys-gold)' }}>x{item.count}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.desc}</div>
                </div>
              </div>

              <button
                className="btn-system"
                style={{ fontSize: '0.72rem', padding: '6px 12px' }}
                onClick={() => onUseItem(item.id)}
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
