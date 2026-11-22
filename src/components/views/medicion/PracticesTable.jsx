import React from 'react';
import { 
  Sliders, 
  RotateCcw, 
  User, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  HelpCircle,
  Layers
} from 'lucide-react';

export default function PracticesTable({ practices, onUpdatePercent }) {
  // Suma total de pesos para verificar que suman 100%
  const totalWeight = practices.reduce((acc, p) => acc + (Number(p.weight) || 0), 0);

  // Semáforo individual por práctica
  const getPracticeStatus = (percent) => {
    if (percent >= 85) {
      return {
        color: 'verde',
        label: 'Consolidado',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        bar: 'bg-emerald-500',
      };
    }
    if (percent >= 70) {
      return {
        color: 'amarillo',
        label: 'En adopción',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        bar: 'bg-amber-500',
      };
    }
    return {
      color: 'rojo',
      label: 'En riesgo',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      bar: 'bg-rose-500',
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Encabezado del Panel */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Panel de las 8 Prácticas Ponderadas
            </h3>
            <p className="text-xs text-slate-500">
              Ajusta los controles deslizantes o valores numéricos para calcular en tiempo real el cumplimiento del equipo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
            Ponderación Total: {totalWeight}% (100% calibrado)
          </span>
        </div>
      </div>

      {/* Lista de Prácticas */}
      <div className="divide-y divide-slate-100">
        {practices.map((practice) => {
          const status = getPracticeStatus(practice.currentPercent);
          const contribution = Math.round(((practice.weight * practice.currentPercent) / 100) * 10) / 10;

          return (
            <div
              key={practice.id}
              className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Columna 1: Información de la Práctica */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono text-xs flex items-center justify-center font-bold">
                    {practice.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {practice.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Peso: {practice.weight}%
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${status.badge}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-700 font-medium">{practice.owner}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cadencia: {practice.cadence}</span>
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 font-medium">
                    Aporta al índice: <strong className="text-slate-900">{contribution} pts</strong>
                  </span>
                </div>
              </div>

              {/* Columna 2: Control deslizante e Input numérico */}
              <div className="flex items-center gap-4 w-full lg:w-80 shrink-0">
                {/* Slider */}
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={practice.currentPercent}
                    onChange={(e) => onUpdatePercent(practice.id, e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full ${status.bar}`}
                      style={{ width: `${practice.currentPercent}%` }}
                    />
                  </div>
                </div>

                {/* Input numérico */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={practice.currentPercent}
                    onChange={(e) => onUpdatePercent(practice.id, e.target.value)}
                    className="w-16 px-2 py-1.5 text-center text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs font-mono"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie de Panel Informativo */}
      <div className="px-5 py-3 bg-slate-50/90 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-slate-600">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Pesos oficiales: Prácticas 1, 4, 5 y 7 (15% c/u) + Prácticas 2, 3, 6 y 8 (10% c/u) = 100%.
        </span>
        <span className="font-semibold text-slate-700">
          Semáforo: Verde ≥85% | Amarillo 70–84.9% | Rojo &lt;70%
        </span>
      </div>
    </div>
  );
}
