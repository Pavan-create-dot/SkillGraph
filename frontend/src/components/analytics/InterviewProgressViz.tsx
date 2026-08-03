import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  ChevronRight,
  Sparkles,
  PlayCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InterviewSession } from '../../api/interview.api';

interface VizProps {
  history: InterviewSession[];
}

export const InterviewProgressViz: React.FC<VizProps> = ({ history }) => {
  // If user has no sessions, generate structured sample trajectory data so the graph is immediately interactive
  const defaultSessions = [
    {
      id: 'sample-1',
      date: '2026-07-05',
      type: 'TECHNICAL',
      role: 'Full-Stack Developer',
      score: 62,
      label: 'Session 1',
      feedback: 'Good baseline syntax knowledge. Needs deeper explanation of concurrency and system design bottlenecks.',
      competencies: { technical: 65, communication: 60, problemSolving: 62, systemDesign: 55 },
    },
    {
      id: 'sample-2',
      date: '2026-07-12',
      type: 'BEHAVIOURAL',
      role: 'Full-Stack Developer',
      score: 74,
      label: 'Session 2',
      feedback: 'Clear STAR method framing. Enhanced response structure for team conflict resolution scenarios.',
      competencies: { technical: 70, communication: 82, problemSolving: 72, systemDesign: 65 },
    },
    {
      id: 'sample-3',
      date: '2026-07-20',
      type: 'TECHNICAL',
      role: 'Senior Software Engineer',
      score: 81,
      label: 'Session 3',
      feedback: 'Strong performance on Async/Await internals, PostgreSQL indexing, and microservice decoupling.',
      competencies: { technical: 85, communication: 78, problemSolving: 82, systemDesign: 76 },
    },
    {
      id: 'sample-4',
      date: '2026-07-28',
      type: 'TECHNICAL',
      role: 'Full-Stack Engineer',
      score: 88,
      label: 'Session 4',
      feedback: 'Excellent tradeoff analysis between Redis caching strategies and database write speed.',
      competencies: { technical: 90, communication: 86, problemSolving: 88, systemDesign: 85 },
    },
    {
      id: 'sample-5',
      date: '2026-08-02',
      type: 'TECHNICAL',
      role: 'Full-Stack Engineer',
      score: 93,
      label: 'Latest Session',
      feedback: 'Production-ready candidate responses! Concise architecture diagrams and optimal algorithmic time complexities.',
      competencies: { technical: 95, communication: 90, problemSolving: 94, systemDesign: 92 },
    },
  ];

  // Process history items
  const processedData = history.length > 0
    ? history.map((s, idx) => {
        const scores = s.questions.map((q) => q.score ?? 70);
        const avgScore = scores.length
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 75;
        const d = new Date(s.createdAt);
        const dateStr = !isNaN(d.getTime()) ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Session ${idx + 1}`;
        return {
          id: s.id,
          date: dateStr,
          type: s.type,
          role: 'Full-Stack Engineer',
          score: avgScore,
          label: `Session ${idx + 1}`,
          feedback: s.questions[0]?.feedback || 'Completed session with evaluated responses.',
          competencies: {
            technical: Math.min(100, avgScore + 4),
            communication: Math.max(50, avgScore - 5),
            problemSolving: avgScore,
            systemDesign: Math.max(45, avgScore - 8),
          },
        };
      })
    : defaultSessions;

  const [selectedIdx, setSelectedIdx] = useState<number>(processedData.length - 1);
  const selectedSession = processedData[selectedIdx] || processedData[processedData.length - 1];

  const scores = processedData.map((d) => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const latestScore = scores[scores.length - 1];
  const initialScore = scores[0];
  const totalGrowth = latestScore - initialScore;

  // Graph SVG Layout dimensions
  const svgWidth = 720;
  const svgHeight = 220;
  const paddingX = 50;
  const paddingY = 30;
  const usableW = svgWidth - paddingX * 2;
  const usableH = svgHeight - paddingY * 2;

  const points = processedData.map((d, i) => {
    const x = paddingX + (i / (processedData.length - 1 || 1)) * usableW;
    const y = svgHeight - paddingY - ((d.score - 40) / 60) * usableH; // Map 40-100 to canvas
    return { x, y, data: d, index: i };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-indigo-950/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl hover:border-indigo-800/60 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Overall Score Growth</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">+{totalGrowth}%</span>
            <span className="text-xs text-emerald-400 font-medium">Since baseline</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Initial: <span className="font-semibold text-slate-300">{initialScore}/100</span> → Current: <span className="font-semibold font-mono text-emerald-400">{latestScore}/100</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-indigo-950/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl hover:border-indigo-800/60 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Peak Score Achieved</span>
            <Award size={16} className="text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">{maxScore}</span>
            <span className="text-xs text-slate-400">/ 100 pts</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Top performance tier reached
          </div>
        </div>

        <div className="bg-slate-900/90 border border-indigo-950/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl hover:border-indigo-800/60 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Mock Rounds</span>
            <Clock size={16} className="text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{processedData.length}</span>
            <span className="text-xs text-indigo-300 font-medium">Completed</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Consistency level: <span className="text-indigo-300 font-medium">High</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-indigo-950/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl hover:border-indigo-800/60 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Readiness Mastery</span>
            <Target size={16} className="text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              {latestScore >= 85 ? 'Strong Hire' : latestScore >= 70 ? 'Hire' : 'Needs Practice'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Based on recent AI evaluations
          </div>
        </div>
      </div>

      {/* Main Graph & Session Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Chart Canvas */}
        <div className="lg:col-span-8 bg-slate-900/95 border border-indigo-950 rounded-2xl p-6 shadow-2xl relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-400" />
                Interview Score Improvement Trajectory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Visualizing your score progression (0–100) across mock interview sessions over time.
              </p>
            </div>
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all shadow-md shadow-indigo-900/30"
            >
              <PlayCircle size={14} />
              Start New Round
            </Link>
          </div>

          {/* Canvas */}
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px]">
              <defs>
                <linearGradient id="meridianGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4338ca" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines */}
              {[40, 60, 80, 100].map((val) => {
                const y = svgHeight - paddingY - ((val - 40) / 60) * usableH;
                return (
                  <g key={val}>
                    <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#1e1b4b" strokeDasharray="3 3" />
                    <text x={paddingX - 10} y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area Under Curve */}
              <path d={areaD} fill="url(#meridianGrad)" />

              {/* Smooth Line */}
              <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Interactive Points */}
              {points.map((p) => {
                const isSelected = p.index === selectedIdx;
                return (
                  <g key={p.data.id} onClick={() => setSelectedIdx(p.index)} className="cursor-pointer group">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isSelected ? 8 : 5}
                      fill={isSelected ? '#f59e0b' : '#6366f1'}
                      stroke={isSelected ? '#ffffff' : '#312e81'}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-200"
                    />
                    {/* Score Label above point */}
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fill={isSelected ? '#f59e0b' : '#94a3b8'}
                      fontSize="10"
                      fontWeight={isSelected ? 'bold' : 'medium'}
                    >
                      {p.data.score}
                    </text>

                    {/* Date Label on X-Axis */}
                    <text x={p.x} y={svgHeight - 8} textAnchor="middle" fill="#64748b" fontSize="10">
                      {p.data.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-indigo-950/80 pt-3">
            <span>Click any node to inspect session score breakdown</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Baseline Session
              <span className="w-2 h-2 rounded-full bg-amber-500 ml-2"></span> Selected Node
            </span>
          </div>
        </div>

        {/* Selected Session Inspector Panel */}
        <div className="lg:col-span-4 bg-slate-900/95 border border-indigo-950 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-indigo-950">
              <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                Session Inspector
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-950 border border-indigo-800/60 rounded-full text-indigo-300 text-xs font-semibold">
                {selectedSession.date}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{selectedSession.label}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedSession.role}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-amber-400">{selectedSession.score}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>

            {/* Competency Breakdown Meters */}
            <div className="mt-5 space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Competency Breakdown</span>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Technical Concepts</span>
                  <span className="font-semibold text-indigo-300">{selectedSession.competencies.technical}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${selectedSession.competencies.technical}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Problem Solving</span>
                  <span className="font-semibold text-indigo-300">{selectedSession.competencies.problemSolving}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${selectedSession.competencies.problemSolving}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Communication & Clarity</span>
                  <span className="font-semibold text-indigo-300">{selectedSession.competencies.communication}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${selectedSession.competencies.communication}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>System Design</span>
                  <span className="font-semibold text-indigo-300">{selectedSession.competencies.systemDesign}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${selectedSession.competencies.systemDesign}%` }} />
                </div>
              </div>
            </div>

            {/* AI Feedback Snippet */}
            <div className="mt-5 p-3.5 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-indigo-300 block mb-1">AI Evaluator Feedback:</span>
              "{selectedSession.feedback}"
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-950 flex items-center justify-between">
            <span className="text-xs text-slate-400">Round Type: <strong className="text-white">{selectedSession.type}</strong></span>
            <Link
              to="/interview"
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Practice Again <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
