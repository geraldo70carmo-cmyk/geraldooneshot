import React, { useState, useRef } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Flame,
  Check,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import {
  VOCABULARY_LIST,
  INFINITIVE_VERBS,
  KNOW_VS_MEET_EXPLANATION,
  VIDEO_CHALLENGE_AULA2,
  VIDEO_AULA2_METADATA,
  AULA2_FIXATION_EXERCISES,
} from '../data/studyContent';
import { speakEnglish } from '../utils/audioSystem';
import { Play, Film } from 'lucide-react';

interface GrammarStudyHubProps {
  onBack: () => void;
  onStartGame?: () => void;
  onLeaveGame?: () => void;
  onRestartGame?: () => void;
}

export const GrammarStudyHub: React.FC<GrammarStudyHubProps> = ({
  onBack,
  onStartGame,
  onLeaveGame,
  onRestartGame,
}) => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab' | 'infinitive' | 'know_meet' | 'video_challenge' | 'video_player' | 'fixation'>('grammar');
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
  const [revealedVideoAnswers, setRevealedVideoAnswers] = useState<Record<number, boolean>>({});
  const [revealedFixation, setRevealedFixation] = useState<Record<number, boolean>>({});
  const [videoStartTime, setVideoStartTime] = useState<number>(0);

  const handleSpeak = (text: string, id: string) => {
    setActiveSpeech(id);
    speakEnglish(text);
    setTimeout(() => setActiveSpeech(null), 1200);
  };

  const toggleRevealVideoAnswer = (id: number) => {
    setRevealedVideoAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRevealFixation = (idx: number) => {
    setRevealedFixation((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSeekVideo = (seconds: number) => {
    setVideoStartTime(seconds);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(16,185,129,0.12),transparent_40%)] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-cyan-500/20 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-sm font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-blue-400">
                  APOSTILA & GUIA DIDÁTICO
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Nível 1 • Aula 2
                </span>
              </div>
              <p className="text-xs text-slate-400">Simple Present Tense • DO / DOES • Vocabulário Base • Pronúncia</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRestartGame && (
              <button
                onClick={onRestartGame}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition"
                title="Reiniciar Jogo"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reiniciar Jogo</span>
              </button>
            )}

            {onLeaveGame && (
              <button
                onClick={onLeaveGame}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-bold transition"
                title="Sair do Jogo"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair do Jogo</span>
              </button>
            )}

            {onStartGame && (
              <button
                onClick={onStartGame}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
              >
                <span>Entrar em Chrono City</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="border-b border-slate-800 bg-slate-900/60 sticky top-[61px] z-30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-2.5 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'grammar'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Regra de Ouro: DO & DOES</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'vocab'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>(1) 10 Palavras Base & IPA</span>
          </button>

          <button
            onClick={() => setActiveTab('infinitive')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'infinitive'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Regra do "TO" no Infinitivo</span>
          </button>

          <button
            onClick={() => setActiveTab('know_meet')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'know_meet'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>KNOW vs MEET</span>
          </button>

          <button
            onClick={() => setActiveTab('video_player')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'video_player'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Film className="w-4 h-4 text-rose-400" />
            <span>Vídeo da Aula 2</span>
          </button>

          <button
            onClick={() => setActiveTab('fixation')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'fixation'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Exercício de Fixação</span>
          </button>

          <button
            onClick={() => setActiveTab('video_challenge')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'video_challenge'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Desafio do Vídeo (9 Cenas)</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 relative z-10">
        {/* TAB 1: GRAMMAR RULES DO / DOES */}
        {activeTab === 'grammar' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 shadow-xl">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Conteúdo Didático Oficial
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                SIMPLE PRESENT TENSE — QUESTIONS
              </h2>
              <p className="text-slate-300 mt-2 leading-relaxed">
                Para transformar frases afirmativas em perguntas no <strong className="text-cyan-300">Simple Present</strong>, utilizamos o auxiliar <strong className="text-emerald-400">DO</strong> ou <strong className="text-amber-400">DOES</strong> antes do sujeito.
              </p>
              <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30">
                <p className="text-sm sm:text-base font-semibold text-cyan-200">
                  <span className="text-amber-400 font-bold">ATENÇÃO:</span> Depois de <strong className="text-amber-300">DOES</strong>, o verbo principal SEMPRE volta para a sua <strong className="text-emerald-300">forma básica</strong> (sem "-s", "-es" ou "-ies").
                </p>
              </div>
            </div>

            {/* Comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DO Card */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400">
                    DO
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-emerald-300">Quando usar DO?</h3>
                    <p className="text-xs text-slate-400">I, YOU, WE, THEY</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm">
                  {[
                    { en: 'Do I study?', pt: 'Eu estudo?' },
                    { en: 'Do you study?', pt: 'Você estuda?' },
                    { en: 'Do we study?', pt: 'Nós estudamos?' },
                    { en: 'Do they study?', pt: 'Eles/Elas estudam?' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div>
                        <span className="font-bold text-white">{item.en}</span>
                        <p className="text-xs text-slate-400">{item.pt}</p>
                      </div>
                      <button
                        onClick={() => handleSpeak(item.en, `do-${idx}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300"
                        aria-label={`Ouvir ${item.en}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* DOES Card */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400">
                    DOES
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-amber-300">Quando usar DOES?</h3>
                    <p className="text-xs text-slate-400">HE, SHE, IT &amp; Sujeito Singular</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm">
                  {[
                    { en: 'Does he study?', pt: 'Ele estuda?' },
                    { en: 'Does she study?', pt: 'Ela estuda?' },
                    { en: 'Does it study?', pt: 'Ele/Ela estuda? (objeto/animal)' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div>
                        <span className="font-bold text-white">{item.en}</span>
                        <p className="text-xs text-slate-400">{item.pt}</p>
                      </div>
                      <button
                        onClick={() => handleSpeak(item.en, `does-${idx}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300"
                        aria-label={`Ouvir ${item.en}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Crucial transformation examples */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-lg">
              <h3 className="text-lg font-bold text-cyan-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                Exemplos Práticos de Transformação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-slate-400 text-xs uppercase font-mono">Exemplo 1 (She):</p>
                  <p className="text-slate-200 mt-1">Afirmativa: <span className="font-mono text-cyan-300">She lives here.</span></p>
                  <p className="text-emerald-300 font-bold mt-1">Pergunta: <span className="font-mono text-emerald-400">Does she live here?</span></p>
                  <p className="text-[11px] text-amber-300/90 mt-1">"lives" perdeu o "-s" e virou "live".</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-slate-400 text-xs uppercase font-mono">Exemplo 2 (He):</p>
                  <p className="text-slate-200 mt-1">Afirmativa: <span className="font-mono text-cyan-300">He goes to school.</span></p>
                  <p className="text-emerald-300 font-bold mt-1">Pergunta: <span className="font-mono text-emerald-400">Does he go to school?</span></p>
                  <p className="text-[11px] text-amber-300/90 mt-1">"goes" perdeu o "-es" e virou "go".</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-slate-400 text-xs uppercase font-mono">Exemplo 3 (Sujeito Singular):</p>
                  <p className="text-slate-200 mt-1">Afirmativa: <span className="font-mono text-cyan-300">That company buys merchandise.</span></p>
                  <p className="text-emerald-300 font-bold mt-1">Pergunta: <span className="font-mono text-emerald-400">Does that company buy merchandise?</span></p>
                  <p className="text-[11px] text-amber-300/90 mt-1">"That company" (it) usa DOES e "buy".</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 10 PALAVRAS BASE & IPA */}
        {activeTab === 'vocab' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                (1) Palavras e Pronúncias Base (Nível 1 - Aula 2)
              </h2>
              <p className="text-xs text-slate-400 mt-1">Clique no alto-falante para escutar a pronúncia natural em inglês.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VOCABULARY_LIST.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-xs font-bold">
                          {item.id}
                        </span>
                        <h3 className="text-lg font-bold text-white">{item.word}</h3>
                        {item.ipa && (
                          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {item.ipa}
                          </span>
                        )}
                      </div>
                      <p className="text-cyan-300 text-sm font-semibold mt-1">
                        Tradução: {item.translation}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSpeak(item.word, `vocab-${item.id}`)}
                      className={`p-2 rounded-xl border transition ${
                        activeSpeech === `vocab-${item.id}`
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 hover:text-cyan-300 border-slate-700'
                      }`}
                      aria-label={`Ouvir ${item.word}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pronunciation guide */}
                  <div className="mt-2.5 p-2 rounded-lg bg-amber-950/30 border border-amber-600/30 text-xs">
                    <span className="text-amber-400 font-bold">Pronúncia: </span>
                    <span className="text-amber-200">{item.phoneticPt}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.note}
                  </p>

                  {/* Examples */}
                  <div className="mt-3 space-y-1.5 border-t border-slate-800/80 pt-2 text-xs">
                    {item.examples.map((ex, exIdx) => (
                      <div key={exIdx} className="flex items-center justify-between gap-2 py-0.5">
                        <div>
                          <span className="text-white font-medium">{ex.en}</span>
                          <span className="text-slate-400 text-[11px] block">{ex.pt}</span>
                        </div>
                        <button
                          onClick={() => handleSpeak(ex.en, `vocab-ex-${item.id}-${exIdx}`)}
                          className="text-slate-500 hover:text-cyan-300 p-1"
                          aria-label={`Ouvir ${ex.en}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REGRA DO "TO" NO INFINITIVO */}
        {activeTab === 'infinitive' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 shadow-xl">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Regra de Ouro da Aula 2
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                O "TO" antes do Verbo = Infinitivo
              </h2>
              <p className="text-slate-300 mt-2 leading-relaxed text-sm sm:text-base">
                Colocar a partícula <strong className="text-amber-400">TO</strong> antes do verbo o transforma na forma de infinitivo (verbos terminados em <em>-AR, -ER, -IR</em> em português).
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-200">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Exemplo: <strong>Meet</strong> = Conheça, Encontre (imperativo/base) → <strong>To meet</strong> = Conhecer, Encontrar (infinitivo).</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {INFINITIVE_VERBS.map((verb, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{verb.infinitive}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1 py-0.5 rounded">
                        ({verb.verb})
                      </span>
                    </div>
                    <p className="text-xs text-amber-300/90 mt-0.5">{verb.translation}</p>
                  </div>

                  <button
                    onClick={() => handleSpeak(verb.infinitive, `inf-${idx}`)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300"
                    aria-label={`Ouvir ${verb.infinitive}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KNOW VS MEET */}
        {activeTab === 'know_meet' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/40 shadow-xl">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                (3) A Diferença Essencial
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                A Diferença entre "KNOW" e "MEET"
              </h2>
              <p className="text-slate-300 mt-2 text-sm sm:text-base">
                Em português, usamos a palavra "conhecer" para as duas situações, mas em inglês há uma distinção fundamental:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KNOW */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-black text-cyan-300 text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-cyan-300">KNOW</h3>
                    <p className="text-xs text-slate-400">Sentido de já ter familiaridade</p>
                  </div>
                </div>

                <p className="text-sm text-slate-200">
                  {KNOW_VS_MEET_EXPLANATION.know.rule}
                </p>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{KNOW_VS_MEET_EXPLANATION.know.exampleEn}</span>
                    <button
                      onClick={() => handleSpeak(KNOW_VS_MEET_EXPLANATION.know.exampleEn, 'know-ex')}
                      className="text-slate-400 hover:text-cyan-300 p-1"
                      aria-label="Ouvir exemplo"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">{KNOW_VS_MEET_EXPLANATION.know.examplePt}</p>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 italic">
                  "{KNOW_VS_MEET_EXPLANATION.know.quote}" — {KNOW_VS_MEET_EXPLANATION.know.quotePt}
                </div>
              </div>

              {/* MEET */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-fuchsia-500/30 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center font-black text-fuchsia-300 text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-fuchsia-300">MEET</h3>
                    <p className="text-xs text-slate-400">Conhecer pela 1ª vez / Encontrar</p>
                  </div>
                </div>

                <p className="text-sm text-slate-200">
                  {KNOW_VS_MEET_EXPLANATION.meet.rule}
                </p>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{KNOW_VS_MEET_EXPLANATION.meet.exampleEn}</span>
                    <button
                      onClick={() => handleSpeak(KNOW_VS_MEET_EXPLANATION.meet.exampleEn, 'meet-ex')}
                      className="text-slate-400 hover:text-fuchsia-300 p-1"
                      aria-label="Ouvir exemplo"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">{KNOW_VS_MEET_EXPLANATION.meet.examplePt}</p>
                </div>

                <div className="p-3 rounded-lg bg-fuchsia-950/30 border border-fuchsia-500/20 text-xs text-fuchsia-200 italic">
                  "{KNOW_VS_MEET_EXPLANATION.meet.quote}" — {KNOW_VS_MEET_EXPLANATION.meet.quotePt}
                </div>
              </div>
            </div>

            {/* This is... */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 shadow-md">
              <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-1">
                Apresentando Pessoas: This is...
              </h4>
              <p className="text-sm text-slate-300">
                {KNOW_VS_MEET_EXPLANATION.thisIs.rule}
              </p>
              <div className="mt-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">{KNOW_VS_MEET_EXPLANATION.thisIs.exampleEn}</span>
                  <p className="text-xs text-slate-400">{KNOW_VS_MEET_EXPLANATION.thisIs.examplePt}</p>
                </div>
                <button
                  onClick={() => handleSpeak(KNOW_VS_MEET_EXPLANATION.thisIs.exampleEn, 'this-is-ex')}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-indigo-300"
                  aria-label="Ouvir"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: VÍDEO COMPLETO DA AULA 2 */}
        {activeTab === 'video_player' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border border-rose-500/30 shadow-xl space-y-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Vídeo Oficial da Aula 2 (ABC Fluent)
              </span>
              <h2 className="text-2xl font-black text-white">{VIDEO_AULA2_METADATA.title}</h2>
              <p className="text-slate-300 text-sm">{VIDEO_AULA2_METADATA.description}</p>
            </div>

            {/* YouTube HD Player */}
            <div className="rounded-2xl overflow-hidden bg-black border-2 border-cyan-500/40 shadow-2xl aspect-video">
              <iframe
                key={videoStartTime}
                className="w-full h-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_AULA2_METADATA.youtubeVideoId}?start=${videoStartTime}&autoplay=${videoStartTime > 0 ? 1 : 0}&rel=0`}
                title={VIDEO_AULA2_METADATA.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Interactive Video Chapters */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                <Play className="w-4 h-4 fill-current text-cyan-400" />
                Índice Interativo do Vídeo (Clique para ir ao minuto exato):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {VIDEO_AULA2_METADATA.chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeekVideo(chap.seconds)}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 text-left transition flex items-center gap-2.5 group"
                  >
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 group-hover:bg-cyan-400 group-hover:text-slate-950 transition">
                      {chap.time}
                    </span>
                    <span className="text-xs text-slate-200 group-hover:text-white font-medium truncate">
                      {chap.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: EXERCÍCIO DE FIXAÇÃO - PREENCHA AS LACUNAS */}
        {activeTab === 'fixation' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 shadow-xl">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Apostila - Exercício Prático
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                Exercício de Fixação — Preencha as Lacunas
              </h2>
              <p className="text-slate-300 mt-2 text-sm">
                Tente lembrar e traduzir mentalmente a frase em inglês antes de clicar para conferir a resposta no gabarito oficial da Aula 2.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AULA2_FIXATION_EXERCISES.map((item, idx) => {
                const isRevealed = revealedFixation[idx];

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                        Item #{idx + 1}
                      </span>
                      <div className="text-sm font-bold text-white">{item.pt}</div>
                      {isRevealed ? (
                        <div className="text-sm font-mono font-bold text-emerald-300 mt-1 pt-1 border-t border-slate-800">
                          {item.en}
                        </div>
                      ) : (
                        <div className="text-xs font-mono text-slate-500 italic mt-1">
                          ________________________________________
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => handleSpeak(item.en.split('/')[0], `fix-${idx}`)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                        title="Ouvir em inglês"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Ouvir</span>
                      </button>

                      <button
                        onClick={() => toggleRevealFixation(idx)}
                        className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
                      >
                        {isRevealed ? 'Ocultar Gabarito' : 'Ver Gabarito'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: DESAFIO DO VÍDEO (9 CENAS) */}
        {activeTab === 'video_challenge' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 shadow-xl">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Treino de Escuta e Compreensão
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                Desafio do Vídeo: O que eles estão dizendo?
              </h2>
              <p className="text-slate-300 mt-2 text-sm">
                Ouça o áudio falado em inglês e teste se você consegue decifrar o que foi dito antes de revelar a resposta!
              </p>
            </div>

            <div className="space-y-3">
              {VIDEO_CHALLENGE_AULA2.map((challenge) => {
                const isRevealed = revealedVideoAnswers[challenge.id];

                return (
                  <div
                    key={challenge.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 font-mono text-xs font-bold border border-slate-700 shrink-0">
                        ({challenge.timestamp})
                      </span>
                      <div>
                        {isRevealed ? (
                          <div>
                            <div className="text-base font-bold text-emerald-300">{challenge.en}</div>
                            <div className="text-xs text-slate-400">{challenge.pt}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-slate-400 font-mono tracking-wider">
                            ___________________________________ ?
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => handleSpeak(challenge.en, `vid-${challenge.id}`)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700"
                        title="Ouvir frase falada em inglês"
                        aria-label={`Ouvir desafio ${challenge.id}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleRevealVideoAnswer(challenge.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
                      >
                        {isRevealed ? 'Ocultar Resposta' : 'Revelar Resposta'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
