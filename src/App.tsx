import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  ALL_80_QUESTIONS,
  QuestionItem,
  ValidationResult,
  calculateAssessmentScore,
  calculateAccuracyPercentage,
  formatDuration,
} from './game/grammarRules';
import {
  AssessmentRecord,
  saveAssessmentRecord,
  StudentAnswerRecord,
  ActiveGameSession,
  saveActiveSession,
  getActiveSession,
  clearActiveSession,
} from './services/storage';
import { MainMenu } from './components/MainMenu';
import { ThreeWorld } from './components/ThreeWorld';
import { TerminalModal } from './components/TerminalModal';
import { ReportModal } from './components/ReportModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GrammarStudyHub } from './components/GrammarStudyHub';
import { MusicLounge } from './components/MusicLounge';
import { GlobalContinuousTimerBar } from './components/GlobalContinuousTimerBar';
import { ExitConfirmationModal } from './components/ExitConfirmationModal';
import { MissionJumpModal } from './components/MissionJumpModal';
import { soundEffects } from './utils/audioSystem';
import { Sparkles, X } from 'lucide-react';

export default function App() {
  const [, startTransition] = useTransition();
  const [currentView, setCurrentView] = useState<
    'menu' | 'game' | 'study_guide' | 'music_lounge' | 'teacher_dashboard'
  >('menu');

  const [studentInfo, setStudentInfo] = useState<{
    studentName: string;
    studentClass: string;
    schoolName: string;
    mode: 'avaliacao' | 'treino';
  }>({
    studentName: '',
    studentClass: '',
    schoolName: '',
    mode: 'avaliacao',
  });

  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [activeTerminalQuestion, setActiveTerminalQuestion] = useState<QuestionItem | null>(null);
  const [answersMap, setAnswersMap] = useState<
    Record<number, { userAnswer: string; isCorrect: boolean; hadError?: boolean; feedback?: string }>
  >({});
  const [completedRecord, setCompletedRecord] = useState<AssessmentRecord | null>(null);
  const [graphicsQuality, setGraphicsQuality] = useState<'high' | 'low'>('high');

  // Continuous Timer & Session Anti-Loss State
  const [hasActiveGame, setHasActiveGame] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [savedSession, setSavedSession] = useState<ActiveGameSession | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
  const [isMissionJumpOpen, setIsMissionJumpOpen] = useState<boolean>(false);
  const [restoredToast, setRestoredToast] = useState<string | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const activeQuestions = ALL_80_QUESTIONS;

  // 1. Initial Load: Auto-restore active session from localStorage if present
  useEffect(() => {
    const existingSession = getActiveSession();
    if (existingSession && existingSession.hasActiveGame) {
      setSavedSession(existingSession);
      setStudentInfo(existingSession.studentInfo);
      setCurrentQuestionId(existingSession.currentQuestionId || 1);
      setAnswersMap(existingSession.answersMap || {});
      setElapsedSeconds(existingSession.elapsedSeconds || 0);
      setHasActiveGame(true);

      // Always default initial view to 'menu' so player lands on Main Menu screen where they can input student name
      setCurrentView('menu');
      if (existingSession.activeTerminalQuestionId) {
        const q = activeQuestions.find((item) => item.id === existingSession.activeTerminalQuestionId);
        if (q) setActiveTerminalQuestion(q);
      }

      const answeredCount = Object.keys(existingSession.answersMap || {}).length;
      setRestoredToast(
        `Sessão salva em andamento (Missão #${existingSession.currentQuestionId}/80). Digite o nome do aluno no menu ou clique em 'Continuar'.`
      );
    } else if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        handleStartGame({
          studentName: 'Cadete Chrono',
          studentClass: '8º Ano Piloto',
          schoolName: 'Chrono Academy',
          mode: 'treino',
        });
      }
    }
  }, []);

  // 2. Continuous Timer: runs uninterruptedly whenever hasActiveGame is true across ALL pages
  useEffect(() => {
    if (!hasActiveGame) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hasActiveGame]);

  // 3. Periodic and State-Triggered Autosave to localStorage
  useEffect(() => {
    if (!hasActiveGame) return;

    const snapshot: ActiveGameSession = {
      studentInfo,
      currentQuestionId,
      activeTerminalQuestionId: activeTerminalQuestion ? activeTerminalQuestion.id : null,
      answersMap,
      startTime: startTimeRef.current,
      elapsedSeconds,
      lastSavedTimestamp: Date.now(),
      currentView,
      hasActiveGame: true,
    };

    saveActiveSession(snapshot);
    setSavedSession(snapshot);
  }, [hasActiveGame, studentInfo, currentQuestionId, activeTerminalQuestion, answersMap, currentView]);

  // Sync elapsed seconds every 5 seconds
  useEffect(() => {
    if (!hasActiveGame) return;

    const syncInterval = setInterval(() => {
      const current = getActiveSession();
      if (current) {
        current.elapsedSeconds = elapsedSeconds;
        current.lastSavedTimestamp = Date.now();
        saveActiveSession(current);
        setSavedSession(current);
      }
    }, 5000);

    return () => clearInterval(syncInterval);
  }, [hasActiveGame, elapsedSeconds]);

  // 4. BeforeUnload Guard: Prevent accidental closing of tab without prompt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasActiveGame && Object.keys(answersMap).length > 0 && Object.keys(answersMap).length < 80) {
        // Emergency flush
        const current = getActiveSession();
        if (current) {
          current.elapsedSeconds = elapsedSeconds;
          current.lastSavedTimestamp = Date.now();
          saveActiveSession(current);
        }
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasActiveGame, answersMap, elapsedSeconds]);

  // Autostart query parameter support (?autostart=1)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' && !hasActiveGame) {
        handleStartGame({
          studentName: 'Estudante Teste',
          studentClass: '8º Ano A',
          schoolName: 'Chrono Academy',
          mode: 'treino',
        });
      }
    }
  }, [hasActiveGame]);

  const handleStartGame = (params: {
    studentName: string;
    studentClass: string;
    schoolName: string;
    mode: 'avaliacao' | 'treino';
  }) => {
    setStudentInfo(params);
    setAnswersMap({});
    setCurrentQuestionId(1);
    setActiveTerminalQuestion(null);
    setCompletedRecord(null);
    setElapsedSeconds(0);
    setHasActiveGame(true);
    startTimeRef.current = Date.now();

    const snapshot: ActiveGameSession = {
      studentInfo: params,
      currentQuestionId: 1,
      activeTerminalQuestionId: null,
      answersMap: {},
      startTime: startTimeRef.current,
      elapsedSeconds: 0,
      lastSavedTimestamp: Date.now(),
      currentView: 'game',
      hasActiveGame: true,
    };
    saveActiveSession(snapshot);
    setSavedSession(snapshot);

    startTransition(() => {
      setCurrentView('game');
    });
  };

  const handleResumeSavedGame = () => {
    const session = getActiveSession();
    if (session) {
      setStudentInfo(session.studentInfo);
      setCurrentQuestionId(session.currentQuestionId || 1);
      setAnswersMap(session.answersMap || {});
      setElapsedSeconds(session.elapsedSeconds || 0);
      setHasActiveGame(true);
      if (session.activeTerminalQuestionId) {
        const q = activeQuestions.find((item) => item.id === session.activeTerminalQuestionId);
        if (q) setActiveTerminalQuestion(q);
      }
      setCurrentView('game');
    }
  };

  const handleExitAfterCompletion = () => {
    setCompletedRecord(null);
    clearActiveSession();
    setSavedSession(null);
    setAnswersMap({});
    setCurrentQuestionId(1);
    setActiveTerminalQuestion(null);
    setElapsedSeconds(0);
    setHasActiveGame(false);
    setIsExitModalOpen(false);
    setCurrentView('menu');
  };

  const handleRestartAfterCompletion = () => {
    setCompletedRecord(null);
    clearActiveSession();
    setSavedSession(null);
    setAnswersMap({});
    setCurrentQuestionId(1);
    setActiveTerminalQuestion(null);
    setElapsedSeconds(0);
    setHasActiveGame(false);
    setIsExitModalOpen(false);

    handleStartGame({
      studentName: studentInfo.studentName || 'Estudante Visitante',
      studentClass: studentInfo.studentClass || 'Turma Geral',
      schoolName: studentInfo.schoolName || '',
      mode: studentInfo.mode || 'treino',
    });
  };

  const handleResetSessionToZero = () => {
    try {
      soundEffects.interact();
    } catch {
      // AudioContext may be suspended or blocked before user gesture
    }
    clearActiveSession();
    setSavedSession(null);
    setAnswersMap({});
    setCurrentQuestionId(1);
    setElapsedSeconds(0);
    startTimeRef.current = Date.now();
    setCompletedRecord(null);
    setIsExitModalOpen(false);

    // If terminal question was open, reset to mission 1
    if (activeTerminalQuestion) {
      const q1 = activeQuestions.find((item) => item.id === 1);
      setActiveTerminalQuestion(q1 || null);
    }

    if (currentView === 'game') {
      setHasActiveGame(true);
      const cleanSession: ActiveGameSession = {
        studentInfo,
        currentQuestionId: 1,
        activeTerminalQuestionId: activeTerminalQuestion ? 1 : null,
        answersMap: {},
        startTime: startTimeRef.current,
        elapsedSeconds: 0,
        lastSavedTimestamp: Date.now(),
        currentView: 'game',
        hasActiveGame: true,
      };
      saveActiveSession(cleanSession);
      setSavedSession(cleanSession);
    } else {
      setHasActiveGame(false);
    }

    setRestoredToast('Tempo (00:00) e percentual (0%) zerados com sucesso! Partida reiniciada na Missão #1 do zero.');
    setTimeout(() => {
      setRestoredToast(null);
    }, 4000);
  };

  const handleOpenExitModal = () => {
    setIsExitModalOpen(true);
  };

  const handleSaveAndExitToMenu = () => {
    // If the game was already completed (all 80 questions answered or finalized), reset everything to zero
    if (Object.keys(answersMap).length >= 80 || completedRecord !== null) {
      handleExitAfterCompletion();
      return;
    }

    // Flush current state to localStorage (game in progress)
    const snapshot: ActiveGameSession = {
      studentInfo,
      currentQuestionId,
      activeTerminalQuestionId: activeTerminalQuestion ? activeTerminalQuestion.id : null,
      answersMap,
      startTime: startTimeRef.current,
      elapsedSeconds,
      lastSavedTimestamp: Date.now(),
      currentView: 'menu',
      hasActiveGame: true,
    };
    saveActiveSession(snapshot);
    setSavedSession(snapshot);

    setIsExitModalOpen(false);
    setActiveTerminalQuestion(null);
    setCurrentView('menu');
  };

  const handleConfirmRestart = () => {
    clearActiveSession();
    setSavedSession(null);
    setAnswersMap({});
    setCurrentQuestionId(1);
    setActiveTerminalQuestion(null);
    setCompletedRecord(null);
    setElapsedSeconds(0);
    setHasActiveGame(false);
    setIsExitModalOpen(false);

    handleStartGame({
      studentName: studentInfo.studentName || 'Estudante Visitante',
      studentClass: studentInfo.studentClass || 'Turma Geral',
      schoolName: studentInfo.schoolName || '',
      mode: studentInfo.mode || 'treino',
    });
  };

  const handleOpenTerminal = (question: QuestionItem) => {
    setActiveTerminalQuestion(question);
  };

  const handleConfirmAnswer = (
    questionId: number,
    rawAnswer: string,
    result: ValidationResult
  ) => {
    setAnswersMap((prev) => {
      const existing = prev[questionId];
      const hadPreviousError = existing ? (existing.hadError || !existing.isCorrect) : false;
      const isErrorThisTime = !result.isCorrect;
      const hadError = hadPreviousError || isErrorThisTime;

      const updated = {
        ...prev,
        [questionId]: {
          userAnswer: rawAnswer,
          isCorrect: result.isCorrect,
          hadError,
          feedback: result.feedbackMessage,
        },
      };

      // Check if all 80 questions have now been answered
      const answeredKeys = Object.keys(updated).map(Number);
      if (answeredKeys.length === 80) {
        finalizeAssessment(updated);
      }

      return updated;
    });
  };

  const finalizeAssessment = (
    finalAnswers: Record<number, { userAnswer: string; isCorrect: boolean; hadError?: boolean; feedback?: string }>
  ) => {
    const totalDuration = Math.max(1, elapsedSeconds);
    let correctCount = 0;
    let totalErrorCount = 0;

    const answerRecords: StudentAnswerRecord[] = activeQuestions.map((q) => {
      const ans = finalAnswers[q.id];
      const isCorrect = ans?.isCorrect ?? false;
      const hadError = ans?.hadError ?? !isCorrect;
      if (isCorrect) correctCount++;
      if (hadError) totalErrorCount++;

      return {
        questionId: q.id,
        affirmative: q.affirmative,
        translation: q.translation,
        userAnswer: ans?.userAnswer || '',
        canonicalAnswer: q.canonicalAnswer,
        isCorrect,
        hadError,
        feedback: ans?.feedback,
      };
    });

    const scoreMetrics = calculateAssessmentScore(correctCount, 80, totalErrorCount);

    const record: AssessmentRecord = {
      id: `cq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentName: studentInfo.studentName,
      studentClass: studentInfo.studentClass,
      schoolName: studentInfo.schoolName,
      mode: studentInfo.mode,
      completedAt: new Date().toISOString(),
      formattedDate: new Date().toLocaleString('pt-BR'),
      durationSeconds: totalDuration,
      formattedDuration: formatDuration(totalDuration),
      totalQuestions: 80,
      correctCount: scoreMetrics.correctCount,
      wrongCount: scoreMetrics.wrongCount,
      percentage: scoreMetrics.percentage,
      scoreOutOfTen: scoreMetrics.scoreOutOfTen,
      answers: answerRecords,
    };

    saveAssessmentRecord(record);
    setCompletedRecord(record);

    // Keep session marked completed
    clearActiveSession();
    setSavedSession(null);
    setHasActiveGame(false);
  };

  const handleNextQuestion = () => {
    if (!activeTerminalQuestion) return;
    const nextId = activeTerminalQuestion.id + 1;
    if (nextId <= 80) {
      setCurrentQuestionId(nextId);
      const nextQ = activeQuestions.find((q) => q.id === nextId);
      setActiveTerminalQuestion(nextQ || null);
    } else {
      setActiveTerminalQuestion(null);
    }
  };

  const handleJumpToMission = (targetId: number) => {
    const targetQ = activeQuestions.find((q) => q.id === targetId);
    if (!targetQ) return;

    setCurrentQuestionId(targetId);
    setHasActiveGame(true);
    if (!studentInfo.studentName) {
      setStudentInfo({
        studentName: 'Estudante',
        studentClass: 'Geral',
        schoolName: '',
        mode: 'treino',
      });
    }

    startTransition(() => {
      setCurrentView('game');
      setActiveTerminalQuestion(targetQ);
    });

    setRestoredToast(`Atalho executado com sucesso! Redirecionado para a Missão #${targetId}.`);
    setTimeout(() => {
      setRestoredToast(null);
    }, 3500);
  };

  const answeredIds = Object.keys(answersMap).map(Number);
  const correctCount = Object.values(answersMap).filter((a) => a.isCorrect).length;
  const totalErrorCount = Object.values(answersMap).filter((a) => a.hadError).length;
  const currentAccuracy = calculateAccuracyPercentage(correctCount, answeredIds.length, totalErrorCount);

  const handleOpenReport = () => {
    if (answeredIds.length >= 80) {
      finalizeAssessment(answersMap);
    }
  };

  const handleGoToMenu = () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      try {
        document.exitPointerLock();
      } catch (err) {
        // pointer lock exit fallback
      }
    }
    setActiveTerminalQuestion(null);
    setCompletedRecord(null);
    setIsExitModalOpen(false);
    setIsMissionJumpOpen(false);
    setCurrentView('menu');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* 1. CONTINUOUS TIMER & STATUS BAR (VISIBLE ACROSS ALL PAGES) */}
      <GlobalContinuousTimerBar
        elapsedSeconds={elapsedSeconds}
        currentQuestionId={currentQuestionId}
        totalQuestions={80}
        answeredCount={answeredIds.length}
        correctCount={correctCount}
        accuracy={currentAccuracy}
        currentView={currentView}
        hasActiveGame={hasActiveGame}
        onReturnToGame={() => setCurrentView('game')}
        onOpenExitModal={handleOpenExitModal}
        onRestartGame={handleOpenExitModal}
        onResetToZero={handleResetSessionToZero}
        onOpenMissionJump={() => setIsMissionJumpOpen(true)}
        onJumpToMission={(id) => handleJumpToMission(id)}
        onOpenReport={handleOpenReport}
        onGoToMenu={handleGoToMenu}
        mode={studentInfo.mode}
        studentName={studentInfo.studentName}
      />

      {/* Restored Session Toast Notification */}
      {restoredToast && (
        <div className="bg-gradient-to-r from-cyan-900/90 via-slate-900 to-emerald-900/90 border-b border-cyan-400/40 px-4 py-2 text-xs font-mono text-cyan-200 flex items-center justify-between z-50 animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" />
            <span>{restoredToast}</span>
          </div>
          <button
            onClick={() => setRestoredToast(null)}
            className="p-1 hover:text-white rounded"
            aria-label="Fechar notificação"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN VIEW CONTAINER */}
      <div className="flex-1 flex flex-col">
        {/* VIEW: MAIN MENU */}
        {currentView === 'menu' && (
          <MainMenu
            onStartGame={handleStartGame}
            onOpenTeacherDashboard={() => setCurrentView('teacher_dashboard')}
            onOpenStudyGuide={() => setCurrentView('study_guide')}
            onOpenMusicLounge={() => setCurrentView('music_lounge')}
            graphicsQuality={graphicsQuality}
            onToggleGraphics={() =>
              setGraphicsQuality((prev) => (prev === 'high' ? 'low' : 'high'))
            }
            onRestartGame={handleResetSessionToZero}
            savedSession={savedSession}
            onResumeSavedGame={handleResumeSavedGame}
            initialStudentInfo={studentInfo}
          />
        )}

        {/* VIEW: 3D CHRONO CITY GAME */}
        {currentView === 'game' && (
          <div className="relative w-full h-[calc(100vh-3.2rem)] flex-1">
            <ThreeWorld
              currentQuestionId={currentQuestionId}
              answeredQuestionIds={answeredIds}
              onOpenQuestion={handleOpenTerminal}
              graphicsQuality={graphicsQuality}
              onToggleGraphics={() =>
                setGraphicsQuality((prev) => (prev === 'high' ? 'low' : 'high'))
              }
              onOpenStudyGuide={() => setCurrentView('study_guide')}
              onOpenMusicLounge={() => setCurrentView('music_lounge')}
              mode={studentInfo.mode}
              questions={activeQuestions}
              startTime={startTimeRef.current}
              elapsedSeconds={elapsedSeconds}
              correctCount={correctCount}
              onLeaveGame={handleOpenExitModal}
              onRestartGame={handleOpenExitModal}
              onResetToZero={handleResetSessionToZero}
            />

            {/* ACTIVE MISSION TERMINAL MODAL */}
            {activeTerminalQuestion && (
              <TerminalModal
                question={activeTerminalQuestion}
                mode={studentInfo.mode}
                isAnswered={!!answersMap[activeTerminalQuestion.id]}
                savedAnswer={answersMap[activeTerminalQuestion.id]?.userAnswer}
                isSavedCorrect={answersMap[activeTerminalQuestion.id]?.isCorrect}
                onConfirmAnswer={handleConfirmAnswer}
                onNextQuestion={handleNextQuestion}
                onClose={() => setActiveTerminalQuestion(null)}
                hasNextQuestion={activeTerminalQuestion.id < 80}
                elapsedSeconds={elapsedSeconds}
                accuracy={currentAccuracy}
                answeredCount={answeredIds.length}
                correctCount={correctCount}
                totalQuestions={80}
                onResetToZero={handleResetSessionToZero}
              />
            )}
          </div>
        )}

        {/* VIEW: STUDY GUIDE / APOSTILA NÍVEL 1 AULA 2 */}
        {currentView === 'study_guide' && (
          <GrammarStudyHub
            onBack={() => {
              if (hasActiveGame) {
                setCurrentView('game');
              } else {
                setCurrentView('menu');
              }
            }}
            onStartGame={() => {
              if (!studentInfo.studentName) {
                setStudentInfo({
                  studentName: 'Estudante',
                  studentClass: 'Geral',
                  schoolName: '',
                  mode: 'treino',
                });
              }
              setHasActiveGame(true);
              setCurrentView('game');
            }}
            onLeaveGame={handleOpenExitModal}
            onRestartGame={handleOpenExitModal}
          />
        )}

        {/* VIEW: MUSIC LOUNGE */}
        {currentView === 'music_lounge' && (
          <MusicLounge
            onBack={() => {
              if (hasActiveGame) {
                setCurrentView('game');
              } else {
                setCurrentView('menu');
              }
            }}
            onLeaveGame={handleOpenExitModal}
            onRestartGame={handleOpenExitModal}
          />
        )}

        {/* VIEW: TEACHER DASHBOARD */}
        {currentView === 'teacher_dashboard' && (
          <TeacherDashboard
            onBack={() => {
              if (hasActiveGame) {
                setCurrentView('game');
              } else {
                setCurrentView('menu');
              }
            }}
            onLeaveGame={handleOpenExitModal}
            onRestartGame={handleOpenExitModal}
          />
        )}
      </div>

      {/* SAFE EXIT CONFIRMATION MODAL */}
      <ExitConfirmationModal
        isOpen={isExitModalOpen}
        studentName={studentInfo.studentName}
        currentQuestionId={currentQuestionId}
        answeredCount={answeredIds.length}
        totalQuestions={80}
        accuracy={currentAccuracy}
        elapsedDuration={formatDuration(elapsedSeconds)}
        onStayInGame={() => setIsExitModalOpen(false)}
        onSaveAndExitToMenu={handleSaveAndExitToMenu}
        onConfirmRestart={handleConfirmRestart}
        mode={studentInfo.mode}
        isCompleted={answeredIds.length >= 80 || completedRecord !== null}
      />

      {/* COMPLETED ASSESSMENT REPORT OVERLAY (GLOBAL FOR ALL VIEWS) */}
      {completedRecord && (
        <ReportModal
          record={completedRecord}
          onReturnToMenu={handleExitAfterCompletion}
          onRestartGame={handleRestartAfterCompletion}
          onReviewInWorld={() => {
            setCompletedRecord(null);
          }}
        />
      )}

      {/* SECRET / TEACHER MISSION JUMP MODAL */}
      <MissionJumpModal
        isOpen={isMissionJumpOpen}
        onClose={() => setIsMissionJumpOpen(false)}
        onJumpToMission={handleJumpToMission}
        totalQuestions={80}
        currentQuestionId={currentQuestionId}
      />
    </div>
  );
}
