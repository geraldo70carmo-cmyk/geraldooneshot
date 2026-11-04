import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Clock,
  Target,
  RotateCcw,
} from 'lucide-react';
import {
  QuestionItem,
  ValidationResult,
  evaluateAnswer,
  normalizeSentence,
  formatDuration,
} from '../game/grammarRules';
import { soundEffects, speakEnglish } from '../utils/audioSystem';

import confetti from 'canvas-confetti';

interface TerminalModalProps {
  question: QuestionItem;
  mode: 'avaliacao' | 'treino';
  isAnswered: boolean;
  savedAnswer?: string;
  isSavedCorrect?: boolean;
  onConfirmAnswer: (questionId: number, answer: string, result: ValidationResult) => void;
  onNextQuestion?: () => void;
  onClose: () => void;
  hasNextQuestion: boolean;
  elapsedSeconds?: number;
  accuracy?: number;
  answeredCount?: number;
  correctCount?: number;
  totalQuestions?: number;
  onResetToZero?: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  question,
  mode,
  isAnswered,
  savedAnswer = '',
  isSavedCorrect,
  onConfirmAnswer,
  onNextQuestion,
  onClose,
  hasNextQuestion,
  elapsedSeconds,
  accuracy,
  answeredCount,
  correctCount,
  totalQuestions = 80,
  onResetToZero,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmittedThisSession, setHasSubmittedThisSession] = useState<boolean>(isAnswered);
  const [evalResult, setEvalResult] = useState<ValidationResult | null>(null);
  const [hintTier, setHintTier] = useState<number>(0);

  useEffect(() => {
    if (savedAnswer) {
      const matched = question.options.find(
        (o) => normalizeSentence(o.text) === normalizeSentence(savedAnswer)
      );
      setSelectedOptionId(matched ? matched.id : null);
    } else {
      setSelectedOptionId(null);
    }
    setHasSubmittedThisSession(isAnswered);
    setHintTier(0);
    setEvalResult(null);
  }, [question.id]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedOptionId || hasSubmittedThisSession) return;

    const result = evaluateAnswer(question, selectedOptionId);
    setEvalResult(result);
    setHasSubmittedThisSession(true);

    if (result.isCorrect) {
      soundEffects.correct();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#00f0ff', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
        });
      } catch {}
    } else {
      soundEffects.incorrect();
    }

    onConfirmAnswer(question.id, result.normalizedUser, result);
  };

  const handleRetryInTraining = () => {
    setHasSubmittedThisSession(false);
    setSelectedOptionId(null);
    setEvalResult(null);
  };

  const handleNext = () => {
    if (onNextQuestion) {
      onNextQuestion();
    } else {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terminal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-slate-950 px-4 sm:px-5 py-3 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider uppercase">
                  SETOR {question.sectorId}/8 • {question.sectorName}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                    mode === 'avaliacao'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {mode === 'avaliacao' ? 'MODO AVALIAÇÃO OFICIAL' : 'MODO TREINO'}
                </span>
              </div>
              <h2 id="terminal-modal-title" className="text-base sm:text-lg font-black text-white">
                MISSÃO #{question.id.toString().padStart(2, '0')} / {totalQuestions} — TERMINAL DE ENERGIA
              </h2>
            </div>
          </div>

          {/* Continuous Clock & Accuracy Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {elapsedSeconds !== undefined && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border-2 border-amber-400/70 rounded-xl font-mono text-xs font-bold text-amber-300 shadow-sm"
                title="Relógio contínuo"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden xs:inline text-[10px] text-amber-400/80">RELÓGIO:</span>
                <span className="text-white font-black">{formatDuration(elapsedSeconds)}</span>
              </div>
            )}

            {accuracy !== undefined && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border-2 border-emerald-400/70 rounded-xl font-mono text-xs font-bold text-emerald-300 shadow-sm"
                title="Percentual de acerto"
              >
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-black">{accuracy}%</span>
                <span className="text-[10px] text-emerald-400/80">Acerto</span>
              </div>
            )}

            {onResetToZero && (
              <button
                type="button"
                onClick={() => {
                  setSelectedOptionId(null);
                  setHasSubmittedThisSession(false);
                  setEvalResult(null);
                  onResetToZero();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 hover:from-rose-900 hover:to-rose-800 border-2 border-rose-500/70 hover:border-rose-400 text-rose-300 hover:text-white font-black text-xs shadow-sm transition active:scale-95 cursor-pointer"
                title="Zerar cronômetro (00:00), percentual (0%) e recomeçar a Missão #1 do zero"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400 animate-spin-once" />
                <span className="hidden sm:inline">Zerar Tempo e %</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
              aria-label="Fechar terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Sentence Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                {question.id >= 61 ? 'Desafio / Frase de Estudo (Aula 2):' : 'Frase Afirmativa Original:'}
              </span>
              <button
                type="button"
                onClick={() => speakEnglish(question.affirmative)}
                className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition"
                title="Ouvir pronúncia"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ouvir</span>
              </button>
            </div>

            {/* 1. English or Portuguese sentence */}
            <p className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {question.affirmative}
            </p>

            {/* 2. Translation or Description */}
            <p className="text-sm sm:text-base text-cyan-300/90 font-medium mt-1">
              {question.id >= 61 ? `Contexto: ${question.translation}` : `Tradução: ${question.translation}`}
            </p>
          </div>

          {/* Form instructions */}
          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-slate-200">
              {question.id >= 61
                ? 'Instrução: Escolha a alternativa correta entre A, B, C, D e E com base nas regras e expressões da Aula 2.'
                : 'Instrução: Escolha a alternativa correta entre A, B, C, D e E que transforma a frase acima em uma pergunta no Simple Present.'}
            </p>
          </div>

          {/* Multiple Choice Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
                Alternativas de Resposta:
              </label>
              <div className="space-y-2.5">
                {question.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={hasSubmittedThisSession}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-mono text-sm sm:text-base transition flex items-center gap-3 ${
                        hasSubmittedThisSession
                          ? isSelected
                            ? opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-950/50 text-white shadow-md'
                              : 'border-rose-500 bg-rose-950/50 text-white shadow-md'
                            : opt.isCorrect
                              ? 'border-emerald-500/70 bg-emerald-950/20 text-emerald-200'
                              : 'border-slate-800 bg-slate-950/50 text-slate-400 opacity-60'
                          : isSelected
                            ? 'border-cyan-400 bg-cyan-950/70 text-white shadow-lg shadow-cyan-950/50'
                            : 'border-slate-800 bg-slate-950/80 hover:border-cyan-500/40 text-slate-200'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {opt.id}
                      </span>
                      <span className="flex-1 font-semibold">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {!hasSubmittedThisSession ? (
                <button
                  type="submit"
                  disabled={!selectedOptionId}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>CONFIRMAR RESPOSTA</span>
                </button>
              ) : (
                <div className="w-full space-y-4">
                  {/* Feedback Banner: Celebration when correct, or correct form when incorrect */}
                  {(evalResult?.isCorrect ?? isSavedCorrect) ? (
                    // CELEBRATION WHEN CORRECT
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border-2 border-emerald-400 shadow-xl shadow-emerald-950/60 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
                        <h4 className="font-black text-emerald-300 text-lg tracking-wide">
                          🎉 PARABÉNS! VOCÊ ACERTOU! 🎉
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                        {question.id >= 61
                          ? 'Excelente! Você selecionou a alternativa correta referente ao conteúdo da Aula 2.'
                          : `Excelente raciocínio! Você identificou o auxiliar correto (${question.auxiliary.toUpperCase()}) e manteve o verbo na forma básica (${question.baseVerb}).`}
                      </p>
                      <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-500/40 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block">
                            A FORMA CORRETA DA QUESTÃO É:
                          </span>
                          <span className="font-mono text-sm sm:text-base font-black text-white">
                            {question.canonicalAnswer}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakEnglish(question.canonicalAnswer)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 text-xs font-bold transition border border-emerald-500/40 shrink-0"
                          title="Ouvir forma correta"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>Ouvir</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // INFORM CORRECT FORM WHEN WRONG
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-rose-950/70 border-2 border-rose-500 shadow-xl shadow-rose-950/60 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                        <h4 className="font-black text-rose-300 text-lg tracking-wide">
                          RESPOSTA INCORRETA
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-rose-200">
                        {evalResult?.feedbackMessage || `A alternativa selecionada não é a resposta adequada.`}
                      </p>

                      {/* Prominent Correct Form Display */}
                      <div className="p-4 rounded-xl bg-slate-950/95 border-2 border-cyan-400/70 space-y-1.5 shadow-lg">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs uppercase font-mono tracking-wider text-cyan-300 font-black flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            A FORMA CORRETA DA QUESTÃO É:
                          </span>
                          <button
                            type="button"
                            onClick={() => speakEnglish(question.canonicalAnswer)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 text-xs font-bold transition border border-cyan-500/40 shrink-0"
                            title="Ouvir forma correta"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Ouvir</span>
                          </button>
                        </div>

                        <p className="text-base sm:text-xl font-mono font-black text-white tracking-wide">
                          {question.canonicalAnswer}
                        </p>

                        <div className="pt-2 mt-1 border-t border-slate-800 text-xs text-amber-300/90 leading-relaxed">
                          <strong>Explicação Didática (Aula 2):</strong> {question.hints.level3}
                        </div>
                      </div>

                      {mode === 'treino' ? (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleRetryInTraining}
                            className="px-3.5 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-bold transition"
                          >
                            Tentar Novamente
                          </button>
                          <button
                            type="button"
                            onClick={() => setHintTier((prev) => Math.min(3, prev + 1))}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Ver Dica ({hintTier + 1}/3)</span>
                          </button>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 font-mono italic">
                          (Sua resposta inicial foi registrada para o cálculo da nota oficial. Utilize a correção acima para consolidar seu aprendizado!)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Next mission button */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <span>{hasNextQuestion ? 'PRÓXIMA MISSÃO' : 'CONCLUIR AVALIAÇÃO'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Training Mode Progressive Hints Box */}
          {mode === 'treino' && hintTier > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Dica Nível {hintTier} de 3:</span>
              </div>
              {hintTier >= 1 && <p><strong>Lembrete:</strong> {question.hints.level1}</p>}
              {hintTier >= 2 && <p><strong>Estrutura:</strong> {question.hints.level2}</p>}
              {hintTier >= 3 && <p><strong>Explicação Específica:</strong> {question.hints.level3}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
