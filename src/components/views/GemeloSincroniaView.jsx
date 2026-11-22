import React, { useState } from 'react';
import { useSync } from '../../context/SyncContext';
import {
  CULTURAL_PRESETS,
  ABSENT_MEMBER_REPORT,
  analyzeCulturalTone
} from '../../services/gemeloService';
import {
  Bot,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit3,
  Power,
  RotateCcw,
  Send,
  AlertTriangle,
  FileText,
  UserCheck,
  Lock,
  ArrowRight,
  Sparkles,
  ClipboardList,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function GemeloSincroniaView() {
  const {
    activeUser,
    twinAiEnabled,
    toggleTwinAi,
    pendingProposals,
    approveProposal,
    rejectProposal,
    addProposal,
    pendingScopeRequests,
    addScopeRequest,
    manualSummaries,
    addManualSummary,
    sessionMinutes,
    approveSessionMinutes,
    setCurrentView,
  } = useSync();

  // Estados del Traductor de Tono Cultural
  const [inputText, setInputText] = useState(CULTURAL_PRESETS[0].rawText);
  const [originSite, setOriginSite] = useState(CULTURAL_PRESETS[0].originSite);
  const [analysisResult, setAnalysisResult] = useState(() =>
    analyzeCulturalTone(CULTURAL_PRESETS[0].rawText, CULTURAL_PRESETS[0].originSite)
  );

  // Estados para edición inline en el candado humano
  const [editingProposalId, setEditingProposalId] = useState(null);
  const [editedResponse, setEditedResponse] = useState('');

  // Estados para formulario de resumen manual rotativo
  const [manualKeyPoints, setManualKeyPoints] = useState('');
  const [manualDecisions, setManualDecisions] = useState('');
  const [manualNextActions, setManualNextActions] = useState('');
  const [manualSavedNotice, setManualSavedNotice] = useState(false);

  // Notificación de acción humana
  const [statusNotification, setStatusNotification] = useState(null);

  // Manejar cambio en preset
  const handleSelectPreset = (preset) => {
    setInputText(preset.rawText);
    setOriginSite(preset.originSite);
    const result = analyzeCulturalTone(preset.rawText, preset.originSite);
    setAnalysisResult(result);
  };

  // Analizar texto libre o modificado
  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const result = analyzeCulturalTone(inputText, originSite);
    setAnalysisResult(result);

    // Si es cambio de alcance no autorizado, registrarlo en la bandeja de alcance
    if (result.isScopeChange) {
      addScopeRequest({
        requester: `${activeUser.name} (${activeUser.baseCity})`,
        originSite,
        requestedScope: inputText,
        gemeloResponse: result.autoReply,
      });
      setStatusNotification({
        type: 'warning',
        title: 'Candado de Gobernanza Activado',
        message: 'El Gemelo denegó el compromiso de nuevo alcance y lo canalizó a la bandeja de Aprobación Humana.',
      });
      setTimeout(() => setStatusNotification(null), 6000);
    }
  };

  // Transferir análisis al Candado de Aprobación Humana
  const handleTransferToApproval = () => {
    if (!analysisResult) return;

    if (analysisResult.isScopeChange) {
      addScopeRequest({
        requester: `${activeUser.name} (${activeUser.baseCity})`,
        originSite,
        requestedScope: analysisResult.originalText,
        gemeloResponse: analysisResult.autoReply,
      });
      setStatusNotification({
        type: 'warning',
        title: 'Solicitud de Alcance Registrada',
        message: 'Canalizada a la bandeja de decisiones directivas sin compromiso automático.',
      });
    } else {
      addProposal({
        title: `Interpretación Intercultural (${originSite.toUpperCase()})`,
        originSite,
        author: `${activeUser.name} (${activeUser.baseCity})`,
        originalText: analysisResult.originalText,
        intendedMeaning: analysisResult.intendedMeaning,
        riskLevel: analysisResult.riskLevel,
        interpretationRisk: analysisResult.interpretationRisk,
        proposedResponse: analysisResult.proposedResponse,
        targetCardId: analysisResult.targetCardId || 'card-1',
      });
      setStatusNotification({
        type: 'success',
        title: 'Propuesta Enviada al Candado Humano',
        message: 'Se requiere la firma explícita de un integrante para validar la respuesta y actualizar el tablero.',
      });
    }
    setTimeout(() => setStatusNotification(null), 6000);
  };

  // Manejar aprobación humana
  const handleApprove = (proposalId, customText = null) => {
    approveProposal(proposalId, customText);
    setEditingProposalId(null);
    setStatusNotification({
      type: 'success',
      title: 'Aprobación Humana Registrada',
      message: `Decisión refrendada por ${activeUser.name}. Se sincronizó el estado en el Tablero por Valor.`,
    });
    setTimeout(() => setStatusNotification(null), 6000);
  };

  // Guardar resumen manual rotativo
  const handleSaveManualSummary = (e) => {
    e.preventDefault();
    if (!manualKeyPoints.trim() || !manualDecisions.trim()) return;

    addManualSummary({
      keyPoints: manualKeyPoints,
      decisions: manualDecisions,
      nextActions: manualNextActions || 'Revisión en el siguiente ciclo asíncrono.',
    });

    setManualKeyPoints('');
    setManualDecisions('');
    setManualNextActions('');
    setManualSavedNotice(true);
    setTimeout(() => setManualSavedNotice(false), 5000);
  };

  const pendingCount = pendingProposals.filter(p => p.status === 'pending').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Banner de Notificación */}
      {statusNotification && (
        <div
          className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
            statusNotification.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          {statusNotification.type === 'warning' ? (
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h4 className="font-bold text-sm">{statusNotification.title}</h4>
            <p className="text-xs mt-0.5">{statusNotification.message}</p>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Encabezado del Módulo y Conmutador de Respaldo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            Asistencia e Inteligencia Cultural
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Gemelo de Sincronía
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Cobertura activa de ausencias entre husos horarios, traducción de intenciones culturales y candado estricto de aprobación humana.
          </p>
        </div>

        {/* Interruptor de Modo Respaldo Manual */}
        <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-xl p-2.5 px-3.5 shadow-sm">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                twinAiEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            ></span>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800">
                {twinAiEnabled ? 'Motor de IA Activo' : 'Modo Respaldo Manual'}
              </div>
              <div className="text-[10px] text-slate-500">
                {twinAiEnabled ? 'Análisis local determinista' : 'Plan de contingencia activado'}
              </div>
            </div>
          </div>

          <button
            onClick={toggleTwinAi}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              twinAiEnabled
                ? 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Conmutar entre asistencia de IA y bitácora manual rotativa"
          >
            <Power className="w-3.5 h-3.5" />
            <span>{twinAiEnabled ? 'Activar Respaldo Manual' : 'Restaurar Motor IA'}</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: Cobertura de Ausencia y Consola de Minuta Estructurada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Cobertura de Ausencia */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cobertura de Ausencia por Huso Horario
                </h3>
                <span className="text-xs text-slate-500">
                  {ABSENT_MEMBER_REPORT.name} • {ABSENT_MEMBER_REPORT.site} ({ABSENT_MEMBER_REPORT.timezone})
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              {ABSENT_MEMBER_REPORT.currentStatus}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Avances reportados */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
              <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Entregables Completados en su Jornada:</span>
              </span>
              <ul className="space-y-1 pl-5 text-emerald-800 list-disc">
                {ABSENT_MEMBER_REPORT.completedAdvances.map((adv, idx) => (
                  <li key={idx} className="leading-relaxed">{adv}</li>
                ))}
              </ul>
            </div>

            {/* Pendientes y Bloqueos */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1.5">
              <span className="font-bold text-amber-900 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pendientes Clave y Criterios Requeridos:</span>
              </span>
              <ul className="space-y-1 pl-5 text-amber-800 list-disc">
                {ABSENT_MEMBER_REPORT.pendingItems.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            {/* Directrices permanentes */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
              <span className="font-bold text-slate-700">Directrices fijadas por el ausente:</span>
              <ul className="space-y-0.5 pl-4 list-disc text-[11px]">
                {ABSENT_MEMBER_REPORT.standingGuardrails.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Consola de Minuta Estructurada en Tiempo Real */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Consola de Minuta Estructurada
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  sessionMinutes.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {sessionMinutes.status === 'published' ? 'Minuta Validada' : 'Borrador en Proceso'}
              </span>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-800">{sessionMinutes.sessionTitle}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Presentes: {sessionMinutes.participantsPresent.join(', ')}
                </p>
                <p className="text-[11px] text-indigo-600 font-medium">
                  Cubiertos por Gemelo: {sessionMinutes.coveredAbsent.join(', ')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700">Acuerdos Principales de la Sesión:</span>
                <ul className="space-y-1 pl-4 list-disc text-slate-600 text-[11px]">
                  {sessionMinutes.keyDecisions.map((dec, idx) => (
                    <li key={idx}>{dec}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-700">Compromisos Asignados:</span>
                <div className="space-y-1.5">
                  {sessionMinutes.actionItems.map((act) => (
                    <div
                      key={act.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]"
                    >
                      <span className="font-medium text-slate-800">{act.task}</span>
                      <span className="text-slate-500 ml-2 shrink-0">
                        {act.owner} ({act.site})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 italic">
              {sessionMinutes.status === 'published'
                ? `Firmada por: ${sessionMinutes.approvedBy}`
                : 'Requiere validación humana para archivado oficial'}
            </span>
            {sessionMinutes.status !== 'published' && (
              <button
                onClick={approveSessionMinutes}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors shadow-sm flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Firmar y Publicar Minuta</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Traductor de Tono Cultural */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Traductor de Tono Cultural
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Descodificación de supuestos culturales entre alto contexto (Tokio), bajo contexto (Berlín) y agilidad (Guadalajara).
            </p>
          </div>

          {/* Selector de Presets Frecuentes */}
          <div className="flex flex-wrap gap-2">
            {CULTURAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  inputText === preset.rawText
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {preset.label.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Formulario de Entrada y Análisis */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mensaje Entrante a Procesar:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={2}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 font-medium"
                placeholder="Ingresa cualquier expresión de trabajo..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sede de Origen:
              </label>
              <select
                value={originSite}
                onChange={(e) => setOriginSite(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                <option value="tokio">Tokio (Japón)</option>
                <option value="berlin">Berlín (Alemania)</option>
                <option value="guadalajara">Guadalajara (México)</option>
              </select>

              <button
                type="submit"
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analizar Tono</span>
              </button>
            </div>
          </div>
        </form>

        {/* Panel de Resultados del Análisis */}
        {analysisResult && (
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/70 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">Resultado del Diagnóstico:</span>
                <span className="text-xs font-semibold text-slate-500">
                  {analysisResult.culturalStyle || 'Evaluación de Gobernanza'}
                </span>
              </div>

              {/* Badge de Riesgo y Semáforo */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600">Semáforo Sugerido:</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    analysisResult.riskLevel === 'rojo'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : analysisResult.riskLevel === 'amarillo'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {analysisResult.riskLevel}
                </span>
              </div>
            </div>

            {/* Comparativa: Mensaje Original vs Intención Real */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Mensaje Original:
                </span>
                <p className="text-sm font-semibold text-slate-800 italic">
                  "{analysisResult.originalText}"
                </p>
                <div className="text-[11px] text-amber-700 font-medium pt-1">
                  ⚠️ Riesgo de interpretación: {analysisResult.interpretationRisk}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">
                  Intención Real Estructurada:
                </span>
                <p className="text-sm font-bold text-indigo-950">
                  "{analysisResult.intendedMeaning}"
                </p>
                <div className="text-[11px] text-slate-600 pt-1">
                  💡 Criterio: {analysisResult.culturalAdvice}
                </div>
              </div>
            </div>

            {/* Propuesta de respuesta y acción */}
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1 flex-1">
                <span className="text-xs font-bold text-indigo-900">
                  {analysisResult.isScopeChange
                    ? 'Respuesta Automática de Bloqueo:'
                    : 'Propuesta de Respuesta Formulada:'}
                </span>
                <p className="text-xs text-indigo-800">
                  {analysisResult.isScopeChange
                    ? analysisResult.autoReply
                    : analysisResult.proposedResponse}
                </p>
              </div>

              <button
                onClick={handleTransferToApproval}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Transferir a Aprobación Humana</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 3: Candado de Aprobación Humana ("El humano siempre aprueba") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Candado de Aprobación Humana
              </h3>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                {pendingCount} Pendiente{pendingCount !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Gobernanza corporativa: Ningún mensaje ni compromiso sale del sistema sin firma explícita de un integrante del equipo.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            Firma en curso: <span className="font-bold text-indigo-600">{activeUser.name}</span> ({activeUser.baseCity})
          </div>
        </div>

        {/* Lista de Propuestas de Sincronía Pendientes */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Propuestas de Comunicación y Sincronía con Tablero:
          </h4>

          {pendingProposals.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay propuestas pendientes en la bandeja.</p>
          ) : (
            <div className="space-y-3">
              {pendingProposals.map((prop) => {
                const isPending = prop.status === 'pending';
                const isApproved = prop.status === 'approved';
                const isEditing = editingProposalId === prop.id;

                return (
                  <div
                    key={prop.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isApproved
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : prop.status === 'rejected'
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 shadow-sm ring-1 ring-slate-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="font-bold text-sm text-slate-900">{prop.title}</h5>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                              prop.riskLevel === 'rojo'
                                ? 'bg-rose-100 text-rose-700'
                                : prop.riskLevel === 'amarillo'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            Semáforo {prop.riskLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Origen: {prop.author} • Destino vinculado: Tablero por Valor
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : prop.status === 'rejected'
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isApproved ? 'Aprobado y Sincronizado' : prop.status === 'rejected' ? 'Rechazado' : 'Requiere Aprobación'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs my-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <div>
                        <span className="font-bold text-slate-500 text-[10px] uppercase">Mensaje Original:</span>
                        <p className="text-slate-700 italic mt-0.5">"{prop.originalText}"</p>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-600 text-[10px] uppercase">Intención Real:</span>
                        <p className="text-slate-900 font-semibold mt-0.5">"{prop.intendedMeaning}"</p>
                      </div>
                    </div>

                    {/* Respuesta sugerida o en edición */}
                    <div className="text-xs mb-3">
                      <span className="font-bold text-slate-700">Respuesta acordada para el equipo:</span>
                      {isEditing ? (
                        <div className="mt-1 space-y-2">
                          <textarea
                            value={editedResponse}
                            onChange={(e) => setEditedResponse(e.target.value)}
                            rows={2}
                            className="w-full text-xs p-2 bg-white border border-indigo-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(prop.id, editedResponse)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1 rounded-lg"
                            >
                              Guardar y Aprobar
                            </button>
                            <button
                              onClick={() => setEditingProposalId(null)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1 rounded-lg"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                          {prop.finalText || prop.proposedResponse}
                        </p>
                      )}
                    </div>

                    {/* Botones de acción del candado */}
                    {isPending && !isEditing && (
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => rejectProposal(prop.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => {
                            setEditingProposalId(prop.id);
                            setEditedResponse(prop.proposedResponse);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center space-x-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleApprove(prop.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-colors shadow-sm flex items-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aprobar y Sincronizar con Tablero</span>
                        </button>
                      </div>
                    )}

                    {isApproved && (
                      <div className="flex items-center justify-between text-[11px] text-emerald-800 pt-2 border-t border-emerald-100">
                        <span>Aprobado por: <strong>{prop.approvedBy}</strong></span>
                        <button
                          onClick={() => setCurrentView('tablero-valor')}
                          className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                        >
                          <span>Ver actualización en Tablero</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bandeja de Cambios de Alcance No Autorizados (Retenidos) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Bandeja de Solicitudes de Alcance Retenidas ({pendingScopeRequests.length}):
            </h4>
            <span className="text-[11px] text-slate-400">
              El Gemelo nunca se compromete automáticamente
            </span>
          </div>

          {pendingScopeRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950">
                  Petición de: {req.requester}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-300">
                  En espera de deliberación humana
                </span>
              </div>
              <p className="text-slate-700 font-medium italic">
                "{req.requestedScope}"
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-amber-200 text-[11px] text-amber-900 font-semibold">
                🛡️ Respuesta del Gemelo: "{req.gemeloResponse}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 4: Bitácora de Respaldo Manual (Visible siempre como auditoría) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Protocolo de Respaldo Manual Rotativo
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Responsable en turno: {activeUser.name} ({activeUser.baseCity})
          </span>
        </div>
        <p className="text-xs text-slate-500">
          En caso de indisponibilidad técnica o interrupción del asistente, el equipo continúa registrando acuerdos y decisiones sin perder la trazabilidad.
        </p>

        {manualSavedNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center space-x-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Resumen manual archivado correctamente bajo la firma de {activeUser.name}.</span>
          </div>
        )}

        <form onSubmit={handleSaveManualSummary} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Puntos Clave Discutidos:
              </label>
              <textarea
                value={manualKeyPoints}
                onChange={(e) => setManualKeyPoints(e.target.value)}
                rows={2}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500"
                placeholder="Resumen de temas tratados..."
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Acuerdos y Decisiones Ratificadas:
              </label>
              <textarea
                value={manualDecisions}
                onChange={(e) => setManualDecisions(e.target.value)}
                rows={2}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500"
                placeholder="Decisiones obligatorias tomadas..."
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Se preservan intactas todas las decisiones previas.
            </span>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Registrar Bitácora Manual</span>
            </button>
          </div>
        </form>

        {/* Historial de bitácoras manuales */}
        {manualSummaries.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Bitácoras Manuales Registradas ({manualSummaries.length}):
            </span>
            <div className="space-y-2">
              {manualSummaries.map((sum) => (
                <div
                  key={sum.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Autor: {sum.authorName} ({sum.authorCity})</span>
                    <span className="text-slate-400 font-normal">{new Date(sum.timestamp).toLocaleTimeString('es-ES')}</span>
                  </div>
                  <p className="text-slate-600"><strong>Puntos:</strong> {sum.keyPoints}</p>
                  <p className="text-slate-600"><strong>Decisiones:</strong> {sum.decisions}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
