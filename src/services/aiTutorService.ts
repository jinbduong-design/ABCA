export interface TutorChatResponse {
  reply: string;
  suggestedNext?: string;
}

export interface ConversationResponse {
  aiReply: string;
  aiReplyTranslation?: string;
  correction?: {
    hasMistake: boolean;
    original: string;
    better: string;
    explanation: string;
  };
  vietnameseHint?: string;
  microFeedback?: {
    whatWentWell?: string;
    oneFix?: string;
    usefulPhrase?: string;
  };
  missionProgress?: {
    percent: number;
    achieved?: string[];
    nextMission?: string;
    complete?: boolean;
  };
}

export interface WritingCorrectionResponse {
  score: number;
  cefrLevel: string;
  overallFeedback: string;
  correctedVersion: string;
  sentenceCorrections: {
    original: string;
    corrected: string;
    explanation: string;
    hasError: boolean;
  }[];
  vocabularySuggestions: {
    original: string;
    better: string;
    reason: string;
  }[];
  keyTips: string[];
}

async function requestAI<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = 'AI đang tạm thời không khả dụng. Hãy thử lại sau.';
    try {
      const payload = await res.json();
      if (payload?.message) message = payload.message;
    } catch {
      // Keep the clear default message when the server did not return JSON.
    }
    throw new Error(message);
  }

  return await res.json();
}

export async function askAITutor(params: {
  message: string;
  mode: string;
  history: { sender: string; text: string }[];
  userLevel?: string;
  topic?: string;
}): Promise<TutorChatResponse> {
  return requestAI<TutorChatResponse>('/api/tutor/chat', params);
}

export async function sendConversationMessage(params: {
  scenarioTitle: string;
  scenarioContext: string;
  scenarioGoal: string;
  userLevel: string;
  practiceMode: 'guided' | 'natural' | 'challenge';
  suggestedPhrases: { german: string; vietnamese: string }[];
  turnNumber: number;
  userMessage: string;
  history: { sender: string; text: string }[];
}): Promise<ConversationResponse> {
  return requestAI<ConversationResponse>('/api/conversation/message', params);
}

export async function analyzeGermanSentence(sentence: string): Promise<any> {
  return requestAI('/api/tutor/analyze-sentence', { sentence });
}

export async function correctGermanWriting(params: {
  promptTopic: string;
  userText: string;
  level?: string;
}): Promise<WritingCorrectionResponse> {
  return requestAI<WritingCorrectionResponse>('/api/tutor/correct-writing', params);
}
