import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Save,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  CULTURAL_LIGHTS,
  calculateNeutralAmbassador,
  formatRemainingTime
} from '../../../utils/boardRules';

export default function CardDetailModal({
  isOpen,
  card,
  teamMembers,
  onClose,
  onSave, // (cardId, updatedData) => result
  onOpenIntervention, // (card)
}) {
  if (!isOpen || !card) return null;

  const [title, setTitle] = useState(card.title || '');
  const [column, setColumn] = useState(card.column || 'por-hacer');
  const [ownerId, setOwnerId] = useState(card.ownerId || '');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(card.acceptanceCriteria || '');
  const [okr, setOkr] = useState(card.okr || '');
  const [sites, setSites] = useState(card.sites || ['Guadalajara']);
  const [culturalTrafficLight, setCulturalTrafficLight] = useState(
    card.culturalTrafficLight || 'verde'
  );
  const [frictionReason, setFrictionReason] = useState(card.frictionReason || '');

  // Sincronizar estado cuando cambia la tarjeta activa
  useEffect(() => {
    setTitle(card.title || '');
    setColumn(card.column || 'por-hacer');
    setOwnerId(card.ownerId || '');
    setAcceptanceCriteria(card.acceptanceCriteria || '');
    setOkr(card.okr || '');
    setSites(card.sites || ['Guadalajara']);
    setCulturalTrafficLight(card.culturalTrafficLight || 'verde');
    setFrictionReason(card.frictionReason || '');
  }, [card]);

  // Manejo de sedes involucradas
  const toggleSite = (siteName) => {
    setSites(prev => {
      const exists = prev.includes(siteName);
      if (exists) {
        if (prev.length === 1) return prev; // Mantener al menos una sede
        return prev.filter(s => s !== siteName);
      }
      return [...prev, siteName];
    });
  };

  // Embajador neutral calculado dinámicamente según las sedes actuales
  const liveAmbassador = calculateNeutralAmbassador(sites);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      title: title.trim(),
      column,
      ownerId,
      acceptanceCriteria: acceptanceCriteria.trim(),
      okr: okr.trim(),
      sites,
      culturalTrafficLight,
      frictionReason: frictionReason.trim(),
    };
    onSave(card.id, updatedData);
  };

  const isRed = culturalTrafficLight === 'rojo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Encabezado */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                CULTURAL_LIGHTS[culturalTrafficLight]?.dotColor || 'bg-emerald-500'
              } ${isRed ? 'animate-pulse' : ''}`}
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Detalle de Iniciativa</h3>
              <p className="text-xs text-slate-500">ID: {card.id}</p>
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
          {/* Sincronización con el Gemelo si aplica */}
          {card.lastHumanSync && (
            <div className="bg-indigo-50/70 border border-indigo-150 rounded-xl p-3 flex items-center justify-between text-indigo-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Actualizado desde el Gemelo de Sincronía ({card.lastHumanSync})
              </span>
              <span className="text-[10px] bg-white text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-200">
                Aprobación Humana Confirmada
              </span>
            </div>
          )}

          {/* Título */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Título de la Iniciativa</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              placeholder="Ej. Integración de Sistema de Diseño..."
            />
          </div>

          {/* Fila: Columna y Responsable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Columna */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Columna de Estado</label>
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

            {/* Responsable */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Integrante Responsable</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">-- Sin responsable asignado --</option>
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
              Sedes Involucradas (Genera regla de embajador neutral):
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
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">
                Criterio de Aceptación (Requerido para pasar a "En curso")
              </label>
              {!acceptanceCriteria.trim() && (
                <span className="text-[10px] text-amber-600 font-semibold">Pendiente</span>
              )}
            </div>
            <textarea
              rows={2}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none"
              placeholder="Especifica el resultado tangible y verificable necesario para dar la tarea por concluida..."
            />
          </div>

          {/* OKR Vinculado */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Objetivo y Resultado Clave (OKR)</label>
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
              Semáforo Cultural y Riesgo Intercultural:
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
                    name="culturalTrafficLight"
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

          {/* Bloque Especial si está en Rojo */}
          {isRed && (
            <div className="bg-rose-50 rounded-xl p-3.5 border border-rose-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-rose-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-600 animate-spin" style={{ animationDuration: '8s' }} />
                  Protocolo Crítico de SLA: 24 horas continuas
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-rose-200 font-mono text-[11px]">
                  {card.redCountdownExpiresAt
                    ? formatRemainingTime(card.redCountdownExpiresAt).formatted
                    : '24:00:00 (Iniciando)'}
                </span>
              </div>

              <div className="bg-white/80 rounded-lg p-2.5 border border-rose-100 text-[11px] text-rose-950 flex items-center justify-between">
                <span className="font-medium text-rose-800">Embajador neutral calculado:</span>
                <span className="font-bold">{liveAmbassador}</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-rose-900">
                  Motivo de la fricción o desacuerdo intercultural:
                </label>
                <input
                  type="text"
                  value={frictionReason}
                  onChange={(e) => setFrictionReason(e.target.value)}
                  placeholder="Ej. Tiempos de respuesta esperados vs horas de descanso..."
                  className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {card.culturalTrafficLight === 'rojo' && onOpenIntervention && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenIntervention(card);
                  }}
                  className="w-full py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Abrir panel de mediación del embajador neutral
                </button>
              )}
            </div>
          )}

          {/* Historial de resoluciones si existen */}
          {card.resolutionHistory && card.resolutionHistory.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-700">Bitácora de Mediaciones Anteriores:</span>
              <div className="space-y-1">
                {card.resolutionHistory.map((res, i) => (
                  <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">{res.resolvedBy}</span>: {res.note} ({res.resolvedTime || 'Registrado'})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
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
              <Save className="w-3.5 h-3.5" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
