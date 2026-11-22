import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  UserX,
  FileX2,
  ArrowRight,
  X,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function GovernanceAlertModal({
  isOpen,
  alertData, // { reason: 'ENTRY_RULE' | 'WIP_LIMIT', missing: [], message, card, ownerId }
  teamMembers,
  onClose,
  onResolveEntryRule, // Abre el modal de detalle para completar los campos
}) {
  if (!isOpen || !alertData) return null;

  const isEntryRule = alertData.reason === 'ENTRY_RULE';
  const isWipLimit = alertData.reason === 'WIP_LIMIT';

  const owner = teamMembers.find(m => m.id === (alertData.ownerId || alertData.card?.ownerId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Encabezado del modal */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isEntryRule
              ? 'bg-amber-50/70 border-amber-100 text-amber-900'
              : 'bg-rose-50/70 border-rose-100 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isEntryRule ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isEntryRule
                  ? 'Requisitos de Calidad Incompletos'
                  : 'Límite de Trabajo en Curso Alcanzado'}
              </h3>
              <p className="text-xs opacity-80">Política de Gobernanza SYNC 2030</p>
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

        {/* Cuerpo del modal */}
        <div className="p-6 space-y-4 text-slate-700 text-sm">
          {/* Tarjeta afectada */}
          {alertData.card && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Iniciativa evaluada
              </span>
              <p className="font-semibold text-slate-900 text-sm line-clamp-2">
                {alertData.card.title}
              </p>
            </div>
          )}

          {/* Caso 1: Regla Estricta de Entrada */}
          {isEntryRule && (
            <div className="space-y-3">
              <p className="text-slate-600 text-xs leading-relaxed">
                El flujo de trabajo prohíbe pasar iniciativas a la columna{' '}
                <strong className="text-slate-800">"En curso"</strong> si no cuentan con un
                responsable asignado y un criterio de aceptación verificable:
              </p>

              <div className="space-y-2">
                <div
                  className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 ${
                    !alertData.card?.ownerId
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  {!alertData.card?.ownerId ? (
                    <UserX className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold">Responsable de entrega: </span>
                    {alertData.card?.ownerId
                      ? `${owner?.name || 'Asignado'}`
                      : 'Falta asignar un integrante del equipo.'}
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 ${
                    !alertData.card?.acceptanceCriteria?.trim()
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  {!alertData.card?.acceptanceCriteria?.trim() ? (
                    <FileX2 className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold">Criterio de aceptación: </span>
                    {alertData.card?.acceptanceCriteria?.trim()
                      ? 'Definido.'
                      : 'Falta especificar las condiciones de satisfacción.'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-500 border border-slate-200/80">
                💡 <em>"Gestionamos impacto, no horas"</em>: Un criterio de aceptación explícito
                elimina retrabajos y evita malentendidos entre las sedes de Tokio, Guadalajara y Berlín.
              </div>
            </div>
          )}

          {/* Caso 2: Límite WIP Excedido */}
          {isWipLimit && (
            <div className="space-y-3">
              <div className="bg-rose-50 rounded-xl p-3 border border-rose-200 flex items-start gap-3">
                <Users className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 space-y-1">
                  <p className="font-bold">
                    {owner ? `${owner.name} (${owner.baseCity})` : 'El integrante seleccionado'}{' '}
                    ya tiene 2 tarjetas en curso.
                  </p>
                  <p className="text-rose-700 leading-normal">
                    La política de protección del enfoque y bienestar digital establece un tope
                    estricto de <strong className="font-bold">2 tarjetas activas por integrante</strong>.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Para asignar o activar una nueva iniciativa para este integrante, primero debe
                concluir o mover a revisión una de sus tareas actuales.
              </p>

              <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-500 border border-slate-200/80">
                🛡️ <strong>Escudo Anti-Fatiga:</strong> La multitarea dispersa esfuerzos y genera
                fricciones asíncronas en equipos distribuidos globalmente.
              </div>
            </div>
          )}
        </div>

        {/* Pie del modal con acciones */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cerrar
          </button>

          {isEntryRule && (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onResolveEntryRule && alertData.card) {
                  onResolveEntryRule(alertData.card);
                }
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              Completar requisitos ahora
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
