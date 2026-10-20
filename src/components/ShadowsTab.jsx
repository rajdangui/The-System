import React from 'react';
import { Sparkles, Package, FlaskConical, Scroll, ShoppingBag, Coins, UserCheck } from 'lucide-react';

export const ShadowsTab = ({ state, onUseItem, onBuyItem }) => {
  const { shadows, inventory, player } = state;

  const shopItems = [
    { id: 'inv_1', name: 'Mana Core Elixir', desc: '+500 mL Water Mana recovery', price: 1000, icon: FlaskConical },
    { id: 'inv_2', name: 'Detox Talisman', desc: 'Neutralizes 10g of consumed sugar', price: 2000, icon: Scroll },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Monarch Extraction Throne Card */}
      <div className="sovereign-card monarch">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--sovereign-violet)', letterSpacing: '0.08em' }}>
              SHADOW EXTRACTION VAULT
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
              THE SHADOW ARMY
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Souls extracted from conquered dungeon bosses to guard streak shields.
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid var(--border-active-violet)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(168, 85, 247, 0.25)',
            }}
          >
            <Sparkles size={20} color="var(--sovereign-violet)" />
          </div>
        </div>
      </div>

      {/* Extracted Shadows Roster */}
      <div className="sovereign-card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em', marginBottom: 12 }}>
          EXTRACTED SHADOW SOLDIERS ({shadows.length})
        </div>

        {shadows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: '#64748b', fontSize: '0.78rem' }}>
            No shadows commanded yet. Defeat Dungeon Bosses to extract shadows into your legion!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {shadows.map((sh) => (
              <div
                key={sh.id}
                className="interactive-item"
                style={{ borderColor: 'rgba(168, 85, 247, 0.25)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid var(--border-active-violet)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--sovereign-violet)',
                    }}
                  >
                    <UserCheck size={18} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.86rem', color: '#fff' }}>
                        {sh.name}
                      </span>
                      <span
                        className="hunter-rank-pill"
                        style={{
                          borderColor: 'var(--sovereign-violet)',
                          color: 'var(--sovereign-violet)',
                          fontSize: '0.64rem',
                          padding: '0 5px',
                        }}
                      >
                        {sh.rank}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)' }}>
                      Buff: {sh.ability}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Responsive Tactical 2-Column Grid for Inventory & Shop */}
      <div className="deck-grid-2">
        {/* Inventory Stash */}
        <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={15} color="var(--sovereign-gold)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--sovereign-gold)', letterSpacing: '0.08em' }}>
              HUNTER INVENTORY ({inventory.reduce((a, b) => a + b.count, 0)})
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Tap to Consume
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {inventory.map((item) => (
            <div key={item.id} className="interactive-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    background: 'rgba(251, 191, 36, 0.08)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sovereign-gold)',
                  }}
                >
                  {item.type === 'potion' ? <FlaskConical size={15} /> : <Scroll size={15} />}
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.84rem', color: '#fff' }}>
                    {item.name} <span style={{ color: 'var(--sovereign-gold)', fontFamily: 'var(--font-mono)' }}>x{item.count}</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{item.desc}</div>
                </div>
              </div>

              <button
                className="btn-sovereign"
                style={{ fontSize: '0.72rem', padding: '4px 10px', minHeight: 28 }}
                onClick={() => onUseItem(item.id)}
              >
                Consume
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hunter Guild Shop / Vault */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShoppingBag size={15} color="var(--electric-cyan)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em' }}>
              HUNTER GUILD VAULT
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--sovereign-gold)', fontFamily: 'var(--font-mono)' }}>
            Balance: {player.gold.toLocaleString()} G
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {shopItems.map((item) => {
            const Icon = item.icon;
            const canAfford = player.gold >= item.price;
            return (
              <div key={item.id} className="interactive-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 6,
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid var(--border-active-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--electric-cyan)',
                    }}
                  >
                    <Icon size={15} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.84rem', color: '#fff' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{item.desc}</div>
                  </div>
                </div>

                <button
                  className="btn-sovereign"
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    minHeight: 28,
                    opacity: canAfford ? 1 : 0.5,
                  }}
                  disabled={!canAfford}
                  onClick={() => onBuyItem(item.id, item.price)}
                >
                  <Coins size={12} /> {item.price.toLocaleString()} G
                </button>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};
