export interface VocabularyItem {
  id: number;
  word: string;
  translation: string;
  ipa?: string;
  phoneticPt: string;
  note: string;
  examples: { en: string; pt: string }[];
}

export interface InfinitiveVerbItem {
  verb: string;
  infinitive: string;
  translation: string;
}

export interface VideoChallengeItem {
  id: number;
  timestamp: string;
  en: string;
  pt: string;
  speakerHint?: string;
}

export const VOCABULARY_LIST: VocabularyItem[] = [
  {
    id: 1,
    word: 'Pleasure',
    translation: 'Prazer',
    ipa: '/ˈplɛʒ.ər/',
    phoneticPt: "PLÉjâr (o 'S' tem som de 'J' e o 'E' final não pronuncia)",
    note: "Usado para expressar satisfação ao conhecer alguém ou em cumprimentos.",
    examples: [
      { en: 'Pleasure to meet you.', pt: 'Prazer em conhecê-lo(a).' },
      { en: "It's a pleasure to meet you.", pt: 'É um prazer conhecê-lo(a).' },
      { en: 'Well, hello there.', pt: 'Bem, olá.' },
    ],
  },
  {
    id: 2,
    word: "It's",
    translation: 'É, Está',
    phoneticPt: 'Íts (contração de It is)',
    note: 'Usado para situações, clima, animais ou objetos quando não há uma pessoa específica.',
    examples: [
      { en: "It's raining.", pt: 'Está chovendo.' },
      { en: "It's cool!", pt: 'É legal!' },
      { en: "It's awesome!", pt: 'É incrível!' },
      { en: "It's here.", pt: 'Está aqui.' },
      { en: "He's cool! / She's cool!", pt: 'Ele é legal! / Ela é legal! (para pessoas)' },
      { en: 'It is black and white.', pt: 'Ele é preto e branco (objeto/animal).' },
    ],
  },
  {
    id: 3,
    word: 'a',
    translation: 'Um, uma',
    phoneticPt: '"â" curto e fechado',
    note: 'Artigo indefinido usado antes de sons consonantais.',
    examples: [
      { en: 'It is a pleasure.', pt: 'É um prazer.' },
      { en: 'A book.', pt: 'Um livro.' },
    ],
  },
  {
    id: 4,
    word: 'Nice',
    translation: 'Agradável, simpático, legal, gentil',
    phoneticPt: '"nais" (o \'E\' final não é pronunciado)',
    note: 'Muito comum em cumprimentos e elogios.',
    examples: [
      { en: 'Nice to meet you.', pt: 'Prazer em conhecê-lo(a).' },
      { en: "It's nice to meet you.", pt: 'É um prazer em conhecê-lo(a).' },
      { en: 'Nice to meet you, too.', pt: 'Prazer em conhecê-lo(a) também.' },
    ],
  },
  {
    id: 5,
    word: 'Meet',
    translation: 'Conheça, Encontre',
    phoneticPt: '"mit"',
    note: 'Usado para conhecer pela 1ª vez ou encontrar alguém.',
    examples: [
      { en: 'Meet my father, Oscar.', pt: 'Conheça o meu pai, Oscar.' },
      { en: 'To meet.', pt: 'Conhecer, encontrar.' },
    ],
  },
  {
    id: 6,
    word: 'Well',
    translation: 'Bem',
    phoneticPt: '"uel"',
    note: 'Advérbio ("fazer algo bem") ou interjeição ("bem, então...").',
    examples: [
      { en: 'Very well, thank you.', pt: 'Muito bem, obrigado.' },
      { en: 'You speak French well.', pt: 'Você fala francês bem.' },
    ],
  },
  {
    id: 7,
    word: 'And',
    translation: 'E',
    phoneticPt: '"end" (abra bem a boca)',
    note: 'Conjunção aditiva.',
    examples: [
      { en: 'You and me.', pt: 'Você e eu.' },
      { en: 'Fine, and you?', pt: 'Bem, e você?' },
    ],
  },
  {
    id: 8,
    word: "You're",
    translation: 'Você é, você está',
    phoneticPt: 'iór / iâr (contração de You are)',
    note: 'Segunda pessoa do singular ou plural.',
    examples: [
      { en: 'You are great.', pt: 'Você é ótimo / você está ótimo.' },
      { en: 'You are here today.', pt: 'Você está aqui hoje.' },
      { en: 'How are you today?', pt: 'Como você está hoje?' },
    ],
  },
  {
    id: 9,
    word: 'Fine',
    translation: 'Bem, ótimo',
    phoneticPt: '"fain"',
    note: 'Resposta polida clássica ao perguntarem como vai.',
    examples: [
      { en: "I'm fine, thanks.", pt: 'Estou bem, obrigado.' },
      { en: 'Fine, and you?', pt: 'Bem, e você?' },
    ],
  },
  {
    id: 10,
    word: 'Very',
    translation: 'Muito',
    phoneticPt: 'VÉri',
    note: 'Intensificador antes de adjetivos ou advérbios.',
    examples: [
      { en: 'Very well, thank you.', pt: 'Muito bem, obrigado.' },
      { en: 'He seems to be very busy.', pt: 'Ele parece estar muito ocupado.' },
    ],
  },
];

