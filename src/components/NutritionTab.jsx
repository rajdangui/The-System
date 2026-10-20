import React, { useState } from 'react';
import { Droplets, ShieldCheck, Plus, Trash2, ShieldAlert } from 'lucide-react';

export const NutritionTab = ({
  state,
  onAddWater,
  onAddSugar,
  onDeleteSugar,
  onOpenCravingModal,
}) => {
  const { user, today } = state;
  const [customWater, setCustomWater] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodGrams, setFoodGrams] = useState('');

  const waterPct = Math.min(100, Math.round((today.waterMl / user.waterGoalMl) * 100));
  const sugarRemaining = Math.max(0, user.sugarLimitG - today.sugarG);
  const sugarExceeded = today.sugarG > user.sugarLimitG;

  const handleCustomWaterSubmit = (e) => {
    e.preventDefault();
    const amt = parseInt(customWater, 10);
    if (!amt || amt <= 0) return;
    onAddWater(amt);
    setCustomWater('');
  };

  const handleFoodSubmit = (e) => {
    e.preventDefault();
    const g = parseFloat(foodGrams);
    if (!g || g <= 0) return;
    onAddSugar(g, foodName.trim() || 'Food Item');
    setFoodName('');
    setFoodGrams('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Responsive 2-Column Deck on Desktop */}
      <div className="deck-grid-2">
        {/* Hydration Module */}
        <div className="sovereign-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Droplets size={18} color="var(--electric-cyan)" />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--electric-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Fluid Intake
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                  Daily Hydration
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: waterPct >= 100 ? 'var(--calm-green)' : 'var(--electric-cyan)', fontWeight: 700 }}>
              {waterPct}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              {today.waterMl.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              / {user.waterGoalMl.toLocaleString()} mL target
            </span>
          </div>

          <div className="laser-meter-track" style={{ height: 6, marginBottom: 12 }}>
            <div className="laser-meter-fill hp" style={{ width: `${waterPct}%` }} />
          </div>

          {/* Preset Quick Log */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10 }}>
            {[250, 350, 500, 750].map((amt) => (
              <button
                key={amt}
                className="btn-sovereign"
                style={{ padding: '6px 2px', fontSize: '0.72rem' }}
                onClick={() => onAddWater(amt)}
              >
                +{amt}ml
              </button>
            ))}
          </div>

          {/* Custom Milliliters Form */}
          <form onSubmit={handleCustomWaterSubmit} style={{ display: 'flex', gap: 6 }}>
            <input
              type="number"
              placeholder="Custom amount (mL)"
              value={customWater}
              onChange={(e) => setCustomWater(e.target.value)}
              style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem' }}
            />
            <button type="submit" className="btn-sovereign" style={{ padding: '0 12px' }}>
              <Plus size={14} /> Add
            </button>
          </form>
        </div>

        {/* Sugar & Nutrition Limit Module */}
        <div className="sovereign-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} color={sugarExceeded ? 'var(--lethal-red)' : 'var(--sovereign-gold)'} />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: sugarExceeded ? 'var(--lethal-red)' : 'var(--sovereign-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Tolerance Threshold
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                  Sugar Intake Cap
                </div>
              </div>
            </div>
            <button
              className="btn-sovereign btn-sovereign-danger"
              style={{ padding: '3px 8px', minHeight: 28, fontSize: '0.7rem' }}
              onClick={onOpenCravingModal}
              title="3-Minute Craving Delay Protocol"
            >
              <ShieldAlert size={12} /> Craving SOS
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: sugarExceeded ? 'var(--lethal-red)' : '#fff' }}>
              {today.sugarG}g
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              / {user.sugarLimitG}g cap {sugarExceeded ? '(EXCEEDED)' : `(${sugarRemaining}g remaining)`}
            </span>
          </div>

          <div className="laser-meter-track" style={{ height: 6, marginBottom: 12 }}>
            <div
              className="laser-meter-fill"
              style={{
                width: `${Math.min(100, (today.sugarG / user.sugarLimitG) * 100)}%`,
                background: sugarExceeded ? 'var(--lethal-red)' : 'var(--sovereign-gold)',
              }}
            />
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
            <button className="btn-sovereign" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(5, 'Light Snack')}>
              +5g Snack
            </button>
            <button className="btn-sovereign" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(15, 'Dessert / Beverage')}>
              +15g Drink
            </button>
            <button className="btn-sovereign btn-sovereign-danger" style={{ fontSize: '0.72rem', padding: '6px 4px' }} onClick={() => onAddSugar(35, 'Sweet Pastry / Soda')}>
              +35g Spike
            </button>
          </div>

          {/* Custom Food Item Form */}
          <form onSubmit={handleFoodSubmit} style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              placeholder="Item name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              style={{ flex: 1.2, padding: '7px 10px', fontSize: '0.8rem' }}
            />
            <input
              type="number"
              step="0.5"
              placeholder="Grams (g)"
              value={foodGrams}
              onChange={(e) => setFoodGrams(e.target.value)}
              style={{ flex: 0.9, padding: '7px 10px', fontSize: '0.8rem' }}
            />
            <button type="submit" className="btn-sovereign" style={{ padding: '0 12px' }}>
              Log
            </button>
          </form>
        </div>
      </div>

      {/* Itemized Nutrition Log Archive */}
      <div className="sovereign-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#cbd5e1', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Logged Consumables ({today.sugarItems?.length || 0})
          </span>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Daily Breakdown
          </span>
        </div>

        {(!today.sugarItems || today.sugarItems.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: '#64748b', fontSize: '0.78rem' }}>
            No sugar or caloric breaches recorded today. Clean diet maintained.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {today.sugarItems.map((si) => (
              <div
                key={si.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  padding: '6px 8px',
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-dormant)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{si.name}</span>
                  <span style={{ color: '#64748b', marginLeft: 8, fontFamily: 'var(--font-mono)' }}>+{si.grams}g • {si.time}</span>
                </div>
                <button
                  onClick={() => onDeleteSugar(si.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--lethal-red)', cursor: 'pointer', padding: 4 }}
                  title="Remove entry"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
