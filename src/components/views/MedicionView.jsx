import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function MedicionView() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Módulo 4: Medición (% de Aplicación y Retorno)</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Calculadora interactiva de las 8 prácticas ponderadas (suma 100%) con clasificación y panel de los 7 indicadores de retorno diferenciando Línea base vs Meta semana 12 (supuesto).
        </p>
        <span className="inline-block text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
          Próximo módulo a implementar en el sprint
        </span>
      </div>
    </div>
  );
}
