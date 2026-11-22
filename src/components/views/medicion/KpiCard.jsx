import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function KpiCard({ kpi, onOpenEdit }) {
  // Cálculo de progreso porcentual hacia la meta
  // Si direction === 'decrease': la meta es menor que la línea base (ej. 15 -> 6)
  //   progreso = (baselineValue - currentValue) / (baselineValue - targetValue) * 100
  // Si direction === 'increase': la meta es mayor que la línea base (ej. 62 -> 85)
  //   progreso = (currentValue - baselineValue) / (targetValue - baselineValue) * 100
  
  let progressPercent = 0;
  if (kpi.direction === 'decrease') {
    const totalReductionNeeded = kpi.baselineValue - kpi.targetValue;
    const currentReduction = kpi.baselineValue - kpi.currentValue;
    progressPercent = totalReductionNeeded > 0 ? (currentReduction / totalReductionNeeded) * 100 : 0;
  } else {
    const totalIncreaseNeeded = kpi.targetValue - kpi.baselineValue;
    const currentIncrease = kpi.currentValue - kpi.baselineValue;
    progressPercent = totalIncreaseNeeded > 0 ? (currentIncrease / totalIncreaseNeeded) * 100 : 0;
  }

  const clampedProgress = Math.max(0, Math.min(100, Math.round(progressPercent)));
  const isTargetAchieved = kpi.status === 'meta-alcanzada' || clampedProgress >= 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-sm transition-all p-5 flex flex-col justify-between space-y-4">
      {/* Encabezado de la Tarjeta */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              kpi.type === 'innovacion'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              {kpi.type === 'innovacion' ? 'Indicador de Innovación' : 'Indicador Base'} • {kpi.category}
            </span>
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {kpi.name}
            </h4>
          </div>

          <button
            onClick={() => onOpenEdit(kpi)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Actualizar medición"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
          {kpi.description}
        </p>
      </div>

      {/* Valores Comparativos: Línea Base, Actual y Meta Semana 12 */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 text-center">
        {/* Línea Base */}
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Línea Base
          </span>
          <p className="text-xs font-semibold text-slate-700 font-mono">
            {kpi.baseline}
          </p>
        </div>

        {/* Valor Actual */}
        <div className="space-y-0.5 border-x border-slate-200 px-1">
          <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
            Actual
          </span>
          <p className="text-base font-extrabold text-slate-900 font-mono">
            {kpi.currentValue} <span className="text-xs font-normal text-slate-500">{kpi.unit}</span>
          </p>
        </div>

        {/* Meta Semana 12 */}
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
            Meta Sem 12
          </span>
          <p className="text-xs font-semibold text-emerald-700 font-mono">
            {kpi.targetLabel}
          </p>
        </div>
      </div>

      {/* Barra de Progreso hacia la Meta */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            {kpi.direction === 'decrease' ? (
              <TrendingDown className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            )}
            Avance hacia la meta
          </span>
          <span className={`font-bold font-mono ${
            isTargetAchieved ? 'text-emerald-700' : 'text-slate-700'
          }`}>
            {clampedProgress}%
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isTargetAchieved
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
            }`}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span className="italic">Supuesto proyectado Sem 12</span>
          <span className={`font-semibold flex items-center gap-1 ${
            isTargetAchieved ? 'text-emerald-600' : 'text-slate-600'
          }`}>
            {isTargetAchieved ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Meta Consolidada
              </>
            ) : (
              'En trayectoria'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
