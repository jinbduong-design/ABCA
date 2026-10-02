import {
  generateWithModelFallback,
  parseJsonText,
  sendAIUnavailable,
} from '../_lib/gemini';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const {
    scenarioTitle,
    scenarioContext,
    scenarioGoal,
    userLevel = 'A0',
    practiceMode = 'guided',
    suggestedPhrases = [],
    turnNumber = 1,
    userMessage,
    history = [],
  } = req.body || {};

  if (!userMessage || !String(userMessage).trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const modeRule =
      practiceMode === 'guided'
        ? 'Guided: use one short German sentence, include concise English translation, and give one short hint.'
        : practiceMode === 'challenge'
        ? 'Challenge: natural German, do not proactively hint unless the learner is stuck.'
        : 'Natural: 1-2 natural German sentences with minimal help.';

    const phraseBank = Array.isArray(suggestedPhrases)
      ? suggestedPhrases
          .slice(0, 6)
          .map(
            (phrase: any) =>
              `${phrase?.german || ''} = ${phrase?.english || phrase?.vietnamese || ''}`
          )
          .join('\n')
      : '';

    const prompt = `You are a native German roleplay partner and a gentle coach for a Vietnamese beginner.

SCENARIO: ${scenarioTitle || 'German conversation'}
CONTEXT: ${scenarioContext || ''}
GOAL: ${scenarioGoal || 'Complete a short realistic exchange.'}
LEARNER LEVEL: ${userLevel}
TURN: ${turnNumber}
MODE: ${modeRule}

REFERENCE PHRASES:
${phraseBank || '(none)'}

RULES:
1. Stay in character. Do not turn the reply into a lecture.
2. Keep the German reply short and appropriate to ${userLevel}.
3. Ask or respond with only one main conversational move per turn.
4. If the learner is understandable, do not over-correct.
5. If correction is needed, correct only the single most important issue.
6. English translation should always be short and natural.
7. Vietnamese explanation should only be provided as a fallback field for the UI, not as the primary translation.
8. missionProgress must reflect actual goal completion, not turn count.

HISTORY:
${history
  .slice(-10)
  .map((item: any) => `${item.sender === 'user' ? 'Learner' : 'Partner'}: ${item.text}`)
  .join('\n')}

LEARNER MESSAGE:
${userMessage}

Return JSON only:
{
  "aiReply": "German reply",
  "aiReplyEnglish": "short English translation",
  "aiReplyTranslation": "short Vietnamese fallback translation",
  "correction": {
    "hasMistake": false,
    "original": "${String(userMessage).replace(/"/g, '\"')}",
    "better": "better German version",
    "explanation": "very short Vietnamese explanation"
  },
  "englishHint": "one short English hint for the next reply",
  "vietnameseHint": "Vietnamese fallback hint",
  "microFeedback": {
    "whatWentWell": "specific short feedback",
    "oneFix": "at most one fix",
    "usefulPhrase": "one reusable German phrase with English meaning"
  },
  "missionProgress": {
    "percent": 0,
    "achieved": [],
    "nextMission": "one concrete next action",
    "complete": false
  }
}`;

    const text = await generateWithModelFallback(req, {
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.55,
    });

    const parsed = parseJsonText(text);
    return res.status(200).json(parsed);
  } catch (error) {
    return sendAIUnavailable(res, error);
  }
}
