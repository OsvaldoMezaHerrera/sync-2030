import React from 'react';
import { Plus, ShieldAlert, Sparkles, Inbox } from 'lucide-react';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({
  column,
  cards,
  teamMembers,
  onOpenDetail,
  onMove,
  onIntervene,
  onAddNew,
  highlightedCardId = null,
}) {
  const isEnCurso = column.id === 'en-curso';

  return (
    <div className="flex flex-col bg-slate-100/80 rounded-2xl border border-slate-200/80 p-3 min-w-[290px] flex-1 max-w-sm h-[calc(100vh-285px)] min-h-[480px] shadow-2xs">
      {/* Encabezado fijo de la Columna (sticky top-0) */}
      <div className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur-xs pb-2 mb-1 border-b border-slate-200/50">
        <div className="flex items-start justify-between gap-2 px-1 py-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">{column.title}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold border ${column.badgeColor}`}
              >
                {cards.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">{column.subtitle}</p>
          </div>

          {/* Botón rápido para agregar tarjeta */}
          <button
            type="button"
            onClick={() => onAddNew(column.id)}
            title={`Agregar nueva tarjeta en ${column.title}`}
            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-all shadow-2xs border border-transparent hover:border-slate-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Badge explicativo de Límite WIP en la columna En Curso */}
        {isEnCurso && (
          <div className="mt-2 px-2.5 py-1.5 bg-indigo-50/90 border border-indigo-200/70 rounded-lg flex items-center justify-between text-[11px] text-indigo-900 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Límite WIP Activo
            </span>
            <span className="font-semibold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-[10px]">
              ≤ 2 por persona
            </span>
          </div>
        )}
      </div>

      {/* Lista de Tarjetas con scroll vertical independiente */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-0 pt-1">
        {cards.length > 0 ? (
          cards.map(card => (
            <KanbanCard
              key={card.id}
              card={card}
              teamMembers={teamMembers}
              onOpenDetail={onOpenDetail}
              onMove={onMove}
              onIntervene={onIntervene}
              isHighlighted={card.id === highlightedCardId}
            />
          ))
        ) : (
          <div className="h-full min-h-[140px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 space-y-1">
            <Inbox className="w-5 h-5 text-slate-300" />
            <p className="text-xs font-medium">Sin tarjetas en esta columna</p>
          </div>
        )}
      </div>
    </div>
  );
}
