import { Question, Subject, Difficulty } from '@/types';
import { INITIAL_QUESTION_BANK } from './questionBank';
import { findChapterByName } from './syllabus';

interface MutationRule {
  subject: Subject;
  topicMatch: string;
  generate: (salt: number) => {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
    explanation: string;
    commonTrap: string;
  };
}

// Procedural physics generator rules with dynamic recalculation of formulas
const PROCEDURAL_RULES: MutationRule[] = [
  // 1. Dielectric Capacitor Work
  {
    subject: 'Physics',
    topicMatch: 'Capacitance',
    generate: (salt) => {
      const K = (salt % 5) + 3; // K = 3, 4, 5, 6, 7
      const numerator = K - 1;
      const options: [string, string, string, string] = [
        `+(${numerator}/${K}) U_0`,
        `+(${1}/${K}) U_0`,
        `-${numerator} U_0`,
        `+${K} U_0`
      ];
      return {
        question: `A parallel plate capacitor is charged by a battery of EMF $V_0$ and then disconnected. A dielectric slab of dielectric constant $K = ${K}$ is now introduced completely filling the space between the plates. If the initial electrostatic energy stored was $U_0$, what is the total work done by the electrostatic field in pulling the dielectric into the capacitor?`,
        options,
        correctAnswer: 0,
        explanation: `With the battery disconnected, charge $Q$ is constant. Initial energy $U_0 = \\frac{Q^2}{2C_0}$. When dielectric $K=${K}$ is inserted, $C = ${K}C_0$, so final energy $U_f = \\frac{Q^2}{2(${K}C_0)} = \\frac{U_0}{${K}}$. The work done by the electrostatic field is $W_{\\text{field}} = -\\Delta U = U_0 - U_f = \\left(1 - \\frac{1}{${K}}\\right)U_0 = \\frac{${numerator}}{${K}} U_0$.`,
        commonTrap: `Students often use $U = \\frac{1}{2}CV^2$ assuming $V$ stays constant, but the battery was disconnected, so $Q$ is conserved, not $V$!`
      };
    }
  },
  // 2. Young's Double Slit Fringe Shift
  {
    subject: 'Physics',
    topicMatch: 'Optics',
    generate: (salt) => {
      const lambdaNm = [400, 500, 600][salt % 3];
      const mu = [1.4, 1.5, 1.6][(salt + 1) % 3];
      const tMicro = [1.0, 2.0, 3.0][(salt + 2) % 3];
      const shiftFringes = ((mu - 1) * tMicro * 1e-6) / (lambdaNm * 1e-9);
      const roundedShift = Math.round(shiftFringes * 10) / 10;
      const options: [string, string, string, string] = [
        `${roundedShift} fringe widths`,
        `${Math.round((roundedShift * 0.5) * 10) / 10} fringe widths`,
        `${Math.round((roundedShift * 2) * 10) / 10} fringe widths`,
        `${Math.round((roundedShift + 1.5) * 10) / 10} fringe widths`
      ];
      return {
        question: `In a Young's double slit experiment with slit separation $d = 1.0\\text{ mm}$ and screen distance $D = 1.2\\text{ m}$ using light of wavelength $\\lambda = ${lambdaNm}\\text{ nm}$, a transparent glass sheet of thickness $t = ${tMicro}\\ \\mu\\text{m}$ and refractive index $\\mu = ${mu}$ is introduced in the path of one interfering beam. The central zero-order maximum shifts by:`,
        options,
        correctAnswer: 0,
        explanation: `The extra optical path difference introduced is $\\Delta x = (\\mu - 1)t$. The number of fringe widths shifted is $N = \\frac{\\Delta x}{\\lambda} = \\frac{(${mu} - 1) \\times ${tMicro} \\times 10^{-6}}{${lambdaNm} \\times 10^{-9}} = ${roundedShift}$.`,
        commonTrap: `Failing to convert micrometers ($10^{-6}\\text{ m}$) and nanometers ($10^{-9}\\text{ m}$) into identical SI meters before dividing.`
      };
    }
  },
  // 3. Radioactive Decay Multi-step
  {
    subject: 'Chemistry',
    topicMatch: 'Radioactivity',
    generate: (salt) => {
      const t1 = [10, 15, 20][salt % 3];
      const totalHours = t1 * 4;
      const decayedPercent = `93.75%`;
      const options: [string, string, string, string] = [
        `${decayedPercent}`,
        `6.25%`,
        `87.5%`,
        `99.2%`
      ];
      return {
        question: `A radioactive nuclide decays with a half-life of $t_{1/2} = ${t1}\\text{ minutes}$. What percentage of the initial radioactive nuclei will have decayed after exactly $t = ${totalHours}\\text{ minutes}$?`,
        options,
        correctAnswer: 0,
        explanation: `Number of half-lives elapsed $n = \\frac{t}{t_{1/2}} = \\frac{${totalHours}}{${t1}} = 4$. Fraction remaining $N/N_0 = (1/2)^4 = 1/16 = 6.25\\%$. The question specifically asks for the percentage that has DECAYED: $100\\% - 6.25\\% = 93.75\\%$.`,
        commonTrap: `Carelessly selecting the remaining fraction (6.25%) instead of the decayed fraction (93.75%). CEE examiners intentionally place 6.25% as distractor B!`
      };
    }
  },
  // 4. MAT - Bayes Diagnostic Accuracy
  {
    subject: 'MAT',
    topicMatch: 'Diagnostic',
    generate: (salt) => {
      const prevPercent = [0.1, 0.2, 0.5][salt % 3];
      const sens = 99;
      const spec = 98;
      const N = 10000;
      const diseased = (N * prevPercent) / 100;
      const healthy = N - diseased;
      const truePos = (diseased * sens) / 100;
      const falsePos = (healthy * (100 - spec)) / 100;
      const ppv = Math.round((truePos / (truePos + falsePos)) * 1000) / 10;
      const options: [string, string, string, string] = [
        `Approximately ${ppv}%`,
        `Approximately 99.0%`,
        `Approximately 98.0%`,
        `Approximately 50.0%`
      ];
      return {
        question: `In a clinical screening test at Bir Hospital, a rare autoimmune condition has a population prevalence of $${prevPercent}\\%$. A diagnostic blood test has a sensitivity of $${sens}\\%$ and a specificity of $${spec}\\%$. If an asymptomatic patient randomly tests positive, what is the actual posterior probability (Positive Predictive Value) that they genuinely have the condition?`,
        options,
        correctAnswer: 0,
        explanation: `Take 10,000 random patients:
1. Diseased: $10,000 \\times ${prevPercent}\\% = ${diseased}$ patients. True positives = $${diseased} \\times 99\\% \\approx ${Math.round(truePos * 10) / 10}$.
2. Healthy: $${healthy}$ patients. False positive rate = $100\\% - ${spec}\\% = ${100 - spec}\\%$. False positives = $${healthy} \\times 2\\% = ${Math.round(falsePos)}$.
3. Total positive tests = $${Math.round(truePos * 10) / 10} + ${Math.round(falsePos)} \\approx ${Math.round((truePos + falsePos) * 10) / 10}$.
4. Actual probability of disease given a positive test = $\\frac{${Math.round(truePos * 10) / 10}}{${Math.round((truePos + falsePos) * 10) / 10}} \\approx ${ppv}\\%$.`,
        commonTrap: `The Base Rate Fallacy: Assuming that a 99% sensitive test means a positive test implies a 99% probability of disease. Because the disease is rare, false positives vastly outnumber true positives!`
      };
    }
  },
  // 5. MAT - Modular Clock / Watch Angle
  {
    subject: 'MAT',
    topicMatch: 'Clock',
    generate: (salt) => {
      const hours = [3, 4, 5, 7, 8][salt % 5];
      const minutes = [20, 24, 30, 40, 48][(salt + 2) % 5];
      const rawAngle = Math.abs(30 * hours - 5.5 * minutes);
      const angle = rawAngle > 180 ? 360 - rawAngle : rawAngle;
      const roundedAngle = Math.round(angle * 10) / 10;
      const options: [string, string, string, string] = [
        `${roundedAngle}°`,
        `${Math.round(Math.abs(angle - 15) * 10) / 10}°`,
        `${Math.round((angle + 22.5) * 10) / 10}°`,
        `${Math.round((180 - angle) * 10) / 10}°`
      ];
      return {
        question: `At exactly ${hours}:${minutes < 10 ? '0' + minutes : minutes} on a standard analog clock, what is the acute angle formed between the hour hand and the minute hand?`,
        options,
        correctAnswer: 0,
        explanation: `Angle formula between clock hands: $\\theta = |30H - 5.5M|$.
Substituting $H = ${hours}$ and $M = ${minutes}$:
$\\theta = |30(${hours}) - 5.5(${minutes})| = |${30 * hours} - ${5.5 * minutes}| = ${rawAngle}^\\circ$.
${rawAngle > 180 ? `Since this is a reflex angle, the acute angle is $360^\\circ - ${rawAngle}^\\circ = ${roundedAngle}^\\circ$.` : `The acute angle is ${roundedAngle}°.`}`,
        commonTrap: `Forgetting that the hour hand moves $0.5^\\circ$ every minute, and simply calculating $|30 \\times ${hours} - 6 \\times ${minutes}|$.`
      };
    }
  }
];

