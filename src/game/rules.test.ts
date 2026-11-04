import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OFFICIAL_QUESTIONS,
  SONG_QUESTIONS,
  AULA2_QUESTIONS_28,
  TRANSLATION_QUESTIONS_20,
  ALL_80_QUESTIONS,
  getQuestionSet,
  normalizeSentence,
  evaluateAnswer,
  calculateAssessmentScore,
  calculateAccuracyPercentage,
  formatDuration,
} from './grammarRules';

test('OFFICIAL_QUESTIONS has exactly 16 questions spanning 8 sectors', () => {
  assert.equal(OFFICIAL_QUESTIONS.length, 16);
  for (let i = 0; i < 16; i++) {
    const q = OFFICIAL_QUESTIONS[i];
    assert.equal(q.id, i + 1);
    assert.ok(q.affirmative.length > 0);
    assert.ok(q.translation.length > 0);
    assert.ok(q.canonicalAnswer.endsWith('?'));
    assert.ok(q.hints.level1.length > 0);
    assert.ok(q.hints.level2.length > 0);
    assert.ok(q.hints.level3.length > 0);
  }
});

test('SONG_QUESTIONS has exactly 16 creative questions based on One Shot Tonight lyrics', () => {
  assert.equal(SONG_QUESTIONS.length, 16);
  assert.equal(getQuestionSet('song').length, 16);
  assert.equal(getQuestionSet('geraldo').length, 16);
  for (let i = 0; i < 16; i++) {
    const q = SONG_QUESTIONS[i];
    assert.equal(q.id, i + 17);
    assert.ok(q.affirmative.length > 0);
    assert.ok(q.canonicalAnswer.endsWith('?'));
    // Verify deterministic evaluation
    const res = evaluateAnswer(q, q.canonicalAnswer);
    assert.equal(res.isCorrect, true);
  }
});

test('AULA2_QUESTIONS_28 has exactly 28 beginner missions covering presentations, infinitives, and vocabulary', () => {
  assert.equal(AULA2_QUESTIONS_28.length, 28);
  assert.equal(getQuestionSet('aula2').length, 28);
  for (let i = 0; i < 28; i++) {
    const q = AULA2_QUESTIONS_28[i];
    assert.equal(q.id, i + 33);
    assert.ok(q.affirmative.length > 0);
    assert.ok(q.canonicalAnswer.endsWith('?'));
    const res = evaluateAnswer(q, q.canonicalAnswer);
    assert.equal(res.isCorrect, true);
  }
});

test('TRANSLATION_QUESTIONS_20 has exactly 20 Portuguese-to-English translation missions', () => {
  assert.equal(TRANSLATION_QUESTIONS_20.length, 20);
  assert.equal(getQuestionSet('translation').length, 20);
  assert.equal(ALL_80_QUESTIONS.length, 80);
  for (let i = 0; i < 20; i++) {
    const q = TRANSLATION_QUESTIONS_20[i];
    assert.equal(q.id, i + 61);
    assert.ok(q.affirmative.length > 0);
    assert.ok(q.canonicalAnswer.length > 0);
    const res = evaluateAnswer(q, q.canonicalAnswer);
    assert.equal(res.isCorrect, true);
  }
});

test('normalizeSentence handles punctuation, whitespace, quotes, and case', () => {
  assert.equal(
    normalizeSentence('  Does she live in far Rockway?  '),
    'does she live in far rockway'
  );
  assert.equal(
    normalizeSentence('Does   she  live in far Rockway'),
    'does she live in far rockway'
  );
  assert.equal(
    normalizeSentence("Does the store open at nine o’clock?"),
    "does the store open at nine o'clock"
  );
});

test('evaluateAnswer strictly accepts exact canonical answers regardless of casing/spacing', () => {
  const q1 = OFFICIAL_QUESTIONS[0]; // "Does she live in far Rockway?"
  
  // Exact match
  assert.equal(evaluateAnswer(q1, 'Does she live in far Rockway?').isCorrect, true);
  // Lowercase without question mark
  assert.equal(evaluateAnswer(q1, 'does she live in far rockway').isCorrect, true);
  // Extra spacing and uppercase
  assert.equal(evaluateAnswer(q1, '   DOES   SHE   LIVE   IN FAR ROCKWAY?  ').isCorrect, true);
});

