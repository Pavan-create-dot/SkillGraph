import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { Skill, SkillDifficulty, ProgressStatus } from '../../types';

interface SkillNodeData {
  skill: Skill;
  mastery: number;
  status: ProgressStatus;
  learningPathIndex?: number;
  isSelected?: boolean;
  isPrerequisite?: boolean;
  isDescendant?: boolean;
  isPathNode?: boolean;
  layoutDirection: 'TB' | 'LR';
}

export const SkillNode: React.FC<{ data: SkillNodeData }> = memo(({ data }) => {
  const {
    skill,
    mastery,
    status,
    learningPathIndex,
    isSelected,
    isPrerequisite,
    isDescendant,
    isPathNode,
    layoutDirection,
  } = data;

  // Handles depend on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  // Category Color Map
  const getCategoryColor = (cat: string) => {
    const cleanCat = cat.toLowerCase();
    if (cleanCat.includes('programming')) return 'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-300';
    if (cleanCat.includes('frontend')) return 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/40 text-cyan-300';
    if (cleanCat.includes('backend')) return 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/40 text-indigo-300';
    if (cleanCat.includes('database')) return 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300';
    if (cleanCat.includes('devops')) return 'from-rose-500/20 to-rose-600/10 border-rose-500/40 text-rose-300';
    if (cleanCat.includes('data')) return 'from-purple-500/20 to-purple-600/10 border-purple-500/40 text-purple-300';
    return 'from-slate-500/20 to-slate-600/10 border-slate-500/40 text-slate-300';
  };

  // Difficulty badge colors
  const getDifficultyBadge = (diff: SkillDifficulty) => {
    switch (diff) {
      case 'BEGINNER':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'INTERMEDIATE':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'ADVANCED':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  // Border glow styling depending on highlights
  const getBorderGlow = () => {
    if (isSelected) return 'border-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.5)] ring-2 ring-primary-500/20 scale-[1.03]';
    if (isPathNode) return 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] ring-2 ring-amber-500/20';
    if (isPrerequisite) return 'border-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
    if (isDescendant) return 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
    return 'border-slate-700/80 hover:border-slate-600';
  };

  // Status background overlays
  const getStatusBg = () => {
    if (status === 'COMPLETED') return 'border-emerald-500/30';
    if (status === 'IN_PROGRESS') return 'border-primary-500/30';
    return '';
  };

  // SVG Mastery Circular Progress
  const circleRadius = 16;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (mastery / 100) * circumference;

  const getMasteryColor = () => {
    if (status === 'COMPLETED') return '#10b981'; // emerald-500
    if (status === 'IN_PROGRESS') return '#0ea5e9'; // primary-500
    return '#64748b'; // slate-500
  };

  return (
    <div
      className={`card relative w-[220px] p-4 bg-slate-800/90 backdrop-blur-md rounded-xl border flex flex-col justify-between transition-all duration-300 ${getBorderGlow()} ${getStatusBg()}`}
    >
      {/* Target handle */}
      <Handle
        type="target"
        position={targetPosition}
        className="!w-2.5 !h-2.5 !bg-slate-500 hover:!bg-primary-500 !border-slate-700 transition-colors"
      />

      {/* Header Info */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getDifficultyBadge(skill.difficulty)}`}>
          {skill.difficulty}
        </span>

        {/* Circular progress bar */}
        <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="16"
              cy="16"
              r={circleRadius}
              className="stroke-slate-700/50"
              strokeWidth="3.5"
              fill="transparent"
            />
            <circle
              cx="16"
              cy="16"
              r={circleRadius}
              stroke={getMasteryColor()}
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[9px] font-bold text-slate-300">{Math.round(mastery)}%</span>
        </div>
      </div>

      {/* Learning Path Index Badge */}
      {learningPathIndex !== undefined && (
        <span className="absolute -top-2 -left-2 w-5 h-5 bg-accent-600 border border-accent-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg">
          {learningPathIndex}
        </span>
      )}

      {/* Skill Name */}
      <h4 className="text-sm font-semibold text-slate-100 line-clamp-2 min-h-[40px] mb-3 leading-snug">
        {skill.name}
      </h4>

      {/* Footer Category Badge */}
      <div className="flex items-center justify-between border-t border-slate-700/40 pt-2">
        <span className={`text-[10px] font-semibold bg-gradient-to-r px-2 py-0.5 rounded border ${getCategoryColor(skill.category)}`}>
          {skill.category}
        </span>

        {/* Short Status Indicator */}
        <span className="text-[10px] text-slate-400 font-medium">
          {status === 'COMPLETED' ? '✅ Done' : status === 'IN_PROGRESS' ? '🔵 Learning' : '⚪ Not Started'}
        </span>
      </div>

      {/* Source handle */}
      <Handle
        type="source"
        position={sourcePosition}
        className="!w-2.5 !h-2.5 !bg-slate-500 hover:!bg-primary-500 !border-slate-700 transition-colors"
      />
    </div>
  );
});

SkillNode.displayName = 'SkillNode';
export default SkillNode;
