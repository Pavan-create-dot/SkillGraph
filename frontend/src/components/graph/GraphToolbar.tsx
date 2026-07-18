import React from 'react';
import type { Skill } from '../../types';

interface GraphToolbarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showLearningPath: boolean;
  onToggleLearningPath: () => void;
  skills: Skill[];
  pathStart: string;
  pathEnd: string;
  onPathStartChange: (id: string) => void;
  onPathEndChange: (id: string) => void;
  onClearPath: () => void;
  layoutDirection: 'TB' | 'LR';
  onLayoutDirectionChange: (direction: 'TB' | 'LR') => void;
}

export const GraphToolbar: React.FC<GraphToolbarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  showLearningPath,
  onToggleLearningPath,
  skills,
  pathStart,
  pathEnd,
  onPathStartChange,
  onPathEndChange,
  onClearPath,
  layoutDirection,
  onLayoutDirectionChange,
}) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Filters & Layout */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Category Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-medium">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Layout Direction Toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-medium">Layout</label>
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => onLayoutDirectionChange('TB')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                layoutDirection === 'TB'
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Top-Down
            </button>
            <button
              onClick={() => onLayoutDirectionChange('LR')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                layoutDirection === 'LR'
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Left-Right
            </button>
          </div>
        </div>

        {/* Highlight Learning Path */}
        <div className="flex flex-col gap-1 justify-end h-full">
          <label className="text-xs text-slate-400 font-medium">Overlays</label>
          <button
            onClick={onToggleLearningPath}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
              showLearningPath
                ? 'bg-accent-600/20 border-accent-500 text-accent-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <span>🛣️</span>
            {showLearningPath ? 'Hide learning path order' : 'Show learning path order'}
          </button>
        </div>
      </div>

      {/* Shortest Path Finder */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <span>🔍</span> Path Finder:
        </span>

        <select
          value={pathStart}
          onChange={(e) => onPathStartChange(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none max-w-[150px]"
        >
          <option value="">Start Skill...</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <span className="text-slate-500 text-xs">➔</span>

        <select
          value={pathEnd}
          onChange={(e) => onPathEndChange(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none max-w-[150px]"
        >
          <option value="">Target Skill...</option>
          {skills
            .filter((s) => s.id !== pathStart)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>

        {(pathStart || pathEnd) && (
          <button
            onClick={onClearPath}
            className="text-xs bg-red-950/40 hover:bg-red-900/40 border border-red-800 text-red-300 px-2.5 py-1 rounded-md transition-colors"
          >
            Clear Path
          </button>
        )}
      </div>
    </div>
  );
};
export default GraphToolbar;
