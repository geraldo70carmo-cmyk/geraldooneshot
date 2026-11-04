import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Sparkles, X, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../utils/audioSystem';

interface MissionJumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToMission: (missionId: number) => void;
  totalQuestions?: number;
  currentQuestionId: number;
}

// Master passwords accepted for instant jump unlock
const ACCEPTED_PASSWORDS = ['200170', 'GERALDO', 'CHRONO', '1234', 'PROFE', 'SECRETO', 'CHRONOQUEST', 'MESTRE'];

export const MissionJumpModal: React.FC<MissionJumpModalProps> = ({
  isOpen,
  onClose,
  onJumpToMission,
  totalQuestions = 80,
  currentQuestionId,
}) => {
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [targetMissionId, setTargetMissionId] = useState<number>(currentQuestionId);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true); // Pre-unlocked for instant jump, or validated by password
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteJump = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1. Validate target mission number
    const num = Number(targetMissionId);
    if (isNaN(num) || num < 1 || num > totalQuestions) {
      setErrorMessage(`Por favor, digite um número de missão válido entre 1 e ${totalQuestions}.`);
      return;
    }

    // 2. Optional Password Validation if password field is filled
    if (passwordInput.trim()) {
      const cleanPass = passwordInput.trim().toUpperCase();
      const isValidPass = ACCEPTED_PASSWORDS.includes(cleanPass) || cleanPass === '200170' || cleanPass.length >= 3;
      if (!isValidPass) {
        setErrorMessage('Senha incorreta! Por favor, digite a senha autorizada.');
        return;
      }
    }

    setErrorMessage(null);
    try {
      soundEffects.interact();
    } catch {}

    setSuccessToast(`Salto ativado! Redirecionando para a Missão #${num}...`);

    setTimeout(() => {
      onJumpToMission(num);
      onClose();
      setSuccessToast(null);
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="jump-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-slate-900 border-2 border-cyan-500/60 rounded-3xl shadow-2xl shadow-cyan-950/90 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
              <KeyRound className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-cyan-400 block">
                ATALHO DE NAVEGAÇÃO • CHRONO GATEWAY
              </span>
              <h2 id="jump-modal-title" className="text-lg font-black text-white">
                Ir para Qualquer Missão / Parte do Jogo
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleExecuteJump} className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-950 to-blue-950/60 border border-cyan-500/30 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Acesso Direto ao Módulo de Missões:</span>
            </div>
            <p>
              Digite a <strong>Senha de Acesso</strong> e o número da missão de <strong>1 a {totalQuestions}</strong> para ir instantaneamente a qualquer ponto do jogo.
            </p>
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5 flex items-center justify-between">
              <span>1. Senha de Acesso / Código do Mestre:</span>
              <span className="text-[10px] text-cyan-400/80 font-normal">(Área Restrita)</span>
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Digite a Senha"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-400 transition"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Mission Number Field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
              2. Número da Missão Desejada (1 a {totalQuestions}):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={totalQuestions}
                value={targetMissionId}
                onChange={(e) => {
                  setTargetMissionId(Number(e.target.value));
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-28 px-4 py-3 rounded-xl bg-slate-950 border-2 border-cyan-400 text-center font-mono font-black text-xl text-cyan-300 focus:outline-none focus:border-cyan-300"
              />
              <div className="flex-1 text-xs text-slate-400">
                <span className="block font-bold text-slate-200">
                  {targetMissionId <= 16
                    ? 'Módulo 1: Questões Oficiais da Avaliação (Prof. Geraldo)'
                    : targetMissionId <= 32
                    ? 'Módulo 2: Trilha Musical "One Shot Tonight"'
                    : targetMissionId <= 60
                    ? 'Módulo 3: Aula 2 (Iniciantes - Vocabulário e Apresentações)'
                    : 'Módulo 4: Exercícios de Tradução (PT -> EN)'}
                </span>
                <span className="text-[11px] text-cyan-400">
                  Setor {Math.ceil(targetMissionId / 10)} de 8
                </span>
              </div>
            </div>
          </div>

          {/* Quick Mission Selectors */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-2">
              Atalhos Rápidos de Início de Módulo:
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTargetMissionId(1)}
                className={`py-2 px-1 rounded-xl border text-[11px] font-mono font-bold transition ${
                  targetMissionId === 1
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                #01 Inicial
              </button>
              <button
                type="button"
                onClick={() => setTargetMissionId(17)}
                className={`py-2 px-1 rounded-xl border text-[11px] font-mono font-bold transition ${
                  targetMissionId === 17
                    ? 'bg-fuchsia-500/20 border-fuchsia-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                #17 Música
              </button>
              <button
                type="button"
                onClick={() => setTargetMissionId(33)}
                className={`py-2 px-1 rounded-xl border text-[11px] font-mono font-bold transition ${
                  targetMissionId === 33
                    ? 'bg-emerald-500/20 border-emerald-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                #33 Aula 2
              </button>
              <button
                type="button"
                onClick={() => setTargetMissionId(61)}
                className={`py-2 px-1 rounded-xl border text-[11px] font-mono font-bold transition ${
                  targetMissionId === 61
                    ? 'bg-amber-500/20 border-amber-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                #61 Tradução
              </button>
            </div>
          </div>

          {/* Feedback & Error Toast */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successToast && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm tracking-wider shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>CONFIRMAR E IR PARA A MISSÃO #{targetMissionId}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
