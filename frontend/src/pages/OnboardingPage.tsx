import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerateRoadmap } from '../hooks/useRoadmap';
import type { RoadmapGenerateInput } from '../hooks/useRoadmap';

// ── Step types ───────────────────────────────────────────────────────────────

type Level = RoadmapGenerateInput['currentLevel'];
type GoalType = RoadmapGenerateInput['goalType'];

const STEPS = ['What to learn', 'Your level', 'Your goal', 'Time commitment'];

const LEVEL_OPTIONS: { value: Level; label: string; desc: string; icon: string }[] = [
  { value: 'BEGINNER', label: 'Beginner', desc: 'I\'m just getting started with this topic', icon: '🌱' },
  { value: 'INTERMEDIATE', label: 'Intermediate', desc: 'I know the basics and want to go deeper', icon: '🔥' },
  { value: 'ADVANCED', label: 'Advanced', desc: 'I have solid experience and want to specialise', icon: '⚡' },
];

const GOAL_OPTIONS: { value: GoalType; label: string; desc: string; icon: string }[] = [
  { value: 'GET_JOB', label: 'Get a Job', desc: 'Land a role as a professional in this field', icon: '💼' },
  { value: 'SIDE_PROJECT', label: 'Build a Project', desc: 'Create something cool on the side', icon: '🛠️' },
  { value: 'CURIOSITY', label: 'Learn for Fun', desc: 'Explore out of passion and curiosity', icon: '🔍' },
  { value: 'ACADEMIC', label: 'Academic Study', desc: 'Deep theoretical understanding for research/exams', icon: '📚' },
];

const HOURS_OPTIONS = [2, 5, 10, 20, 40];

