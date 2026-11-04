import React, { useState } from 'react';
import { Volume2, ArrowLeft, Disc3, Sparkles, LogOut, RotateCcw } from 'lucide-react';
import { SONG_SECTIONS, SONG_TITLE, SONG_TRANSLATION } from '../data/lyrics';
import { SONG_QUESTIONS, evaluateAnswer } from '../game/grammarRules';
import { soundEffects, speakEnglish } from '../utils/audioSystem';
import { AudioPlayer } from './AudioPlayer';
import confetti from 'canvas-confetti';

interface MusicLoungeProps {
  onBack: () => void;
  onLeaveGame?: () => void;
  onRestartGame?: () => void;
}

export const MusicLounge: React.FC<MusicLoungeProps> = ({
  onBack,
  onLeaveGame,
  onRestartGame,
}) => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'quiz' | 'verse1' | 'pre-chorus' | 'chorus' | 'verse2' | 'bridge'
  >('all');
  const [speakingIndex, setSpeakingIndex] = useState<string | null>(null);
  const [quizSelections, setQuizSelections] = useState<Record<number, string>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});

  const handleSpeakLine = (enText: string, key: string) => {
    setSpeakingIndex(key);
    speakEnglish(enText);
    setTimeout(() => {
      setSpeakingIndex(null);
    }, 1500);
  };

  const fullSongSequence = [
    { title: 'Verso 1', section: SONG_SECTIONS[0], key: 'v1' },
    { title: 'Pré-Refrão', section: SONG_SECTIONS[1], key: 'pc1' },
    { title: 'Refrão', section: SONG_SECTIONS[2], key: 'c1' },
    { title: 'Verso 2', section: SONG_SECTIONS[3], key: 'v2' },
    { title: 'Pré-Refrão (Repetição)', section: SONG_SECTIONS[1], key: 'pc2' },
    { title: 'Refrão (Repetição)', section: SONG_SECTIONS[2], key: 'c2' },
    { title: 'Ponte', section: SONG_SECTIONS[4], key: 'b' },
    { title: 'Refrão Final', section: SONG_SECTIONS[2], key: 'c_final' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Background neon ambient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-sm font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Jogo</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400">
                  MUSIC LOUNGE: {SONG_TITLE}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                  Estúdio Sci-Fi
                </span>
              </div>
              <p className="text-xs text-slate-400">{SONG_TRANSLATION} • Estudo de Letra e Pronúncia Fonética</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-auto">
              <AudioPlayer />
            </div>

            <div className="flex items-center gap-2">
              {onRestartGame && (
                <button
                  onClick={onRestartGame}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition"
                  title="Reiniciar Jogo"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden md:inline">Reiniciar</span>
                </button>
              )}

              {onLeaveGame && (
                <button
                  onClick={onLeaveGame}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-bold transition"
                  title="Sair do Jogo"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sair</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 sm:px-6 relative z-10">
        {/* Intro banner */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase mb-1">
                <Disc3 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Trilha Oficial Chrono City</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Treine Pronúncia & Vocabulário com Música</h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Pratique ouvindo a faixa, lendo a tradução em português e acompanhando a aproximação de pronúncia fonética brasileira. Clique no ícone de som ao lado de qualquer frase para escutar a pronúncia isolada!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Área de Estudo Opcional
              </span>
            </div>
          </div>

          {/* Quick filter tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Música Completa (Ordem Musical)
            </button>
            <button
              onClick={() => setActiveTab('verse1')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'verse1'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Verso 1
            </button>
            <button
              onClick={() => setActiveTab('pre-chorus')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'pre-chorus'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Pré-Refrão
            </button>
            <button
              onClick={() => setActiveTab('chorus')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'chorus'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Refrão
            </button>
            <button
              onClick={() => setActiveTab('verse2')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'verse2'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Verso 2
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-fuchsia-500 text-slate-950 font-black shadow-md shadow-fuchsia-500/30'
                  : 'bg-slate-800/80 text-fuchsia-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quiz da Música (16 Novas Questões)</span>
            </button>
            <button
              onClick={() => setActiveTab('bridge')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'bridge'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Ponte
            </button>
          </div>
        </div>

        {/* QUIZ DA MÚSICA VIEW */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-fuchsia-950/40 via-purple-950/30 to-slate-900 border border-fuchsia-500/40 shadow-xl">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                16 Novas Missões Baseadas na Música
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                Transforme os Versos de "One Shot Tonight" em Perguntas!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Pratique aplicando a regra de ouro do Simple Present (<strong>DO</strong> ou <strong>DOES</strong>) diretamente nas frases da trilha sonora.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SONG_QUESTIONS.map((q) => {
                const selectedOptId = quizSelections[q.id];
                const result = quizResults[q.id];
                const isChecked = result !== undefined;

                const handleCheck = () => {
                  if (!selectedOptId) return;
                  const res = evaluateAnswer(q, selectedOptId);
                  setQuizResults((prev) => ({ ...prev, [q.id]: res.isCorrect }));
                  if (res.isCorrect) {
                    soundEffects.correct();
                    try {
                      confetti({
                        particleCount: 60,
                        spread: 60,
                        origin: { y: 0.6 },
                        colors: ['#f43f5e', '#ec4899', '#a855f7', '#06b6d4', '#eab308'],
                      });
                    } catch {}
                  } else {
                    soundEffects.incorrect();
                  }
                };

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-fuchsia-500/40 shadow-md transition space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-fuchsia-400 bg-fuchsia-950/50 px-2 py-0.5 rounded border border-fuchsia-500/30">
                          Missão da Música #{q.id} • {q.sectorName}
                        </span>
                        <h4 className="text-base font-bold text-white mt-1.5">{q.affirmative}</h4>
                        <p className="text-xs text-slate-400">{q.translation}</p>
                      </div>

                      <button
                        onClick={() => speakEnglish(q.affirmative)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-fuchsia-300 border border-slate-700 transition shrink-0"
                        title="Ouvir frase em inglês"
                        aria-label={`Ouvir ${q.affirmative}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Escolha a alternativa correta (A, B, C, D, E):
                      </label>
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isSelected = selectedOptId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              disabled={isChecked}
                              onClick={() => setQuizSelections((prev) => ({ ...prev, [q.id]: opt.id }))}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl border font-mono text-xs sm:text-sm transition flex items-center gap-2.5 ${
                                isChecked
                                  ? isSelected
                                    ? opt.isCorrect
                                      ? 'border-emerald-500 bg-emerald-950/40 text-white'
                                      : 'border-rose-500 bg-rose-950/40 text-white'
                                    : opt.isCorrect
                                      ? 'border-emerald-500/70 bg-emerald-950/20 text-emerald-200'
                                      : 'border-slate-800 bg-slate-950/40 text-slate-400 opacity-60'
                                  : isSelected
                                    ? 'border-fuchsia-400 bg-fuchsia-950/60 text-white'
                                    : 'border-slate-800 bg-slate-950/80 hover:border-fuchsia-500/40 text-slate-200'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-[11px] shrink-0 ${
                                isSelected ? 'bg-fuchsia-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {opt.id}
                              </span>
                              <span className="flex-1 font-semibold">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      {!isChecked ? (
                        <button
                          onClick={handleCheck}
                          disabled={!selectedOptId}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600 text-slate-950 text-xs font-bold hover:from-fuchsia-400 hover:to-purple-500 disabled:opacity-40 transition"
                        >
                          Verificar Alternativa
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${result ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {result ? '🎉 Correto!' : '❌ Incorreto!'}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          const correctOpt = q.options.find((o) => o.isCorrect);
                          if (correctOpt) {
                            setQuizSelections((prev) => ({ ...prev, [q.id]: correctOpt.id }));
                            setQuizResults((prev) => ({ ...prev, [q.id]: true }));
                          }
                        }}
                        className="text-[11px] text-slate-400 hover:text-fuchsia-300 underline font-mono"
                      >
                        Ver Resposta
                      </button>
                    </div>

                    {isChecked && (
                      <div
                        className={`p-3 rounded-xl text-xs font-mono transition-all duration-200 ${
                          result
                            ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900 border-2 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-950/40 space-y-1'
                            : 'bg-gradient-to-r from-rose-950/70 to-slate-900 border-2 border-rose-500 text-rose-200 shadow-md shadow-rose-950/40 space-y-2'
                        }`}
                      >
                        {result ? (
                          <div>
                            <div className="font-bold text-yellow-300 flex items-center gap-1.5">
                              <span>🎉 PARABÉNS! VOCÊ ACERTOU! 🎉</span>
                            </div>
                            <div className="text-white mt-1">
                              Forma correta: <strong>{q.canonicalAnswer}</strong>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-rose-300 flex items-center gap-1.5">
                              <span>❌ RESPOSTA INCORRETA</span>
                            </div>
                            <div className="p-2 rounded bg-slate-950/90 border border-cyan-400 text-white font-bold mt-1 text-sm">
                              <span className="text-[10px] text-cyan-300 block font-normal uppercase">Forma Correta da Questão:</span>
                              {q.canonicalAnswer}
                            </div>
                            <div className="text-[11px] text-amber-300 pt-1">
                              Regra: {q.hints.level3}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })};
            </div>
          </div>
        )}

        {/* Lyrics Sections Display */}
        {activeTab !== 'quiz' && (
        <div className="space-y-6">
          {fullSongSequence
            .filter((item) => {
              if (activeTab === 'all') return true;
              if (activeTab === 'verse1') return item.key === 'v1';
              if (activeTab === 'pre-chorus') return item.key === 'pc1' || item.key === 'pc2';
              if (activeTab === 'chorus') return item.key === 'c1' || item.key === 'c2' || item.key === 'c_final';
              if (activeTab === 'verse2') return item.key === 'v2';
              if (activeTab === 'bridge') return item.key === 'b';
              return true;
            })
            .map((item) => (
              <div
                key={item.key}
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg backdrop-blur-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <h3 className="text-base font-bold text-cyan-300 uppercase tracking-wider">{item.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{item.section.lines.length} versos</span>
                </div>

                <div className="space-y-4">
                  {item.section.lines.map((line, idx) => {
                    const lineKey = `${item.key}-${idx}`;
                    const isSpeaking = speakingIndex === lineKey;

                    return (
                      <div
                        key={lineKey}
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/40 border border-slate-800/60 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          {/* 1. English line */}
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-200 transition">
                              {line.en}
                            </span>
                          </div>

                          {/* 2. Portuguese translation */}
                          <p className="text-sm text-cyan-400/90 font-medium">
                            {line.pt}
                          </p>

                          {/* 3. Phonetic Portuguese Guide */}
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-600/30">
                              Pronúncia
                            </span>
                            <span className="text-xs text-amber-200/90 font-mono">
                              [ {line.phonetic} ]
                            </span>
                          </div>
                        </div>

                        {/* Speech synthesis button */}
                        <button
                          onClick={() => handleSpeakLine(line.en, lineKey)}
                          className={`p-2.5 rounded-xl border transition shrink-0 ${
                            isSpeaking
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 scale-105'
                              : 'bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 border-slate-700'
                          }`}
                          title="Ouvir pronúncia em inglês (voz nativa)"
                          aria-label={`Ouvir frase em inglês: ${line.en}`}
                        >
                          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
        )}
      </main>
    </div>
  );
};
