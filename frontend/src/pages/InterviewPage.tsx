import React, { useState } from 'react';
import {
  startInterviewSession,
  submitInterviewAnswer,
  type InterviewSession,
  type InterviewQuestion,
} from '../api/interview.api';
import { useAuth } from '../hooks/useAuth';
import {
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Send,
  Loader2,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  BriefcaseBusiness,
  Code2,
  Users,
} from 'lucide-react';

type Step = 'role' | 'type' | 'session';

interface InterviewType {
  id: 'TECHNICAL' | 'HR' | 'BEHAVIOURAL';
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  borderHover: string;
}

const INTERVIEW_TYPES: InterviewType[] = [
  {
    id: 'TECHNICAL',
    label: 'Technical',
    description: 'Core CS concepts, data structures, algorithms, system design, and role-specific framework questions.',
    icon: <Code2 className="w-6 h-6" />,
    colorClass: 'text-primary-400 bg-primary-500/10',
    borderHover: 'hover:border-primary-500',
  },
  {
    id: 'HR',
    label: 'HR',
    description: 'Career motivation, strengths, weaknesses, salary expectations, and cultural fit questions.',
    icon: <BriefcaseBusiness className="w-6 h-6" />,
    colorClass: 'text-accent-400 bg-accent-500/10',
    borderHover: 'hover:border-accent-500',
  },
  {
    id: 'BEHAVIOURAL',
    label: 'Behavioral',
    description: 'STAR-method scenarios covering conflict resolution, leadership, teamwork, and ownership.',
    icon: <Users className="w-6 h-6" />,
    colorClass: 'text-violet-400 bg-violet-500/10',
    borderHover: 'hover:border-violet-500',
  },
];