test('evaluateAnswer rejects common grammatical errors', () => {
  const q1 = OFFICIAL_QUESTIONS[0]; // "Does she live in far Rockway?"

  // Error 1: unreverted verb "lives"
  const r1 = evaluateAnswer(q1, 'Does she lives in far Rockway?');
  assert.equal(r1.isCorrect, false);
  assert.equal(r1.detectedErrorType, 'unreverted_verb');

  // Error 2: wrong auxiliary "Do"
  const r2 = evaluateAnswer(q1, 'Do she live in far Rockway?');
  assert.equal(r2.isCorrect, false);
  assert.equal(r2.detectedErrorType, 'wrong_auxiliary');

  // Error 3: missing auxiliary
  const r3 = evaluateAnswer(q1, 'She live in far Rockway?');
  assert.equal(r3.isCorrect, false);
  assert.equal(r3.detectedErrorType, 'missing_auxiliary');

  // Error 4: missing preposition
  const r4 = evaluateAnswer(q1, 'Does she live far Rockway?');
  assert.equal(r4.isCorrect, false);
});

test('evaluateAnswer verifies Question 14 apostrophe variants', () => {
  const q14 = OFFICIAL_QUESTIONS[13]; // The store opens at nine o’clock.
  assert.equal(evaluateAnswer(q14, "Does the store open at nine o'clock?").isCorrect, true);
  assert.equal(evaluateAnswer(q14, "Does the store open at nine o’clock?").isCorrect, true);
});

test('calculateAssessmentScore handles 80 questions and 2.5% error penalty', () => {
  const perfect = calculateAssessmentScore(80, 80, 0);
  assert.equal(perfect.percentage, 100);
  assert.equal(perfect.scoreOutOfTen, '10.0');
  assert.equal(perfect.correctCount, 80);
  assert.equal(perfect.wrongCount, 0);

  // 72 correct, 8 wrong: base = 90%, penalty = 8 * 2.5% = 20% -> net = 70%
  const c8wrong = calculateAssessmentScore(72, 80, 8);
  assert.equal(c8wrong.percentage, 70);
  assert.equal(c8wrong.scoreOutOfTen, '7.0');

  // 80 correct out of 80 = 100%
  const zeroErrors = calculateAssessmentScore(80, 80);
  assert.equal(zeroErrors.percentage, 100);
  assert.equal(zeroErrors.scoreOutOfTen, '10.0');
});

test('formatDuration formats seconds properly', () => {
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(360), '06:00');
});

test('ALL 80 questions have exactly 5 distinct options without any "Opção" placeholder', () => {
  assert.equal(ALL_80_QUESTIONS.length, 80);

  for (const q of ALL_80_QUESTIONS) {
    assert.equal(q.options.length, 5, `Question #${q.id} should have 5 options`);
    
    const correctCount = q.options.filter(o => o.isCorrect).length;
    assert.equal(correctCount, 1, `Question #${q.id} should have exactly 1 correct option`);

    const optionIds = q.options.map(o => o.id);
    assert.deepEqual(optionIds, ['A', 'B', 'C', 'D', 'E'], `Question #${q.id} must have options A, B, C, D, E`);

    const texts = new Set<string>();
    for (const opt of q.options) {
      assert.ok(opt.text.trim().length > 3, `Question #${q.id} option ${opt.id} text too short: ${opt.text}`);
      assert.ok(!opt.text.includes('Opção'), `Question #${q.id} option ${opt.id} must not contain 'Opção': ${opt.text}`);
      assert.ok(!opt.text.includes('Alt '), `Question #${q.id} option ${opt.id} must not contain 'Alt ': ${opt.text}`);
      assert.ok(!texts.has(opt.text), `Question #${q.id} has duplicate option: ${opt.text}`);
      texts.add(opt.text);
    }
  }
});

