import React, { useState, useMemo } from 'react';
import { useSync } from '../../context/SyncContext';
import {
  Kanban,
  Plus,
  Filter,
  Users,
  Building2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import {
  BOARD_COLUMNS,
  CULTURAL_LIGHTS,
  validateEntryRule,
  validateWipLimit
} from '../../utils/boardRules';
import KanbanColumn from './tablero/KanbanColumn';
import CardDetailModal from './tablero/CardDetailModal';
import NewCardModal from './tablero/NewCardModal';
import AmbassadorInterventionModal from './tablero/AmbassadorInterventionModal';
import GovernanceAlertModal from './tablero/GovernanceAlertModal';

export default function TableroValorView() {
  const {
    cards,
    teamMembers,
    activeUser,
    moveCard,
    updateCard,
    createCard,
    resolveRedCard,
  } = useSync();

  // Estados de Filtros Rápidos
  const [filterLight, setFilterLight] = useState('todos'); // 'todos' | 'rojo' | 'amarillo' | 'verde'
  const [filterSite, setFilterSite] = useState('todas'); // 'todas' | 'Tokio' | 'Guadalajara' | 'Berlín'
  const [filterOwner, setFilterOwner] = useState('todos'); // 'todos' | memberId

  // Estados de Modales
  const [selectedCardForDetail, setSelectedCardForDetail] = useState(null);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [newCardInitialColumn, setNewCardInitialColumn] = useState('por-hacer');
  const [selectedCardForIntervention, setSelectedCardForIntervention] = useState(null);
  const [governanceAlert, setGovernanceAlert] = useState(null); // { reason, missing, message, card, ownerId }

  // Métricas rápidas de cabecera
  const metrics = useMemo(() => {
    const total = cards.length;
    const inProgress = cards.filter(c => c.column === 'en-curso').length;
    const redAlerts = cards.filter(c => c.culturalTrafficLight === 'rojo').length;
    const completed = cards.filter(c => c.column === 'terminado').length;
    return { total, inProgress, redAlerts, completed };
  }, [cards]);

  // Filtrado reactivo de tarjetas
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // 1. Filtro por Semáforo Cultural
      if (filterLight !== 'todos' && card.culturalTrafficLight !== filterLight) {
        return false;
      }

      // 2. Filtro por Sede
      if (filterSite !== 'todas') {
        const matchesSite = card.sites && card.sites.some(
          s => s.toLowerCase() === filterSite.toLowerCase()
        );
        if (!matchesSite) return false;
      }

      // 3. Filtro por Integrante Responsable
      if (filterOwner !== 'todos') {
        if (card.ownerId !== filterOwner) return false;
      }

      return true;
    });
  }, [cards, filterLight, filterSite, filterOwner]);

  // Manejo de movimiento de tarjeta con validación de gobernanza
  const handleMoveCard = (cardId, targetColumn) => {
    const result = moveCard(cardId, targetColumn);
    if (!result.success) {
      setGovernanceAlert(result);
    }
  };

  // Manejo de guardado en el modal de detalle
  const handleSaveCardDetail = (cardId, updatedData) => {
    const result = updateCard(cardId, updatedData);
    if (!result.success) {
      setGovernanceAlert(result);
      return;
    }
    setSelectedCardForDetail(null);
  };

  // Manejo de creación de tarjeta
  const handleCreateCard = (newCardData) => {
    const result = createCard(newCardData);
    if (!result.success) {
      setGovernanceAlert(result);
      return;
    }
    setIsNewCardModalOpen(false);
  };

  // Manejo de intervención del embajador neutral
  const handleConfirmIntervention = (cardId, newLight, note) => {
    resolveRedCard(cardId, newLight, note);
  };

  // Abrir modal nueva tarjeta para una columna específica
  const handleOpenAddNew = (columnId = 'por-hacer') => {
    setNewCardInitialColumn(columnId);
    setIsNewCardModalOpen(true);
  };

  const hasActiveFilters = filterLight !== 'todos' || filterSite !== 'todas' || filterOwner !== 'todos';

  const resetFilters = () => {
    setFilterLight('todos');
    setFilterSite('todas');
    setFilterOwner('todos');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Encabezado Ejecutivo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Tablero por Valor y Semáforo Cultural
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Flujo de valor con límite WIP ≤ 2 y SLA de mediación intercultural de 24 horas
              </p>
            </div>
          </div>
        </div>

        {/* Botón "+ Nueva tarjeta" */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenAddNew('por-hacer')}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            + Nueva tarjeta
          </button>
        </div>
      </div>

      {/* 2. Tarjetas de Resumen de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total en Flujo
          </span>
          <div className="text-xl font-bold text-slate-900">{metrics.total}</div>
          <div className="text-[10px] text-slate-400">Iniciativas registradas</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-0.5">
          <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
            En Curso
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          </span>
          <div className="text-xl font-bold text-indigo-950">{metrics.inProgress}</div>
          <div className="text-[10px] text-indigo-600/80">Límite: máx. 2 por integrante</div>
        </div>

        <div
          className={`rounded-xl border p-3 shadow-2xs space-y-0.5 ${
            metrics.redAlerts > 0
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 ${
              metrics.redAlerts > 0 ? 'text-rose-700 font-bold' : 'text-slate-500'
            }`}
          >
            Alertas Críticas
            {metrics.redAlerts > 0 && <Clock className="w-3 h-3 text-rose-600" />}
          </span>
          <div className="text-xl font-bold">
            {metrics.redAlerts}
            {metrics.redAlerts > 0 && (
              <span className="text-xs font-semibold ml-1.5 text-rose-600">SLA 24h</span>
            )}
          </div>
          <div className="text-[10px] opacity-75">
            {metrics.redAlerts > 0
              ? 'Requiere mediación de embajador'
              : 'Sin fricciones críticas activas'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-0.5">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
            Terminadas
          </span>
          <div className="text-xl font-bold text-emerald-950">{metrics.completed}</div>
          <div className="text-[10px] text-emerald-600/80">Impacto y valor verificado</div>
        </div>
      </div>

      {/* 3. Barra Superior Discreta de Filtros Rápidos */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-xs">
          {/* Grupo 1: Semáforo Cultural */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mr-1 shrink-0">
              Semáforo:
            </span>
            <button
              type="button"
              onClick={() => setFilterLight('todos')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                filterLight === 'todos'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterLight('rojo')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                filterLight === 'rojo'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-100/70'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Rojo {metrics.redAlerts > 0 ? `(${metrics.redAlerts})` : ''}
            </button>
            <button
              type="button"
              onClick={() => setFilterLight('amarillo')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                filterLight === 'amarillo'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/60 hover:bg-amber-100/70'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Amarillo
            </button>
            <button
              type="button"
              onClick={() => setFilterLight('verde')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                filterLight === 'verde'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100/70'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verde
            </button>
          </div>

          {/* Grupo 2: Sedes y Grupo 3: Integrantes */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro por Sede */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterSite}
                onChange={(e) => setFilterSite(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="todas">Todas las sedes</option>
                <option value="Tokio">🇯🇵 Tokio</option>
                <option value="Guadalajara">🇲🇽 Guadalajara</option>
                <option value="Berlín">🇩🇪 Berlín</option>
              </select>
            </div>

            {/* Filtro por Integrante */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="todos">Todos los integrantes (7)</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.baseCity})
                  </option>
                ))}
              </select>
            </div>

            {/* Limpiar Filtros */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Tablero Kanban (4 Columnas) */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1240px]">
          {BOARD_COLUMNS.map(col => {
            const columnCards = filteredCards.filter(c => c.column === col.id);
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                cards={columnCards}
                teamMembers={teamMembers}
                onOpenDetail={(card) => setSelectedCardForDetail(card)}
                onMove={handleMoveCard}
                onIntervene={(card) => setSelectedCardForIntervention(card)}
                onAddNew={handleOpenAddNew}
              />
            );
          })}
        </div>
      </div>

      {/* 5. Modales Operativos */}
      {/* 5.1 Modal de Detalle y Edición Rápida */}
      {selectedCardForDetail && (
        <CardDetailModal
          isOpen={!!selectedCardForDetail}
          card={selectedCardForDetail}
          teamMembers={teamMembers}
          onClose={() => setSelectedCardForDetail(null)}
          onSave={handleSaveCardDetail}
          onOpenIntervention={(card) => setSelectedCardForIntervention(card)}
        />
      )}

      {/* 5.2 Modal de Creación de Nueva Tarjeta */}
      {isNewCardModalOpen && (
        <NewCardModal
          isOpen={isNewCardModalOpen}
          initialColumn={newCardInitialColumn}
          teamMembers={teamMembers}
          onClose={() => setIsNewCardModalOpen(false)}
          onCreate={handleCreateCard}
        />
      )}

      {/* 5.3 Modal de Intervención del Embajador Neutral (SLA 24h) */}
      {selectedCardForIntervention && (
        <AmbassadorInterventionModal
          isOpen={!!selectedCardForIntervention}
          card={selectedCardForIntervention}
          onClose={() => setSelectedCardForIntervention(null)}
          onConfirmIntervention={handleConfirmIntervention}
        />
      )}

      {/* 5.4 Modal de Bloqueo de Gobernanza (Regla de Entrada y Límite WIP) */}
      {governanceAlert && (
        <GovernanceAlertModal
          isOpen={!!governanceAlert}
          alertData={governanceAlert}
          teamMembers={teamMembers}
          onClose={() => setGovernanceAlert(null)}
          onResolveEntryRule={(card) => {
            setGovernanceAlert(null);
            setSelectedCardForDetail(card);
          }}
        />
      )}
    </div>
  );
}
