export interface MultipleChoiceOption {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  isCorrect: boolean;
}

export interface QuestionItem {
  id: number;
  sectorId: number;
  sectorName: string;
  affirmative: string;
  translation: string;
  canonicalAnswer: string;
  acceptedAnswers: string[];
  options: MultipleChoiceOption[];
  subject: string;
  auxiliary: 'do' | 'does';
  baseVerb: string;
  originalVerb: string;
  hints: {
    level1: string;
    level2: string;
    level3: string;
  };
}

export interface SectorInfo {
  id: number;
  name: string;
  code: string;
  theme: string;
  description: string;
  color: string;
  accentHex: number;
  questionIds: number[];
}

export const SECTORS: SectorInfo[] = [
  {
    id: 1,
    name: 'Neon Gate',
    code: 'SEC-01',
    theme: 'Entrada da Cidade',
    description: 'Portal de acesso inicial às vias cibernéticas de Chrono City.',
    color: 'from-cyan-500 to-blue-600',
    accentHex: 0x00f0ff,
    questionIds: [1, 2, 17, 18, 33, 34, 35, 61, 62, 63],
  },
  {
    id: 2,
    name: 'Merchandise District',
    code: 'SEC-02',
    theme: 'Comércio Futurista',
    description: 'Bairro comercial de alta tecnologia e logística automatizada.',
    color: 'from-amber-500 to-orange-600',
    accentHex: 0xffa500,
    questionIds: [3, 4, 19, 20, 36, 37, 38, 64, 65, 66],
  },
  {
    id: 3,
    name: 'Transit Station',
    code: 'SEC-03',
    theme: 'Transporte e Movimentação',
    description: 'Estação de monotrilhos magnéticos e transportes interplanetários.',
    color: 'from-emerald-500 to-teal-600',
    accentHex: 0x00ff88,
    questionIds: [5, 6, 21, 22, 39, 40, 41, 67, 68, 69],
  },
  {
    id: 4,
    name: 'Observation Tower',
    code: 'SEC-04',
    theme: 'Torre de Observação',
    description: 'Torre estratosférica que monitora os fluxos de energia de Chrono City.',
    color: 'from-indigo-500 to-violet-600',
    accentHex: 0x8a2be2,
    questionIds: [7, 8, 23, 24, 42, 43, 44, 70, 71, 72],
  },
  {
    id: 5,
    name: 'New York Portal',
    code: 'SEC-05',
    theme: 'Cidade e Comunicação',
    description: 'Nó quântico de comunicação e conexões intercidades.',
    color: 'from-blue-500 to-sky-600',
    accentHex: 0x3b82f6,
    questionIds: [9, 10, 25, 26, 45, 46, 47, 48, 73, 74, 75],
  },
  {
    id: 6,
    name: 'Outer City',
    code: 'SEC-06',
    theme: 'Estradas e Exploração Urbana',
    description: 'Anel perimetral e autoestradas estendidas sob as estrelas.',
    color: 'from-fuchsia-500 to-pink-600',
    accentHex: 0xff007f,
    questionIds: [11, 12, 27, 28, 49, 50, 51, 52, 76, 77],
  },
  {
    id: 7,
    name: 'Market Core',
    code: 'SEC-07',
    theme: 'Centro Comercial e Serviços',
    description: 'O pulsar dos mercados holográficos e centros de dados.',
    color: 'from-rose-500 to-red-600',
    accentHex: 0xff3366,
    questionIds: [13, 14, 29, 30, 53, 54, 55, 56, 78, 79],
  },
  {
    id: 8,
    name: 'Final Chrono Gate',
    code: 'SEC-08',
    theme: 'Núcleo Central da Cidade',
    description: 'O grande portal quântico alimentado pela energia gramatical restaurada.',
    color: 'from-yellow-400 to-amber-600',
    accentHex: 0xffd700,
    questionIds: [15, 16, 31, 32, 57, 58, 59, 60, 80],
  },
];

function getThirdPersonVerbForm(baseVerb: string): string {
  const v = baseVerb.toLowerCase();
  if (v === 'have') return 'has';
  if (v.endsWith('y') && !/[aeiou]y$/i.test(v)) {
    return v.slice(0, -1) + 'ies';
  }
  if (/(?:s|x|z|ch|sh|o)$/i.test(v)) {
    return v + 'es';
  }
  if (v.endsWith('e')) {
    return v + 's';
  }
  return v + 's';
}

export function shuffleOptionsForQuestion(
  rawOptions: { text: string; isCorrect: boolean }[],
  questionId: number
): MultipleChoiceOption[] {
  const correctOpt = rawOptions.find((o) => o.isCorrect) || rawOptions[0];
  const distractors = rawOptions.filter((o) => !o.isCorrect);

  // Pseudo-random shuffle of distractors using questionId seed
  const shuffledDistractors = [...distractors];
  const seed = questionId * 17 + 3;
  for (let i = shuffledDistractors.length - 1; i > 0; i--) {
    const j = (seed + i * 7) % (i + 1);
    [shuffledDistractors[i], shuffledDistractors[j]] = [shuffledDistractors[j], shuffledDistractors[i]];
  }

  // Determine target index for the correct option (0 to 4 => A to E)
  // Formula distributes correct answers uniformly across A, B, C, D, E:
  // e.g. Q1 -> D, Q2 -> A, Q3 -> C, Q4 -> E, Q5 -> B, Q6 -> D, Q7 -> A...
  const targetIndex = (questionId * 2 + 1) % 5;

  const resultOptions: { text: string; isCorrect: boolean }[] = [];
  let distractorIdx = 0;

  for (let i = 0; i < 5; i++) {
    if (i === targetIndex) {
      resultOptions.push(correctOpt);
    } else {
      resultOptions.push(shuffledDistractors[distractorIdx] || { text: 'N/A', isCorrect: false });
      distractorIdx++;
    }
  }

  const ids: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
  return resultOptions.map((opt, idx) => ({
    id: ids[idx],
    text: opt.text,
    isCorrect: opt.isCorrect,
  }));
}

export function generateOptionsForQuestion(q: {
  id?: number;
  canonicalAnswer: string;
  affirmative: string;
  subject: string;
  auxiliary: 'do' | 'does';
  baseVerb: string;
  originalVerb: string;
}): MultipleChoiceOption[] {
  const correct = q.canonicalAnswer;

  // 1. Wrong auxiliary (Do vs Does)
  let wrongAux: string;
  if (q.auxiliary === 'does') {
    wrongAux = correct.replace(/^Does\b/i, 'Do');
  } else {
    wrongAux = correct.replace(/^Do\b/i, 'Does');
  }

  // 2. S-form verb error (unreverted or hypercorrected)
  let sVerb = q.originalVerb;
  if (q.originalVerb.toLowerCase() === q.baseVerb.toLowerCase()) {
    sVerb = getThirdPersonVerbForm(q.baseVerb);
  }
  const baseRegex = new RegExp(`\\b${q.baseVerb}\\b`, 'i');
  let sFormDistractor = correct;
  if (baseRegex.test(correct)) {
    sFormDistractor = correct.replace(baseRegex, sVerb);
  } else {
    sFormDistractor = correct.replace(/\?$/, '') + 's?';
  }

  // 3. Missing auxiliary (Affirmative sentence as question)
  const missingAux = q.affirmative.replace(/[.]+$/, '').trim() + '?';

  // 4. Inverted auxiliary position: Subject before auxiliary (e.g. "They do enjoy...", "She does live...")
  const restAfterAux = correct.replace(/^(Do|Does)\s+/i, '').trim();
  const subjectCapitalized = q.subject.charAt(0).toUpperCase() + q.subject.slice(1);
  const restAfterSubject = restAfterAux.replace(new RegExp(`^${q.subject}\\s*`, 'i'), '').trim();
  const subjectBeforeAux = `${subjectCapitalized} ${q.auxiliary} ${restAfterSubject}`.replace(/\s+/g, ' ').trim();

  // 5. Verb-fronted inversion without auxiliary
  const verbCapitalized = sVerb.charAt(0).toUpperCase() + sVerb.slice(1);
  const predicate = restAfterSubject.replace(new RegExp(`^${q.baseVerb}\\s*`, 'i'), '').trim();
  const verbFronted = `${verbCapitalized} ${q.subject}${predicate ? ' ' + predicate : ''}?`.replace(/\s+/g, ' ').trim();

  // 6. Wrong auxiliary combined with S-form (e.g. "Does they enjoys...?", "Do she lives...?")
  let wrongAuxWithS = sFormDistractor;
  if (q.auxiliary === 'does') {
    wrongAuxWithS = sFormDistractor.replace(/^Does\b/i, 'Do');
  } else {
    wrongAuxWithS = sFormDistractor.replace(/^Do\b/i, 'Does');
  }

  // 7. Base form without auxiliary (e.g. "She live in far Rockway?", "He smoke a lot?")
  const baseWithoutAux = `${subjectCapitalized} ${q.baseVerb}${predicate ? ' ' + predicate : ''}?`.replace(/\s+/g, ' ').trim();

  // 8. Auxiliary at the very end
  const auxAtEnd = `${subjectCapitalized} ${q.baseVerb}${predicate ? ' ' + predicate : ''}`.replace(/[?]+$/, '').trim() + ` ${q.auxiliary}?`;

  const candidateDistractors = [
    wrongAux,
    sFormDistractor,
    missingAux,
    subjectBeforeAux,
    verbFronted,
    wrongAuxWithS,
    baseWithoutAux,
    auxAtEnd,
  ];

  const uniqueTexts = new Set<string>();
  uniqueTexts.add(correct);

  const selectedDistractors: { text: string; isCorrect: boolean }[] = [];
  for (const text of candidateDistractors) {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (!uniqueTexts.has(clean)) {
      uniqueTexts.add(clean);
      selectedDistractors.push({ text: clean, isCorrect: false });
      if (selectedDistractors.length === 4) break;
    }
  }

  const rawOptions = [
    { text: correct, isCorrect: true },
    ...selectedDistractors,
  ];

  const qId = q.id || (q.canonicalAnswer.length + q.subject.length);
  return shuffleOptionsForQuestion(rawOptions, qId);
}

