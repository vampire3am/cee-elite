import { NextRequest, NextResponse } from 'next/server';
import { Question, Subject, Difficulty } from '@/types';
import { generateDynamicQuestion } from '@/lib/proceduralGenerator';

interface GenerateRequestPayload {
  subject: Subject;
  chapter?: string;
  topic?: string;
  difficulty?: Difficulty;
  isVariation?: boolean;
  baseQuestion?: {
    id: string;
    question: string;
    topic: string;
    chapter: string;
    subject: Subject;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequestPayload = await req.json();
    const { subject, chapter, topic, difficulty = 'hard', isVariation, baseQuestion } = body;

    // Check API Key: either server environment variable or client custom key header
    const clientKey = req.headers.get('x-gemini-key');
    const apiKey = process.env.GEMINI_API_KEY || clientKey;

    if (!apiKey) {
      // Procedural permutation and dynamic calculation engine when no API key is provided
      const dynamicQ = generateDynamicQuestion(subject, topic, difficulty, isVariation, baseQuestion);
      return NextResponse.json({ question: dynamicQ, mode: 'procedural_dynamic' });
    }

    const systemInstruction = `You are the lead academic question architect for the Nepal Common Entrance Examination (CEE / MECEE-BL) for MBBS and BDS.
Your role is to craft rigorous, discrimination-grade questions for high-achieving science students.
Do not generate generic textbook trivia or simple formula plug-and-chug questions.
Maximize:
1. Conceptual depth and multi-step reasoning.
2. Recognition of subtle scientific distinctions and commonly held traps.
3. Plausible distractors (incorrect options based on real common errors).
4. Strictly conform to standard Nepal CEE syllabus.
5. NEVER fabricate past-year exam claims or cite fake exam years. All generated questions must be labeled strictly as AI generated.
6. Provide three-tier progressive hints:
   - Hint 1: Conceptual direction / strategy.
   - Hint 2: Key governing formula or core biological/chemical principle.
   - Hint 3: Near-solution / critical algebraic or deduction step.
7. Use KaTeX/LaTeX formatting for all math and chemical formulas enclosed in $...$ (e.g. $K_{sp}$, $\\Delta G$, $\\frac{hc}{\\lambda}$).`;

    let userPrompt = '';

    if (isVariation && baseQuestion) {
      userPrompt = `PAST -> HARD VARIATION REQUEST:
Original Verified Question Concept: ${baseQuestion.topic} (${baseQuestion.chapter}, ${baseQuestion.subject})
Original Question: "${baseQuestion.question}"

Task: Create a significantly harder conceptual variation (${difficulty.toUpperCase()} difficulty) testing the same underlying concept.
Change the constraints or introduce multi-step reasoning, composite variables, or coupled effects.
Superficial memorization must fail; genuine conceptual mastery must succeed.`;
    } else {
      userPrompt = `Generate a ${difficulty.toUpperCase()} difficulty question for Nepal CEE.
Subject: ${subject}
Chapter: ${chapter || 'High-Yield Core'}
Topic: ${topic || 'High-Yield Core'}

Instructed difficulty criteria:
${difficulty === 'elite' 
  ? 'ELITE difficulty: Require multiple integrated reasoning steps. Superficial recall must be insufficient. Must remain strictly scientifically valid and solvable within 90-120 seconds by an elite student.' 
  : 'HARD/VERY HARD difficulty: Prioritize high-yield concepts, common traps, and multi-step deductions with plausible distractors.'}
`;
    }

    const jsonSchema = {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'The question text with LaTeX formulas in $...$' },
        options: {
          type: 'array',
          items: { type: 'string' },
          minItems: 4,
          maxItems: 4,
          description: 'Exactly 4 distinct plausible options with LaTeX'
        },
        correctAnswer: { type: 'integer', minimum: 0, maximum: 3, description: '0-based index of correct option' },
        explanation: { type: 'string', description: 'Clear explanation of why the correct option is right and others wrong' },
        solution: { type: 'string', description: 'Complete step-by-step mathematical/conceptual breakdown' },
        concepts: { type: 'array', items: { type: 'string' }, description: '2 to 4 key underlying concepts' },
        commonTrap: { type: 'string', description: 'The specific trap or misconception students fall for' },
        shortcut: { type: 'string', description: 'The expert reasoning or calculation shortcut' },
        expertReasoning: { type: 'string', description: 'The quickest reliable deduction' },
        hints: {
          type: 'array',
          items: { type: 'string' },
          minItems: 3,
          maxItems: 3,
          description: 'Hint 1 (direction), Hint 2 (equation/principle), Hint 3 (almost-solution)'
        },
        estimatedTimeSeconds: { type: 'integer', description: 'Realistic time in seconds (45 to 120)' }
      },
      required: [
        'question',
        'options',
        'correctAnswer',
        'explanation',
        'solution',
        'concepts',
        'commonTrap',
        'hints',
        'estimatedTimeSeconds'
      ]
    };

    const requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: jsonSchema,
          temperature: 0.7
        }
      })
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text().catch(() => '');
      console.warn('Gemini API call failed, using high-yield fallback generator:', errText);
      const dynamicQ = generateDynamicQuestion(subject, topic, difficulty, isVariation, baseQuestion);
      return NextResponse.json({ question: dynamicQ, mode: 'procedural_dynamic' });
    }

    const data = await apiResponse.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json(
        { error: 'EMPTY_AI_RESPONSE', message: 'Gemini returned empty response' },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(candidateText);

    // Validate generated question against strict criteria
    if (
      !parsed.question ||
      !Array.isArray(parsed.options) ||
      parsed.options.length !== 4 ||
      typeof parsed.correctAnswer !== 'number' ||
      parsed.correctAnswer < 0 ||
      parsed.correctAnswer > 3 ||
      !parsed.explanation
    ) {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', message: 'Generated question failed structural validation' },
        { status: 422 }
      );
    }

    const newQuestion: Question = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sourceType: isVariation ? 'ai_variation' : 'ai_generated',
      subject,
      chapter: chapter || (baseQuestion?.chapter ?? 'Core Syllabus'),
      topic: topic || (baseQuestion?.topic ?? 'Core Concept'),
      difficulty,
      question: parsed.question,
      options: [parsed.options[0], parsed.options[1], parsed.options[2], parsed.options[3]],
      correctAnswer: parsed.correctAnswer,
      explanation: parsed.explanation,
      solution: parsed.solution || parsed.explanation,
      concepts: parsed.concepts || ['CEE Core Concept'],
      commonTrap: parsed.commonTrap || 'Watch out for sign conventions and subtle wording differences.',
      shortcut: parsed.shortcut || parsed.expertReasoning,
      expertReasoning: parsed.expertReasoning,
      hints: parsed.hints?.length === 3 ? parsed.hints : [
        'Identify what fundamental conservation law or biological principle applies here.',
        'Recall the governing relationship between the key variables.',
        'Eliminate the distractors that contradict the primary equation.'
      ],
      estimatedTimeSeconds: parsed.estimatedTimeSeconds || 75,
      source: null,
      year: null,
      verificationStatus: 'ai_generated',
      originalPastQuestionId: isVariation && baseQuestion ? baseQuestion.id : undefined
    };

    return NextResponse.json({ question: newQuestion });
  } catch (err: unknown) {
    console.error('Question generation route error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
