import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Flag,
  Award,
  Sparkles
} from 'lucide-react';

export default function ExecutiveSummaryBar({ adoptionScore, adoptionStatus, practices }) {
  // Conteo de prácticas por estado
  const consolidatedCount = practices.filter(p => p.currentPercent >= 85).length;
  const inAdoptionCount = practices.filter(p => p.currentPercent >= 70 && p.currentPercent < 85).length;
  const inRiskCount = practices.filter(p => p.currentPercent < 70).length;

  // Hitos de referencia oficiales
  const milestones = [
    { week: 'Semana 4', target: 60, label: '60% (Arranque)' },
    { week: 'Semana 8', target: 75, label: '75% (Alineación)' },
    { week: 'Semana 12', target: 85, label: '85% (Consolidación)' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      {/* Fila principal: Métricas Clave y Semáforo */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Badge circular con porcentaje global */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-xs transition-colors duration-200 ${
              adoptionStatus.color === 'verde'
                ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300 ring-4 ring-emerald-50/50'
                : adoptionStatus.color === 'amarillo'
                ? 'bg-amber-50 text-amber-700 border-2 border-amber-300 ring-4 ring-amber-50/50'
                : 'bg-rose-50 text-rose-700 border-2 border-rose-300 ring-4 ring-rose-50/50'
            }`}>
              {adoptionScore}%
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
              adoptionStatus.color === 'verde' ? 'bg-emerald-500 text-white' :
              adoptionStatus.color === 'amarillo' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {adoptionStatus.color === 'verde' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {adoptionStatus.color === 'amarillo' && <AlertTriangle className="w-3.5 h-3.5" />}
              {adoptionStatus.color === 'rojo' && <AlertCircle className="w-3.5 h-3.5" />}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Índice Global de Aplicación
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${adoptionStatus.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${adoptionStatus.accentBg}`}></span>
                {adoptionStatus.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              Fórmula oficial ponderada: <span className="font-mono font-medium text-slate-700">% Aplicación = Σ(peso_i × cumplimiento_i) ÷ 100</span>.
            </p>
          </div>
        </div>

        {/* Resumen rápido de estados de las 8 prácticas */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs">
          <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">{consolidatedCount}</span>
            <span className="text-slate-500">Consolidadas (≥85%)</span>
          </div>
          <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-slate-700">{inAdoptionCount}</span>
            <span className="text-slate-500">En adopción (70–84%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="font-semibold text-slate-700">{inRiskCount}</span>
            <span className="text-slate-500">En riesgo (&lt;70%)</span>
          </div>
        </div>
      </div>

      {/* Barra de progreso discreta con hitos de referencia */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            Trayectoria de Madurez hacia la Semana 12
          </span>
          <span className="text-slate-500 font-mono">
            {adoptionScore}% de 100% posible
          </span>
        </div>

        {/* Barra con track y relleno */}
        <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              adoptionStatus.color === 'verde'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : adoptionStatus.color === 'amarillo'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                : 'bg-gradient-to-r from-rose-500 to-red-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, adoptionScore))}%` }}
          />

          {/* Marcadores de hitos integrados en la barra */}
          {milestones.map((m) => (
            <div
              key={m.week}
              className="absolute top-0 bottom-0 w-0.5 bg-slate-400/70 z-10"
              style={{ left: `${m.target}%` }}
              title={`${m.week}: Meta ${m.target}%`}
            />
          ))}
        </div>

        {/* Leyenda de los 3 hitos debajo de la barra */}
        <div className="relative w-full h-6 text-[11px]">
          {milestones.map((m) => {
            const isReached = adoptionScore >= m.target;
            return (
              <div
                key={m.week}
                className="absolute -translate-x-1/2 flex flex-col items-center whitespace-nowrap"
                style={{ left: `${m.target}%` }}
              >
                <span className={`font-semibold flex items-center gap-0.5 ${
                  isReached ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {isReached ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline" /> : <Target className="w-2.5 h-2.5 text-slate-400 inline" />}
                  {m.week}: {m.target}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
