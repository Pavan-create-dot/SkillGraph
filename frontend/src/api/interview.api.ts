import api from './axios';

export interface InterviewQuestion {
  id: string;
  sessionId: string;
  questionText: string;
  userAnswer?: string;
  feedback?: string;
  suggestedImprovements?: string;
  modelAnswer?: string;
  score?: number;
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: 'HR' | 'TECHNICAL' | 'BEHAVIOURAL';
  createdAt: string;
  questions: InterviewQuestion[];
}

/** Start a new interview session.
 *  @param type   - Interview round type
 *  @param role   - Target role for this session (overrides profile targetRole)
 */
export const startInterviewSession = async (
  type: 'HR' | 'TECHNICAL' | 'BEHAVIOURAL',
  role: string,
): Promise<InterviewSession> => {
  const response = await api.post('/interview/start', { type, role });
  return response.data.data;
};

export const submitInterviewAnswer = async (
  sessionId: string,
  questionId: string,
  userAnswer: string,
): Promise<InterviewQuestion> => {
  const response = await api.post('/interview/answer', { sessionId, questionId, userAnswer });
  return response.data.data;
};

export const getInterviewSession = async (id: string): Promise<InterviewSession> => {
  const response = await api.get(`/interview/session/${id}`);
  return response.data.data;
};

export const getInterviewHistory = async (): Promise<InterviewSession[]> => {
  const response = await api.get('/interview/history');
  return response.data.data;
};
