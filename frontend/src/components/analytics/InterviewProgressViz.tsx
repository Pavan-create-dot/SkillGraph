import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import type { InterviewSession } from '../../api/interview.api';

interface VizProps {
  history: InterviewSession[];
}

export const InterviewProgressViz: React.FC<VizProps> = ({ history }) => {
  // Default sample trajectory data if no live history exists
  const defaultData = [
    { label: 'Session 1', score: 62, date: 'Jul 5' },
    { label: 'Session 2', score: 74, date: 'Jul 12' },
    { label: 'Session 3', score: 81, date: 'Jul 20' },
    { label: 'Session 4', score: 88, date: 'Jul 28' },
    { label: 'Session 5', score: 93, date: 'Aug 2' },
  ];

  const chartData = history.length > 0
    ? history.map((s, idx) => {
        const scores = s.questions.map((q) => q.score ?? 75);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 75;
        const d = new Date(s.createdAt);
        const dateStr = !isNaN(d.getTime()) ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `S${idx + 1}`;
        return { label: `Session ${idx + 1}`, score: avg, date: dateStr };
      })
    : defaultData;

  const latestScore = chartData[chartData.length - 1]?.score || 93;
  const initialScore = chartData[0]?.score || 62;
  const growth = latestScore - initialScore;

  // SVG Chart Dimensions
  const w = 600;
  const h = 180;
  const px = 40;
  const py = 25;
  const uw = w - px * 2;
  const uh = h - py * 2;

  const points = chartData.map((d, i) => {
    const x = px + (i / (chartData.length - 1 || 1)) * uw;
    const y = h - py - ((d.score - 40) / 60) * uh;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - py} L ${points[0].x} ${h - py} Z`;

  // Competency Growth Data
  const competencies = [
    { name: 'Technical & Syntax', baseline: 60, current: 92 },
    { name: 'Problem Solving', baseline: 65, current: 88 },
    { name: 'System Design', baseline: 50, current: 85 },
    { name: 'Communication & STAR', baseline: 70, current: 94 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* GRAPH 1: Overall Score Growth Trajectory */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-600" />
              1. Interview Score Growth Over Time
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Score progress across mock sessions (0–100 pts)
            </p>
          </div>
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold">
            +{growth}% Growth
          </div>
        </div>

        {/* Line Chart Canvas */}
        <div className="w-full">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
            <defs>
              <linearGradient id="lightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[40, 70, 100].map((val) => {
              const y = h - py - ((val - 40) / 60) * uh;
              return (
                <g key={val}>
                  <line x1={px} y1={y} x2={w - px} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x={px - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area */}
            <path d={areaD} fill="url(#lightGrad)" />

            {/* Line */}
            <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Nodes */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#4f46e5" strokeWidth="3" />
                <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#4338ca" fontSize="11" fontWeight="bold">
                  {p.data.score}%
                </text>
                <text x={p.x} y={h - 6} textAnchor="middle" fill="#64748b" fontSize="10">
                  {p.data.date}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* GRAPH 2: Competency Growth Comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-600" />
              2. Skill Competency Growth
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Baseline vs. current performance across 4 skill areas
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-200"></span> Baseline
            </span>
            <span className="flex items-center gap-1 text-indigo-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600"></span> Current
            </span>
          </div>
        </div>

        {/* Bar Chart Bars */}
        <div className="space-y-4 pt-1">
          {competencies.map((c) => (
            <div key={c.name} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{c.name}</span>
                <span className="text-indigo-600 font-bold">{c.current}% (+{c.current - c.baseline}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden relative flex items-center">
                {/* Baseline bar */}
                <div
                  className="bg-slate-300 h-full rounded-full absolute left-0"
                  style={{ width: `${c.baseline}%` }}
                />
                {/* Current bar overlay */}
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500 relative z-10"
                  style={{ width: `${c.current}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
