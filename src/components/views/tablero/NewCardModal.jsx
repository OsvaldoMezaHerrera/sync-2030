import React, { useState } from 'react';
import {
  X,
  Target,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import {
  CULTURAL_LIGHTS,
  calculateNeutralAmbassador
} from '../../../utils/boardRules';

export default function NewCardModal({
  isOpen,
  initialColumn = 'por-hacer',
  teamMembers,
  onClose,
  onCreate, // (cardData) => result
}) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [column, setColumn] = useState(initialColumn);
  const [ownerId, setOwnerId] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [okr, setOkr] = useState('');
  const [sites, setSites] = useState(['Guadalajara']);
  const [culturalTrafficLight, setCulturalTrafficLight] = useState('verde');
  const [frictionReason, setFrictionReason] = useState('');

  // Toggle de sedes involucradas
  const toggleSite = (siteName) => {
    setSites(prev => {
      const exists = prev.includes(siteName);
      if (exists) {
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== siteName);
      }
      return [...prev, siteName];
    });
  };

  const calculatedAmbassador = calculateNeutralAmbassador(sites);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCardData = {
      title: title.trim(),
      column,
      ownerId,
      acceptanceCriteria: acceptanceCriteria.trim(),
      okr: okr.trim(),
      sites,
      culturalTrafficLight,
      frictionReason: frictionReason.trim(),
    };
    onCreate(newCardData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Encabezado */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Nueva Iniciativa por Valor</h3>
              <p className="text-xs text-slate-500">Definición de flujo y semáforo intercultural</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Título */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Título de la Iniciativa *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              placeholder="Ej. Sincronización de esquemas JSON entre Tokio y Guadalajara..."
            />
          </div>

          {/* Fila: Columna inicial y Responsable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Columna de Inicio</label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="por-hacer">Por hacer</option>
                <option value="en-curso">En curso (WIP ≤ 2 por integrante)</option>
                <option value="en-revision">En revisión</option>
                <option value="terminado">Terminado</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Integrante Responsable</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">-- Sin responsable inicial --</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.baseCity} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sedes Involucradas */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Sedes Involucradas (Determina el embajador neutral):
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Tokio', flag: '🇯🇵' },
                { name: 'Guadalajara', flag: '🇲🇽' },
                { name: 'Berlín', flag: '🇩🇪' },
              ].map(s => {
                const isSelected = sites.includes(s.name);
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => toggleSite(s.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{s.flag}</span>
                    <span>{s.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Criterio de Aceptación */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Criterio de Aceptación (Requerido para pasar a "En curso")
            </label>
            <textarea
              rows={2}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none"
              placeholder="¿Qué condición tangible debe cumplirse para validar este impacto?"
            />
          </div>

          {/* OKR Vinculado */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">OKR Vinculado</label>
            <div className="relative">
              <Target className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={okr}
                onChange={(e) => setOkr(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Ej. Reducir retrabajo entre Diseño e Ingeniería en 30%"
              />
            </div>
          </div>

          {/* Semáforo Cultural */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700">
              Semáforo Cultural Inicial:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.values(CULTURAL_LIGHTS).map(light => (
                <label
                  key={light.id}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                    culturalTrafficLight === light.id
                      ? `${light.badgeClass} ring-2 ${light.ringColor}`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="newCulturalTrafficLight"
                    value={light.id}
                    checked={culturalTrafficLight === light.id}
                    onChange={() => setCulturalTrafficLight(light.id)}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-bold">{light.shortLabel}</div>
                    <div className="text-[10px] opacity-80 leading-tight">{light.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Bloque Informativo si se crea en Rojo */}
          {culturalTrafficLight === 'rojo' && (
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-rose-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-600" />
                  Alerta Crítica: Se activará cuenta regresiva de 24 horas
                </span>
              </div>
              <div className="bg-white/90 p-2 rounded border border-rose-100 text-[11px] text-rose-950 flex items-center justify-between">
                <span className="text-rose-700 font-medium">Embajador asignado automáticamente:</span>
                <span className="font-bold">{calculatedAmbassador}</span>
              </div>
              <input
                type="text"
                value={frictionReason}
                onChange={(e) => setFrictionReason(e.target.value)}
                placeholder="Motivo o desacuerdo que origina el semáforo rojo..."
                className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white"
              />
            </div>
          )}

          {/* Botones */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Crear iniciativa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
