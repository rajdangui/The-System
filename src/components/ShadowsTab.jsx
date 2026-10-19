import React from 'react';
import { Sparkles, Shield, Award, Package, FlaskConical, Scroll, Zap, UserCheck } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

export const ShadowsTab = ({ state, onUseItem }) => {
  const { shadows, inventory, player } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Monarch Extraction Throne Card */}
      <div className="hud-card monarch">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.74rem', color: 'var(--monarch-purple)', letterSpacing: '0.06em' }}>
              MONARCH EXTRACTION VAULT
            </div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
              SHADOW ARMY DIVISION
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: 2 }}>
              Command souls extracted from defeated dungeon bosses to fortify discipline.
            </div>
          </div>

          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.2) 0%, transparent 100%)',
              border: '1px solid var(--monarch-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(192, 132, 252, 0.3)',
            }}
          >
            <Sparkles size={22} color="var(--monarch-purple)" />
          </div>
        </div>
      </div>

      {/* Extracted Shadows Roster */}
      <div className="hud-card">
        <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.78rem', color: 'var(--mana-cyan)', letterSpacing: '0.06em', marginBottom: 12 }}>
          EXTRACTED SHADOW RANKS ({shadows.length})
        </div>

        {shadows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-faint)', fontSize: '0.82rem' }}>
            No shadows commanded yet. Defeat your first Dungeon Gate Boss to extract their shadow!
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
                  borderRadius: 8,
                  background: 'rgba(192, 132, 252, 0.05)',
                  border: '1px solid rgba(192, 132, 252, 0.25)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 6,
                    background: 'rgba(192, 132, 252, 0.15)',
                    border: '1px solid var(--monarch-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--monarch-purple)',
                  }}
                >
                  <UserCheck size={20} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-hud)', fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
                      {sh.name}
                    </span>
                    <span
                      className="hunter-rank-crest"
                      style={{
                        borderColor: 'var(--monarch-purple)',
                        color: 'var(--monarch-purple)',
                        fontSize: '0.66rem',
                        padding: '1px 6px',
                      }}
                    >
                      {sh.rank}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--mana-cyan)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                    Active Buff: {sh.ability}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hunter Inventory */}
      <div className="hud-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={16} color="var(--gold-amber)" />
            <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.78rem', color: 'var(--gold-amber)', letterSpacing: '0.06em' }}>
              CONSUMABLE SUPPLIES
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            System Stash
          </span>
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
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--hud-border-dark)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-amber)',
                  }}
                >
                  {item.type === 'potion' ? <FlaskConical size={16} /> : <Scroll size={16} />}
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-hud)', fontWeight: 600, fontSize: '0.86rem', color: '#fff' }}>
                    {item.name} <span style={{ color: 'var(--gold-amber)', fontFamily: 'var(--font-mono)' }}>x{item.count}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{item.desc}</div>
                </div>
              </div>

              <button
                className="btn-hud"
                style={{ fontSize: '0.72rem', padding: '5px 12px' }}
                onClick={() => onUseItem(item.id)}
              >
                Consume
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
