import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  X,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ArrowRight,
  FileText
} from 'lucide-react';
import { formatRemainingTime } from '../../../utils/boardRules';

export default function AmbassadorInterventionModal({
  isOpen,
  card,
  onClose,
  onConfirmIntervention, // (cardId, newLight, note)
}) {
  if (!isOpen || !card) return null;

  const [remainingTime, setRemainingTime] = useState(() =>
    formatRemainingTime(card.redCountdownExpiresAt)
  );
  const [targetLight, setTargetLight] = useState('amarillo'); // 'amarillo' | 'verde'
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(null);

  // Contador regresivo en tiempo real
  useEffect(() => {
    if (!card.redCountdownExpiresAt) return;
    setRemainingTime(formatRemainingTime(card.redCountdownExpiresAt));

    const interval = setInterval(() => {
      setRemainingTime(formatRemainingTime(card.redCountdownExpiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [card.redCountdownExpiresAt]);

  // Presets de acuerdos de mediación cultural profesional
  const INTERVENTION_PRESETS = [
    {
      label: 'Desacople técnico y flexibilidad horaria',
      note: 'Se acordó desacoplar los contratos técnicos de integración y pactar una ventana de revisión asíncrona de 24h sin exigir respuestas en horario nocturno.',
      recommendedLight: 'amarillo',
    },
    {
      label: 'Alineación de criterios de aceptación explícitos',
      note: 'Se consensuaron criterios de aceptación numéricos y pruebas automáticas en el pipeline, eliminando la ambigüedad entre las especificaciones de Tokio y los servicios de backend.',
      recommendedLight: 'verde',
    },
    {
      label: 'Acuerdo de release escalonado',
      note: 'Se pactó una liberación parcial inicial con retroalimentación empírica en Guadalajara, manteniendo la compatibilidad estricta solicitada por Berlín.',
      recommendedLight: 'amarillo',
    },
  ];

  const handleSelectPreset = (preset, idx) => {
    setSelectedPresetIndex(idx);
    setResolutionNote(preset.note);
    setTargetLight(preset.recommendedLight);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalNote = resolutionNote.trim() || 'Intervención de mediación cultural completada con éxito.';
    onConfirmIntervention(card.id, targetLight, finalNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Encabezado */}
        <div className="px-6 py-4 bg-rose-50/80 border-b border-rose-100 flex items-center justify-between text-rose-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Intervención de Embajador Neutral</h3>
              <p className="text-xs text-rose-700">Resolución de Semáforo Rojo y Protocolo SLA 24h</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario / Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Tarjeta y Estado Crítico */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Iniciativa en Conflicto
              </span>
              <span className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-rose-600" />
                SLA: {remainingTime.formatted}
              </span>
            </div>
            <p className="font-semibold text-slate-900 text-sm">{card.title}</p>
          </div>

          {/* Información del Embajador y Cruce de Sedes */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Sedes en cruce</span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                {card.sites && card.sites.length > 0 ? card.sites.join(' ↔ ') : 'Global'}
              </div>
            </div>

            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Embajador Neutral</span>
              <div className="font-bold text-emerald-950 truncate">
                {card.neutralAmbassador || 'Osvaldo Meza (Transversal)'}
              </div>
            </div>
          </div>

          {/* Motivo o Contexto de la Fricción */}
          {card.frictionReason && (
            <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-200/70 text-xs text-rose-900 space-y-1">
              <span className="font-bold text-rose-800">Fricción identificada:</span>
              <p className="text-slate-700 leading-relaxed">{card.frictionReason}</p>
            </div>
          )}

          {/* Presets Rápidos de Solución */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Plantillas de acuerdo intercultural rápido:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {INTERVENTION_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p, idx)}
                  className={`text-left p-2 rounded-lg border text-xs transition-all ${
                    selectedPresetIndex === idx
                      ? 'border-indigo-400 bg-indigo-50/80 text-indigo-900 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-900 flex items-center justify-between">
                    <span>{p.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        p.recommendedLight === 'verde'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Pasa a {p.recommendedLight}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Registro del Acuerdo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Bitácora de Mediación y Acuerdos Consensuados:
            </label>
            <textarea
              rows={3}
              value={resolutionNote}
              onChange={(e) => {
                setResolutionNote(e.target.value);
                setSelectedPresetIndex(null);
              }}
              placeholder="Describe el acuerdo de trabajo alcanzado entre las sedes..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none"
            />
          </div>

          {/* Selector de Nuevo Estado del Semáforo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Nuevo estado del Semáforo Cultural:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  targetLight === 'amarillo'
                    ? 'border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-400/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="targetLight"
                  value="amarillo"
                  checked={targetLight === 'amarillo'}
                  onChange={() => setTargetLight('amarillo')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div className="text-xs">
                  <div className="font-bold">Amarillo (Atención activa)</div>
                  <div className="text-[11px] text-amber-700">Fricción mitigada con seguimiento en el sprint.</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  targetLight === 'verde'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="targetLight"
                  value="verde"
                  checked={targetLight === 'verde'}
                  onChange={() => setTargetLight('verde')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <div className="font-bold">Verde (Resuelto)</div>
                  <div className="text-[11px] text-emerald-700">Consenso pleno sin riesgo intercultural.</div>
                </div>
              </label>
            </div>
          </div>

          {/* Pie / Botones */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
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
              <CheckCircle2 className="w-3.5 h-3.5" />
              Registrar intervención y desactivar alerta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
