import React, { useState, useEffect } from 'react';
import {
  Clock,
  UserCheck,
  AlertOctagon,
  Target,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  UserX,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { CULTURAL_LIGHTS, formatRemainingTime } from '../../../utils/boardRules';

export default function KanbanCard({
  card,
  teamMembers,
  onOpenDetail,
  onMove,
  onIntervene,
}) {
  const [remainingTime, setRemainingTime] = useState(() =>
    formatRemainingTime(card.redCountdownExpiresAt)
  );

  // Contador regresivo en tiempo real para tarjetas en Rojo (SLA 24h)
  useEffect(() => {
    if (card.culturalTrafficLight !== 'rojo' || !card.redCountdownExpiresAt) {
      return;
    }

    setRemainingTime(formatRemainingTime(card.redCountdownExpiresAt));

    const interval = setInterval(() => {
      setRemainingTime(formatRemainingTime(card.redCountdownExpiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [card.culturalTrafficLight, card.redCountdownExpiresAt]);

  const owner = teamMembers.find(m => m.id === card.ownerId);
  const lightConfig = CULTURAL_LIGHTS[card.culturalTrafficLight] || CULTURAL_LIGHTS.verde;

  // Banderas de sedes
  const getSiteBadge = (site) => {
    const s = site.toLowerCase();
    if (s.includes('tokio') || s.includes('tokyo')) {
      return { flag: '🇯🇵', label: 'Tokio', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (s.includes('berlin') || s.includes('berlín')) {
      return { flag: '🇩🇪', label: 'Berlín', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    return { flag: '🇲🇽', label: 'Guadalajara', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  // Mover columna rápido
  const columnOrder = ['por-hacer', 'en-curso', 'en-revision', 'terminado'];
  const currentIndex = columnOrder.indexOf(card.column);
  const prevColumn = currentIndex > 0 ? columnOrder[currentIndex - 1] : null;
  const nextColumn = currentIndex < columnOrder.length - 1 ? columnOrder[currentIndex + 1] : null;

  return (
    <div
      onClick={() => onOpenDetail(card)}
      className={`group relative bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer overflow-hidden border-l-4 ${
        card.culturalTrafficLight === 'rojo'
          ? 'border-l-rose-500 hover:border-slate-300'
          : card.culturalTrafficLight === 'amarillo'
          ? 'border-l-amber-500 hover:border-slate-300'
          : 'border-l-emerald-500 hover:border-slate-300'
      }`}
    >
      <div className="p-4 space-y-3">
        {/* Encabezado: Semáforo y Sedes */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Tag Semáforo Cultural */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${lightConfig.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${lightConfig.dotColor} ${card.culturalTrafficLight === 'rojo' ? 'animate-pulse' : ''}`} />
              {lightConfig.shortLabel}
            </span>

            {/* Sedes involucradas */}
            {card.sites && card.sites.map((site, idx) => {
              const b = getSiteBadge(site);
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${b.bg}`}
                >
                  <span>{b.flag}</span>
                  <span>{b.label}</span>
                </span>
              );
            })}
          </div>

          {/* Sincronización reciente con el Gemelo si existe */}
          {card.lastHumanSync && (
            <span
              title={`Sincronizado desde el Gemelo: ${card.lastHumanSync}`}
              className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 font-medium shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5" />
              Sync IA
            </span>
          )}
        </div>

        {/* Título de la tarjeta */}
        <div>
          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
            {card.title}
          </h4>
        </div>

        {/* Alerta Roja y Embajador Neutral (SLA 24 Horas) */}
        {card.culturalTrafficLight === 'rojo' && (
          <div className="bg-rose-50/80 rounded-lg p-2.5 border border-rose-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-600 animate-spin" style={{ animationDuration: '6s' }} />
                SLA de Mediación:
              </span>
              <span className="font-mono text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200 text-[11px] font-bold shadow-2xs">
                {remainingTime.formatted}
              </span>
            </div>

            {card.neutralAmbassador && (
              <div className="text-[11px] text-rose-900 bg-rose-100/60 rounded px-2 py-1 flex items-center justify-between gap-1">
                <span className="text-rose-700 font-medium">Embajador asignado:</span>
                <span className="font-semibold truncate text-rose-950">{card.neutralAmbassador}</span>
              </div>
            )}

            {/* Botón directo para registrar intervención */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIntervene(card);
              }}
              className="w-full mt-1 px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Registrar intervención del embajador
            </button>
          </div>
        )}

        {/* Criterio de aceptación o alerta si falta */}
        {card.acceptanceCriteria ? (
          <div className="text-[11px] text-slate-600 bg-slate-50 rounded p-2 border border-slate-100 line-clamp-2">
            <span className="font-semibold text-slate-700">Criterio: </span>
            {card.acceptanceCriteria}
          </div>
        ) : (
          <div className="text-[11px] text-amber-800 bg-amber-50/70 rounded p-1.5 border border-amber-200/60 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium">Sin criterio de aceptación definido</span>
          </div>
        )}

        {/* OKR Vinculado */}
        {card.okr && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Target className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate" title={`OKR: ${card.okr}`}>
              {card.okr}
            </span>
          </div>
        )}

        {/* Pie de tarjeta: Responsable y Controles Rápidos de Columna */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Dueño de la tarjeta */}
          {owner ? (
            <div className="flex items-center gap-2 min-w-0" title={`Responsable: ${owner.name} (${owner.baseCity})`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${owner.avatarColor}`}
              >
                {owner.avatarInitials}
              </div>
              <span className="text-xs font-medium text-slate-700 truncate">
                {owner.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
              <UserX className="w-4 h-4 text-amber-500" />
              <span>Sin responsable</span>
            </div>
          )}

          {/* Botones de navegación de columna */}
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            {prevColumn && (
              <button
                type="button"
                onClick={() => onMove(card.id, prevColumn)}
                title="Mover a columna anterior"
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            {nextColumn && (
              <button
                type="button"
                onClick={() => onMove(card.id, nextColumn)}
                title="Avanzar a siguiente columna"
                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