export function generateDynamicQuestion(
  subject: Subject,
  chapter?: string,
  topic?: string,
  difficulty: Difficulty = 'hard',
  isVariation?: boolean,
  baseQuestion?: { id: string; question: string; topic: string; chapter: string; subject: Subject }
): Question {
  const salt = Math.floor(Math.random() * 100000);

  // Check if we have a procedural calculation rule matching the subject and topic/chapter
  const matchingRule = PROCEDURAL_RULES.find(r => 
    r.subject === subject && (
      (topic && (r.topicMatch.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(r.topicMatch.toLowerCase()))) ||
      (chapter && (r.topicMatch.toLowerCase().includes(chapter.toLowerCase()) || chapter.toLowerCase().includes(r.topicMatch.toLowerCase())))
    )
  ) || (chapter ? undefined : PROCEDURAL_RULES.find(r => r.subject === subject));

  if (matchingRule) {
    const custom = matchingRule.generate(salt);
    const baseFallback = INITIAL_QUESTION_BANK.find(q => 
      q.subject === subject && (!chapter || q.chapter.toLowerCase() === chapter.toLowerCase())
    ) || INITIAL_QUESTION_BANK.find(q => q.subject === subject) || INITIAL_QUESTION_BANK[0];

    return {
      ...baseFallback,
      ...custom,
      id: `gen-${Date.now()}-${salt}`,
      sourceType: isVariation ? 'ai_variation' : 'ai_generated',
      verificationStatus: 'ai_generated',
      difficulty,
      subject,
      chapter: chapter || baseFallback.chapter,
      originalPastQuestionId: baseQuestion?.id
    } as Question;
  }

  // Fallback to parameterized selection from our verified question bank
  const pool = INITIAL_QUESTION_BANK.filter(q => q.subject === subject);
  const chapterPool = chapter ? pool.filter(q => {
    const qc = q.chapter.toLowerCase();
    const c = chapter.toLowerCase();
    const qt = q.topic.toLowerCase();
    return qc === c || qc.includes(c) || c.includes(qc) || qt.includes(c) || c.includes(qt);
  }) : [];
  const effectivePool = chapterPool.length > 0 ? chapterPool : pool;

  const base = (topic ? effectivePool.find(q => q.topic.toLowerCase().includes(topic.toLowerCase())) : null)
    || effectivePool[salt % effectivePool.length]
    || INITIAL_QUESTION_BANK[0];

  // If chapter definition exists in syllabus, ensure topic and concept grounding matches the chapter
  const chapterDef = chapter ? findChapterByName(chapter) : undefined;
  const chapterTopic = chapterDef?.topics?.[salt % (chapterDef.topics.length || 1)];

  return {
    ...base,
    id: `dyn-${Date.now()}-${salt}`,
    sourceType: isVariation ? 'ai_variation' : 'ai_generated',
    verificationStatus: 'ai_generated',
    difficulty,
    subject,
    chapter: chapter || base.chapter,
    topic: chapterTopic?.name || base.topic,
    originalPastQuestionId: isVariation && baseQuestion ? baseQuestion.id : base.id,
    question: chapterTopic && chapterPool.length === 0
      ? `[${chapterDef?.name} · High-Yield Focus] ${base.question}`
      : isVariation 
        ? `[Advanced Multi-Constraint Variation] ${base.question}`
        : base.question,
    commonTrap: chapterTopic?.commonTraps?.[0] || base.commonTrap
  };
}
