import React, { useState, useEffect } from 'react';
import type { Skill, ProgressStatus } from '../../types';
import { usePrerequisites, useSkillTree } from '../../hooks/useGraph';
import { useUpsertProgress } from '../../hooks/useProgress';

interface SkillDetailPanelProps {
  skill: Skill | null;
  onClose: () => void;
  userProgress: Array<{ skillId: string; mastery: number; status: ProgressStatus }> | undefined;
  onJumpToSkill: (skillId: string) => void;
}

export const SkillDetailPanel: React.FC<SkillDetailPanelProps> = ({
  skill,
  onClose,
  userProgress,
  onJumpToSkill,
}) => {
  const [mastery, setMastery] = useState(0);
  const [status, setStatus] = useState<ProgressStatus>('NOT_STARTED');

  const { data: prerequisites, isLoading: loadingPrereqs } = usePrerequisites(skill?.id ?? null);
  const { data: unlocks, isLoading: loadingUnlocks } = useSkillTree(skill?.id ?? null);
  const { mutate: upsertProgress, isPending: updating } = useUpsertProgress();

  // Find user's current progress for this skill
  const currentProgress = userProgress?.find((p) => p.skillId === skill?.id);

  // Sync state with current progress
  useEffect(() => {
    if (currentProgress) {
      setMastery(currentProgress.mastery);
      setStatus(currentProgress.status);
    } else {
      setMastery(0);
      setStatus('NOT_STARTED');
    }
  }, [currentProgress, skill]);

  if (!skill) return null;

  const handleUpdateProgress = (e: React.FormEvent) => {
    e.preventDefault();
    upsertProgress({
      skillId: skill.id,
      mastery,
      status,
    });
  };

  // Synchronize mastery when status is updated
  const handleStatusChange = (newStatus: ProgressStatus) => {
    setStatus(newStatus);
    if (newStatus === 'COMPLETED') {
      setMastery(100);
    } else if (newStatus === 'NOT_STARTED') {
      setMastery(0);
    }
  };

  return (
    <div className="fixed top-[64px] right-0 bottom-0 w-full sm:w-[420px] bg-slate-800/95 backdrop-blur-md border-l border-slate-700 p-6 shadow-2xl flex flex-col z-40 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
            {skill.category}
          </span>
          <h2 className="text-xl font-bold text-white mt-2 leading-tight">{skill.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {/* Description */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
            {skill.description || 'No description provided for this skill.'}
          </p>
        </div>

        {/* Progress Form */}
        <form onSubmit={handleUpdateProgress} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
            <span>📈</span> Update Mastery
          </h3>

          {/* Status Checkboxes */}
          <div>
            <label className="label">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as ProgressStatus[]).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                    status === st
                      ? st === 'COMPLETED'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : st === 'IN_PROGRESS'
                          ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                          : 'bg-slate-700 border-slate-600 text-slate-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Mastery Range Slider */}
          {status !== 'NOT_STARTED' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label">Mastery level</label>
                <span className="text-xs font-semibold text-primary-400">{mastery}%</span>
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

          <button
            type="submit"
            disabled={updating}
            className="w-full btn-primary py-2 text-sm font-semibold shadow-md flex items-center justify-center gap-2"
          >
            {updating ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
            ) : null}
            Save Progress
          </button>
        </form>

        {/* Prerequisites (BFS Traverse) */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Prerequisites (BFS Order)</h3>
          {loadingPrereqs ? (
            <div className="text-xs text-slate-500 py-1">Loading prerequisites...</div>
          ) : prerequisites && prerequisites.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {prerequisites.map((prereq) => (
                <button
                  key={prereq.id}
                  type="button"
                  onClick={() => onJumpToSkill(prereq.id)}
                  className="text-xs bg-slate-900 hover:bg-slate-900/80 border border-slate-700/60 rounded px-2.5 py-1 text-slate-300 hover:border-slate-500 transition-colors"
                >
                  {prereq.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No prerequisites required. This is a root skill!</p>
          )}
        </div>

        {/* Downstream Unlocks (DFS Tree) */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills Unlocked Next</h3>
          {loadingUnlocks ? (
            <div className="text-xs text-slate-500 py-1">Loading downstream tree...</div>
          ) : unlocks && unlocks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {unlocks.map((unl) => (
                <button
                  key={unl.id}
                  type="button"
                  onClick={() => onJumpToSkill(unl.id)}
                  className="text-xs bg-slate-900 hover:bg-slate-900/80 border border-slate-700/60 rounded px-2.5 py-1 text-slate-300 hover:border-slate-500 transition-colors"
                >
                  {unl.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No further skills depend on this skill.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default SkillDetailPanel;
