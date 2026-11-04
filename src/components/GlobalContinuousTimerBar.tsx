import React, { useState } from 'react';
import { Clock, ShieldCheck, Play, LogOut, RotateCcw, Target, ChevronRight, KeyRound, Zap, Trophy, Home, User } from 'lucide-react';
import { formatDuration } from '../game/grammarRules';

interface GlobalContinuousTimerBarProps {
  elapsedSeconds: number;
  currentQuestionId: number;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  accuracy: number;
  currentView: 'menu' | 'game' | 'study_guide' | 'music_lounge' | 'teacher_dashboard';
  hasActiveGame: boolean;
  onReturnToGame: () => void;
  onOpenExitModal: () => void;
  onRestartGame: () => void;
  onResetToZero?: () => void;
  onOpenMissionJump?: () => void;
  onJumpToMission?: (missionId: number, pass?: string) => void;
  onOpenReport?: () => void;
  onGoToMenu?: () => void;
  mode: 'avaliacao' | 'treino';
  studentName?: string;
}

export const GlobalContinuousTimerBar: React.FC<GlobalContinuousTimerBarProps> = ({
  elapsedSeconds,
  currentQuestionId,
  totalQuestions,
  answeredCount,
  correctCount,
  accuracy,
  currentView,
  hasActiveGame,
  onReturnToGame,
  onOpenExitModal,
  onRestartGame,
  onResetToZero,
  onOpenMissionJump,
  onJumpToMission,
  onOpenReport,
  onGoToMenu,
  mode,
  studentName,
}) => {
  const isGameView = currentView === 'game';
  const [inlinePassword, setInlinePassword] = useState<string>('');
  const [inlineMissionNum, setInlineMissionNum] = useState<string>(currentQuestionId.toString());

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(inlineMissionNum);
    if (!isNaN(target) && target >= 1 && target <= totalQuestions) {
      if (onJumpToMission) {
        onJumpToMission(target, inlinePassword);
      }
    }
  };

  return (
    <aside
      aria-label="Cronômetro Contínuo, Senha de Acesso e Painel de Progresso"
      className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/60 text-xs font-mono transition-all duration-200"
    >
      {/* ROW 1: CONTINUOUS CLOCK, ACCURACY, STUDENT NAME, RESTART, RESET & NAVIGATION */}
      <div className="max-w-7xl mx-auto px-3 py-1.5 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60">
        {/* Left: Clock, Accuracy & Student Name Badge */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* 1. STUDENT NAME BADGE (ALWAYS VISIBLE NEXT TO CLOCK & ACCURACY) */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-sky-950/90 via-slate-900 to-cyan-950/90 border-2 border-cyan-400/80 shadow-md text-cyan-300 font-black tracking-wider"
            title={studentName ? `Estudante Cadastrado: ${studentName}` : 'Estudante Visitante'}
          >
            <User className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-[11px] uppercase text-cyan-400/90 font-bold hidden xs:inline">Aluno:</span>
            <span data-testid="student-name-display" className="text-sm font-black text-white font-mono max-w-[130px] sm:max-w-[220px] truncate">
              {studentName && studentName.trim() ? studentName : 'Estudante'}
            </span>
          </div>

          {/* 2. CONTINUOUS CLOCK (ALWAYS VISIBLE) */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-2 border-amber-400/80 shadow-md text-amber-300 font-black tracking-wider">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span className="text-[11px] uppercase text-amber-400/90 font-bold hidden xs:inline">Relógio:</span>
            <span data-testid="timer-display" className="text-sm font-black text-white font-mono">
              {formatDuration(elapsedSeconds)}
            </span>
          </div>

          {/* 3. ACCURACY PERCENTAGE (ALWAYS VISIBLE) */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border-2 border-emerald-400/80 shadow-md text-emerald-300 font-black tracking-wider"
            title="Percentual de Acerto (-2,5% deduzidos a cada questão errada)"
          >
            <Target className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] uppercase text-emerald-400/90 font-bold hidden xs:inline">Percentual:</span>
            <span data-testid="accuracy-display" className="text-sm font-black text-white font-mono">
              {accuracy}%
            </span>
            <span className="text-[11px] text-emerald-300/80 font-bold">Acerto</span>
          </div>

          {/* 3. ZERAR TEMPO E % BUTTON */}
          {onResetToZero && (
            <button
              data-testid="reset-to-zero-btn"
              type="button"
              onClick={onResetToZero}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 hover:from-rose-900 hover:to-rose-800 border-2 border-rose-500/80 hover:border-rose-400 text-rose-300 hover:text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer"
              title="Zerar cronômetro (00:00) e percentual (0%)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Zerar Tempo e %</span>
            </button>
          )}

          {/* 4. Current Mission Counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-bold">
            <span className="text-cyan-400">MISSÃO:</span>
            <span className="text-white">#{currentQuestionId.toString().padStart(2, '0')}/{totalQuestions}</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline font-normal">
              {answeredCount}/{totalQuestions} respondidas
            </span>
          </div>
        </div>

        {/* Right: Return to Game / Pausar / Sair / Ver Relatório / Tela Inicial */}
        <div className="flex items-center gap-2">
          {currentView !== 'menu' && onGoToMenu && (
            <button
              type="button"
              onClick={onGoToMenu}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-500 hover:from-cyan-300 hover:to-sky-200 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/50 border-2 border-white/80 transition active:scale-95 cursor-pointer animate-pulse"
              title="Voltar para a Tela Inicial / Menu Principal (Identificação do Aluno)"
            >
              <Home className="w-4 h-4 text-slate-950 fill-current" />
              <span>🏠 TELA INICIAL (MENU)</span>
            </button>
          )}

          {answeredCount >= totalQuestions && onOpenReport && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition active:scale-95 cursor-pointer animate-pulse"
              title="Ver relatório final da avaliação"
            >
              <Trophy className="w-3.5 h-3.5 fill-current" />
              <span>🏆 RELATÓRIO FINAL</span>
            </button>
          )}

          {!isGameView && hasActiveGame && (
            <button
              onClick={onReturnToGame}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>CONTINUAR MISSÃO #{currentQuestionId}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {(hasActiveGame || answeredCount > 0) && (
            <button
              onClick={onOpenExitModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-rose-300 hover:text-white border border-slate-700 text-xs font-bold transition"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Pausar / Sair</span>
            </button>
          )}
        </div>
      </div>

      {/* ROW 2: PERMANENT HIGH-VISIBILITY PASSWORD & MISSION JUMP INPUT BAR (VISIBLE ON 100% OF SCREENS) */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 border-t border-cyan-500/40 px-3 py-1.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <form
            onSubmit={handleInlineSubmit}
            className="w-full flex flex-wrap items-center gap-2"
          >
            {/* Label */}
            <div className="flex items-center gap-1.5 text-cyan-300 font-black text-xs shrink-0">
              <KeyRound className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
              <span className="uppercase tracking-wider">CAMPO DE SENHA E SALTO DE MISSÃO:</span>
            </div>

            {/* Password Field */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[11px] text-slate-300 font-bold">Senha:</span>
              <input
                type="password"
                placeholder="Digite a Senha"
                value={inlinePassword}
                onChange={(e) => setInlinePassword(e.target.value)}
                className="w-24 sm:w-28 px-2.5 py-1 rounded-lg bg-slate-950 border-2 border-cyan-500/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 font-mono shadow-inner"
              />
            </div>

            {/* Mission Number Field */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[11px] text-cyan-300 font-bold">Ir para Missão #:</span>
              <input
                type="number"
                min={1}
                max={totalQuestions}
                placeholder="1-80"
                value={inlineMissionNum}
                onChange={(e) => setInlineMissionNum(e.target.value)}
                className="w-16 px-2 py-1 rounded-lg bg-slate-950 border-2 border-cyan-400 text-center text-xs text-cyan-300 font-black focus:outline-none focus:border-cyan-300 font-mono shadow-inner"
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 transition active:scale-95 shrink-0 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>IR AGORA</span>
            </button>

            {/* Expanded Modal Trigger */}
            {onOpenMissionJump && (
              <button
                type="button"
                onClick={onOpenMissionJump}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs font-bold transition shrink-0 ml-auto"
                title="Abrir painel completo com botões rápidos de todos os módulos"
              >
                <span>🔑 Abrir Painel Completo</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </aside>
  );
};