const RAW_OFFICIAL_QUESTIONS: Omit<QuestionItem, 'options'>[] = [
  {
    id: 1,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'She lives in far Rockway.',
    translation: 'Ela mora na distante Rockway.',
    canonicalAnswer: 'Does she live in far Rockway?',
    acceptedAnswers: ['Does she live in far Rockway?'],
    subject: 'she',
    auxiliary: 'does',
    baseVerb: 'live',
    originalVerb: 'lives',
    hints: {
      level1: 'Escolha DO ou DOES de acordo com o sujeito ("she").',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'O sujeito é "she", logo usamos DOES no início. Com DOES, "lives" perde o "-s" e vira "live": "Does she live in far Rockway?".',
    },
  },
  {
    id: 2,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'They enjoy their English lessons.',
    translation: 'Eles gostam das suas aulas de inglês.',
    canonicalAnswer: 'Do they enjoy their English lessons?',
    acceptedAnswers: ['Do they enjoy their English lessons?'],
    subject: 'they',
    auxiliary: 'do',
    baseVerb: 'enjoy',
    originalVerb: 'enjoy',
    hints: {
      level1: 'Escolha DO ou DOES de acordo com o sujeito ("they").',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'Para "they", o auxiliar correto é DO. O verbo "enjoy" permanece na forma básica: "Do they enjoy their English lessons?".',
    },
  },
  {
    id: 3,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'That company buys a lot of merchandise.',
    translation: 'Aquela empresa compra muitas mercadorias.',
    canonicalAnswer: 'Does that company buy a lot of merchandise?',
    acceptedAnswers: ['Does that company buy a lot of merchandise?'],
    subject: 'that company',
    auxiliary: 'does',
    baseVerb: 'buy',
    originalVerb: 'buys',
    hints: {
      level1: 'Identifique o sujeito ("that company" é singular, equivale a "it").',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'O sujeito é "that company" (it), logo usamos DOES no início. Com DOES, "buys" perde o "-s" e vira "buy": "Does that company buy a lot of merchandise?".',
    },
  },
  {
    id: 4,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'It looks like rain.',
    translation: 'Parece chuva.',
    canonicalAnswer: 'Does it look like rain?',
    acceptedAnswers: ['Does it look like rain?'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'look',
    originalVerb: 'looks',
    hints: {
      level1: 'Escolha DO ou DOES de acordo com o sujeito ("it").',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'O pronome "it" exige o auxiliar DOES. O verbo "looks" perde o "-s" e fica "look": "Does it look like rain?".',
    },
  },
  {
    id: 5,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'He drives to Washington once a week.',
    translation: 'Ele dirige para Washington uma vez por semana.',
    canonicalAnswer: 'Does he drive to Washington once a week?',
    acceptedAnswers: ['Does he drive to Washington once a week?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'drive',
    originalVerb: 'drives',
    hints: {
      level1: 'Escolha DO ou DOES de acordo com o sujeito ("he").',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'Com "he", usamos DOES. "Drives" deve voltar à forma básica "drive": "Does he drive to Washington once a week?".',
    },
  },
  {
    id: 6,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'The class meets on the tenth floor.',
    translation: 'A turma se reúne no décimo andar.',
    canonicalAnswer: 'Does the class meet on the tenth floor?',
    acceptedAnswers: ['Does the class meet on the tenth floor?'],
    subject: 'the class',
    auxiliary: 'does',
    baseVerb: 'meet',
    originalVerb: 'meets',
    hints: {
      level1: 'Atenção ao sujeito singular "the class" (equivale a "it").',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: '"The class" é singular coletivo (it) e exige DOES. "Meets" vira "meet": "Does the class meet on the tenth floor?".',
    },
  },
  {
    id: 7,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'He seems to be very busy.',
    translation: 'Ele parece estar muito ocupado.',
    canonicalAnswer: 'Does he seem to be very busy?',
    acceptedAnswers: ['Does he seem to be very busy?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'seem',
    originalVerb: 'seems',
    hints: {
      level1: 'Escolha DO ou DOES de acordo com o sujeito ("he").',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'Para "he", usamos DOES. O verbo principal "seems" perde o "-s" e volta para "seem": "Does he seem to be very busy?".',
    },
  },
  {
    id: 8,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'This book belongs to her.',
    translation: 'Este livro pertence a ela.',
    canonicalAnswer: 'Does this book belong to her?',
    acceptedAnswers: ['Does this book belong to her?'],
    subject: 'this book',
    auxiliary: 'does',
    baseVerb: 'belong',
    originalVerb: 'belongs',
    hints: {
      level1: 'O sujeito "this book" é uma terceira pessoa singular (it).',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'Sujeito singular "this book" usa DOES. "Belongs" perde o "-s" e vira "belong": "Does this book belong to her?".',
    },
  },
  {
    id: 9,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'You like New York.',
    translation: 'Você gosta de Nova York.',
    canonicalAnswer: 'Do you like New York?',
    acceptedAnswers: ['Do you like New York?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'like',
    originalVerb: 'like',
    hints: {
      level1: 'Escolha DO ou DOES para o pronome "you".',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'Para "you", o auxiliar é DO. O verbo "like" permanece inalterado: "Do you like New York?".',
    },
  },
  {
    id: 10,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'You speak French well.',
    translation: 'Você fala bem francês.',
    canonicalAnswer: 'Do you speak French well?',
    acceptedAnswers: ['Do you speak French well?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'speak',
    originalVerb: 'speak',
    hints: {
      level1: 'Escolha DO ou DOES para "you".',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'O pronome "you" recebe DO. A forma básica é "speak": "Do you speak French well?".',
    },
  },
  {
    id: 11,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'He often goes out of town.',
    translation: 'Ele sai frequentemente da cidade.',
    canonicalAnswer: 'Does he often go out of town?',
    acceptedAnswers: ['Does he often go out of town?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'go',
    originalVerb: 'goes',
    hints: {
      level1: 'Escolha DO ou DOES para "he" e atente ao advérbio "often".',
      level2: 'Estrutura: Auxiliar + sujeito + advérbio + verbo na forma básica + complemento?',
      level3: 'Com "he", usamos DOES. "Goes" volta à forma básica "go": "Does he often go out of town?".',
    },
  },
  {
    id: 12,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'I always take the same bus to work.',
    translation: 'Eu sempre pego o mesmo ônibus para o trabalho.',
    canonicalAnswer: 'Do I always take the same bus to work?',
    acceptedAnswers: ['Do I always take the same bus to work?'],
    subject: 'I',
    auxiliary: 'do',
    baseVerb: 'take',
    originalVerb: 'take',
    hints: {
      level1: 'Escolha DO ou DOES para o pronome "I".',
      level2: 'Estrutura: Auxiliar + sujeito + advérbio + verbo na forma básica + complemento?',
      level3: 'Para "I", o auxiliar é DO. O verbo "take" permanece na forma básica: "Do I always take the same bus to work?".',
    },
  },
  {
    id: 13,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'They sell newspapers there.',
    translation: 'Eles vendem jornais lá.',
    canonicalAnswer: 'Do they sell newspapers there?',
    acceptedAnswers: ['Do they sell newspapers there?'],
    subject: 'they',
    auxiliary: 'do',
    baseVerb: 'sell',
    originalVerb: 'sell',
    hints: {
      level1: 'Escolha DO ou DOES de acordo com o pronome "they".',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'Com "they", usamos DO. O verbo "sell" fica na forma básica: "Do they sell newspapers there?".',
    },
  },
  {
    id: 14,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'The store opens at nine o’clock.',
    translation: 'A loja abre às nove horas.',
    canonicalAnswer: "Does the store open at nine o'clock?",
    acceptedAnswers: [
      "Does the store open at nine o'clock?",
      "Does the store open at nine o’clock?",
    ],
    subject: 'the store',
    auxiliary: 'does',
    baseVerb: 'open',
    originalVerb: 'opens',
    hints: {
      level1: 'Identifique o sujeito "the store" (singular, equivale a "it").',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: '"The store" é singular (it) e exige DOES. "Opens" perde o "-s" e vira "open": "Does the store open at nine o\'clock?".',
    },
  },
  {
    id: 15,
    sectorId: 8,
    sectorName: 'Final Chrono Gate',
    affirmative: 'It closes at five-thirty.',
    translation: 'Ela fecha às cinco e meia.',
    canonicalAnswer: 'Does it close at five-thirty?',
    acceptedAnswers: ['Does it close at five-thirty?'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'close',
    originalVerb: 'closes',
    hints: {
      level1: 'Escolha DO ou DOES para "it".',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'O pronome "it" exige DOES. "Closes" volta para "close": "Does it close at five-thirty?".',
    },
  },
  {
    id: 16,
    sectorId: 8,
    sectorName: 'Final Chrono Gate',
    affirmative: 'He smokes a lot.',
    translation: 'Ele fuma muito.',
    canonicalAnswer: 'Does he smoke a lot?',
    acceptedAnswers: ['Does he smoke a lot?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'smoke',
    originalVerb: 'smokes',
    hints: {
      level1: 'Escolha DO ou DOES para o pronome "he".',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'Com "he", o auxiliar é DOES. O verbo "smokes" perde o "-s" e fica "smoke": "Does he smoke a lot?".',
    },
  },
];

const RAW_SONG_QUESTIONS_32: Omit<QuestionItem, 'options'>[] = [
  {
    id: 17,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'I turn the radio up.',
    translation: 'Eu aumento o volume do rádio. (One Shot Tonight - Verso 1)',
    canonicalAnswer: 'Do I turn the radio up?',
    acceptedAnswers: ['Do I turn the radio up?'],
    subject: 'I',
    auxiliary: 'do',
    baseVerb: 'turn',
    originalVerb: 'turn',
    hints: {
      level1: 'Escolha DO ou DOES de acordo com o pronome "I".',
      level2: 'Estrutura: Auxiliar + sujeito + verbo na forma básica + complemento?',
      level3: 'Para "I", o auxiliar é DO: "Do I turn the radio up?".',
    },
  },
  {
    id: 18,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'He believes in tonight.',
    translation: 'Ele acredita nesta noite. (One Shot Tonight - Verso 1)',
    canonicalAnswer: 'Does he believe in tonight?',
    acceptedAnswers: ['Does he believe in tonight?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'believe',
    originalVerb: 'believes',
    hints: {
      level1: 'O sujeito é "he", qual auxiliar utilizar?',
      level2: 'Estrutura: DOES + sujeito + verbo sem o "-s" + complemento?',
      level3: 'Com "he", usamos DOES. "Believes" volta à forma básica "believe": "Does he believe in tonight?".',
    },
  },
  {
    id: 19,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'We find a better way.',
    translation: 'Nós encontramos um caminho melhor. (One Shot Tonight - Verso 1)',
    canonicalAnswer: 'Do we find a better way?',
    acceptedAnswers: ['Do we find a better way?'],
    subject: 'we',
    auxiliary: 'do',
    baseVerb: 'find',
    originalVerb: 'find',
    hints: {
      level1: 'Identifique o pronome "we".',
      level2: 'Estrutura: DO + we + verbo na forma básica + complemento?',
      level3: 'Com "we", usamos DO: "Do we find a better way?".',
    },
  },
  {
    id: 20,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'She gets that feeling.',
    translation: 'Ela sente aquela sensação. (One Shot Tonight - Verso 1)',
    canonicalAnswer: 'Does she get that feeling?',
    acceptedAnswers: ['Does she get that feeling?'],
    subject: 'she',
    auxiliary: 'does',
    baseVerb: 'get',
    originalVerb: 'gets',
    hints: {
      level1: 'O sujeito "she" exige DOES.',
      level2: 'Estrutura: DOES + she + verbo na forma básica + complemento?',
      level3: 'Com "she", o verbo "gets" perde o "-s" e vira "get": "Does she get that feeling?".',
    },
  },
  {
    id: 21,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'I know the way.',
    translation: 'Eu conheço o caminho. (One Shot Tonight - Pré-refrão)',
    canonicalAnswer: 'Do I know the way?',
    acceptedAnswers: ['Do I know the way?'],
    subject: 'I',
    auxiliary: 'do',
    baseVerb: 'know',
    originalVerb: 'know',
    hints: {
      level1: 'Pronome "I" utiliza DO.',
      level2: 'Estrutura: DO + sujeito + verbo na forma básica + complemento?',
      level3: 'Para "I", iniciamos com DO: "Do I know the way?".',
    },
  },
  {
    id: 22,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'He knows the way.',
    translation: 'Ele sabe o caminho. (One Shot Tonight - Pré-refrão)',
    canonicalAnswer: 'Does he know the way?',
    acceptedAnswers: ['Does he know the way?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'know',
    originalVerb: 'knows',
    hints: {
      level1: 'Com "he", o auxiliar é DOES.',
      level2: 'Estrutura: DOES + he + verbo básico (sem -s)?',
      level3: 'Com DOES, "knows" volta para a forma básica "know": "Does he know the way?".',
    },
  },
  {
    id: 23,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'We chase the light.',
    translation: 'Nós perseguimos a luz. (One Shot Tonight - Pré-refrão)',
    canonicalAnswer: 'Do we chase the light?',
    acceptedAnswers: ['Do we chase the light?'],
    subject: 'we',
    auxiliary: 'do',
    baseVerb: 'chase',
    originalVerb: 'chase',
    hints: {
      level1: 'Pronome "we" utiliza o auxiliar DO.',
      level2: 'Estrutura: DO + we + chase the light?',
      level3: 'Para "we", usamos DO: "Do we chase the light?".',
    },
  },
  {
    id: 24,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'The morning sun shines.',
    translation: 'O sol da manhã brilha. (One Shot Tonight - Verso 1)',
    canonicalAnswer: 'Does the morning sun shine?',
    acceptedAnswers: ['Does the morning sun shine?'],
    subject: 'the morning sun',
    auxiliary: 'does',
    baseVerb: 'shine',
    originalVerb: 'shines',
    hints: {
      level1: '"The morning sun" é terceira pessoa singular (it).',
      level2: 'Estrutura: DOES + the morning sun + verbo sem "-s"?',
      level3: 'Sujeito singular usa DOES. "Shines" vira "shine": "Does the morning sun shine?".',
    },
  },
  {
    id: 25,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'We get only one shot.',
    translation: 'Nós temos apenas uma chance. (One Shot Tonight - Refrão)',
    canonicalAnswer: 'Do we get only one shot?',
    acceptedAnswers: ['Do we get only one shot?'],
    subject: 'we',
    auxiliary: 'do',
    baseVerb: 'get',
    originalVerb: 'get',
    hints: {
      level1: 'O sujeito é "we". Use o auxiliar correto.',
      level2: 'Estrutura: DO + we + get only one shot?',
      level3: 'Para "we", usamos DO: "Do we get only one shot?".',
    },
  },
  {
    id: 26,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'They stop to wait.',
    translation: 'Eles param para esperar. (One Shot Tonight - Refrão)',
    canonicalAnswer: 'Do they stop to wait?',
    acceptedAnswers: ['Do they stop to wait?'],
    subject: 'they',
    auxiliary: 'do',
    baseVerb: 'stop',
    originalVerb: 'stop',
    hints: {
      level1: 'Com "they", o auxiliar correto é DO.',
      level2: 'Estrutura: DO + they + stop to wait?',
      level3: 'Inicie com DO: "Do they stop to wait?".',
    },
  },
  {
    id: 27,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'They stand at the gate.',
    translation: 'Eles ficam parados no portão. (One Shot Tonight - Refrão)',
    canonicalAnswer: 'Do they stand at the gate?',
    acceptedAnswers: ['Do they stand at the gate?'],
    subject: 'they',
    auxiliary: 'do',
    baseVerb: 'stand',
    originalVerb: 'stand',
    hints: {
      level1: 'Para "they", utilizamos DO.',
      level2: 'Estrutura: DO + they + stand at the gate?',
      level3: 'Com "they", usamos DO: "Do they stand at the gate?".',
    },
  },
  {
    id: 28,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'You take my hand.',
    translation: 'Você pega minha mão. (One Shot Tonight - Verso 2)',
    canonicalAnswer: 'Do you take my hand?',
    acceptedAnswers: ['Do you take my hand?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'take',
    originalVerb: 'take',
    hints: {
      level1: 'Para "you", o auxiliar é DO.',
      level2: 'Estrutura: DO + you + verbo básico + complemento?',
      level3: 'Para "you", usamos DO: "Do you take my hand?".',
    },
  },
  {
    id: 29,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'He leaves the world behind.',
    translation: 'Ele deixa o mundo para trás. (One Shot Tonight - Verso 2)',
    canonicalAnswer: 'Does he leave the world behind?',
    acceptedAnswers: ['Does he leave the world behind?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'leave',
    originalVerb: 'leaves',
    hints: {
      level1: 'O sujeito "he" exige DOES.',
      level2: 'Estrutura: DOES + he + verbo sem "-s"?',
      level3: 'Com "he", usamos DOES e "leaves" volta para "leave": "Does he leave the world behind?".',
    },
  },
  {
    id: 30,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'The heartbeat keeps time.',
    translation: 'O batimento cardíaco mantém o tempo. (One Shot Tonight - Verso 2)',
    canonicalAnswer: 'Does the heartbeat keep time?',
    acceptedAnswers: ['Does the heartbeat keep time?'],
    subject: 'the heartbeat',
    auxiliary: 'does',
    baseVerb: 'keep',
    originalVerb: 'keeps',
    hints: {
      level1: '"The heartbeat" é um sujeito singular (it).',
      level2: 'Estrutura: DOES + the heartbeat + verbo na forma básica?',
      level3: 'Sujeito singular exige DOES. "Keeps" perde o "-s" e fica "keep": "Does the heartbeat keep time?".',
    },
  },
  {
    id: 31,
    sectorId: 8,
    sectorName: 'Final Chrono Gate',
    affirmative: 'You know the moment is ours.',
    translation: 'Você sabe que o momento é nosso. (One Shot Tonight - Ponte)',
    canonicalAnswer: 'Do you know the moment is ours?',
    acceptedAnswers: ['Do you know the moment is ours?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'know',
    originalVerb: 'know',
    hints: {
      level1: 'Para o pronome "you", usamos DO.',
      level2: 'Estrutura: DO + you + know the moment is ours?',
      level3: 'Com "you", usamos DO: "Do you know the moment is ours?".',
    },
  },
  {
    id: 32,
    sectorId: 8,
    sectorName: 'Final Chrono Gate',
    affirmative: 'We have the power.',
    translation: 'Nós temos o poder. (One Shot Tonight - Ponte)',
    canonicalAnswer: 'Do we have the power?',
    acceptedAnswers: ['Do we have the power?'],
    subject: 'we',
    auxiliary: 'do',
    baseVerb: 'have',
    originalVerb: 'have',
    hints: {
      level1: 'Para "we", qual é o auxiliar?',
      level2: 'Estrutura: DO + we + have the power?',
      level3: 'Com "we", o auxiliar é DO: "Do we have the power?".',
    },
  },
];

const RAW_AULA2_QUESTIONS_28: Omit<QuestionItem, 'options'>[] = [
  {
    id: 33,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'You know my father.',
    translation: 'Você conhece o meu pai. (Aula 2 - Verbo "Know" para familiaridade)',
    canonicalAnswer: 'Do you know my father?',
    acceptedAnswers: ['Do you know my father?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'know',
    originalVerb: 'know',
    hints: {
      level1: 'Para o sujeito "you", qual auxiliar interrogativo usar?',
      level2: 'Estrutura: DO + you + verbo básico + complemento?',
      level3: 'Com "you", usamos DO: "Do you know my father?".',
    },
  },
  {
    id: 34,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'He meets my father, Oscar.',
    translation: 'Ele conhece meu pai, Oscar, pela primeira vez. (Aula 2 - Verbo "Meet" para apresentação)',
    canonicalAnswer: 'Does he meet my father, Oscar?',
    acceptedAnswers: ['Does he meet my father, Oscar?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'meet',
    originalVerb: 'meets',
    hints: {
      level1: 'O sujeito "he" (3ª pessoa) exige o auxiliar DOES.',
      level2: 'Estrutura: DOES + he + verbo sem "-s" + complemento?',
      level3: 'Com "he", o auxiliar é DOES e "meets" volta para "meet": "Does he meet my father, Oscar?".',
    },
  },
  {
    id: 35,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'You know Rebecca.',
    translation: 'Você conhece a Rebecca. (Aula 2 - Vídeo: "Rebecca is awesome")',
    canonicalAnswer: 'Do you know Rebecca?',
    acceptedAnswers: ['Do you know Rebecca?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'know',
    originalVerb: 'know',
    hints: {
      level1: 'O pronome "you" exige o auxiliar DO.',
      level2: 'Estrutura: DO + you + know Rebecca?',
      level3: 'Inicie a pergunta com DO: "Do you know Rebecca?".',
    },
  },
  {
    id: 36,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'She meets my mother, Gloria.',
    translation: 'Ela conhece a minha mãe, Gloria, pela primeira vez. (Aula 2 - "Meet" na apresentação)',
    canonicalAnswer: 'Does she meet my mother, Gloria?',
    acceptedAnswers: ['Does she meet my mother, Gloria?'],
    subject: 'she',
    auxiliary: 'does',
    baseVerb: 'meet',
    originalVerb: 'meets',
    hints: {
      level1: 'Para "she", usamos o auxiliar DOES.',
      level2: 'Estrutura: DOES + she + verbo na forma básica sem "-s"?',
      level3: 'Com "she", usamos DOES e o verbo volta a "meet": "Does she meet my mother, Gloria?".',
    },
  },
  {
    id: 37,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'You know my mother, Gloria.',
    translation: 'Você conhece a minha mãe, Gloria. (Aula 2 - "Know" para quem já conhece)',
    canonicalAnswer: 'Do you know my mother, Gloria?',
    acceptedAnswers: ['Do you know my mother, Gloria?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'know',
    originalVerb: 'know',
    hints: {
      level1: 'Com "you", utilize o auxiliar DO.',
      level2: 'Estrutura: DO + you + know my mother, Gloria?',
      level3: 'Para "you", usamos DO: "Do you know my mother, Gloria?".',
    },
  },
  {
    id: 38,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'Dwight knows me very well.',
    translation: 'Dwight me conhece muito bem. (Aula 2 - Vídeo: "You know me very well, Dwight")',
    canonicalAnswer: 'Does Dwight know me very well?',
    acceptedAnswers: ['Does Dwight know me very well?'],
    subject: 'Dwight',
    auxiliary: 'does',
    baseVerb: 'know',
    originalVerb: 'knows',
    hints: {
      level1: 'Dwight é 3ª pessoa do singular (he), qual auxiliar usar?',
      level2: 'Estrutura: DOES + Dwight + verbo básico sem "-s"?',
      level3: 'Com "Dwight", usamos DOES e "knows" volta para "know": "Does Dwight know me very well?".',
    },
  },
  {
    id: 39,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'You agree to help.',
    translation: 'Você concorda em ajudar. (Aula 2 - Regra de Ouro: "To help" no infinitivo)',
    canonicalAnswer: 'Do you agree to help?',
    acceptedAnswers: ['Do you agree to help?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'agree',
    originalVerb: 'agree',
    hints: {
      level1: 'Para o sujeito "you", utilizamos o auxiliar DO.',
      level2: 'Estrutura: DO + you + agree to help?',
      level3: 'Com "you", usamos DO: "Do you agree to help?".',
    },
  },
  {
    id: 40,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'He wants to come today.',
    translation: 'Ele quer vir hoje. (Aula 2 - "To come" no infinitivo e "today")',
    canonicalAnswer: 'Does he want to come today?',
    acceptedAnswers: ['Does he want to come today?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'want',
    originalVerb: 'wants',
    hints: {
      level1: 'O sujeito "he" exige o auxiliar DOES.',
      level2: 'Estrutura: DOES + he + verbo sem "-s" + complemento?',
      level3: 'Com "he", usamos DOES e "wants" volta para "want": "Does he want to come today?".',
    },
  },
  {
    id: 41,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'They choose to go.',
    translation: 'Eles escolhem ir. (Aula 2 - "To go" no infinitivo)',
    canonicalAnswer: 'Do they choose to go?',
    acceptedAnswers: ['Do they choose to go?'],
    subject: 'they',
    auxiliary: 'do',
    baseVerb: 'choose',
    originalVerb: 'choose',
    hints: {
      level1: 'Para "they", qual auxiliar usar?',
      level2: 'Estrutura: DO + they + choose to go?',
      level3: 'Com "they", o auxiliar correto é DO: "Do they choose to go?".',
    },
  },
  {
    id: 42,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'She likes to believe in dreams.',
    translation: 'Ela gosta de acreditar em sonhos. (Aula 2 - "To believe" no infinitivo)',
    canonicalAnswer: 'Does she like to believe in dreams?',
    acceptedAnswers: ['Does she like to believe in dreams?'],
    subject: 'she',
    auxiliary: 'does',
    baseVerb: 'like',
    originalVerb: 'likes',
    hints: {
      level1: 'Com "she", o auxiliar interrogativo é DOES.',
      level2: 'Estrutura: DOES + she + like to believe in dreams?',
      level3: 'Use DOES e o verbo volta à forma básica "like": "Does she like to believe in dreams?".',
    },
  },
  {
    id: 43,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'The driver needs to stop here.',
    translation: 'O motorista precisa parar aqui. (Aula 2 - "To stop" no infinitivo e "here")',
    canonicalAnswer: 'Does the driver need to stop here?',
    acceptedAnswers: ['Does the driver need to stop here?'],
    subject: 'the driver',
    auxiliary: 'does',
    baseVerb: 'need',
    originalVerb: 'needs',
    hints: {
      level1: '"The driver" é sujeito singular (he/she).',
      level2: 'Estrutura: DOES + the driver + need to stop here?',
      level3: 'Com sujeito singular, usamos DOES e "needs" vira "need": "Does the driver need to stop here?".',
    },
  },
  {
    id: 44,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'You prefer to wait.',
    translation: 'Você prefere esperar. (Aula 2 - "To wait" no infinitivo)',
    canonicalAnswer: 'Do you prefer to wait?',
    acceptedAnswers: ['Do you prefer to wait?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'prefer',
    originalVerb: 'prefer',
    hints: {
      level1: 'Com "you", utilizamos o auxiliar DO.',
      level2: 'Estrutura: DO + you + prefer to wait?',
      level3: 'Para "you", usamos DO: "Do you prefer to wait?".',
    },
  },
  {
    id: 45,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'The teacher decides to begin the lesson.',
    translation: 'O professor decide começar a lição. (Aula 2 - "To begin" no infinitivo)',
    canonicalAnswer: 'Does the teacher decide to begin the lesson?',
    acceptedAnswers: ['Does the teacher decide to begin the lesson?'],
    subject: 'the teacher',
    auxiliary: 'does',
    baseVerb: 'decide',
    originalVerb: 'decides',
    hints: {
      level1: '"The teacher" é 3ª pessoa do singular.',
      level2: 'Estrutura: DOES + the teacher + decide to begin the lesson?',
      level3: 'Use o auxiliar DOES e "decides" volta para "decide": "Does the teacher decide to begin the lesson?".',
    },
  },
  {
    id: 46,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'You remember to breathe slowly.',
    translation: 'Você se lembra de respirar devagar. (Aula 2 - "To breathe" no infinitivo)',
    canonicalAnswer: 'Do you remember to breathe slowly?',
    acceptedAnswers: ['Do you remember to breathe slowly?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'remember',
    originalVerb: 'remember',
    hints: {
      level1: 'Com o pronome "you", use DO.',
      level2: 'Estrutura: DO + you + remember to breathe slowly?',
      level3: 'Inicie com DO: "Do you remember to breathe slowly?".',
    },
  },
  {
    id: 47,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'He tries to guess the secret.',
    translation: 'Ele tenta adivinhar o segredo. (Aula 2 - "To guess" no infinitivo)',
    canonicalAnswer: 'Does he try to guess the secret?',
    acceptedAnswers: ['Does he try to guess the secret?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'try',
    originalVerb: 'tries',
    hints: {
      level1: 'O sujeito "he" exige DOES.',
      level2: 'Estrutura: DOES + he + try to guess the secret?',
      level3: 'Com "he", usamos DOES e "tries" volta para "try": "Does he try to guess the secret?".',
    },
  },
  {
    id: 48,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'They love to speak English.',
    translation: 'Eles amam falar inglês. (Aula 2 - "To speak" e "To love")',
    canonicalAnswer: 'Do they love to speak English?',
    acceptedAnswers: ['Do they love to speak English?'],
    subject: 'they',
    auxiliary: 'do',
    baseVerb: 'love',
    originalVerb: 'love',
    hints: {
      level1: 'Para "they", o auxiliar interrogativo é DO.',
      level2: 'Estrutura: DO + they + love to speak English?',
      level3: 'Para "they", use DO: "Do they love to speak English?".',
    },
  },
  {
    id: 49,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'She speaks English very well.',
    translation: 'Ela fala inglês muito bem. (Aula 2 - "Very well" e pronúncia VÉri uel)',
    canonicalAnswer: 'Does she speak English very well?',
    acceptedAnswers: ['Does she speak English very well?'],
    subject: 'she',
    auxiliary: 'does',
    baseVerb: 'speak',
    originalVerb: 'speaks',
    hints: {
      level1: 'Com "she", o auxiliar correto é DOES.',
      level2: 'Estrutura: DOES + she + speak English very well?',
      level3: 'Após DOES, o verbo "speaks" perde o "-s" e volta a "speak": "Does she speak English very well?".',
    },
  },
  {
    id: 50,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'You think about that idea.',
    translation: 'Você pensa sobre aquela ideia. (Aula 2 - "To think" no infinitivo)',
    canonicalAnswer: 'Do you think about that idea?',
    acceptedAnswers: ['Do you think about that idea?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'think',
    originalVerb: 'think',
    hints: {
      level1: 'Para "you", o auxiliar é DO.',
      level2: 'Estrutura: DO + you + think about that idea?',
      level3: 'Com "you", usamos DO: "Do you think about that idea?".',
    },
  },
  {
    id: 51,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'He knows how to spell the word.',
    translation: 'Ele sabe como soletrar a palavra. (Aula 2 - "To know" e "To spell")',
    canonicalAnswer: 'Does he know how to spell the word?',
    acceptedAnswers: ['Does he know how to spell the word?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'know',
    originalVerb: 'knows',
    hints: {
      level1: 'Com o pronome "he", o auxiliar é DOES.',
      level2: 'Estrutura: DOES + he + know how to spell the word?',
      level3: 'Com "he", usamos DOES e "knows" vira "know": "Does he know how to spell the word?".',
    },
  },
  {
    id: 52,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'The security guard lets visitors enter.',
    translation: 'O guarda de segurança permite a entrada de visitantes. (Aula 2 - "To let" no infinitivo)',
    canonicalAnswer: 'Does the security guard let visitors enter?',
    acceptedAnswers: ['Does the security guard let visitors enter?'],
    subject: 'the security guard',
    auxiliary: 'does',
    baseVerb: 'let',
    originalVerb: 'lets',
    hints: {
      level1: '"The security guard" é sujeito singular (he/she).',
      level2: 'Estrutura: DOES + the security guard + let visitors enter?',
      level3: 'Com sujeito singular, usamos DOES e "lets" vira "let": "Does the security guard let visitors enter?".',
    },
  },
  {
    id: 53,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'You call your friend every morning.',
    translation: 'Você liga para o seu amigo toda manhã. (Aula 2 - "To call" e "Good morning")',
    canonicalAnswer: 'Do you call your friend every morning?',
    acceptedAnswers: ['Do you call your friend every morning?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'call',
    originalVerb: 'call',
    hints: {
      level1: 'Com "you", o auxiliar é DO.',
      level2: 'Estrutura: DO + you + call your friend every morning?',
      level3: 'Inicie com DO: "Do you call your friend every morning?".',
    },
  },
  {
    id: 54,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'The committee agrees to meet tomorrow.',
    translation: 'O comitê concorda em se reunir amanhã. (Aula 2 - "To agree" e "To meet")',
    canonicalAnswer: 'Does the committee agree to meet tomorrow?',
    acceptedAnswers: ['Does the committee agree to meet tomorrow?'],
    subject: 'the committee',
    auxiliary: 'does',
    baseVerb: 'agree',
    originalVerb: 'agrees',
    hints: {
      level1: '"The committee" é tratado no singular como instituição.',
      level2: 'Estrutura: DOES + the committee + agree to meet tomorrow?',
      level3: 'Use DOES e o verbo sem "-s": "Does the committee agree to meet tomorrow?".',
    },
  },
  {
    id: 55,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'You see the neon lights.',
    translation: 'Você vê as luzes de neon. (Aula 2 - "To see" no infinitivo)',
    canonicalAnswer: 'Do you see the neon lights?',
    acceptedAnswers: ['Do you see the neon lights?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'see',
    originalVerb: 'see',
    hints: {
      level1: 'Para "you", o auxiliar correto é DO.',
      level2: 'Estrutura: DO + you + see the neon lights?',
      level3: 'Com "you", usamos DO: "Do you see the neon lights?".',
    },
  },
  {
    id: 56,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'She sees her old friends again.',
    translation: 'Ela vê seus velhos amigos novamente. (Aula 2 - "Good to see you again!")',
    canonicalAnswer: 'Does she see her old friends again?',
    acceptedAnswers: ['Does she see her old friends again?'],
    subject: 'she',
    auxiliary: 'does',
    baseVerb: 'see',
    originalVerb: 'sees',
    hints: {
      level1: 'Com "she", o auxiliar interrogativo é DOES.',
      level2: 'Estrutura: DOES + she + see her old friends again?',
      level3: 'Após DOES, "sees" volta para a forma básica "see": "Does she see her old friends again?".',
    },
  },
  {
    id: 57,
    sectorId: 8,
    sectorName: 'Final Chrono Gate',
    affirmative: 'You spell your name with two M\'s.',
    translation: 'Você soletra seu nome com dois M. (Aula 2 - Vídeo: "K-Y-M-M-I" e "How you spell your name?")',
    canonicalAnswer: 'Do you spell your name with two M\'s?',
    acceptedAnswers: ['Do you spell your name with two M\'s?', 'Do you spell your name with two Ms?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'spell',
    originalVerb: 'spell',
    hints: {
      level1: 'Para "you", usamos o auxiliar DO.',
      level2: 'Estrutura: DO + you + spell your name with two M\'s?',
      level3: 'Inicie com DO: "Do you spell your name with two M\'s?".',
    },
  },
  {
    id: 58,
    sectorId: 8,
    sectorName: 'Final Chrono Gate',
    affirmative: 'He spells his name again.',
    translation: 'Ele soletra o nome dele novamente. (Aula 2 - "What\'s your name again?")',
    canonicalAnswer: 'Does he spell his name again?',
    acceptedAnswers: ['Does he spell his name again?'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'spell',
    originalVerb: 'spells',
    hints: {
      level1: 'O pronome "he" pede o auxiliar DOES.',
      level2: 'Estrutura: DOES + he + spell his name again?',
      level3: 'Com "he", usamos DOES e "spells" volta para "spell": "Does he spell his name again?".',
    },
  },
  {
    id: 59,
    sectorId: 8,
    sectorName: 'Final Chrono Gate',
    affirmative: 'You feel fine today.',
    translation: 'Você se sente bem hoje. (Aula 2 - "I\'m fine" e "How are you today?")',
    canonicalAnswer: 'Do you feel fine today?',
    acceptedAnswers: ['Do you feel fine today?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'feel',
    originalVerb: 'feel',
    hints: {
      level1: 'Com "you", utilizamos o auxiliar DO.',
      level2: 'Estrutura: DO + you + feel fine today?',
      level3: 'Para "you", usamos DO: "Do you feel fine today?".',
    },
  },
  {
    id: 60,
    sectorId: 8,
    sectorName: 'Final Chrono Gate',
    affirmative: 'She thinks it is a pleasure to meet you.',
    translation: 'Ela acha que é um prazer conhecê-lo. (Aula 2 - "It\'s a pleasure to meet you")',
    canonicalAnswer: 'Does she think it is a pleasure to meet you?',
    acceptedAnswers: ['Does she think it is a pleasure to meet you?'],
    subject: 'she',
    auxiliary: 'does',
    baseVerb: 'think',
    originalVerb: 'thinks',
    hints: {
      level1: 'Com "she", o auxiliar correto é DOES.',
      level2: 'Estrutura: DOES + she + think it is a pleasure to meet you?',
      level3: 'Após DOES, "thinks" perde o "-s" e fica "think": "Does she think it is a pleasure to meet you?".',
    },
  },
];

const RAW_TRANSLATION_QUESTIONS_20: QuestionItem[] = [
  {
    id: 61,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'Conheça o meu pai, Oscar.',
    translation: 'Apresentação pela 1ª vez: "Conheça o meu pai, Oscar."',
    canonicalAnswer: 'Meet my father, Oscar.',
    acceptedAnswers: ['Meet my father, Oscar.', 'Meet my father Oscar.'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'meet',
    originalVerb: 'meet',
    hints: {
      level1: 'Para apresentar alguém pela 1ª vez (Aula 2), use MEET.',
      level2: 'KNOW é para quem já tem familiaridade; MEET é para o 1º contato.',
      level3: 'A forma imperativa correta de apresentação é: "Meet my father, Oscar.".',
    },
    options: [
      { id: 'A', text: 'Meet my father, Oscar.', isCorrect: true },
      { id: 'B', text: 'Know my father, Oscar.', isCorrect: false },
      { id: 'C', text: 'To meet my father, Oscar.', isCorrect: false },
      { id: 'D', text: 'Meeting my father, Oscar.', isCorrect: false },
      { id: 'E', text: 'This meet my father, Oscar.', isCorrect: false },
    ],
  },
  {
    id: 62,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'Você conhece o meu pai?',
    translation: 'Perguntando sobre familiaridade prévia: "Você conhece o meu pai?"',
    canonicalAnswer: 'You know my father?',
    acceptedAnswers: ['You know my father?', 'Do you know my father?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'know',
    originalVerb: 'know',
    hints: {
      level1: 'Na Aula 2, KNOW indica ter familiaridade prévia com a pessoa.',
      level2: 'MEET é para o 1º encontro; KNOW é para familiaridade.',
      level3: 'Para perguntar se já conhece: "You know my father?" (ou "Do you know my father?").',
    },
    options: [
      { id: 'A', text: 'You know my father?', isCorrect: true },
      { id: 'B', text: 'You meet my father?', isCorrect: false },
      { id: 'C', text: 'You to know my father?', isCorrect: false },
      { id: 'D', text: 'You knowing my father?', isCorrect: false },
      { id: 'E', text: 'You pleasure my father?', isCorrect: false },
    ],
  },
  {
    id: 63,
    sectorId: 1,
    sectorName: 'Neon Gate',
    affirmative: 'Prazer em conhecê-lo(a).',
    translation: 'Cumprimento de cortesia: "Prazer em conhecê-lo(a)."',
    canonicalAnswer: 'Nice to meet you.',
    acceptedAnswers: ['Nice to meet you.', 'Pleasure to meet you.'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'meet',
    originalVerb: 'meet',
    hints: {
      level1: 'Dica de fluência da Aula 2: som nativo "Naistâ mitchu".',
      level2: 'Usa-se a estrutura: Nice + to meet + you.',
      level3: 'A expressão padrão é: "Nice to meet you." ou "Pleasure to meet you.".',
    },
    options: [
      { id: 'A', text: 'Nice to meet you.', isCorrect: true },
      { id: 'B', text: 'Nice to know you.', isCorrect: false },
      { id: 'C', text: 'Nice for meet you.', isCorrect: false },
      { id: 'D', text: 'Nice to meeting you.', isCorrect: false },
      { id: 'E', text: 'Pleasure to know you.', isCorrect: false },
    ],
  },
  {
    id: 64,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'É um prazer conhecê-lo(a).',
    translation: 'Expressão formal de cortesia: "É um prazer conhecê-lo(a)."',
    canonicalAnswer: 'It\'s a pleasure to meet you.',
    acceptedAnswers: ['It\'s a pleasure to meet you.', 'It\'s nice to meet you.'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'meet',
    originalVerb: 'meet',
    hints: {
      level1: 'Inicie com "It\'s" (contrações de It is) para situações ou impressões.',
      level2: 'It\'s + a pleasure + to meet + you.',
      level3: 'Tradução correta: "It\'s a pleasure to meet you.".',
    },
    options: [
      { id: 'A', text: 'It\'s a pleasure to meet you.', isCorrect: true },
      { id: 'B', text: 'Is a pleasure to meet you.', isCorrect: false },
      { id: 'C', text: 'He\'s a pleasure to meet you.', isCorrect: false },
      { id: 'D', text: 'It\'s a pleasure to know you.', isCorrect: false },
      { id: 'E', text: 'It\'s a nice for meet you.', isCorrect: false },
    ],
  },
  {
    id: 65,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'Prazer em conhecê-lo(a) também.',
    translation: 'Resposta de cortesia: "Prazer em conhecê-lo(a) também."',
    canonicalAnswer: 'Nice to meet you, too.',
    acceptedAnswers: ['Nice to meet you, too.', 'Pleasure to meet you, too.'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'meet',
    originalVerb: 'meet',
    hints: {
      level1: 'Adicione "too" no final para significar "também".',
      level2: 'Nice to meet you + ", too."',
      level3: 'A resposta padrão nativa é: "Nice to meet you, too.".',
    },
    options: [
      { id: 'A', text: 'Nice to meet you, too.', isCorrect: true },
      { id: 'B', text: 'Nice to meet you, also.', isCorrect: false },
      { id: 'C', text: 'Nice to know you, too.', isCorrect: false },
      { id: 'D', text: 'Nice to meet you, two.', isCorrect: false },
      { id: 'E', text: 'It\'s nice meet you too.', isCorrect: false },
    ],
  },
  {
    id: 66,
    sectorId: 2,
    sectorName: 'Merchandise District',
    affirmative: 'Esse é o meu pai.',
    translation: 'Apresentando alguém próximo: "Esse é o meu pai."',
    canonicalAnswer: 'This is my father.',
    acceptedAnswers: ['This is my father.'],
    subject: 'this',
    auxiliary: 'does',
    baseVerb: 'be',
    originalVerb: 'is',
    hints: {
      level1: 'Na Aula 2, aprendemos "This is..." (Pronúncia: zês êz).',
      level2: 'Use "This is..." para apresentar quem está perto de você.',
      level3: 'Frase correta: "This is my father.".',
    },
    options: [
      { id: 'A', text: 'This is my father.', isCorrect: true },
      { id: 'B', text: 'That is my father.', isCorrect: false },
      { id: 'C', text: 'These is my father.', isCorrect: false },
      { id: 'D', text: 'It is my father.', isCorrect: false },
      { id: 'E', text: 'This are my father.', isCorrect: false },
    ],
  },
  {
    id: 67,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'Regra de Ouro do Infinitivo (TO)',
    translation: 'Como transformar o verbo "help" (ajude) no infinitivo "ajudar"?',
    canonicalAnswer: 'Colocar TO antes do verbo (To help).',
    acceptedAnswers: ['Colocar TO before the verb', 'Colocar TO antes do verbo (To help).', 'To help'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'help',
    originalVerb: 'help',
    hints: {
      level1: 'Revisão da Regra de Ouro da Aula 2.',
      level2: 'Colocar o TO antes do verbo o deixa no infinitivo (AR, ER, IR).',
      level3: 'A regra correta é: Colocar TO antes do verbo (To help).',
    },
    options: [
      { id: 'A', text: 'Colocar TO antes do verbo (To help).', isCorrect: true },
      { id: 'B', text: 'Adicionar -ING no final do verbo (Helping).', isCorrect: false },
      { id: 'C', text: 'Adicionar -ED no final do verbo (Helped).', isCorrect: false },
      { id: 'D', text: 'Colocar FOR antes do verbo (For help).', isCorrect: false },
      { id: 'E', text: 'Colocar IS antes do verbo (Is help).', isCorrect: false },
    ],
  },
  {
    id: 68,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'Acreditar (Infinitivo)',
    translation: 'Traduza o verbo para o infinitivo em inglês: "Acreditar"',
    canonicalAnswer: 'To believe',
    acceptedAnswers: ['To believe', 'To believe.'],
    subject: 'to',
    auxiliary: 'do',
    baseVerb: 'believe',
    originalVerb: 'believe',
    hints: {
      level1: 'Verbo no infinitivo exige TO no início.',
      level2: 'Believe (Acredite) -> To believe (Acreditar).',
      level3: 'Resposta correta: "To believe".',
    },
    options: [
      { id: 'A', text: 'To believe', isCorrect: true },
      { id: 'B', text: 'Believe', isCorrect: false },
      { id: 'C', text: 'Believing', isCorrect: false },
      { id: 'D', text: 'To believes', isCorrect: false },
      { id: 'E', text: 'For believe', isCorrect: false },
    ],
  },
  {
    id: 69,
    sectorId: 3,
    sectorName: 'Transit Station',
    affirmative: 'Respirar (Infinitivo)',
    translation: 'Traduza o verbo para o infinitivo em inglês: "Respirar"',
    canonicalAnswer: 'To breathe',
    acceptedAnswers: ['To breathe', 'To breathe.'],
    subject: 'to',
    auxiliary: 'do',
    baseVerb: 'breathe',
    originalVerb: 'breathe',
    hints: {
      level1: 'Lembre-se da escrita de "respirar" no infinitivo.',
      level2: 'Breathe (Respire) -> To breathe (Respirar).',
      level3: 'Forma correta no infinitivo: "To breathe".',
    },
    options: [
      { id: 'A', text: 'To breathe', isCorrect: true },
      { id: 'B', text: 'Breathe', isCorrect: false },
      { id: 'C', text: 'To breath', isCorrect: false },
      { id: 'D', text: 'Breathing', isCorrect: false },
      { id: 'E', text: 'To breathes', isCorrect: false },
    ],
  },
  {
    id: 70,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'Regra de uso do pronome "It\'s"',
    translation: 'Segundo a Aula 2, quando se deve utilizar "It\'s"?',
    canonicalAnswer: 'Para situações, clima, animais ou objetos sem pessoa específica.',
    acceptedAnswers: ['Para situações, clima, animais ou objetos sem pessoa específica.'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'be',
    originalVerb: 'is',
    hints: {
      level1: 'Revise o quadro "É, Está = It\'s" da Aula 2.',
      level2: 'It\'s é o pronome neutro para situações, clima ou coisas.',
      level3: 'Alternativa correta: Para situações, clima, animais ou objetos sem pessoa específica.',
    },
    options: [
      { id: 'A', text: 'Para situações, clima, animais ou objetos sem pessoa específica.', isCorrect: true },
      { id: 'B', text: 'Apenas para se referir a homens (Ele).', isCorrect: false },
      { id: 'C', text: 'Apenas para se referir a mulheres (Ela).', isCorrect: false },
      { id: 'D', text: 'Somente para pessoas no plural.', isCorrect: false },
      { id: 'E', text: 'Para indicar ações que já aconteceram no passado.', isCorrect: false },
    ],
  },
  {
    id: 71,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'Ele é incrível! (Pessoa do sexo masculino)',
    translation: 'Traduza para o inglês: "Ele é incrível!" (Referindo-se a um homem)',
    canonicalAnswer: 'He\'s awesome!',
    acceptedAnswers: ['He\'s awesome!', 'He is awesome!'],
    subject: 'he',
    auxiliary: 'does',
    baseVerb: 'be',
    originalVerb: 'is',
    hints: {
      level1: 'Para pessoas do sexo masculino, use He\'s em vez de It\'s.',
      level2: 'He\'s = He is.',
      level3: 'A frase correta para pessoas é: "He\'s awesome!".',
    },
    options: [
      { id: 'A', text: 'He\'s awesome!', isCorrect: true },
      { id: 'B', text: 'It\'s awesome!', isCorrect: false },
      { id: 'C', text: 'She\'s awesome!', isCorrect: false },
      { id: 'D', text: 'You\'re awesome!', isCorrect: false },
      { id: 'E', text: 'They\'re awesome!', isCorrect: false },
    ],
  },
  {
    id: 72,
    sectorId: 4,
    sectorName: 'Observation Tower',
    affirmative: 'É legal! (Festa ou Objeto)',
    translation: 'Traduza para o inglês: "É legal!" (Referindo-se a uma festa ou objeto)',
    canonicalAnswer: 'It\'s cool!',
    acceptedAnswers: ['It\'s cool!', 'It is cool!'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'be',
    originalVerb: 'is',
    hints: {
      level1: 'Para coisas ou situações neutras, a frase exige "It\'s".',
      level2: 'It\'s = It is.',
      level3: 'A forma correta é: "It\'s cool!".',
    },
    options: [
      { id: 'A', text: 'It\'s cool!', isCorrect: true },
      { id: 'B', text: 'He\'s cool!', isCorrect: false },
      { id: 'C', text: 'She\'s cool!', isCorrect: false },
      { id: 'D', text: 'Is cool!', isCorrect: false },
      { id: 'E', text: 'Its cool!', isCorrect: false },
    ],
  },
  {
    id: 73,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'Como está você hoje?',
    translation: 'Perguntando o estado da pessoa: "Como está você hoje?"',
    canonicalAnswer: 'How are you today?',
    acceptedAnswers: ['How are you today?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'be',
    originalVerb: 'are',
    hints: {
      level1: 'Revise os cumprimentos e respostas da Aula 2.',
      level2: 'Use How + are + you + today?',
      level3: 'A pergunta correta em inglês é: "How are you today?".',
    },
    options: [
      { id: 'A', text: 'How are you today?', isCorrect: true },
      { id: 'B', text: 'How you are today?', isCorrect: false },
      { id: 'C', text: 'What are you today?', isCorrect: false },
      { id: 'D', text: 'How is you today?', isCorrect: false },
      { id: 'E', text: 'Where are you today?', isCorrect: false },
    ],
  },
  {
    id: 74,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'Estou bem, obrigado. E você?',
    translation: 'Respondendo sobre seu estado: "Estou bem, obrigado. E você?"',
    canonicalAnswer: 'I\'m good, thanks. And you?',
    acceptedAnswers: ['I\'m good, thanks. And you?', 'I\'m fine, thanks. And you?'],
    subject: 'I',
    auxiliary: 'do',
    baseVerb: 'be',
    originalVerb: 'am',
    hints: {
      level1: 'Tanto "I\'m fine" quanto "I\'m good" são muito comuns na Aula 2.',
      level2: 'thanks = obrigado(a); And you? = E você?',
      level3: 'Frase correta: "I\'m good, thanks. And you?".',
    },
    options: [
      { id: 'A', text: 'I\'m good, thanks. And you?', isCorrect: true },
      { id: 'B', text: 'I have fine, thanks. And you?', isCorrect: false },
      { id: 'C', text: 'I\'m well, thank. And you?', isCorrect: false },
      { id: 'D', text: 'I\'m good, please. And you?', isCorrect: false },
      { id: 'E', text: 'Me fine, thanks. And you?', isCorrect: false },
    ],
  },
  {
    id: 75,
    sectorId: 5,
    sectorName: 'New York Portal',
    affirmative: 'Qual é o seu nome?',
    translation: 'Perguntando o nome de alguém: "Qual é o seu nome?"',
    canonicalAnswer: 'What\'s your name?',
    acceptedAnswers: ['What\'s your name?', 'What is your name?'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'be',
    originalVerb: 'is',
    hints: {
      level1: 'Contração natural de What is -> What\'s.',
      level2: 'What\'s + your name?',
      level3: 'Pergunta padrão: "What\'s your name?".',
    },
    options: [
      { id: 'A', text: 'What\'s your name?', isCorrect: true },
      { id: 'B', text: 'Who is your name?', isCorrect: false },
      { id: 'C', text: 'How is your name?', isCorrect: false },
      { id: 'D', text: 'What your name is?', isCorrect: false },
      { id: 'E', text: 'Which is your name?', isCorrect: false },
    ],
  },
  {
    id: 76,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'Qual é o seu nome mesmo?',
    translation: 'Perguntando educadamente ao esquecer: "Qual é o seu nome mesmo?"',
    canonicalAnswer: 'What\'s your name again?',
    acceptedAnswers: ['What\'s your name again?', 'What is your name again?'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'be',
    originalVerb: 'is',
    hints: {
      level1: 'Adicione "again" no final para expressar "mesmo / novamente".',
      level2: 'What\'s your name + again?',
      level3: 'A forma nativa é: "What\'s your name again?".',
    },
    options: [
      { id: 'A', text: 'What\'s your name again?', isCorrect: true },
      { id: 'B', text: 'What\'s your name now?', isCorrect: false },
      { id: 'C', text: 'What\'s your name already?', isCorrect: false },
      { id: 'D', text: 'How is your name again?', isCorrect: false },
      { id: 'E', text: 'What\'s your name back?', isCorrect: false },
    ],
  },
  {
    id: 77,
    sectorId: 6,
    sectorName: 'Outer City',
    affirmative: 'Como você soletra seu nome?',
    translation: 'Perguntando a soletração: "Como você soletra seu nome?"',
    canonicalAnswer: 'How you spell your name?',
    acceptedAnswers: ['How you spell your name?', 'How do you spell your name?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'spell',
    originalVerb: 'spell',
    hints: {
      level1: 'Na Aula 2, o verbo "soletrar" é SPELL.',
      level2: 'Estrutura apresentada na apostila: How + you + spell + your name?',
      level3: 'Resposta correta: "How you spell your name?".',
    },
    options: [
      { id: 'A', text: 'How you spell your name?', isCorrect: true },
      { id: 'B', text: 'How you speak your name?', isCorrect: false },
      { id: 'C', text: 'What you spell your name?', isCorrect: false },
      { id: 'D', text: 'How you write your name?', isCorrect: false },
      { id: 'E', text: 'How you say your name?', isCorrect: false },
    ],
  },
  {
    id: 78,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'Que bom te ver!',
    translation: 'Cumprimento de alegria ao rever alguém: "Que bom te ver!"',
    canonicalAnswer: 'Good to see you!',
    acceptedAnswers: ['Good to see you!', 'It\'s good to see you!'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'see',
    originalVerb: 'see',
    hints: {
      level1: 'Good + to see + you!',
      level2: 'O verbo para ver pessoas neste cumprimento é SEE (com to no infinitivo).',
      level3: 'Expressão idiomática correta: "Good to see you!".',
    },
    options: [
      { id: 'A', text: 'Good to see you!', isCorrect: true },
      { id: 'B', text: 'Good to look you!', isCorrect: false },
      { id: 'C', text: 'Nice for see you!', isCorrect: false },
      { id: 'D', text: 'Good to watch you!', isCorrect: false },
      { id: 'E', text: 'Good see you!', isCorrect: false },
    ],
  },
  {
    id: 79,
    sectorId: 7,
    sectorName: 'Market Core',
    affirmative: 'Bom te ver novamente!',
    translation: 'Cumprimento ao rever alguém de novo: "Bom te ver novamente!"',
    canonicalAnswer: 'Good to see you again!',
    acceptedAnswers: ['Good to see you again!'],
    subject: 'it',
    auxiliary: 'does',
    baseVerb: 'see',
    originalVerb: 'see',
    hints: {
      level1: 'Acrescente "again" no final da saudação "Good to see you".',
      level2: 'Good to see you + again!',
      level3: 'Tradução idiomática: "Good to see you again!".',
    },
    options: [
      { id: 'A', text: 'Good to see you again!', isCorrect: true },
      { id: 'B', text: 'Good to see you back!', isCorrect: false },
      { id: 'C', text: 'Good to look you again!', isCorrect: false },
      { id: 'D', text: 'Good seeing you again!', isCorrect: false },
      { id: 'E', text: 'Good to see again you!', isCorrect: false },
    ],
  },
  {
    id: 80,
    sectorId: 8,
    sectorName: 'Final Chrono Gate',
    affirmative: 'Bom dia, como está?',
    translation: 'Cumprimento de abertura matinal: "Bom dia, como está?"',
    canonicalAnswer: 'Good morning, how are you?',
    acceptedAnswers: ['Good morning, how are you?'],
    subject: 'you',
    auxiliary: 'do',
    baseVerb: 'be',
    originalVerb: 'are',
    hints: {
      level1: 'Good morning (Bom dia) + how are you? (como vai?).',
      level2: 'Esta é a saudação de abertura ao final da apostila da Aula 2.',
      level3: 'A forma correta é: "Good morning, how are you?".',
    },
    options: [
      { id: 'A', text: 'Good morning, how are you?', isCorrect: true },
      { id: 'B', text: 'Good day, how are you?', isCorrect: false },
      { id: 'C', text: 'Good afternoon, how are you?', isCorrect: false },
      { id: 'D', text: 'Good morning, what are you?', isCorrect: false },
      { id: 'E', text: 'Good morning, who are you?', isCorrect: false },
    ],
  },
];

export const OFFICIAL_QUESTIONS: QuestionItem[] = RAW_OFFICIAL_QUESTIONS.map((q) => ({
  ...q,
  options: generateOptionsForQuestion(q),
}));

export const SONG_QUESTIONS_32: QuestionItem[] = RAW_SONG_QUESTIONS_32.map((q) => ({
  ...q,
  options: generateOptionsForQuestion(q),
}));

export const SONG_QUESTIONS = SONG_QUESTIONS_32;

export const AULA2_QUESTIONS_28: QuestionItem[] = RAW_AULA2_QUESTIONS_28.map((q) => ({
  ...q,
  options: generateOptionsForQuestion(q),
}));

export const TRANSLATION_QUESTIONS_20: QuestionItem[] = RAW_TRANSLATION_QUESTIONS_20.map((q) => ({
  ...q,
  options: shuffleOptionsForQuestion((q as any).options ? (q as any).options : generateOptionsForQuestion(q), q.id),
}));

/**
 * Complete sequence of all 80 missions:
 * Missions 01 - 16: Questões Oficiais da Avaliação (Prof. Geraldo)
 * Missions 17 - 32: Questões da Música "One Shot Tonight"
 * Missions 33 - 60: Questões da Aula 2 (Iniciantes - Apresentações, Infinitivo & Vocabulário)
 * Missions 61 - 80: Questões de Tradução (Português para Inglês)
 */
export const ALL_80_QUESTIONS: QuestionItem[] = [
  ...OFFICIAL_QUESTIONS,
  ...SONG_QUESTIONS_32,
  ...AULA2_QUESTIONS_28,
  ...TRANSLATION_QUESTIONS_20,
];

// Backward-compatible aliases
export const ALL_60_QUESTIONS: QuestionItem[] = ALL_80_QUESTIONS;
export const ALL_32_QUESTIONS: QuestionItem[] = ALL_80_QUESTIONS;
export const ALL_QUESTIONS: QuestionItem[] = ALL_80_QUESTIONS;

export type QuestionSetType = 'all' | 'geraldo' | 'song' | 'aula2' | 'translation';

export function getQuestionSet(type?: QuestionSetType): QuestionItem[] {
  if (type === 'geraldo') return OFFICIAL_QUESTIONS;
  if (type === 'song') return SONG_QUESTIONS_32;
  if (type === 'aula2') return AULA2_QUESTIONS_28;
  if (type === 'translation') return TRANSLATION_QUESTIONS_20;
  return ALL_80_QUESTIONS;
}


/**
 * Normalizes text for comparison:
 * - normalizes typographical apostrophes (’ to ')
 * - collapses multiple whitespace characters to a single space
 * - trims ends
 * - strips optional trailing punctuation (. or ?)
 * - converts to lowercase
 */
export function normalizeSentence(str: string): string {
  if (!str) return '';
  return str
    .replace(/[’‘`]/g, "'")
    .replace(/[“”"]/g, '"')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[?!.]+$/, '')
    .trim()
    .toLowerCase();
}

export interface ValidationResult {
  isCorrect: boolean;
  normalizedUser: string;
  normalizedCanonical: string;
  feedbackMessage?: string;
  detectedErrorType?: 'wrong_auxiliary' | 'unreverted_verb' | 'missing_auxiliary' | 'incomplete' | 'grammar_mismatch';
}

/**
 * Evaluates a user response deterministically against a QuestionItem.
 */
export function evaluateAnswer(question: QuestionItem, rawInputOrOptionId: string): ValidationResult {
  const matchedOpt = question.options?.find(
    (o) => o.id === rawInputOrOptionId?.toUpperCase() || normalizeSentence(o.text) === normalizeSentence(rawInputOrOptionId)
  );

  const selectedText = matchedOpt ? matchedOpt.text : rawInputOrOptionId;
  const isCorrect = matchedOpt
    ? matchedOpt.isCorrect
    : (normalizeSentence(selectedText) === normalizeSentence(question.canonicalAnswer) || question.acceptedAnswers?.map(normalizeSentence).includes(normalizeSentence(selectedText)));

  const normUser = normalizeSentence(selectedText);
  const normCanonical = normalizeSentence(question.canonicalAnswer);

  if (isCorrect) {
    return {
      isCorrect: true,
      normalizedUser: normUser,
      normalizedCanonical: normCanonical,
    };
  }

  // Diagnostic error detection for detailed feedback
  let errorType: ValidationResult['detectedErrorType'] = 'grammar_mismatch';
  let feedbackMessage = 'A alternativa selecionada contém divergências gramaticais.';

  const words = normUser.split(' ');
  const firstWord = words[0];

  if (firstWord !== 'do' && firstWord !== 'does') {
    errorType = 'missing_auxiliary';
    feedbackMessage = 'Lembre-se de iniciar perguntas no Simple Present com o auxiliar DO ou DOES.';
  } else if (question.auxiliary === 'does' && firstWord === 'do') {
    errorType = 'wrong_auxiliary';
    feedbackMessage = `Auxiliar incorreto: para o sujeito "${question.subject}", use DOES e não DO.`;
  } else if (question.auxiliary === 'do' && firstWord === 'does') {
    errorType = 'wrong_auxiliary';
    feedbackMessage = `Auxiliar incorreto: para o sujeito "${question.subject}", use DO e não DOES.`;
  } else if (question.auxiliary === 'does' && normUser.includes(question.originalVerb.toLowerCase())) {
    errorType = 'unreverted_verb';
    feedbackMessage = `Atenção à forma verbal: após DOES, o verbo volta à forma básica ("${question.baseVerb}"), sem "-s"/"-es".`;
  } else if (words.length < 3) {
    errorType = 'incomplete';
    feedbackMessage = 'Resposta incompleta.';
  }

  return {
    isCorrect: false,
    normalizedUser: normUser,
    normalizedCanonical: normCanonical,
    feedbackMessage,
    detectedErrorType: errorType,
  };
}

/**
 * Computes assessment metrics for the full 80-question curriculum or custom question counts.
 * Each correct answer adds +1.25% (100% / 80). Each wrong answer deducts 2.5% from the percentage score (minimum 0%).
 * Score on scale 0 to 10 = net percentage / 10.
 */
export function calculateAssessmentScore(correctCount: number, totalQuestions = 80, wrongCount?: number) {
  const safeCorrect = Math.max(0, Math.min(correctCount, totalQuestions));
  const safeWrong = wrongCount !== undefined ? wrongCount : (totalQuestions - safeCorrect);

  const pointsPerCorrect = 100 / totalQuestions;
  const basePercentage = safeCorrect * pointsPerCorrect;
  const penalty = safeWrong * 2.5; // 2.5% penalty per error
  const netPercentage = Math.max(0, Math.min(100, basePercentage - penalty));
  const scoreOutOfTen = Math.max(0, Math.round((netPercentage / 10) * 10) / 10);

  return {
    correctCount: safeCorrect,
    wrongCount: safeWrong,
    totalQuestions,
    percentage: Math.round(netPercentage * 100) / 100, // 2 decimal places
    scoreOutOfTen: scoreOutOfTen.toFixed(1),
    scoreNumber: scoreOutOfTen,
    penaltyApplied: penalty,
  };
}

/**
 * Calculates current real-time accuracy percentage based on answered questions.
 * Each correct answer adds +1.25% (minimum 1.3% per correct answer towards 100% total).
 * Each wrong answer deducts 2.5% penalty (wrongCount * 2.5%).
 * Minimum percentage is 0%.
 * Returns percentage (0 to 100) with 1 decimal place.
 */
export function calculateAccuracyPercentage(
  correctCount: number,
  answeredCount: number,
  wrongCount?: number,
  totalQuestions = 80
): number {
  if (answeredCount <= 0 && correctCount <= 0) return 0;
  const errors = wrongCount !== undefined ? wrongCount : Math.max(0, answeredCount - correctCount);

  // Each correct answer adds +1.25% (100% / 80 = 1.25%)
  const pointsPerCorrect = 100 / totalQuestions;
  const basePercentage = correctCount * pointsPerCorrect;
  const penalty = errors * 2.5; // 2.5% penalty per error
  const netPercentage = Math.max(0, Math.min(100, basePercentage - penalty));

  return Math.round(netPercentage * 10) / 10;
}

/**
 * Formats time in seconds to mm:ss
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

