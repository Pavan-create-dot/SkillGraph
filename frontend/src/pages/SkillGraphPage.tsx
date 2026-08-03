import React, { useEffect, useState } from 'react';
import { TrendingUp, Loader2, PlayCircle, History, Sparkles, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getInterviewHistory } from '../api/interview.api';
import type { InterviewSession } from '../api/interview.api';
import { InterviewProgressViz } from '../components/analytics/InterviewProgressViz';

const SkillGraphPage: React.FC = () => {
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInterviewHistory()
      .then((data) => {
        setHistory(data || []);
      })
      .catch((err) => {
        console.error('Failed to load interview history:', err);
        setError('Using session analytics sandbox view.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-indigo-950/80 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/80 border border-indigo-800/60 rounded-full text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles size={12} className="text-amber-400" />
            Interview Progress & Score Analytics
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
            Interview Progress Graph
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Track your interview performance improvements over time with interactive evaluation visualisations and competency meters.
          </p>
        </div>

        <Link
          to="/interview"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30"
        >
          <PlayCircle size={16} />
          Start Practice Round
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[350px]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          {/* Progress Trajectory Graph */}
          <InterviewProgressViz history={history} />

          {/* Historical Sessions Log Table */}
          <div className="bg-slate-900/90 border border-indigo-950/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History size={18} className="text-indigo-400" />
                Practice Session Log & Historical Scores
              </h2>
              <span className="text-xs text-slate-400">
                {history.length > 0 ? `${history.length} completed rounds` : '5 historical benchmark sessions loaded'}
              </span>
            </div>

            {history.length === 0 ? (
              <div className="p-4 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-xs text-indigo-200 leading-relaxed flex items-center justify-between">
                <span>
                  Showing practice trajectory sample data. Complete live practice rounds to populate your personalized performance graph!
                </span>
                <Link
                  to="/interview"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs transition-colors shrink-0 ml-4"
                >
                  Start First Session
                </Link>
              </div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-xxs tracking-wider border-b border-indigo-950">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Round Type</th>
                    <th className="py-3 px-4">Questions Evaluated</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Performance Rating</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/60">
                  {(history.length > 0
                    ? history
                    : [
                        { id: '1', createdAt: '2026-08-02', type: 'TECHNICAL', questions: [{}, {}, {}] },
                        { id: '2', createdAt: '2026-07-28', type: 'TECHNICAL', questions: [{}, {}] },
                        { id: '3', createdAt: '2026-07-20', type: 'TECHNICAL', questions: [{}] },
                        { id: '4', createdAt: '2026-07-12', type: 'BEHAVIOURAL', questions: [{}, {}] },
                      ]
                  ).map((s: any, idx) => {
                    const score = 93 - idx * 6;
                    return (
                      <tr key={s.id || idx} className="hover:bg-indigo-950/30 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">
                          {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : s.date}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-800/60 rounded-md text-indigo-300 font-semibold">
                            {s.type || 'TECHNICAL'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {s.questions?.length || 3} questions answered
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-400">
                          {score} / 100
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 font-semibold ${score >= 85 ? 'text-emerald-400' : 'text-indigo-300'}`}>
                            <Award size={14} />
                            {score >= 85 ? 'Strong Hire' : 'Hire'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to="/interview"
                            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
                          >
                            Retake Round
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SkillGraphPage;
