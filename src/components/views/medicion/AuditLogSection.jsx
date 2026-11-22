import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  User, 
  Clock, 
  Plus, 
  Search,
  Filter,
  Info
} from 'lucide-react';

export default function AuditLogSection({ practices, auditLogs, onAddAuditLog, activeUser }) {
  const [selectedPracticeId, setSelectedPracticeId] = useState(practices[0]?.id || 1);
  const [auditedValue, setAuditedValue] = useState(85);
  const [auditWeek, setAuditWeek] = useState('Semana 12');
  const [observations, setObservations] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Práctica actualmente seleccionada para auditar
  const currentPractice = practices.find(p => p.id === Number(selectedPracticeId)) || practices[0];
  const reportedValue = currentPractice?.currentPercent ?? 0;
  
  // Cálculo de diferencia detectada en vivo
  const discrepancy = Math.abs(reportedValue - Number(auditedValue));
  const isAlertThreshold = discrepancy > 10;

  const handleSubmitAudit = (e) => {
    e.preventDefault();
    if (!currentPractice) return;

    onAddAuditLog({
      practiceId: currentPractice.id,
      auditedPercent: Number(auditedValue),
      observations: observations.trim() || undefined,
      week: auditWeek,
    });

    setObservations('');
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-0">
      {/* Encabezado */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Registro de Auditoría Semanal por Muestreo
            </h3>
            <p className="text-xs text-slate-500">
              Supervisión de calidad liderada por Iván Ortega (QA / Auditor de Procesos). Tolerancia máxima: 10% de discrepancia.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-semibold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Auditor Oficial: Iván Ortega (QA / Berlín)
          </span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulario de Muestreo de Auditoría (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-xl border border-slate-200/80 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-purple-600" />
              Nueva Verificación de Muestreo
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Rol actual: {activeUser.name}
            </span>
          </div>

          <form onSubmit={handleSubmitAudit} className="space-y-3">
            {/* Selector de Práctica */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Práctica a Verificar
              </label>
              <select
                value={selectedPracticeId}
                onChange={(e) => {
                  setSelectedPracticeId(Number(e.target.value));
                  const p = practices.find(pr => pr.id === Number(e.target.value));
                  if (p) setAuditedValue(p.currentPercent);
                }}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {practices.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id}: {p.name} (Reportado: {p.currentPercent}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Semana */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ciclo de Auditoría
                </label>
                <select
                  value={auditWeek}
                  onChange={(e) => setAuditWeek(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Semana 12">Semana 12</option>
                  <option value="Semana 11">Semana 11</option>
                  <option value="Semana 10">Semana 10</option>
                  <option value="Semana 9">Semana 9</option>
                </select>
              </div>

              {/* Valor Auditado */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor Auditado (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={auditedValue}
                  onChange={(e) => setAuditedValue(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="w-full text-xs font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-purple-500 text-center"
                />
              </div>
            </div>

            {/* Comparativa en vivo: Reportado vs Auditado y Discrepancia */}
            <div className={`p-3 rounded-lg border text-xs space-y-1.5 transition-colors ${
              isAlertThreshold
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <div className="flex items-center justify-between font-semibold">
                <span>Reportado: <strong>{reportedValue}%</strong></span>
                <span>Auditado: <strong>{auditedValue}%</strong></span>
                <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                  isAlertThreshold ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  Diferencia: {discrepancy}%
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                {isAlertThreshold ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>Alerta: Discrepancia &gt; 10%. Supera el umbral de tolerancia permitido.</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Muestreo conforme: Discrepancia dentro del margen admisible (≤ 10%).</span>
                  </>
                )}
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hallazgo / Observaciones de Muestreo
              </label>
              <textarea
                rows="2"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Evidencia observada en el muestreo de repositorios, actas o minutas..."
                className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Registrar Verificación por Muestreo
            </button>
          </form>

          {isSuccessToast && (
            <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-purple-600" />
              <span>Verificación de auditoría registrada exitosamente en la bitácora.</span>
            </div>
          )}
        </div>

        {/* Historial de Auditorías Registradas (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Bitácora Histórica de Verificaciones ({auditLogs.length})
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Criterio QA: Muestreo de 25 evidencias / ciclo
            </span>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {auditLogs.map((log) => {
              const isAlert = log.status === 'alerta' || log.discrepancy > 10;
              return (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    isAlert
                      ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                      : 'bg-white border-slate-200 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {log.practiceName}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {log.week}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Auditor: <span className="font-medium text-slate-700">{log.auditor}</span> • {log.date}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border shrink-0 ${
                      isAlert
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {isAlert ? `Alerta (+${log.discrepancy}%)` : `Conforme (${log.discrepancy}%)`}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-600">
                      <span>Reportado: <strong className="text-slate-900">{log.reportedPercent}%</strong></span>
                      <span>Auditado: <strong className="text-slate-900">{log.auditedPercent}%</strong></span>
                      <span>Diferencia: <strong className={isAlert ? 'text-rose-600' : 'text-emerald-600'}>{log.discrepancy}%</strong></span>
                    </div>
                  </div>

                  {log.observations && (
                    <p className="mt-1.5 text-xs text-slate-600 italic bg-white/70 p-2 rounded border border-slate-200/60">
                      "{log.observations}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
