import React, { useState } from 'react';
import { X, Check, TrendingUp, TrendingDown, Target, Info } from 'lucide-react';

export default function KpiEditModal({ kpi, onClose, onSave, activeUser }) {
  const [newValue, setNewValue] = useState(kpi.currentValue);
  const [note, setNote] = useState('');

  if (!kpi) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(kpi.id, Number(newValue), note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-scale-in">
        {/* Encabezado */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Actualizar Medición de Impacto
            </span>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {kpi.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Línea Base:</span>
              <span className="font-semibold text-slate-800">{kpi.baseline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Meta Semana 12 (supuesto):</span>
              <span className="font-bold text-emerald-700">{kpi.targetLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Unidad de medida:</span>
              <span className="font-mono text-slate-700">{kpi.unit}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nuevo Valor Actual Observado ({kpi.unit})
            </label>
            <input
              type="number"
              step="any"
              required
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full px-3 py-2 text-base font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nota / Justificación del Cambio
            </label>
            <textarea
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej. Medición obtenida tras el cierre del sprint 12..."
              className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Registrado por: {activeUser.name} ({activeUser.baseCity})
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Guardar Medición
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
