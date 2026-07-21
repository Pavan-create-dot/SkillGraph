import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmapStatus, useMyRoadmap } from '../hooks/useRoadmap';
import { useProgress } from '../hooks/useProgress';
import { useUpsertProgress } from '../hooks/useProgress';
import type { Skill, ProgressStatus } from '../types';

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProgressStatus, { label: string; color: string; dot: string; bg: string }> = {
  NOT_STARTED: {
    label: 'Not Started',
    color: 'text-slate-400',
    dot: 'bg-slate-500',
    bg: 'bg-slate-500/10 border-slate-500/20',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-sky-400',
    dot: 'bg-sky-500',
    bg: 'bg-sky-500/10 border-sky-500/20',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-emerald-400',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
};

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: 'Beginner', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  INTERMEDIATE: { label: 'Intermediate', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  ADVANCED: { label: 'Advanced', color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
};

// ─── Inline progress editor ────────────────────────────────────────────────────

interface ProgressEditorProps {
  skill: Skill;
  mastery: number;
  status: ProgressStatus;
  onClose: () => void;
}

const ProgressEditor: React.FC<ProgressEditorProps> = ({ skill, mastery: initialMastery, status: initialStatus, onClose }) => {
  const [mastery, setMastery] = useState(initialMastery);
  const [status, setStatus] = useState<ProgressStatus>(initialStatus);
  const { mutate: upsertProgress, isPending } = useUpsertProgress();

  const handleStatusChange = (s: ProgressStatus) => {
    setStatus(s);
    if (s === 'COMPLETED') setMastery(100);
    else if (s === 'NOT_STARTED') setMastery(0);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    upsertProgress({ skillId: skill.id, mastery, status }, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-slate-700/60 space-y-3">
      {/* Status toggle */}
      <div>
        <p className="text-xs text-slate-400 mb-1.5 font-medium">Update Status</p>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(STATUS_CONFIG) as ProgressStatus[]).map((st) => (
            <button
              type="button"
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`py-1.5 text-[10px] font-semibold rounded-lg border transition-all ${
                status === st
                  ? STATUS_CONFIG[st].bg + ' ' + STATUS_CONFIG[st].color + ' border-current'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
              }`}
            >
              {STATUS_CONFIG[st].label}
            </button>
          ))}
        </div>
      </div>

      {/* Mastery slider */}
      {status !== 'NOT_STARTED' && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-slate-400 font-medium">Mastery</p>
            <span className="text-xs font-bold text-primary-400">{mastery}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={mastery}
            disabled={status === 'COMPLETED'}
            onChange={(e) => setMastery(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 btn-primary py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          {isPending && <span className="w-3 h-3 border-2 border-slate-300 border-t-white rounded-full animate-spin" />}
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// ─── Skill card ────────────────────────────────────────────────────────────────

interface SkillCardProps {
  skill: Skill;
  mastery: number;
  status: ProgressStatus;
  isExpanded: boolean;
  onExpand: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, mastery, status, isExpanded, onExpand }) => {
  const cfg = STATUS_CONFIG[status];
  const diff = DIFFICULTY_CONFIG[skill.difficulty] ?? DIFFICULTY_CONFIG.BEGINNER;

  return (
    <div
      className={`bg-slate-800/60 rounded-2xl border transition-all duration-200 overflow-hidden ${
        isExpanded ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : 'border-slate-700/60 hover:border-slate-600/80'
      }`}
    >
      {/* Progress bar top strip */}
      <div className="h-1 bg-slate-700/50">
        <div
          className={`h-full transition-all duration-500 ${
            status === 'COMPLETED' ? 'bg-emerald-500' : status === 'IN_PROGRESS' ? 'bg-sky-500' : 'bg-slate-600'
          }`}
          style={{ width: `${mastery}%` }}
        />
      </div>

      <div className="p-5">
        {/* Top row */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-slate-700/80 text-slate-300">
              {skill.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${diff.color}`}>
              {diff.label}
            </span>
          </div>

          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.color} shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-1.5 leading-snug">{skill.name}</h3>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{skill.description ?? 'No description.'}</p>

        {/* Mastery row */}
        {status !== 'NOT_STARTED' && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-sky-500'}`}
                style={{ width: `${mastery}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-400 w-8 text-right">{mastery}%</span>
          </div>
        )}

        {/* Expand/collapse button */}
        <button
          onClick={onExpand}
          className={`mt-4 w-full text-xs font-semibold py-2 rounded-lg border transition-all ${
            isExpanded
              ? 'bg-primary-500/10 border-primary-500/30 text-primary-400 hover:bg-primary-500/20'
              : 'bg-slate-700/40 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
          }`}
        >
          {isExpanded ? '✕ Close' : '✏️ Update Progress'}
        </button>

        {/* Inline progress editor */}
        {isExpanded && (
          <ProgressEditor skill={skill} mastery={mastery} status={status} onClose={onExpand} />
        )}
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const STATUS_FILTERS: Array<{ value: 'ALL' | ProgressStatus; label: string }> = [
  { value: 'ALL', label: 'All Skills' },
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const SkillsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProgressStatus>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: roadmapStatus, isLoading: statusLoading } = useRoadmapStatus();
  const hasRoadmap = roadmapStatus?.hasRoadmap ?? false;
  const topic = roadmapStatus?.topic ?? '';

  const { data: roadmapData, isLoading: roadmapLoading } = useMyRoadmap(hasRoadmap);
  const { data: progressData, isLoading: progressLoading } = useProgress();

  const skills: Skill[] = useMemo(() => roadmapData?.nodes ?? [], [roadmapData]);

  // Derive categories from user's roadmap skills
  const categories = useMemo(() => {
    const cats = [...new Set(skills.map((s) => s.category))].sort();
    return cats;
  }, [skills]);

  // Build progress lookup map
  const progressMap = useMemo(() => {
    const map = new Map<string, { mastery: number; status: ProgressStatus }>();
    progressData?.forEach((p) => map.set(p.skillId, { mastery: p.mastery, status: p.status as ProgressStatus }));
    return map;
  }, [progressData]);

  // Filtered & searched skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const prog = progressMap.get(skill.id);
      const status: ProgressStatus = prog?.status ?? 'NOT_STARTED';

      const matchesSearch = search.trim() === '' || skill.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || skill.category === selectedCategory;
      const matchesStatus = statusFilter === 'ALL' || status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [skills, search, selectedCategory, statusFilter, progressMap]);

  // Summary stats
  const stats = useMemo(() => {
    const completed = skills.filter((s) => progressMap.get(s.id)?.status === 'COMPLETED').length;
    const inProgress = skills.filter((s) => progressMap.get(s.id)?.status === 'IN_PROGRESS').length;
    const total = skills.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, inProgress, total, pct };
  }, [skills, progressMap]);

  const handleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const isLoading = statusLoading || roadmapLoading || progressLoading;

  // ─── No roadmap state ──────────────────────────────────────────────────────
  if (!isLoading && !hasRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center text-4xl">
          🧠
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">No Skills Yet</h2>
          <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
            Generate your personalized learning roadmap first. Gemini AI will build a custom skill path just for you.
          </p>
        </div>
        <button
          onClick={() => navigate('/onboarding')}
          className="btn-primary px-8 py-3 text-base font-semibold bg-gradient-to-r from-primary-600 to-accent-600"
        >
          🤖 Generate My Roadmap
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading your skills…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
            {topic}
          </span>
          <h1 className="text-3xl font-bold text-white mt-2 mb-1">My Skills</h1>
          <p className="text-slate-400 text-sm">
            Track and update your progress across all {stats.total} skills in your roadmap.
          </p>
        </div>
        <button
          onClick={() => navigate('/onboarding')}
          className="btn-secondary text-sm self-start shrink-0"
        >
          🔄 New Roadmap
        </button>
      </div>

      {/* ─── Stats Bar ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Skills', value: stats.total, color: 'text-white' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-400' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-sky-400' },
          { label: 'Completion', value: `${stats.pct}%`, color: 'text-primary-400' },
        ].map((s) => (
          <div key={s.label} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-slate-300">Overall Roadmap Progress</p>
          <span className="text-sm font-bold text-primary-400">{stats.pct}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
      </div>

      {/* ─── Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-primary-600 text-white border-primary-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white border-primary-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status filter chips */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              statusFilter === f.value
                ? 'bg-slate-200 text-slate-900 border-slate-200'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            {f.label}
            {f.value !== 'ALL' && (
              <span className="ml-1.5 opacity-70">
                ({skills.filter((s) => (progressMap.get(s.id)?.status ?? 'NOT_STARTED') === f.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Skills Grid ────────────────────────────────────────────── */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">No skills match your filters.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('ALL'); setStatusFilter('ALL'); }}
            className="mt-3 text-xs text-primary-400 hover:text-primary-300 underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => {
            const prog = progressMap.get(skill.id);
            return (
              <SkillCard
                key={skill.id}
                skill={skill}
                mastery={prog?.mastery ?? 0}
                status={prog?.status ?? 'NOT_STARTED'}
                isExpanded={expandedId === skill.id}
                onExpand={() => handleExpand(skill.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
