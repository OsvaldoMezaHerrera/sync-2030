import React from 'react';
import { Kanban } from 'lucide-react';

export default function TableroValorView() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <Kanban className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Módulo 3: Tablero por Valor + Semáforo Cultural</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Columnas por hacer, en curso (WIP ≤ 2), en revisión y terminado. Regla estricta de entrada con dueño y criterio de aceptación, y Semáforo Cultural con cuenta regresiva de 24h y embajador neutral.
        </p>
        <span className="inline-block text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
          Próximo módulo a implementar en el sprint
        </span>
      </div>
    </div>
  );
}