export const INFINITIVE_VERBS: InfinitiveVerbItem[] = [
  { verb: 'Meet', infinitive: 'To meet', translation: 'Conhecer / Encontrar' },
  { verb: 'Help', infinitive: 'To help', translation: 'Ajudar' },
  { verb: 'Come', infinitive: 'To come', translation: 'Vir' },
  { verb: 'Go', infinitive: 'To go', translation: 'Ir' },
  { verb: 'Believe', infinitive: 'To believe', translation: 'Acreditar' },
  { verb: 'Stop', infinitive: 'To stop', translation: 'Parar' },
  { verb: 'Wait', infinitive: 'To wait', translation: 'Esperar' },
  { verb: 'Begin', infinitive: 'To begin', translation: 'Começar' },
  { verb: 'Breathe', infinitive: 'To breathe', translation: 'Respirar' },
  { verb: 'Guess', infinitive: 'To guess', translation: 'Adivinhar' },
  { verb: 'Be', infinitive: 'To be', translation: 'Ser / Estar' },
  { verb: 'Love', infinitive: 'To love', translation: 'Amar' },
  { verb: 'Speak', infinitive: 'To speak', translation: 'Falar' },
  { verb: 'Think', infinitive: 'To think', translation: 'Pensar' },
  { verb: 'Know', infinitive: 'To know', translation: 'Saber / Conhecer' },
  { verb: 'Let', infinitive: 'To let', translation: 'Permitir / Deixar' },
  { verb: 'Call', infinitive: 'To call', translation: 'Chamar / Ligar' },
  { verb: 'Agree', infinitive: 'To agree', translation: 'Concordar' },
  { verb: 'See', infinitive: 'To see', translation: 'Ver' },
];

export const KNOW_VS_MEET_EXPLANATION = {
  know: {
    rule: 'Know = Conhecer no sentido de já ter familiaridade com a pessoa ou assunto.',
    exampleEn: 'You know my father?',
    examplePt: 'Você conhece o meu pai? (já o conhece de antes?)',
    quote: 'You know me very well, Dwight.',
    quotePt: 'Você me conhece muito bem, Dwight.',
  },
  meet: {
    rule: 'Meet = Conhecer pela primeira vez ou encontrar-se fisicamente.',
    exampleEn: 'Meet my father, Oscar.',
    examplePt: 'Conheça o meu pai, Oscar (apresentando pela 1ª vez).',
    quote: 'Kelly, Pablo, meet my father.',
    quotePt: 'Kelly, Pablo, conheçam o meu pai.',
  },
  thisIs: {
    rule: 'This is... = Esse é, essa é... (Pronúncia: "zês êz").',
    exampleEn: 'Everybody, this is my father, Cornelius Hawthorn.',
    examplePt: 'Todo mundo, esse é o meu pai, Cornelius Hawthorn.',
  },
};

export const VIDEO_CHALLENGE_AULA2: VideoChallengeItem[] = [
  {
    id: 1,
    timestamp: '15:08',
    en: "It's nice to meet you.",
    pt: 'É um prazer conhecê-lo(a).',
  },
  {
    id: 2,
    timestamp: '15:12',
    en: 'Good to see you.',
    pt: 'Que bom te ver.',
  },
  {
    id: 3,
    timestamp: '15:18',
    en: "Hi. / How are you? / I'm good.",
    pt: 'Oi. / Como você está? / Estou bem.',
  },
  {
    id: 4,
    timestamp: '15:31',
    en: "I don't know. How are you?",
    pt: 'Eu não sei. Como você está?',
  },
  {
    id: 5,
    timestamp: '15:35',
    en: 'Come in. Come in. Good to see you again.',
    pt: 'Entre. Entre. Bom te ver novamente.',
  },
  {
    id: 6,
    timestamp: '15:43',
    en: "I'm very well, and you? / Good, good.",
    pt: 'Estou muito bem, e você? / Bem, bem.',
  },
  {
    id: 7,
    timestamp: '15:50',
    en: 'Good morning, how are you?',
    pt: 'Bom dia, como você está?',
  },
  {
    id: 8,
    timestamp: '15:55',
    en: "What's your name?",
    pt: 'Qual é o seu nome?',
  },
  {
    id: 9,
    timestamp: '15:58',
    en: "You're great. You're awesome.",
    pt: 'Você é ótimo(a). Você é incrível.',
  },
];

