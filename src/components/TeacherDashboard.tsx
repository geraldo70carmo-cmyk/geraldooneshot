import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Download,
  Users,
  BarChart3,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  TrendingDown,
  Upload,
  UserCheck,
  UserX,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import {
  AssessmentRecord,
  getAssessmentRecords,
  deleteAssessmentRecord,
  clearAllAssessments,
  exportToCSV,
  exportToJSON,
  computeQuestionStats,
  getRoster,
  saveRoster,
  parseRosterCSV,
  RosterStudent,
} from '../services/storage';
import { ReportModal } from './ReportModal';

interface TeacherDashboardProps {
  onBack: () => void;
  onLeaveGame?: () => void;
  onRestartGame?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onBack,
  onLeaveGame,
  onRestartGame,
}) => {
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<AssessmentRecord | null>(null);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);
  const [rosterInputText, setRosterInputText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'records' | 'analytics' | 'roster'>('records');

  useEffect(() => {
    setRecords(getAssessmentRecords());
    setRoster(getRoster());
  }, []);

  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.studentClass && set.add(r.studentClass));
    roster.forEach((st) => st.class && set.add(st.class));
    return Array.from(set).sort();
  }, [records, roster]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.studentClass.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === 'all' || r.studentClass === selectedClass;
      return matchSearch && matchClass;
    });
  }, [records, searchTerm, selectedClass]);

  const stats = useMemo(() => {
    if (filteredRecords.length === 0) return null;
    const total = filteredRecords.length;
    const avgScore =
      filteredRecords.reduce((sum, r) => sum + parseFloat(r.scoreOutOfTen), 0) / total;
    const avgPercent =
      filteredRecords.reduce((sum, r) => sum + r.percentage, 0) / total;
    const passCount = filteredRecords.filter((r) => r.percentage >= 60).length;
    const passRate = (passCount / total) * 100;

    return {
      totalAssessments: total,
      averageScore: avgScore.toFixed(1),
      averagePercentage: avgPercent.toFixed(1),
      passRate: passRate.toFixed(1),
      questionStats: computeQuestionStats(filteredRecords),
    };
  }, [filteredRecords]);

  // Roster completion status
  const rosterStatus = useMemo(() => {
    if (roster.length === 0) return null;
    const filteredRoster =
      selectedClass === 'all'
        ? roster
        : roster.filter((st) => st.class === selectedClass);

    const completedNames = new Set(
      records.map((r) => r.studentName.trim().toLowerCase())
    );

    const completed = filteredRoster.filter((st) =>
      completedNames.has(st.name.trim().toLowerCase())
    );
    const pending = filteredRoster.filter(
      (st) => !completedNames.has(st.name.trim().toLowerCase())
    );

    return {
      total: filteredRoster.length,
      completed,
      pending,
      completionRate: filteredRoster.length > 0 ? (completed.length / filteredRoster.length) * 100 : 0,
    };
  }, [roster, records, selectedClass]);

  const handleDeleteRecord = (id: string, _name: string) => {
    deleteAssessmentRecord(id);
    setRecords(getAssessmentRecords());
  };

  const handleClearAll = () => {
    clearAllAssessments();
    setRecords([]);
  };

  const handleSaveRoster = () => {
    if (!rosterInputText.trim()) return;
    const parsed = parseRosterCSV(rosterInputText);
    saveRoster(parsed);
    setRoster(parsed);
    setShowRosterModal(false);
    setRosterInputText('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-sm font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Menu</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400">
                  PAINEL DO PROFESSOR
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Gestão &amp; Métricas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Avaliações de Simple Present • Alunos de Inglês do Prof. Geraldo
              </p>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportToCSV(filteredRecords)}
              disabled={filteredRecords.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 disabled:opacity-40 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
              title="Baixar planilha CSV com notas e respostas das 60 questões"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={() => exportToJSON(filteredRecords)}
              disabled={filteredRecords.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 border border-slate-700 text-xs font-bold transition"
              title="Baixar dados brutos em JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar JSON</span>
            </button>

            {onRestartGame && (
              <button
                onClick={onRestartGame}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition"
                title="Reiniciar Jogo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reiniciar</span>
              </button>
            )}

            {onLeaveGame && (
              <button
                onClick={onLeaveGame}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-bold transition"
                title="Sair do Jogo"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sair</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 space-y-6">
        {/* Sync status indicator */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Armazenamento Local Ativo: <strong>{records.length} avaliações registradas</strong> neste navegador.
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Exportável para Excel, Google Planilhas ou relatórios impressos
          </span>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'records'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Avaliações Concluídas ({filteredRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'analytics'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Estatísticas &amp; Análise de Erros</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'roster'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Lista de Chamada &amp; Pendências ({roster.length})</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar estudante pelo nome ou turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Class filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-sans"
            >
              <option value="all">Todas as Turmas ({records.length})</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  Turma: {cls}
                </option>
              ))}
            </select>
          </div>

          {records.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Tudo</span>
            </button>
          )}
        </div>

        {/* TAB 1: RECORDS TABLE */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">Nenhuma avaliação encontrada</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Assim que os alunos responderem às 16 missões no Modo Avaliação, seus resultados completos e auditáveis aparecerão aqui automaticamente.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-xs font-mono uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Estudante</th>
                      <th className="p-3.5">Turma</th>
                      <th className="p-3.5">Data / Hora</th>
                      <th className="p-3.5">Tempo</th>
                      <th className="p-3.5 text-center">Acertos</th>
                      <th className="p-3.5 text-center">Nota (0-10)</th>
                      <th className="p-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRecords.map((r) => {
                      const scoreNum = parseFloat(r.scoreOutOfTen);
                      const isHigh = scoreNum >= 7.0;

                      return (
                        <tr key={r.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3.5">
                            <span className="font-bold text-white block">{r.studentName}</span>
                            {r.schoolName && (
                              <span className="text-[11px] text-slate-400">{r.schoolName}</span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono text-cyan-300">{r.studentClass}</td>
                          <td className="p-3.5 text-xs text-slate-400">{r.formattedDate}</td>
                          <td className="p-3.5 font-mono text-xs text-slate-300">{r.formattedDuration}</td>
                          <td className="p-3.5 text-center font-mono">
                            <span className="text-emerald-400 font-bold">{r.correctCount}</span>
                            <span className="text-slate-500"> / 16</span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-xs font-black ${
                                isHigh
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {r.scoreOutOfTen} ({r.percentage.toFixed(0)}%)
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedRecordForDetail(r)}
                                className="px-3 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition"
                              >
                                Ver Detalhes
                              </button>
                              <button
                                onClick={() => handleDeleteRecord(r.id, r.studentName)}
                                className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                                aria-label="Excluir avaliação"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ANALYTICS & HARDEST QUESTIONS */}
        {activeTab === 'analytics' && stats && (
          <div className="space-y-6">
            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400">Total Avaliações</span>
                <div className="text-3xl font-black text-white mt-1">{stats.totalAssessments}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400">Média da Turma (0-10)</span>
                <div className="text-3xl font-black text-cyan-300 mt-1">{stats.averageScore}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400">Aproveitamento Médio</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">{stats.averagePercentage}%</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400">Taxa de Aprovação (≥6.0)</span>
                <div className="text-3xl font-black text-purple-400 mt-1">{stats.passRate}%</div>
              </div>
            </div>

            {/* Questions with highest error rate */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">
                  Análise de Dificuldade: Questões com Maior Índice de Erros
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Identifique onde os estudantes mais hesitam para focar nas próximas aulas explicativas de DO/DOES.
              </p>

              <div className="space-y-3">
                {stats.questionStats.map((item) => (
                  <div
                    key={item.questionId}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        Q{item.questionId}
                      </span>
                      <div>
                        <span className="font-bold text-white">{item.affirmative}</span>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {item.errorCount} erros • {item.correctCount} acertos (de {item.totalAttempts} respostas)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${item.errorRate}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-mono font-bold w-12 text-right ${
                          item.errorRate > 40 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {item.errorRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ROSTER & PENDING STUDENTS */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Lista de Chamada &amp; Controle de Entregas</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cadastre a lista de estudantes para identificar quem já realizou a prova e quem ainda não enviou.
                </p>
              </div>

              <button
                onClick={() => setShowRosterModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition"
              >
                <Upload className="w-4 h-4" />
                <span>Importar Lista de Estudantes</span>
              </button>
            </div>

            {rosterStatus && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Completed */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-emerald-300">
                        Avaliação Concluída ({rosterStatus.completed.length})
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">
                      {rosterStatus.completionRate.toFixed(0)}% da turma
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 text-sm pr-1">
                    {rosterStatus.completed.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">Nenhum estudante concluiu ainda.</p>
                    ) : (
                      rosterStatus.completed.map((st, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                          <span className="font-medium text-white">{st.name}</span>
                          <span className="text-xs font-mono text-slate-400">{st.class}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Pending */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserX className="w-5 h-5 text-amber-400" />
                      <h4 className="font-bold text-amber-300">
                        Pendentes / Sem Avaliação ({rosterStatus.pending.length})
                      </h4>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 text-sm pr-1">
                    {rosterStatus.pending.length === 0 ? (
                      <p className="text-xs text-emerald-400 italic py-2">Todos os estudantes da turma cadastrada já concluíram!</p>
                    ) : (
                      rosterStatus.pending.map((st, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                          <span className="font-medium text-slate-300">{st.name}</span>
                          <span className="text-xs font-mono text-amber-400">{st.class}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedRecordForDetail && (
        <ReportModal
          record={selectedRecordForDetail}
          onReturnToMenu={() => setSelectedRecordForDetail(null)}
        />
      )}

      {/* Roster Upload Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Importar Lista de Estudantes</h3>
            <p className="text-xs text-slate-300">
              Cole abaixo a lista de alunos (um por linha no formato: <code>Nome Completo, Turma</code>) ou de um arquivo CSV:
            </p>

            <textarea
              rows={8}
              value={rosterInputText}
              onChange={(e) => setRosterInputText(e.target.value)}
              placeholder="Exemplo:&#10;Ana Paula Silva, 8º Ano A&#10;Carlos Eduardo Souza, 8º Ano A&#10;Beatriz Oliveira, 8º Ano B"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRosterModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRoster}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black hover:from-cyan-400 hover:to-blue-500"
              >
                Salvar Lista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