export const InterviewPage: React.FC = () => {
  const { user } = useAuth();

  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState(user?.targetRole ?? '');

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswerInput, setUserAnswerInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async (type: 'HR' | 'TECHNICAL' | 'BEHAVIOURAL') => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await startInterviewSession(type, role.trim());
      setSession(newSession);
      setCurrentQuestionIndex(0);
      setUserAnswerInput('');
      setStep('session');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start interview session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !userAnswerInput.trim()) return;
    const currentQ = session.questions[currentQuestionIndex];
    if (!currentQ) return;

    setEvaluating(true);
    setError(null);
    try {
      const updatedQ = await submitInterviewAnswer(session.id, currentQ.id, userAnswerInput.trim());
      setSession((prev) => {
        if (!prev) return null;
        const updatedQuestions = [...prev.questions];
        updatedQuestions[currentQuestionIndex] = updatedQ;
        return { ...prev, questions: updatedQuestions };
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to evaluate answer.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleReset = () => {
    setSession(null);
    setStep('role');
    setRole(user?.targetRole ?? '');
    setCurrentQuestionIndex(0);
    setUserAnswerInput('');
    setError(null);
  };

  const currentQuestion: InterviewQuestion | undefined = session?.questions[currentQuestionIndex];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-primary-400" />
          Mock Interview Simulator
        </h1>
        <p className="mt-1 text-slate-500 text-sm">
          AI-generated questions tailored to your role with instant scoring and model answers.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* ── Step 1: Role Input ─────────────────────────────── */}
      {step === 'role' && (
        <div className="max-w-lg mx-auto">
          <div className="card space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">What role are you preparing for?</h2>
              <p className="text-slate-500 text-sm mt-1">
                The AI uses your target role to generate relevant, accurate interview questions.
              </p>
            </div>

            <div className="space-y-2">
              <label className="label" htmlFor="role-input">Target Role</label>
              <input
                id="role-input"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Full-Stack Developer, SDE-1, Data Analyst"
                className="input-field text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && role.trim()) setStep('type');
                }}
              />
              <p className="text-xs text-slate-600">
                Pre-filled from your profile — edit freely for this session.
              </p>
            </div>

            <button
              onClick={() => setStep('type')}
              disabled={!role.trim()}
              className="btn-primary w-full py-3 text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Interview Type ─────────────────────────── */}
      {step === 'type' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep('role')}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-sm text-slate-400">
              Role: <span className="text-primary-400 font-medium">{role}</span>
            </span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-100">Select Interview Type</h2>
            <p className="text-slate-500 text-sm mt-1">
              Choose the type of round you want to practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {INTERVIEW_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleStartSession(t.id)}
                disabled={loading}
                className={[
                  'p-6 bg-slate-900 border border-slate-800 rounded-2xl text-left space-y-4 group transition-all',
                  t.borderHover,
                  loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-800/60',
                ].join(' ')}
              >
                <div className={['p-3 rounded-xl w-fit transition-transform group-hover:scale-105', t.colorClass].join(' ')}>
                  {t.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 text-sm">{t.label} Round</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.description}</p>
                </div>
                <div className={['flex items-center gap-1 text-xs font-semibold', t.colorClass.split(' ')[0]].join(' ')}>
                  {loading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Starting…</>
                  ) : (
                    <>Start {t.label} <ChevronRight className="w-3.5 h-3.5" /></>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Active Session ─────────────────────────── */}
      {step === 'session' && session && (
        <div className="space-y-6">
          {/* Session Header */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-5 py-3.5 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary-500/15 text-primary-400 text-xs font-semibold rounded-full uppercase tracking-wide border border-primary-500/20">
                {session.type}
              </span>
              <span className="text-sm text-slate-400">
                Question <span className="text-slate-200 font-medium">{currentQuestionIndex + 1}</span> of{' '}
                <span className="text-slate-200 font-medium">{session.questions.length}</span>
              </span>
              <span className="hidden sm:block text-xs text-slate-600">·</span>
              <span className="hidden sm:block text-xs text-slate-500">{role}</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              End Session
            </button>
          </div>

          {/* Question + Feedback */}
          {currentQuestion && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question & Answer */}
              <div className="card space-y-5">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Interviewer Question
                  </p>
                  <p className="text-base font-medium text-slate-100 leading-relaxed">
                    {currentQuestion.questionText}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Your Response</label>
                  <textarea
                    rows={6}
                    value={currentQuestion.userAnswer || userAnswerInput}
                    onChange={(e) => setUserAnswerInput(e.target.value)}
                    disabled={!!currentQuestion.score || evaluating}
                    placeholder="Type your response here…"
                    className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 disabled:opacity-70 resize-none"
                  />
                </div>

                {!currentQuestion.score && (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={evaluating || !userAnswerInput.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-sm transition disabled:opacity-50"
                  >
                    {evaluating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Submit for AI Evaluation</>
                    )}
                  </button>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-3 border-t border-slate-700/60">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => {
                      setCurrentQuestionIndex((p) => p - 1);
                      setUserAnswerInput(session.questions[currentQuestionIndex - 1]?.userAnswer || '');
                    }}
                    className="px-3 py-2 text-xs text-slate-500 hover:text-slate-200 disabled:opacity-30 transition-colors"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={currentQuestionIndex === session.questions.length - 1}
                    onClick={() => {
                      setCurrentQuestionIndex((p) => p + 1);
                      setUserAnswerInput(session.questions[currentQuestionIndex + 1]?.userAnswer || '');
                    }}
                    className="px-3 py-2 text-xs text-primary-400 hover:text-primary-300 disabled:opacity-30 flex items-center gap-1 transition-colors"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* AI Feedback */}
              <div className="card">
                {!currentQuestion.score ? (
                  <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-8">
                    <Sparkles className="w-10 h-10 text-slate-700 mb-4" />
                    <h4 className="text-sm font-semibold text-slate-400">Awaiting Your Answer</h4>
                    <p className="text-xs text-slate-600 max-w-xs mt-1">
                      Submit your response to receive instant AI scoring, feedback, and a model answer.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Score */}
                    <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-700">
                      <div>
                        <span className="text-xs text-slate-500 uppercase font-semibold">Score</span>
                        <h4 className="text-2xl font-bold text-slate-100 mt-0.5">
                          {currentQuestion.score}
                          <span className="text-base text-slate-500 font-normal"> / 100</span>
                        </h4>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>

                    {/* Feedback */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary-400" /> Feedback
                      </h4>
                      <p className="text-xs text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-700 leading-relaxed">
                        {currentQuestion.feedback}
                      </p>
                    </div>

                    {/* Improvements */}
                    {currentQuestion.suggestedImprovements && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-semibold text-accent-400 uppercase tracking-wider">
                          Improvements
                        </h4>
                        <p className="text-xs text-slate-300 bg-slate-900 p-4 rounded-xl border border-accent-500/20 leading-relaxed">
                          {currentQuestion.suggestedImprovements}
                        </p>
                      </div>
                    )}

                    {/* Model Answer */}
                    {currentQuestion.modelAnswer && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> Model Answer
                        </h4>
                        <p className="text-xs text-slate-300 bg-slate-900 p-4 rounded-xl border border-emerald-500/20 leading-relaxed">
                          {currentQuestion.modelAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
