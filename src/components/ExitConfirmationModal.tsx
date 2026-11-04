import React from 'react';
import { ShieldCheck, Play, ArrowLeft, RotateCcw, AlertTriangle, Clock, Target, CheckCircle2 } from 'lucide-react';

interface ExitConfirmationModalProps {
  isOpen: boolean;
  studentName: string;
  currentQuestionId: number;
  answeredCount: number;
  totalQuestions: number;
  accuracy: number;
  elapsedDuration: string;
  onStayInGame: () => void;
  onSaveAndExitToMenu: () => void;
  onConfirmRestart: () => void;
  mode: 'avaliacao' | 'treino';
  isCompleted?: boolean;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  isOpen,
  studentName,
  currentQuestionId,
  answeredCount,
  totalQuestions,
  accuracy,
  elapsedDuration,
  onStayInGame,
  onSaveAndExitToMenu,
  onConfirmRestart,
  mode,
  isCompleted = false,
}) => {
  if (!isOpen) return null;

  const finished = isCompleted || answeredCount >= totalQuestions;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl shadow-cyan-950/90 overflow-hidden flex flex-col p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              {finished ? 'Partida Concluída — Sair ou Jogar Novamente?' : 'Pausar ou Sair do Jogo?'}
            </h3>
            <p className="text-xs text-slate-400">
              {finished ? (
                <>Seu relatório oficial já foi emitido e salvo.</>
              ) : (
                <>Seu progresso está <strong className="text-emerald-400">100% salvo e seguro</strong> no navegador.</>
              )}
            </p>
          </div>
        </div>

        {/* Status Snapshot Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Estudante:</span>
            <span className="text-white font-bold">{studentName || 'Estudante'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-center font-mono">
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block">
                {finished ? 'Concluídas' : 'Missão Atual'}
              </span>
              <span className="text-sm font-black text-cyan-300">
                {finished ? `${answeredCount}/${totalQuestions}` : `#${currentQuestionId}/${totalQuestions}`}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block">Acerto</span>
              <span className="text-sm font-black text-emerald-400">{accuracy}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block">Tempo</span>
              <span className="text-sm font-black text-amber-300">⏱ {elapsedDuration}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 flex items-center gap-2 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {finished ? (
                <>Todas as <strong>{totalQuestions} missões</strong> foram finalizadas com sucesso!</>
              ) : (
                <>Você respondeu <strong>{answeredCount} de {totalQuestions}</strong> questões. Nenhuma resposta será perdida.</>
              )}
            </span>
          </p>
        </div>

        {/* Explanation */}
        <p className="text-xs text-slate-400 leading-relaxed">
          {finished ? (
            <>Ao sair para o menu ou reiniciar agora, o cronômetro contínuo e o percentual de acerto serão <strong className="text-cyan-300">zerados</strong> para você jogar novamente uma partida limpa.</>
          ) : (
            <>Você só sai do jogo se desejar. Se for para o menu principal ou fechar a aba, você poderá retornar exatamente para a Missão #{currentQuestionId} a qualquer momento.</>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          {finished ? (
            <>
              {/* Finished Option 1: Exit to menu (resets time & percentage to 0) */}
              <button
                onClick={onSaveAndExitToMenu}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition"
                title="Sair para o menu principal e zerar cronômetro e percentual"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>SAIR PARA O MENU (ZERAR TEMPO E %)</span>
              </button>

              {/* Finished Option 2: Restart immediately (resets time & percentage to 0) */}
              <button
                onClick={onConfirmRestart}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
                title="Zerar cronômetro e percentual e reiniciar a partida"
              >
                <RotateCcw className="w-4 h-4" />
                <span>JOGAR NOVAMENTE (ZERAR E RECOMEÇAR)</span>
              </button>

              {/* Finished Option 3: Continue exploring */}
              <button
                onClick={onStayInGame}
                className="w-full py-2 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-mono flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Continuar explorando Chrono City</span>
              </button>
            </>
          ) : (
            <>
              {/* In Progress Option 1: Continue playing */}
              <button
                onClick={onStayInGame}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>CONTINUAR JOGANDO (FICAR NESTA TELA)</span>
              </button>

              {/* In Progress Option 2: Save and go to menu */}
              <button
                onClick={onSaveAndExitToMenu}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>SALVAR PROGRESSO E IR PARA O MENU</span>
              </button>

              {/* In Progress Option 3: Restart completely */}
              <button
                onClick={onConfirmRestart}
                className="w-full py-2 px-3 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-[11px] font-mono flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar esta partida do início (apagar respostas)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
