import React, { useEffect } from 'react';
import {
  Trophy,
  Printer,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  GraduationCap,
  Calendar,
  Sparkles,
  School,
  Share2,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AssessmentRecord } from '../services/storage';
import { soundEffects } from '../utils/audioSystem';

interface ReportModalProps {
  record: AssessmentRecord;
  onReturnToMenu: () => void;
  onReviewInWorld?: () => void;
  onRestartGame?: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  record,
  onReturnToMenu,
  onReviewInWorld,
  onRestartGame,
}) => {
  useEffect(() => {
    soundEffects.portalComplete();
    // Fire festive celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const isHighPerformer = record.percentage >= 70;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 flex flex-col items-center justify-start print:bg-white print:p-0 print:text-black">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950 overflow-hidden my-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Top Cinematic Banner */}
        <div className="relative bg-gradient-to-r from-slate-950 via-cyan-950/70 to-slate-950 px-6 py-8 border-b border-cyan-500/30 text-center overflow-hidden print:bg-transparent print:border-b-2 print:border-black print:py-4">
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-widest mb-3 print:hidden">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Chrono City • Portal Quântico Reativado</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-300 print:text-black print:bg-none">
              CHRONO QUEST — MISSÃO CONCLUÍDA
            </h1>
            <p className="text-sm sm:text-base text-cyan-200/80 mt-1 print:text-gray-700">
              Relatório Oficial de Avaliação • Simple Present Questions (DO / DOES)
            </p>
          </div>
        </div>

        {/* Student & Score Spotlight Cards */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Info Card */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 print:border-gray-300 print:bg-gray-50">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400 print:text-gray-700" />
                Dados do Estudante
              </h2>

              <div className="space-y-2">
                <div>
                  <span className="text-xs text-slate-400 block print:text-gray-600">Nome Completo:</span>
                  <span className="text-xl sm:text-2xl font-black text-white print:text-black tracking-wide">
                    {record.studentName}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block flex items-center gap-1 print:text-gray-600">
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400 print:text-gray-700" />
                      Turma:
                    </span>
                    <span className="font-bold text-cyan-300 print:text-black">{record.studentClass}</span>
                  </div>

                  {record.schoolName && (
                    <div>
                      <span className="text-xs text-slate-400 block flex items-center gap-1 print:text-gray-600">
                        <School className="w-3.5 h-3.5 text-cyan-400 print:text-gray-700" />
                        Escola:
                      </span>
                      <span className="font-bold text-slate-200 print:text-black">{record.schoolName}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-xs text-slate-400 block flex items-center gap-1 print:text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 print:text-gray-700" />
                      Data:
                    </span>
                    <span className="font-bold text-slate-300 print:text-black">{record.formattedDate}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block flex items-center gap-1 print:text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 print:text-gray-700" />
                      Tempo Total:
                    </span>
                    <span className="font-mono font-bold text-slate-300 print:text-black">{record.formattedDuration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Big Badge */}
            <div
              className={`p-5 rounded-2xl flex flex-col items-center justify-center text-center border ${
                isHighPerformer
                  ? 'bg-gradient-to-b from-cyan-950/60 to-emerald-950/60 border-cyan-500/50 text-cyan-200'
                  : 'bg-gradient-to-b from-slate-950 to-amber-950/50 border-amber-500/50 text-amber-200'
              } print:bg-white print:border-gray-400 print:text-black`}
            >
              <Trophy
                className={`w-10 h-10 mb-2 ${
                  isHighPerformer ? 'text-yellow-400' : 'text-amber-400'
                } print:hidden`}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold print:text-gray-600">
                Nota Final
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white print:text-black my-1">
                {record.scoreOutOfTen}
                <span className="text-lg text-slate-400 print:text-gray-600 font-normal"> / 10.0</span>
              </div>
              <div className="text-base font-bold text-cyan-400 print:text-black">
                {record.percentage.toFixed(2)}% de Acerto
              </div>
              <div className="text-xs text-slate-300 print:text-gray-700 mt-2">
                {record.correctCount} acertos • {record.wrongCount} erros (Total {record.totalQuestions || 60})
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:hidden">
            <div className="text-xs text-slate-400">
              {record.mode === 'avaliacao' ? (
                <span>Registro oficial auditável gravado.</span>
              ) : (
                <span>Sessão de treino concluída.</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                title="Imprimir ou exportar em PDF o relatório da avaliação"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Imprimir / Salvar PDF</span>
              </button>

              {onReviewInWorld && (
                <button
                  type="button"
                  onClick={onReviewInWorld}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition"
                  title="Fechar relatório para caminhar e explorar a metrópole 3D"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Explorar Chrono City</span>
                </button>
              )}

              {onRestartGame && (
                <button
                  type="button"
                  onClick={onRestartGame}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30 transition-transform active:scale-95"
                  title="Zerar cronômetro e percentual de acerto e iniciar nova partida imediatamente"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Jogar Novamente</span>
                </button>
              )}

              <button
                type="button"
                onClick={onReturnToMenu}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/30 transition-transform active:scale-95"
                title="Sair para o Menu Principal e zerar cronômetro e percentual para jogar novamente"
              >
                <Home className="w-4 h-4" />
                <span>Sair para o Menu</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 print:text-black" />
              Gabarito e Respostas das {record.totalQuestions || 60} Missões
            </h2>

            <div className="space-y-3">
              {record.answers.map((ans) => (
                <div
                  key={ans.questionId}
                  className={`p-4 rounded-xl border text-sm transition ${
                    ans.isCorrect
                      ? 'bg-slate-950/60 border-emerald-500/30'
                      : 'bg-slate-950/60 border-rose-500/30'
                  } print:bg-white print:border-gray-300 print:text-black`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 print:bg-gray-200 print:text-black">
                        #{ans.questionId.toString().padStart(2, '0')}
                      </span>
                      <div>
                        <span className="font-bold text-white print:text-black">{ans.affirmative}</span>
                        <p className="text-xs text-slate-400 print:text-gray-600">{ans.translation}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {ans.isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 print:bg-green-100 print:text-green-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Acerto (+3.125%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 print:bg-red-100 print:text-red-800">
                          <XCircle className="w-3.5 h-3.5" />
                          Erro (0%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Answers breakdown */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono print:border-gray-200">
                    <div>
                      <span className="text-slate-400 block text-[11px] font-sans print:text-gray-600">Sua Resposta Enviada:</span>
                      <span className={`font-semibold ${ans.isCorrect ? 'text-emerald-300' : 'text-rose-300'} print:text-black`}>
                        {ans.userAnswer || '(Sem resposta)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] font-sans print:text-gray-600">Gabarito Oficial:</span>
                      <span className="text-cyan-300 font-semibold print:text-black">
                        {ans.canonicalAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
