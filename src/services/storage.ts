export interface StudentAnswerRecord {
  questionId: number;
  affirmative: string;
  translation: string;
  userAnswer: string;
  canonicalAnswer: string;
  isCorrect: boolean;
  hadError?: boolean;
  feedback?: string;
}

export interface AssessmentRecord {
  id: string;
  studentName: string;
  studentClass: string;
  schoolName?: string;
  mode: 'avaliacao' | 'treino';
  completedAt: string; // ISO
  formattedDate: string;
  durationSeconds: number;
  formattedDuration: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  scoreOutOfTen: string;
  answers: StudentAnswerRecord[];
}

export interface RosterStudent {
  name: string;
  class: string;
}

const STORAGE_KEY = 'chrono_quest_assessments_v1';
const ROSTER_KEY = 'chrono_quest_roster_v1';

export function getAssessmentRecords(): AssessmentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load assessment records:', err);
    return [];
  }
}

export function saveAssessmentRecord(record: AssessmentRecord): void {
  try {
    const current = getAssessmentRecords();
    const updated = [record, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save assessment record:', err);
  }
}

export function deleteAssessmentRecord(id: string): void {
  try {
    const current = getAssessmentRecords();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete assessment record:', err);
  }
}

export function clearAllAssessments(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear assessments:', err);
  }
}

export function getRoster(): RosterStudent[] {
  try {
    const raw = localStorage.getItem(ROSTER_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load roster:', err);
    return [];
  }
}

export function saveRoster(roster: RosterStudent[]): void {
  try {
    localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
  } catch (err) {
    console.error('Failed to save roster:', err);
  }
}

export function parseRosterCSV(csvText: string): RosterStudent[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const students: RosterStudent[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // skip header if contains 'nome' or 'name'
    if (i === 0 && (line.toLowerCase().includes('nome') || line.toLowerCase().includes('name'))) {
      continue;
    }
    const parts = line.split(/[;,]/).map((p) => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length >= 2 && parts[0] && parts[1]) {
      students.push({
        name: parts[0],
        class: parts[1],
      });
    } else if (parts.length === 1 && parts[0]) {
      students.push({
        name: parts[0],
        class: 'Geral',
      });
    }
  }

  return students;
}

export function exportToCSV(records: AssessmentRecord[]): void {
  if (records.length === 0) return;

  const maxQuestions = records.reduce((max, r) => Math.max(max, r.totalQuestions || 80), 80);

  const headers = [
    'ID',
    'Estudante',
    'Turma',
    'Escola',
    'Modo',
    'Data/Hora',
    'Tempo (s)',
    'Tempo Formatado',
    'Acertos',
    'Erros',
    'Percentual (%)',
    'Nota (0-10)',
    ...Array.from({ length: maxQuestions }, (_, i) => `Q${i + 1}_Resposta`),
    ...Array.from({ length: maxQuestions }, (_, i) => `Q${i + 1}_Correto`),
  ];

  const rows = records.map((r) => {
    const answerColumns: string[] = [];
    const correctColumns: string[] = [];

    for (let i = 1; i <= maxQuestions; i++) {
      const ans = r.answers.find((a) => a.questionId === i);
      answerColumns.push(ans ? `"${ans.userAnswer.replace(/"/g, '""')}"` : '""');
      correctColumns.push(ans ? (ans.isCorrect ? 'SIM' : 'NAO') : 'NAO');
    }

    return [
      `"${r.id}"`,
      `"${r.studentName.replace(/"/g, '""')}"`,
      `"${r.studentClass.replace(/"/g, '""')}"`,
      `"${(r.schoolName || '').replace(/"/g, '""')}"`,
      `"${r.mode}"`,
      `"${r.formattedDate}"`,
      r.durationSeconds,
      `"${r.formattedDuration}"`,
      r.correctCount,
      r.wrongCount,
      r.percentage,
      r.scoreOutOfTen,
      ...answerColumns,
      ...correctColumns,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  downloadBlob(csvContent, `ChronoQuest_Relatorio_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

export function exportToJSON(records: AssessmentRecord[]): void {
  const jsonContent = JSON.stringify(records, null, 2);
  downloadBlob(jsonContent, `ChronoQuest_Relatorio_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface QuestionErrorStat {
  questionId: number;
  affirmative: string;
  errorCount: number;
  correctCount: number;
  totalAttempts: number;
  errorRate: number;
}

export function computeQuestionStats(records: AssessmentRecord[]): QuestionErrorStat[] {
  const statsMap: Record<number, { errorCount: number; correctCount: number; affirmative: string }> = {};

  for (const record of records) {
    for (const ans of record.answers) {
      if (!statsMap[ans.questionId]) {
        statsMap[ans.questionId] = { errorCount: 0, correctCount: 0, affirmative: ans.affirmative };
      }
      statsMap[ans.questionId].affirmative = ans.affirmative;
      if (ans.isCorrect) {
        statsMap[ans.questionId].correctCount++;
      } else {
        statsMap[ans.questionId].errorCount++;
      }
    }
  }

  return Object.entries(statsMap).map(([idStr, data]) => {
    const qId = Number(idStr);
    const total = data.errorCount + data.correctCount;
    const rate = total > 0 ? (data.errorCount / total) * 100 : 0;
    return {
      questionId: qId,
      affirmative: data.affirmative,
      errorCount: data.errorCount,
      correctCount: data.correctCount,
      totalAttempts: total,
      errorRate: Math.round(rate * 10) / 10,
    };
  }).sort((a, b) => b.errorRate - a.errorRate);
}

export interface ActiveGameSession {
  studentInfo: {
    studentName: string;
    studentClass: string;
    schoolName: string;
    mode: 'avaliacao' | 'treino';
  };
  currentQuestionId: number;
  activeTerminalQuestionId: number | null;
  answersMap: Record<number, { userAnswer: string; isCorrect: boolean; hadError?: boolean; feedback?: string }>;
  startTime: number;
  elapsedSeconds: number;
  lastSavedTimestamp: number;
  currentView: 'menu' | 'game' | 'study_guide' | 'music_lounge' | 'teacher_dashboard';
  hasActiveGame: boolean;
}

const ACTIVE_SESSION_KEY = 'chrono_quest_active_session_v2';

export function saveActiveSession(session: ActiveGameSession): void {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save active session:', err);
  }
}

export function getActiveSession(): ActiveGameSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.studentInfo && parsed.hasActiveGame) {
      return parsed as ActiveGameSession;
    }
    return null;
  } catch (err) {
    console.error('Failed to get active session:', err);
    return null;
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear active session:', err);
  }
}
