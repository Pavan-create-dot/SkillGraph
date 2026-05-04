import React, { useState } from 'react';
import {
  startInterviewSession,
  submitInterviewAnswer,
  type InterviewSession,
  type InterviewQuestion,
} from '../api/interview.api';
import {
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Award,
  Send,
  Loader2,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const InterviewPage: React.FC = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswerInput, setUserAnswerInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async (type: 'HR' | 'TECHNICAL' | 'BEHAVIOURAL') => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await startInterviewSession(type);
      setSession(newSession);
      setCurrentQuestionIndex(0);
      setUserAnswerInput('');
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

  const currentQuestion: InterviewQuestion | undefined = session?.questions[currentQuestionIndex];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary-400" />
          AI Mock Placement Interview Simulator
        </h1>
        <p className="mt-1 text-slate-400 text-sm">
          Practice role-tailored technical, HR, and behavioral placement interview questions with instant AI scoring and exemplar model answers.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Start Session Controls */}
      {!session && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
          <h2 className="text-xl font-bold text-slate-100">Select Interview Session Type</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Our AI will parse your uploaded resume skills and target role to generate custom questions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
            <button
              onClick={() => handleStartSession('TECHNICAL')}
              disabled={loading}
              className="p-6 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-primary-500 rounded-2xl transition text-left space-y-3 group"
            >
              <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl w-fit group-hover:scale-110 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-200">Technical Round</h3>
              <p className="text-xs text-slate-400">Core CS concepts, coding logic, system design, and framework questions.</p>
              <div className="flex items-center gap-1 text-xs text-primary-400 font-semibold pt-2">
                Start Technical Interview <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleStartSession('HR')}
              disabled={loading}
              className="p-6 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-accent-500 rounded-2xl transition text-left space-y-3 group"
            >
              <div className="p-3 bg-accent-500/10 text-accent-400 rounded-xl w-fit group-hover:scale-110 transition">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-200">HR Round</h3>
              <p className="text-xs text-slate-400">Career aspirations, strengths, weaknesses, salary expectations, and company culture fit.</p>
              <div className="flex items-center gap-1 text-xs text-accent-400 font-semibold pt-2">
                Start HR Interview <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleStartSession('BEHAVIOURAL')}
              disabled={loading}
              className="p-6 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 rounded-2xl transition text-left space-y-3 group"
            >
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit group-hover:scale-110 transition">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-200">Behavioral Round</h3>
              <p className="text-xs text-slate-400">STAR method scenarios, conflict resolution, leadership, and teamwork examples.</p>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold pt-2">
                Start Behavioral Interview <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Active Session Display */}
      {session && (
        <div className="space-y-6">
          {/* Progress Tabs */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded-full uppercase">
                {session.type} Round
              </span>
              <span className="text-sm font-medium text-slate-300">
                Question {currentQuestionIndex + 1} of {session.questions.length}
              </span>
            </div>

            <button
              onClick={() => setSession(null)}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              End Session
            </button>
          </div>

          {/* Current Question & Answer Workspace */}
          {currentQuestion && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Question & Input */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Interviewer Question
                  </h3>
                  <p className="text-lg font-semibold text-slate-100 leading-relaxed">
                    {currentQuestion.questionText}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">
                    Your Response
                  </label>
                  <textarea
                    rows={6}
                    value={currentQuestion.userAnswer || userAnswerInput}
                    onChange={(e) => setUserAnswerInput(e.target.value)}
                    disabled={!!currentQuestion.score || evaluating}
                    placeholder="Type your response here..."
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 disabled:opacity-80"
                  />
                </div>

                {!currentQuestion.score && (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={evaluating || !userAnswerInput.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition disabled:opacity-50"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        AI Evaluating Response...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Answer for AI Evaluation
                      </>
                    )}
                  </button>
                )}

                {/* Question Navigation */}
                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => {
                      setCurrentQuestionIndex((prev) => prev - 1);
                      setUserAnswerInput(session.questions[currentQuestionIndex - 1]?.userAnswer || '');
                    }}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  >
                    Previous Question
                  </button>

                  <button
                    disabled={currentQuestionIndex === session.questions.length - 1}
                    onClick={() => {
                      setCurrentQuestionIndex((prev) => prev + 1);
                      setUserAnswerInput(session.questions[currentQuestionIndex + 1]?.userAnswer || '');
                    }}
                    className="px-4 py-2 text-xs font-medium text-primary-400 hover:text-primary-300 disabled:opacity-30 flex items-center gap-1"
                  >
                    Next Question <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* AI Feedback Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                {!currentQuestion.score ? (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8">
                    <Sparkles className="w-12 h-12 text-slate-600 mb-4" />
                    <h4 className="text-base font-semibold text-slate-300">Awaiting Your Answer</h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Type your response on the left and submit to receive instant AI scoring, feedback, and an exemplar model answer.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Score header */}
                    <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-xs text-slate-400 uppercase font-semibold">AI Assessment Score</span>
                        <h4 className="text-2xl font-bold text-slate-100">{currentQuestion.score} / 100</h4>
                      </div>
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Detailed Feedback */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-400" /> Interviewer Feedback
                      </h4>
                      <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
                        {currentQuestion.feedback}
                      </p>
                    </div>

                    {/* Improvements */}
                    {currentQuestion.suggestedImprovements && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                          Suggested Improvements
                        </h4>
                        <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-amber-500/20 leading-relaxed">
                          {currentQuestion.suggestedImprovements}
                        </p>
                      </div>
                    )}

                    {/* Model Answer */}
                    {currentQuestion.modelAnswer && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                          <BookOpen className="w-4 h-4" /> Exemplar Model Answer
                        </h4>
                        <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-emerald-500/20 leading-relaxed">
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