// ── Component ────────────────────────────────────────────────────────────────

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: generateRoadmap, isPending } = useGenerateRoadmap();

  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<Level>('BEGINNER');
  const [goalType, setGoalType] = useState<GoalType>('GET_JOB');
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [error, setError] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');

  const canProceed = () => {
    if (step === 0) return topic.trim().length >= 2;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleGenerate = async () => {
    setError('');
    try {
      const result = await generateRoadmap({ topic: topic.trim(), currentLevel: level, goalType, hoursPerWeek });
      setGeneratedTitle(result.roadmapTitle);
      setStep(STEPS.length); // success screen
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to generate roadmap. Please try again.');
    }
  };

  const progressPct = Math.round((step / STEPS.length) * 100);

  // ─── Success Screen ───────────────────────────────────────────────────────
  if (step === STEPS.length) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-6 animate-fade-in">
          <div className="text-7xl animate-bounce">🎉</div>
          <h1 className="text-3xl font-bold text-white">Your Roadmap is Ready!</h1>
          <p className="text-slate-300 text-lg">
            <span className="text-primary-400 font-semibold">"{generatedTitle}"</span>
            <br />
            has been created and personalized just for you.
          </p>
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-left space-y-3">
            <p className="text-slate-300 text-sm flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Skills generated and saved to your profile
            </p>
            <p className="text-slate-300 text-sm flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Prerequisite connections mapped as a graph
            </p>
            <p className="text-slate-300 text-sm flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Progress tracking enabled for all skills
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              id="btn-view-graph"
              onClick={() => navigate('/skills/graph')}
              className="btn-primary px-8 py-3 text-base"
            >
              View My Knowledge Graph →
            </button>
            <button
              id="btn-go-dashboard"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary px-8 py-3 text-base"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Loading Screen ───────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Animated AI icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary-500/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-4 border-primary-500/50 animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Gemini AI is building your roadmap…</h2>
            <p className="text-slate-400">Analyzing your goals and designing a personalized learning path for</p>
            <p className="text-primary-400 font-semibold text-lg mt-1">"{topic}"</p>
          </div>
          <div className="space-y-3 text-left">
            {['Crafting skill breakdown…', 'Mapping prerequisites…', 'Ordering by difficulty…', 'Saving to your profile…'].map((msg, i) => (
              <div key={msg} className="flex items-center gap-3 text-slate-400 text-sm" style={{ animationDelay: `${i * 0.5}s` }}>
                <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin flex-shrink-0" />
                {msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Wizard ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top progress bar */}
      <div className="w-full h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">SG</div>
            <span className="text-white font-bold text-lg">SkillGraph</span>
            <span className="text-xs bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded px-1.5 py-0.5 ml-1">AI</span>
          </div>

          {/* Step indicator */}
          <div className="flex gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
                  i < step ? 'bg-primary-500 text-white' :
                  i === step ? 'bg-primary-500/20 border-2 border-primary-500 text-primary-400' :
                  'bg-slate-800 border border-slate-700 text-slate-500'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-all duration-500 ${i < step ? 'bg-primary-500' : 'bg-slate-700'}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── Step 0: Topic ─────────────────────────────────────────── */}
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">What do you want to learn?</h1>
                <p className="text-slate-400">Be specific — the more precise, the better your roadmap.</p>
              </div>
              <div className="space-y-2">
                <input
                  id="input-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                  placeholder="e.g. React, Machine Learning, AWS, Rust, UI/UX Design…"
                  autoFocus
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 text-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
                <p className="text-xs text-slate-500 pl-1">Press Enter or click Next to continue</p>
              </div>
              {/* Example suggestions */}
              <div className="flex flex-wrap gap-2">
                {['React', 'Python', 'Machine Learning', 'DevOps', 'Rust', 'Flutter', 'Data Science', 'GraphQL'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setTopic(suggestion)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      topic === suggestion
                        ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 1: Level ─────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">What's your current level?</h1>
                <p className="text-slate-400">This helps tailor the difficulty of your roadmap.</p>
              </div>
              <div className="space-y-3">
                {LEVEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    id={`btn-level-${opt.value.toLowerCase()}`}
                    onClick={() => setLevel(opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                      level === opt.value
                        ? 'border-primary-500 bg-primary-500/10 ring-2 ring-primary-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-3xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{opt.label}</p>
                      <p className="text-sm text-slate-400">{opt.desc}</p>
                    </div>
                    {level === opt.value && (
                      <span className="ml-auto text-primary-400 text-xl">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Goal ──────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">What's your main goal?</h1>
                <p className="text-slate-400">Your roadmap will be optimized for this outcome.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    id={`btn-goal-${opt.value.toLowerCase()}`}
                    onClick={() => setGoalType(opt.value)}
                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-200 ${
                      goalType === opt.value
                        ? 'border-accent-500 bg-accent-500/10 ring-2 ring-accent-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-3xl">{opt.icon}</span>
                    <p className="font-semibold text-white text-sm">{opt.label}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
                    {goalType === opt.value && (
                      <span className="text-accent-400 text-sm">✓ Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Hours ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">How many hours per week?</h1>
                <p className="text-slate-400">Be realistic — we'll pace the roadmap accordingly.</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-400 px-1">
                  <span>Casual</span>
                  <span className="font-bold text-white text-xl">{hoursPerWeek}h / week</span>
                  <span>Full-time</span>
                </div>
                <input
                  id="slider-hours"
                  type="range"
                  min={1}
                  max={40}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex gap-2 justify-between">
                  {HOURS_OPTIONS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHoursPerWeek(h)}
                      className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
                        hoursPerWeek === h
                          ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary card */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Your Roadmap Summary</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Topic</p>
                    <p className="text-white font-medium">{topic}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Level</p>
                    <p className="text-white font-medium capitalize">{level.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Goal</p>
                    <p className="text-white font-medium">
                      {GOAL_OPTIONS.find((g) => g.value === goalType)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Time</p>
                    <p className="text-white font-medium">{hoursPerWeek}h / week</p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* ── Navigation Buttons ─────────────────────────────────────── */}
          <div className="flex justify-between mt-8">
            <button
              id="btn-back"
              onClick={handleBack}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                id="btn-next"
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                id="btn-generate"
                onClick={handleGenerate}
                disabled={isPending}
                className="btn-primary px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-base font-semibold shadow-lg shadow-primary-500/20"
              >
                🤖 Generate My Roadmap
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
