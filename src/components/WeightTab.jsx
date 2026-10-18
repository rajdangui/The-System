import React, { useState } from 'react';
import { Scale, TrendingDown, Target, Calendar, Plus, Trash2, ArrowDownRight, Sparkles, AlertCircle } from 'lucide-react';
import { getTodayKey } from '../utils/storage';

export const WeightTab = ({ state, onAddWeightLog, onRemoveWeightLog, onUpdateSettings }) => {
  const { weightLogs, settings } = state;
  const { startWeight, targetWeight, heightCm, unit } = settings;

  const [inputWeight, setInputWeight] = useState('');
  const [inputNote, setInputNote] = useState('');
  const [projectionMode, setProjectionMode] = useState('strict'); // 'strict' (-0.75kg/wk) or 'moderate' (-0.4kg/wk)

  const latestLog = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1] : { weight: startWeight, date: getTodayKey() };
  const currentWeight = latestLog.weight;

  // Differences
  const totalDifference = startWeight - targetWeight;
  const currentLost = startWeight - currentWeight;
  const remainingToLose = Math.max(0, currentWeight - targetWeight);
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLost / (totalDifference || 1)) * 100)));

  // BMI Calculation
  const heightM = (heightCm || 178) / 100;
  const currentBmi = (currentWeight / (heightM * heightM)).toFixed(1);
  const targetBmi = (targetWeight / (heightM * heightM)).toFixed(1);

  let bmiCategory = 'Normal';
  let bmiColor = 'var(--emerald-core)';
  if (currentBmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'var(--cyan-core)';
  } else if (currentBmi >= 25 && currentBmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'var(--amber-core)';
  } else if (currentBmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'var(--crimson-core)';
  }

  // Projection Calculations
  // Strict: 0.75 kg/wk (approx 0.107 kg/day); Moderate: 0.40 kg/wk (approx 0.057 kg/day)
  const lossRatePerDay = projectionMode === 'strict' ? 0.75 / 7 : 0.4 / 7;
  const daysToGoal = Math.ceil(remainingToLose / lossRatePerDay);

  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + daysToGoal);
  const goalDateFormatted = goalDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(inputWeight);
    if (!w || w <= 0) return;
    onAddWeightLog(w, inputNote || 'Morning Checkpoint');
    setInputWeight('');
    setInputNote('');
  };

  // Build SVG Projection Points
  // Combine historical points and 4 future projected points
  const sortedHistory = [...weightLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const minVal = Math.min(targetWeight - 1, ...sortedHistory.map((l) => l.weight)) - 1;
  const maxVal = Math.max(startWeight + 1, ...sortedHistory.map((l) => l.weight)) + 1;
  const range = maxVal - minVal || 1;

  // Dimensions of SVG Chart
  const svgWidth = 360;
  const svgHeight = 160;
  const padX = 25;
  const padY = 20;
  const plotW = svgWidth - padX * 2;
  const plotH = svgHeight - padY * 2;

  const getY = (val) => padY + plotH - ((val - minVal) / range) * plotH;

  // History path coordinates
  const histPoints = sortedHistory.map((item, idx) => {
    const x = padX + (idx / Math.max(1, sortedHistory.length + 3)) * plotW;
    const y = getY(item.weight);
    return { x, y, ...item };
  });

  const histPathD = histPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  // Future projection line
  const lastHistPt = histPoints[histPoints.length - 1] || { x: padX, y: getY(currentWeight) };
  const goalPt = {
    x: padX + plotW,
    y: getY(targetWeight),
  };
  const projPathD = `M ${lastHistPt.x} ${lastHistPt.y} L ${goalPt.x} ${goalPt.y}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Target Progress Overview Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Scale size={18} color="var(--emerald-core)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Scale Sentinel
            </span>
          </div>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 4,
              background: 'rgba(0, 255, 157, 0.15)',
              color: 'var(--emerald-core)',
            }}
          >
            BMI {currentBmi} ({bmiCategory})
          </span>
        </div>

        {/* 3 Pillars: Start, Current, Goal */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center', margin: '14px 0' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 4px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Starting</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
              {startWeight} <span style={{ fontSize: '0.75rem' }}>{unit}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.3)', padding: '10px 4px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--cyan-core)', textTransform: 'uppercase', fontWeight: 700 }}>Current</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
              {currentWeight} <span style={{ fontSize: '0.75rem' }}>{unit}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 255, 157, 0.08)', border: '1px solid rgba(0, 255, 157, 0.3)', padding: '10px 4px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--emerald-core)', textTransform: 'uppercase', fontWeight: 700 }}>Target Goal</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-core)' }}>
              {targetWeight} <span style={{ fontSize: '0.75rem' }}>{unit}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-rail" style={{ height: 12 }}>
          <div className="progress-fill emerald" style={{ width: `${progressPercent}%` }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.74rem' }}>
          <span style={{ color: 'var(--emerald-core)', fontWeight: 700 }}>
            -{currentLost.toFixed(1)} {unit} down ({progressPercent}%)
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            {remainingToLose.toFixed(1)} {unit} to target
          </span>
        </div>
      </div>

      {/* Target Projection Graph Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingDown size={16} color="var(--cyan-core)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Target Projection Engine
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Dynamic forecast based on your strict discipline rate
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: 2, borderRadius: 6 }}>
            <button
              onClick={() => setProjectionMode('strict')}
              style={{
                background: projectionMode === 'strict' ? 'var(--cyan-core)' : 'transparent',
                color: projectionMode === 'strict' ? '#000' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Strict (-0.75kg)
            </button>
            <button
              onClick={() => setProjectionMode('moderate')}
              style={{
                background: projectionMode === 'moderate' ? 'var(--cyan-core)' : 'transparent',
                color: projectionMode === 'moderate' ? '#000' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Mod (-0.4kg)
            </button>
          </div>
        </div>

        {/* SVG Chart */}
        <div style={{ width: '100%', overflowX: 'hidden', margin: '8px 0' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#00f0ff" stop-opacity="0" />
              </linearGradient>
            </defs>

            {/* Target line across chart */}
            <line
              x1={padX}
              y1={getY(targetWeight)}
              x2={padX + plotW}
              y2={getY(targetWeight)}
              stroke="var(--emerald-core)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            <text
              x={padX + plotW - 4}
              y={getY(targetWeight) - 6}
              fill="var(--emerald-core)"
              fontSize="9"
              textAnchor="end"
              fontWeight="bold"
            >
              Goal: {targetWeight}{unit}
            </text>

            {/* Historical trajectory line */}
            <path d={histPathD} fill="none" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Historical plot points */}
            {histPoints.map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="4" fill="#07090e" stroke="#00f0ff" strokeWidth="2.5" />
                <text x={pt.x} y={pt.y - 7} fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">
                  {pt.weight}
                </text>
              </g>
            ))}

            {/* Projected Trajectory Line (Dashed) */}
            <path
              d={projPathD}
              fill="none"
              stroke="var(--amber-core)"
              strokeDasharray="5 5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Goal Target point */}
            <circle cx={goalPt.x} cy={goalPt.y} r="5" fill="var(--emerald-core)" />
          </svg>
        </div>

        {/* Forecast Milestone Card */}
        <div
          style={{
            background: 'rgba(0, 255, 157, 0.06)',
            border: '1px solid rgba(0, 255, 157, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--emerald-core)', fontWeight: 700 }}>
              <Calendar size={14} />
              Estimated Goal Date
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: 2 }}>
              {goalDateFormatted}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Timeline</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--cyan-core)' }}>
              ~{Math.ceil(daysToGoal / 7)} Weeks
            </div>
          </div>
        </div>
      </div>

      {/* Log Weight Entry Form */}
      <div className="glass-card">
        <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
          Log Weigh-In Checkpoint
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              step="0.1"
              placeholder={`Weight in ${unit}`}
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '1rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
              }}
            />
            <button type="submit" className="btn btn-primary-cyan">
              <Plus size={18} />
              Record
            </button>
          </div>
          <input
            type="text"
            placeholder="Context note (e.g. Fasted morning weigh-in, post-run)"
            value={inputNote}
            onChange={(e) => setInputNote(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.85rem',
            }}
          />
        </form>
      </div>

      {/* History Log List */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Weigh-In History ({weightLogs.length})
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedHistory.slice().reverse().map((entry, idx) => (
            <div
              key={entry.date + idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem' }}>
                  {entry.weight} {unit}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                  {entry.note || 'Recorded'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{entry.date}</span>
                {weightLogs.length > 1 && (
                  <button
                    onClick={() => onRemoveWeightLog(entry.date)}
                    style={{ background: 'none', border: 'none', color: 'var(--crimson-core)', cursor: 'pointer', padding: 2 }}
                    title="Remove record"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
