import React, { useState } from 'react';
import { useSkills, useCategories } from '../hooks/useSkills';

const SkillsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  
  const { 
    data: skillsResponse, 
    isLoading: isLoadingSkills,
    error: skillsError
  } = useSkills(1, 100, selectedCategory === 'All' ? undefined : selectedCategory);

  const skills = skillsResponse?.data || [];
  const isLoading = isLoadingSkills || isLoadingCategories;
  const error = skillsError ? (skillsError as Error).message : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills Catalog</h2>
          <p className="text-slate-400 text-sm">
            Explore 20 foundational skills defined in the system
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              selectedCategory === 'All'
                ? 'bg-primary-600 text-white border-primary-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white border-primary-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No skills found in database.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div key={skill.id} className="card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
                    {skill.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xxs font-semibold tracking-wide uppercase ${
                      skill.difficulty === 'BEGINNER'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : skill.difficulty === 'INTERMEDIATE'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {skill.difficulty}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{skill.name}</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {skill.description || 'No description available.'}
                </p>
              </div>
              <div className="text-xxs text-slate-500 border-t border-slate-700 pt-3">
                ID: {skill.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
