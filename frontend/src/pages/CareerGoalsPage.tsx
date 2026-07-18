import React, { useState } from 'react';
import { useCareerGoals, useUpdateSelectedCareerGoal } from '../hooks/useCareerGoals';

const CareerGoalsPage: React.FC = () => {
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const { data: careerGoals = [], isLoading, error: queryError } = useCareerGoals();
  const { mutate: selectGoal, isPending: isSubmitting, error: mutationError } = useUpdateSelectedCareerGoal();

  const error = (queryError as Error)?.message || (mutationError as Error)?.message || null;

  const handleSelect = (goalId: string) => {
    setSelectionMessage(null);
    setSelectedGoalId(goalId);

    selectGoal(goalId, {
      onSuccess: () => {
        setSelectionMessage('Selected goal registered successfully!');
      },
      onError: () => {
        setSelectedGoalId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Career Goals</h2>
        <p className="text-slate-400 text-sm">
          Select a career goal to check its impact on your personalized skill path
        </p>
      </div>

      {selectionMessage && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {selectionMessage}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerGoals.map((goal) => (
            <div key={goal.id} className="card flex flex-col justify-between hover:border-slate-600 transition-colors">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{goal.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {goal.description || 'No description available for this career goal.'}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                <span className="text-xxs text-slate-500">ID: {goal.id}</span>
                <button
                  onClick={() => handleSelect(goal.id)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    selectedGoalId === goal.id && isSubmitting
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {selectedGoalId === goal.id && isSubmitting ? 'Registering...' : 'Select Goal'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerGoalsPage;