export const VIDEO_AULA2_METADATA = {
  title: 'Nível 1 - Aula 2: Inglês para Iniciantes (ABC Fluent)',
  description: 'Palavras e pronúncias base, contrações (It\'s, You\'re), regra do infinitivo com TO, diferença entre KNOW e MEET, cumprimentos e desafio auditivo dos filmes.',
  youtubeVideoId: 'I3ZNPP5hE-M',
  youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/I3ZNPP5hE-M',
  chapters: [
    { time: '00:00', seconds: 0, label: 'Introdução à Aula 2' },
    { time: '00:14', seconds: 14, label: '1. Prazer = Pleasure (/ˈplɛʒ.ər/) & "Well, hello there"' },
    { time: '00:46', seconds: 46, label: '2. É, Está = It\'s / He\'s cool / She\'s cool / It\'s awesome!' },
    { time: '02:47', seconds: 167, label: '3. Um, uma = a ("â" curto e fechado)' },
    { time: '03:00', seconds: 180, label: '4. Agradável, legal, gentil = Nice ("nais")' },
    { time: '03:13', seconds: 193, label: '5. Conheça = Meet & Regra de Ouro do "TO" (Infinitivo)' },
    { time: '05:38', seconds: 338, label: '7. E = And / Você e eu = You and me' },
    { time: '05:55', seconds: 355, label: '8. Você é/está = You\'re / How are you? / How are you today?' },
    { time: '06:52', seconds: 412, label: '9. Bem = Fine ("fain")' },
    { time: '07:05', seconds: 425, label: '10. Muito = Very ("VÉri")' },
    { time: '07:12', seconds: 432, label: 'Apresentações: Pleasure to meet you / Nice to meet you' },
    { time: '10:01', seconds: 601, label: 'Diferença entre KNOW (familiaridade) e MEET (1ª vez)' },
    { time: '10:38', seconds: 638, label: 'Apresentando: This is... ("This is my father")' },
    { time: '11:10', seconds: 670, label: 'Como Cumprimentar: I\'m fine / I\'m good / Very well, thank you' },
    { time: '12:14', seconds: 734, label: 'Exercício de Fixação Interativo' },
    { time: '15:04', seconds: 904, label: 'Desafio em Vídeo: WHAT eles estão dizendo?' },
    { time: '16:07', seconds: 967, label: 'Respostas e Soletração (K-Y-M-M-I / S-T-O-P)' },
  ],
};

export const AULA2_FIXATION_EXERCISES = [
  { pt: 'Você conhece o meu pai? (Familiaridade)', en: 'Do you know my father? / You know my father?' },
  { pt: 'Prazer em conhecê-lo(a).', en: 'Pleasure to meet you. / Nice to meet you.' },
  { pt: 'É um prazer conhecê-lo(a).', en: "It's a pleasure to meet you. / It's nice to meet you." },
  { pt: 'Prazer.', en: 'Pleasure.' },
  { pt: 'Eu estou bem, obrigado. E você?', en: "I'm good, thanks. And you? / I'm fine, thanks. And you?" },
  { pt: 'Eu estou bem.', en: "I'm fine. / I'm good." },
  { pt: 'Conheça o meu pai, Oscar. (Apresentando 1ª vez)', en: 'Meet my father, Oscar.' },
  { pt: 'Conheça a minha mãe, Gloria.', en: 'Meet my mother, Gloria.' },
  { pt: 'Esse é o meu pai.', en: 'This is my father.' },
  { pt: 'Essa é minha mãe.', en: 'This is my mother.' },
  { pt: 'Como você está hoje?', en: 'How are you today?' },
  { pt: 'Como vai?', en: 'How are you?' },
  { pt: 'Qual é o seu nome?', en: "What's your name?" },
  { pt: 'Que bom te ver!', en: 'Good to see you!' },
  { pt: 'Bom te ver novamente!', en: 'Good to see you again!' },
  { pt: 'Bom dia, como está?', en: 'Good morning, how are you?' },
  { pt: 'Como você soletra o seu nome?', en: 'How you spell your name?' },
  { pt: 'Qual é o seu nome mesmo?', en: "What's your name again?" },
  { pt: 'Infinitivos: Ser/Estar • Falar • Pensar', en: 'To be • To speak • To think' },
];
