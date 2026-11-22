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
}) {
  const isEnCurso = column.id === 'en-curso';

  return (
    <div className="flex flex-col bg-slate-100/75 rounded-2xl border border-slate-200/80 p-3 min-w-[300px] flex-1 max-w-sm">
      {/* Encabezado de la Columna */}
      <div className="flex items-start justify-between gap-2 px-2 py-1.5 mb-2">
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
        <div className="mx-1 mb-3 px-2.5 py-1.5 bg-indigo-50/80 border border-indigo-150 rounded-lg flex items-center justify-between text-[11px] text-indigo-900 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            Límite WIP Activo
          </span>
          <span className="font-semibold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-[10px]">
            ≤ 2 por persona
          </span>
        </div>
      )}

      {/* Lista de Tarjetas */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1 min-h-[140px]">
        {cards.length > 0 ? (
          cards.map(card => (
            <KanbanCard
              key={card.id}
              card={card}
              teamMembers={teamMembers}
              onOpenDetail={onOpenDetail}
              onMove={onMove}
              onIntervene={onIntervene}
            />
          ))
        ) : (
          <div className="h-full min-h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 space-y-1">
            <Inbox className="w-5 h-5 text-slate-300" />
            <p className="text-xs font-medium">Sin tarjetas en esta columna</p>
          </div>
        )}
      </div>
    </div>
  );
}
