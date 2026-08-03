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
    colorClass: 'text-indigo-600 bg-indigo-50',
    borderHover: 'hover:border-indigo-600 hover:bg-indigo-50/50',
  },
  {
    id: 'HR',
    label: 'HR',
    description: 'Career motivation, strengths, weaknesses, salary expectations, and cultural fit questions.',
    icon: <BriefcaseBusiness className="w-6 h-6" />,
    colorClass: 'text-amber-600 bg-amber-50',
    borderHover: 'hover:border-amber-600 hover:bg-amber-50/50',
  },
  {
    id: 'BEHAVIOURAL',
    label: 'Behavioral',
    description: 'STAR-method scenarios covering conflict resolution, leadership, teamwork, and ownership.',
    icon: <Users className="w-6 h-6" />,
    colorClass: 'text-violet-600 bg-violet-50',
    borderHover: 'hover:border-violet-600 hover:bg-violet-50/50',
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
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          Mock Interview Simulator
        </h1>
        <p className="mt-1 text-slate-500 text-sm">
          AI-generated questions tailored to your role with instant scoring and model answers.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* ── Step 1: Role Input ─────────────────────────────── */}
      {step === 'role' && (
        <div className="max-w-lg mx-auto">
          <div className="card bg-white space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">What role are you preparing for?</h2>
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
              <p className="text-xs text-slate-400">
                Pre-filled from your profile — edit freely for this session.
              </p>
            </div>

            <button
              onClick={() => setStep('type')}
              disabled={!role.trim()}
              className="btn-primary w-full py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
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
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <div className="h-4 w-px bg-slate-300" />
            <span className="text-sm text-slate-500">
              Role: <span className="text-indigo-600 font-bold">{role}</span>
            </span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Select Interview Type</h2>
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
                  'p-6 bg-white border border-slate-200 rounded-2xl text-left space-y-4 group transition-all shadow-xs',
                  t.borderHover,
                  loading ? 'opacity-60 cursor-not-allowed' : '',
                ].join(' ')}
              >
                <div className={['p-3 rounded-xl w-fit transition-transform group-hover:scale-105', t.colorClass].join(' ')}>
                  {t.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{t.label} Round</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600">
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
          <div className="flex items-center justify-between bg-white border border-slate-200 px-5 py-3.5 rounded-xl shadow-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wide border border-indigo-100">
                {session.type}
              </span>
              <span className="text-sm text-slate-500 font-medium">
                Question <span className="text-slate-900 font-bold">{currentQuestionIndex + 1}</span> of{' '}
                <span className="text-slate-900 font-bold">{session.questions.length}</span>
              </span>
              <span className="hidden sm:block text-xs text-slate-300">·</span>
              <span className="hidden sm:block text-xs text-slate-600 font-semibold">{role}</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold transition-colors"
            >
              End Session
            </button>
          </div>

          {/* Question + Feedback */}
          {currentQuestion && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question & Answer */}
              <div className="card bg-white space-y-5">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Interviewer Question
                  </p>
                  <p className="text-base font-semibold text-slate-900 leading-relaxed">
                    {currentQuestion.questionText}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Your Response</label>
                  <textarea
                    rows={6}
                    value={currentQuestion.userAnswer || userAnswerInput}
                    onChange={(e) => setUserAnswerInput(e.target.value)}
                    disabled={!!currentQuestion.score || evaluating}
                    placeholder="Type your response here…"
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 disabled:opacity-70 resize-none font-sans"
                  />
                </div>

                {!currentQuestion.score && (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={evaluating || !userAnswerInput.trim()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition disabled:opacity-50 shadow-xs"
                  >
                    {evaluating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Submit for AI Evaluation</>
                    )}
                  </button>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => {
                      setCurrentQuestionIndex((p) => p - 1);
                      setUserAnswerInput(session.questions[currentQuestionIndex - 1]?.userAnswer || '');
                    }}
                    className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 font-semibold disabled:opacity-30 transition-colors"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={currentQuestionIndex === session.questions.length - 1}
                    onClick={() => {
                      setCurrentQuestionIndex((p) => p + 1);
                      setUserAnswerInput(session.questions[currentQuestionIndex + 1]?.userAnswer || '');
                    }}
                    className="px-3 py-2 text-xs text-indigo-600 hover:text-indigo-800 font-semibold disabled:opacity-30 flex items-center gap-1 transition-colors"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* AI Feedback */}
              <div className="card bg-white">
                {!currentQuestion.score ? (
                  <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-8">
                    <Sparkles className="w-10 h-10 text-slate-300 mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">Awaiting Your Answer</h4>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                      Submit your response to receive instant AI scoring, feedback, and a model answer.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Score */}
                    <div className="flex items-center justify-between bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
                      <div>
                        <span className="text-xs text-indigo-700 uppercase font-bold">Evaluation Score</span>
                        <h4 className="text-2xl font-black text-indigo-900 mt-0.5">
                          {currentQuestion.score}
                          <span className="text-base text-indigo-600 font-medium"> / 100</span>
                        </h4>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>

                    {/* Feedback */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Feedback
                      </h4>
                      <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed font-medium">
                        {currentQuestion.feedback}
                      </p>
                    </div>

                    {/* Improvements */}
                    {currentQuestion.suggestedImprovements && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                          Suggested Improvements
                        </h4>
                        <p className="text-xs text-slate-700 bg-amber-50/60 p-4 rounded-xl border border-amber-200 leading-relaxed font-medium">
                          {currentQuestion.suggestedImprovements}
                        </p>
                      </div>
                    )}

                    {/* Model Answer */}
                    {currentQuestion.modelAnswer && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Model Answer
                        </h4>
                        <p className="text-xs text-slate-700 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 leading-relaxed font-medium">
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
