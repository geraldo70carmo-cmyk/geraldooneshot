import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  BookOpen,
  GraduationCap,
  Music,
  Compass,
  Settings,
  ShieldCheck,
  User,
  School,
  Volume2,
  ChevronRight,
  Info,
  RotateCcw,
  LogOut,
  KeyRound,
  Zap,
} from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { ActiveGameSession } from '../services/storage';
import { formatDuration } from '../game/grammarRules';

interface MainMenuProps {
  onStartGame: (params: {
    studentName: string;
    studentClass: string;
    schoolName: string;
    mode: 'avaliacao' | 'treino';
  }) => void;
  onOpenTeacherDashboard: () => void;
  onOpenStudyGuide: () => void;
  onOpenMusicLounge: () => void;
  graphicsQuality: 'high' | 'low';
  onToggleGraphics: () => void;
  onRestartGame?: () => void;
  savedSession?: ActiveGameSession | null;
  onResumeSavedGame?: () => void;
  onJumpToMission?: (missionId: number) => void;
  initialStudentInfo?: {
    studentName: string;
    studentClass: string;
    schoolName: string;
    mode: 'avaliacao' | 'treino';
  };
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenTeacherDashboard,
  onOpenStudyGuide,
  onOpenMusicLounge,
  graphicsQuality,
  onToggleGraphics,
  onRestartGame,
  savedSession,
  onResumeSavedGame,
  onJumpToMission,
  initialStudentInfo,
}) => {
  const [studentName, setStudentName] = useState<string>(
    initialStudentInfo?.studentName &&
      initialStudentInfo.studentName !== 'Estudante Visitante' &&
      initialStudentInfo.studentName !== 'Estudante'
      ? initialStudentInfo.studentName
      : ''
  );
  const [studentClass, setStudentClass] = useState<string>(
    initialStudentInfo?.studentClass &&
      initialStudentInfo.studentClass !== 'Treino Livre' &&
      initialStudentInfo.studentClass !== 'Turma Geral' &&
      initialStudentInfo.studentClass !== 'Geral'
      ? initialStudentInfo.studentClass
      : ''
  );
  const [schoolName, setSchoolName] = useState<string>(initialStudentInfo?.schoolName || '');
  const [selectedMode, setSelectedMode] = useState<'avaliacao' | 'treino'>(
    initialStudentInfo?.mode || 'avaliacao'
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Dedicated Password & Mission Jump State in Menu
  const [menuPass, setMenuPass] = useState<string>('');
  const [menuMissionNum, setMenuMissionNum] = useState<string>('1');

  const handleLaunch = () => {
    if (selectedMode === 'avaliacao') {
      if (!studentName.trim()) {
        setValidationError('Por favor, informe seu Nome Completo para a Avaliação Oficial.');
        return;
      }
      if (!studentClass.trim()) {
        setValidationError('Por favor, informe sua Turma (ex: 8º Ano A, 9º B, etc.).');
        return;
      }
    }

    setValidationError(null);
    onStartGame({
      studentName: studentName.trim() || 'Estudante Visitante',
      studentClass: studentClass.trim() || 'Treino Livre',
      schoolName: schoolName.trim(),
      mode: selectedMode,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Background Cyber City Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(6,182,212,0.18),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.18),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 shadow-md shadow-cyan-500/50">
            CQ
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold block">
              CHRONO QUEST
            </span>
            <span className="text-[11px] text-slate-400">English Mission • Prof. Geraldo</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenStudyGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Apostila &amp; Guia</span>
          </button>

          <button
            onClick={onOpenMusicLounge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-fuchsia-300 border border-slate-700 text-xs font-bold transition"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Music Lounge</span>
          </button>

          <button
            onClick={onOpenTeacherDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-slate-700 text-xs font-bold transition"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Painel do Professor</span>
          </button>

          {onRestartGame && (
            <button
              onClick={onRestartGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition"
              title="Reiniciar Jogo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar Jogo</span>
            </button>
          )}

          <button
            onClick={onToggleGraphics}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title={`Qualidade Gráfica: ${graphicsQuality === 'high' ? 'Alta' : 'Leve'}`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Hero & Form */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col items-center justify-center relative z-10 space-y-8">
        {/* Title Spotlight */}
        <div className="text-center space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Jogo Educacional 3D • Simple Present</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-500 tracking-tight">
            CHRONO QUEST
          </h1>

          <div className="text-xl sm:text-3xl font-black text-fuchsia-400 uppercase tracking-widest">
            ONE SHOT TONIGHT
          </div>

          <p className="text-sm sm:text-base text-slate-300 font-mono tracking-wide">
            ENGLISH MISSION — SIMPLE PRESENT QUESTIONS (DO / DOES)
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto pt-1">
            Explore os 8 setores tridimensionais de Chrono City. Restaure o fluxo de energia gramatical da metrópole transformando frases afirmativas em perguntas em inglês.
          </p>
        </div>

        {/* Launch Setup Card */}
        <div className="w-full max-w-xl bg-slate-900/90 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl space-y-6">
          {/* Saved Session Resume Card (Anti-loss device) */}
          {savedSession && savedSession.hasActiveGame && onResumeSavedGame && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/95 via-slate-900 to-blue-950/95 border-2 border-cyan-400 shadow-xl shadow-cyan-950/80 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Partida Salva em Andamento</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  CONTINUAÇÃO GARANTIDA
                </span>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed font-mono">
                Estudante: <strong>{savedSession.studentInfo.studentName || 'Estudante'}</strong> ({savedSession.studentInfo.studentClass})
                <br />
                Posição atual: <strong className="text-cyan-300">Missão #{savedSession.currentQuestionId}/80</strong> ({Object.keys(savedSession.answersMap).length}/80 respondidas)
                <div className="flex flex-wrap items-center gap-3 mt-2 pt-2 border-t border-cyan-800/40">
                  <span className="flex items-center gap-1 text-amber-300 font-black">
                    ⏱ Relógio: {formatDuration(savedSession.elapsedSeconds)}
                  </span>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1 text-emerald-300 font-black">
                    🎯 Percentual: {Object.keys(savedSession.answersMap).length > 0 ? Math.round((Object.values(savedSession.answersMap).filter((a) => a.isCorrect).length / Object.keys(savedSession.answersMap).length) * 100) : 100}% Acerto
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onResumeSavedGame}
                  className="w-full sm:flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition transform active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>CONTINUAR MISSÃO #{savedSession.currentQuestionId}</span>
                </button>

                {onRestartGame && (
                  <button
                    type="button"
                    onClick={onRestartGame}
                    className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/70 text-rose-300 hover:text-white font-black text-xs transition flex items-center justify-center gap-1.5"
                    title="Descartar esta partida e zerar cronômetro (00:00) e percentual (0%)"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Zerar Tudo</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              1. Selecione o Modo de Jogo:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode('avaliacao')}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  selectedMode === 'avaliacao'
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Modo Avaliação
                  </span>
                  {selectedMode === 'avaliacao' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300">
                  Prova oficial: 80 questões em sequência, 1 tentativa por item, sem dicas imediatas, gera nota oficial de 0 a 10.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('treino')}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  selectedMode === 'treino'
                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    Modo Treino
                  </span>
                  {selectedMode === 'treino' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300">
                  Estudo prévio: permite refazer, oferece dicas de 3 níveis, não altera a nota oficial.
                </p>
              </button>
            </div>
          </div>



          {/* Student Credentials Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nome Completo do Estudante {selectedMode === 'avaliacao' && <span className="text-cyan-400">*</span>}</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Carlos Eduardo de Oliveira"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Turma {selectedMode === 'avaliacao' && <span className="text-cyan-400">*</span>}</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: 8º Ano B"
                  value={studentClass}
                  onChange={(e) => {
                    setStudentClass(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  <span>Escola (Opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: E.E. Santos Dumont"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {validationError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Launch Button */}
          <button
            onClick={handleLaunch}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-base sm:text-lg tracking-wider shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>INICIAR MISSÃO CHRONO QUEST</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dedicated Password & Direct Mission Jump Card in Main Menu */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-300">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Atalho de Senha • Ir para Qualquer Missão (1-80)</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                ÁREA RESTRITA
              </span>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <input
                type="password"
                placeholder="Digite a Senha"
                value={menuPass}
                onChange={(e) => {
                  setMenuPass(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full sm:w-36 px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/50 text-xs font-mono text-amber-200 placeholder-amber-700/60 focus:outline-none focus:border-amber-400"
              />

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-slate-400 font-mono">Missão:</span>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={menuMissionNum}
                  onChange={(e) => setMenuMissionNum(e.target.value)}
                  className="w-16 px-2 py-2 rounded-xl bg-slate-950 border border-amber-500/50 text-xs font-mono text-center text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const validPasses = ['200170', '1234', 'GERALDO', 'CHRONO', 'PROFE', 'SECRETO', 'MESTRE'];
                  if (menuPass.trim() && !validPasses.includes(menuPass.trim().toUpperCase())) {
                    setValidationError('Senha de acesso incorreta! Por favor, digite a senha autorizada.');
                    return;
                  }
                  const num = parseInt(menuMissionNum, 10);
                  if (isNaN(num) || num < 1 || num > 80) {
                    setValidationError('Por favor, informe um número de missão válido de 1 a 80.');
                    return;
                  }
                  if (onJumpToMission) {
                    onJumpToMission(num);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition transform active:scale-95 shadow-md shadow-amber-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>IR PARA #{menuMissionNum} AGORA</span>
              </button>
            </div>
          </div>

          {/* Controls Quick Reference in Menu */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block font-mono uppercase">
              Controles do Jogo:
            </span>
            <p>
              • <strong>W, A, S, D</strong> para caminhar • <strong>Mouse</strong> para olhar ao redor • <strong>[ E ]</strong> para interagir com o terminal de missão • <strong>ESC</strong> para liberar cursor.
            </p>
          </div>
        </div>

        {/* Soundtrack Player at Bottom */}
        <div className="w-full max-w-md">
          <AudioPlayer initialMuted={selectedMode === 'avaliacao'} compact />
        </div>
      </main>
    </div>
  );
};