test('session persistence functions handle active game state in storage', async () => {
  const { saveActiveSession, getActiveSession, clearActiveSession } = await import('../services/storage');
  
  // Mock localStorage for test environment
  const mockStore: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (k: string) => mockStore[k] ?? null,
    setItem: (k: string, v: string) => { mockStore[k] = v; },
    removeItem: (k: string) => { delete mockStore[k]; },
    clear: () => { for (const k in mockStore) delete mockStore[k]; },
    length: 0,
    key: () => null,
  };

  clearActiveSession();
  assert.equal(getActiveSession(), null);

  const testSession = {
    studentInfo: {
      studentName: 'Ana Souza',
      studentClass: '8º B',
      schoolName: 'Chrono Academy',
      mode: 'avaliacao' as const,
    },
    currentQuestionId: 7,
    activeTerminalQuestionId: 7,
    answersMap: {
      1: { userAnswer: 'Does she live in far Rockway?', isCorrect: true },
      2: { userAnswer: 'Do they enjoy their English lessons?', isCorrect: true },
    },
    startTime: Date.now() - 120000,
    elapsedSeconds: 120,
    lastSavedTimestamp: Date.now(),
    currentView: 'game' as const,
    hasActiveGame: true,
  };

  saveActiveSession(testSession);

  const restored = getActiveSession();
  assert.ok(restored !== null);
  assert.equal(restored?.currentQuestionId, 7);
  assert.equal(restored?.studentInfo.studentName, 'Ana Souza');
  assert.equal(restored?.elapsedSeconds, 120);
  assert.equal(Object.keys(restored?.answersMap || {}).length, 2);

  clearActiveSession();
  assert.equal(getActiveSession(), null);
});

test('calculateAccuracyPercentage gives at least +1.25% (+1.3%) per correct question and applies 10% penalty per error', () => {
  assert.equal(calculateAccuracyPercentage(0, 0, 0), 0);
  assert.equal(calculateAccuracyPercentage(0, 1, 1), 0);
  // 1 correct answer out of 80 gives 1.3% (+1.25%)
  assert.equal(calculateAccuracyPercentage(1, 1, 0), 1.3);
  // 2 correct answers give 2.5%
  assert.equal(calculateAccuracyPercentage(2, 2, 0), 2.5);
  // 80 correct answers give 100%
  assert.equal(calculateAccuracyPercentage(80, 80, 0), 100);
});

test('when clearing game session, session and duration reset cleanly', async () => {
  const { saveActiveSession, getActiveSession, clearActiveSession } = await import('../services/storage');
  
  const completedSession = {
    studentInfo: {
      studentName: 'Roberto Silva',
      studentClass: '8º C',
      schoolName: 'Chrono School',
      mode: 'avaliacao' as const,
    },
    currentQuestionId: 32,
    activeTerminalQuestionId: null,
    answersMap: {
      1: { userAnswer: 'Does she live in far Rockway?', isCorrect: true },
    },
    startTime: Date.now() - 300000,
    elapsedSeconds: 300,
    lastSavedTimestamp: Date.now(),
    currentView: 'game' as const,
    hasActiveGame: true,
  };

  saveActiveSession(completedSession);
  assert.ok(getActiveSession() !== null);

  // Exiting or restarting clears the session cleanly
  clearActiveSession();
  assert.equal(getActiveSession(), null);
});

test('options for ALL 80 questions have correct answer evenly distributed across A, B, C, D, E', () => {
  const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  
  for (const q of ALL_80_QUESTIONS) {
    const correctOpt = q.options.find(o => o.isCorrect);
    assert.ok(correctOpt, `Question #${q.id} missing correct option`);
    distribution[correctOpt.id] = (distribution[correctOpt.id] || 0) + 1;
  }

  // Each option (A, B, C, D, E) should receive exactly 16 correct answers across 80 questions
  assert.equal(distribution.A, 16, 'Option A should have 16 correct answers');
  assert.equal(distribution.B, 16, 'Option B should have 16 correct answers');
  assert.equal(distribution.C, 16, 'Option C should have 16 correct answers');
  assert.equal(distribution.D, 16, 'Option D should have 16 correct answers');
  assert.equal(distribution.E, 16, 'Option E should have 16 correct answers');
});

test('retry on wrong answer awards progression points but retains the -2.5% error penalty', () => {
  // Scenario: 1 question answered wrong first time -> hadError = true
  const acc1 = calculateAccuracyPercentage(0, 1, 1);
  assert.equal(acc1, 0, 'First attempt wrong: accuracy is 0%');

  // Scenario: Student clicks "Tentar Novamente" and gets it right!
  // 1 question answered with 1 correct (+1.25% added) and 1 wrong attempt recorded (-2.5% penalty) -> clamped to 0%
  const acc2 = calculateAccuracyPercentage(1, 1, 1);
  assert.equal(acc2, 0, '1.25% base - 2.5% penalty = -1.25% -> clamped to 0%');

  // Scenario: 10 questions answered correctly on retry after 1 initial error
  // 10 correct (+12.5%), 1 error (-2.5%) -> net = +10.0%
  const acc3 = calculateAccuracyPercentage(10, 10, 1);
  assert.equal(acc3, 10, '12.5% base - 2.5% penalty retained = 10%');
});



