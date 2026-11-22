import React, { useState, useEffect } from 'react';
import { useSync } from '../../context/SyncContext';
import {
  CULTURAL_PRESETS,
  processMeetingIntervention
} from '../../services/gemeloService';
import {
  Bot,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Send,
  Power,
  RotateCcw,
  ShieldCheck,
  Lock,
  ChevronRight,
  Trash2,
  Calendar,
  Users,
  FileText,
  Info,
  Check,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function GemeloSincroniaView() {
  const {
    activeUser,
    activeUserId,
    teamMembers,
    userReports,
    saveUserReport,
    recentMeetings,
    clearRecentMeetings,
    restoreRecentMeetings,
    suggestedRequests,
    addSuggestedRequest,
    approveSuggestedRequest,
    rejectSuggestedRequest,
    postponeSuggestedRequest,
    twinAiEnabled,
    toggleTwinAi,
    manualSummaries,
    addManualSummary,
    setCurrentView,
    meetings,
    updateMeetingAttendance,
    setIsMeetingsDrawerOpen,
  } = useSync();

  // Pestañas internas del módulo
  const [activeTab, setActiveTab] = useState('solicitudes'); // 'solicitudes' | 'reporte' | 'minutas-consola'

  // 1. Estados para Reporte del Gemelo
  const currentMemberReport = userReports[activeUserId] || {
    advances: '',
    pendings: '',
    blockers: '',
    lastUpdated: 'Sin registros previos',
  };

  const [formAdvances, setFormAdvances] = useState(currentMemberReport.advances);
  const [formPendings, setFormPendings] = useState(currentMemberReport.pendings);
  const [formBlockers, setFormBlockers] = useState(currentMemberReport.blockers);
  const [reportSavedNotice, setReportSavedNotice] = useState(false);

  // Sincronizar campos al cambiar de usuario activo en la TopBar
  useEffect(() => {
    const rep = userReports[activeUserId] || {
      advances: '',
      pendings: '',
      blockers: '',
      lastUpdated: 'Sin registros previos',
    };
    setFormAdvances(rep.advances);
    setFormPendings(rep.pendings);
    setFormBlockers(rep.blockers);
    setReportSavedNotice(false);
  }, [activeUserId, userReports]);

  const handleSaveReport = (e) => {
    e.preventDefault();
    saveUserReport(activeUserId, {
      advances: formAdvances,
      pendings: formPendings,
      blockers: formBlockers,
    });
    setReportSavedNotice(true);
    setTimeout(() => setReportSavedNotice(false), 4000);
  };

  // 2. Estados para Consola de Reunión
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(() => {
    const other = teamMembers.find(m => m.id !== activeUserId) || teamMembers[0];
    return other.id;
  });
  const [interventionText, setInterventionText] = useState(CULTURAL_PRESETS[2].rawText);
  const [lastConsoleInteraction, setLastConsoleInteraction] = useState(null);

  // Estados para Modo Respaldo Manual
  const [manualKeyPoints, setManualKeyPoints] = useState('');
  const [manualDecisions, setManualDecisions] = useState('');
  const [manualNextActions, setManualNextActions] = useState('');
  const [manualSavedNotice, setManualSavedNotice] = useState(false);

  // 3. Estados para Modal de Redacción de Correo (Acción: Solicitar más detalles)
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [activeEmailTarget, setActiveEmailTarget] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  const handleOpenEmailModal = (req) => {
    setActiveEmailTarget(req);
    setEmailSubject(`SYNC 2030: Consulta sobre requerimiento — "${req.originalText.slice(0, 32)}..."`);
    setEmailBody(
      `Hola ${req.requesterName},\n\nDurante la sesión de sincronía asíncrona se registró el siguiente planteamiento:\n"${req.originalText}"\n\nConforme a los criterios de gobernanza de SYNC 2030, requerimos detallar los criterios de aceptación técnicos y validar el impacto en el sprint antes de proceder con su aprobación formal en el Tablero por Valor.\n\n¿Podrías compartirnos los requerimientos específicos o si prefieres agendar una breve alineación asíncrona?\n\nSaludos cordiales,\n${activeUser.name}\n${activeUser.baseCity} — SYNC 2030`
    );
    setEmailModalOpen(true);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setEmailSentNotice(true);
    setTimeout(() => {
      setEmailSentNotice(false);
      setEmailModalOpen(false);
    }, 1800);
  };

  // Procesar intervención en la consola de reunión
  const handleProcessIntervention = (e) => {
    e.preventDefault();
    if (!interventionText.trim()) return;

    const speaker = teamMembers.find(m => m.id === selectedSpeakerId) || teamMembers[0];
    const originSiteKey = speaker.baseCity.toLowerCase().includes('tokio')
      ? 'tokio'
      : speaker.baseCity.toLowerCase().includes('berl')
      ? 'berlin'
      : 'guadalajara';

    const result = processMeetingIntervention({
      speaker,
      originSite: originSiteKey,
      rawText: interventionText,
      activeUser,
      userReport: userReports[activeUserId],
    });

    setLastConsoleInteraction({
      speakerName: speaker.name,
      speakerSite: speaker.baseCity,
      rawText: interventionText,
      gemeloReply: result.gemeloResponseText,
      analysis: result.analysis,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    });

    // Registrar en la bandeja de "Solicitudes y Cambios Sugeridos"
    addSuggestedRequest(result.generatedRequest);
  };

  const handleSelectPreset = (preset) => {
    setInterventionText(preset.rawText);
    const matchedMember = teamMembers.find(m => m.name.toLowerCase().includes(preset.author.toLowerCase())) || teamMembers[0];
    setSelectedSpeakerId(matchedMember.id);
  };

  const handleSaveManualSummary = (e) => {
    e.preventDefault();
    if (!manualKeyPoints.trim() || !manualDecisions.trim()) return;

    addManualSummary({
      keyPoints: manualKeyPoints,
      decisions: manualDecisions,
      nextActions: manualNextActions || 'Seguimiento en la próxima jornada asíncrona.',
    });

    setManualKeyPoints('');
    setManualDecisions('');
    setManualNextActions('');
    setManualSavedNotice(true);
    setTimeout(() => setManualSavedNotice(false), 4000);
  };

  const pendingRequestsCount = suggestedRequests.filter(r => r.status === 'pending').length;

  // Reuniones delegadas al Gemelo por el usuario activo
  const delegatedMeetings = meetings.filter(
    (m) => m.attendees && m.attendees[activeUserId] === 'delegated_twin'
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Encabezado del Módulo y Conmutador de Respaldo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Asistencia e Inteligencia Cultural
            </span>
            <span className="text-xs text-slate-500">
              Sincronía Asíncrona Global
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2">
            <span>Gemelo de Sincronía</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Cobertura de ausencias por huso horario, traducción de intenciones culturales y candado inviolable de aprobación humana.
          </p>
        </div>

        {/* Interruptor de Modo Respaldo Manual */}
        <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm shrink-0">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                twinAiEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            ></span>
            <div className="text-left text-xs">
              <span className="font-bold text-slate-800 block">
                {twinAiEnabled ? 'Motor de IA Activo' : 'Modo Respaldo Manual'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {twinAiEnabled ? 'Análisis local determinista' : 'Plan de contingencia'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleTwinAi}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs ${
              twinAiEnabled
                ? 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Conmutar entre asistencia de IA y bitácora manual rotativa"
          >
            <Power className="w-3.5 h-3.5" />
            <span>{twinAiEnabled ? 'Activar Respaldo' : 'Restaurar IA'}</span>
          </button>
        </div>
      </div>

      {/* Navegación por 3 Pestañas Internas Limpias */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        {/* Pestaña 1: Solicitudes y Aprobaciones */}
        <button
          onClick={() => setActiveTab('solicitudes')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'solicitudes'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Solicitudes y Aprobaciones</span>
          {pendingRequestsCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        {/* Pestaña 2: Mi Reporte al Gemelo */}
        <button
          onClick={() => setActiveTab('reporte')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'reporte'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Mi Reporte al Gemelo</span>
          {delegatedMeetings.length > 0 && (
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {delegatedMeetings.length} del.
            </span>
          )}
        </button>

        {/* Pestaña 3: Minutas y Consola */}
        <button
          onClick={() => setActiveTab('minutas-consola')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'minutas-consola'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Minutas y Consola</span>
        </button>
      </div>

      {/* PESTAÑA 1: Solicitudes y Aprobaciones */}
      {activeTab === 'solicitudes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Candado Inviolable:</strong> El Gemelo no compromete alcance ni módulos nuevos en reuniones. Todo cambio requiere confirmación humana explícita.
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 shrink-0 hidden sm:inline">
              Firma: <strong className="text-indigo-600">{activeUser.name}</strong> ({activeUser.baseCity})
            </span>
          </div>

          {/* Listado de Solicitudes */}
          {suggestedRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic border border-dashed rounded-xl bg-white">
              No hay solicitudes pendientes en la bandeja de aprobación humana.
            </div>
          ) : (
            suggestedRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';
              const isRejected = req.status === 'rejected';
              const isPostponed = req.status === 'postponed';

              return (
                <div
                  key={req.id}
                  className={`rounded-2xl border p-5 transition-all text-xs space-y-3.5 ${
                    isApproved
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : isRejected
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : isPostponed
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  {/* Encabezado: Solicitante y Sede */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {req.requesterName} · <span className="text-indigo-600">{req.requesterSite}</span>
                        </span>
                        {req.isScopeChange && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                            Nuevo Módulo / Alcance
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                            req.riskLevel === 'rojo'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : req.riskLevel === 'amarillo'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          Semáforo {req.riskLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Registrado: {req.createdAt} • Contacto: {req.requesterEmail}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isRejected
                          ? 'bg-slate-200 text-slate-700'
                          : isPostponed
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {isApproved
                        ? 'Aprobado y Sincronizado'
                        : isRejected
                        ? 'Rechazado'
                        : isPostponed
                        ? 'Pospuesto'
                        : 'Requiere Aprobación Humana'}
                    </span>
                  </div>

                  {/* Bloque Traductor Cultural: Original vs Intención Real */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Mensaje Original en Sesión:
                      </span>
                      <p className="font-semibold text-slate-800 italic text-xs">
                        "{req.originalText}"
                      </p>
                      {req.interpretationRisk && (
                        <div className="text-[11px] text-amber-800 pt-0.5 flex items-start space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>Riesgo: {req.interpretationRisk}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                        Intención Real Descodificada:
                      </span>
                      <p className="font-bold text-indigo-950 text-xs">
                        "{req.intendedMeaning}"
                      </p>
                      {req.culturalAdvice && (
                        <div className="text-[11px] text-slate-600 pt-0.5 flex items-start space-x-1">
                          <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>Pauta: {req.culturalAdvice}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Respuesta del Gemelo en la Reunión */}
                  {req.gemeloResponse && (
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                      <span className="font-bold text-indigo-700 block mb-0.5">
                        Postura del Gemelo en la reunión:
                      </span>
                      <p className="italic text-slate-800">
                        "{req.gemeloResponse}"
                      </p>
                    </div>
                  )}

                  {/* Acciones Obligatorias: Confirmar / Solicitar detalles (Correo) / Rechazar */}
                  {isPending && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => rejectSuggestedRequest(req.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                      >
                        Rechazar
                      </button>

                      <button
                        onClick={() => postponeSuggestedRequest(req.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-amber-700 transition-colors"
                      >
                        Posponer
                      </button>

                      <button
                        onClick={() => handleOpenEmailModal(req)}
                        className="px-3 py-1.5 rounded-lg border border-indigo-200 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center space-x-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Solicitar detalles por correo</span>
                      </button>

                      <button
                        onClick={() => approveSuggestedRequest(req.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-colors shadow-sm flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmar / Aprobar</span>
                      </button>
                    </div>
                  )}

                  {isApproved && (
                    <div className="flex items-center justify-between text-xs text-emerald-800 pt-2 border-t border-emerald-100">
                      <span className="flex items-center space-x-1 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Aprobado por: {req.approvedBy} ({req.approvedAt})</span>
                      </span>
                      <button
                        onClick={() => setCurrentView('tablero-valor')}
                        className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 text-xs"
                      >
                        <span>Ver en Tablero por Valor</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* PESTAÑA 2: Mi Reporte al Gemelo */}
      {activeTab === 'reporte' && (
        <div className="space-y-6">
          {/* Formulario Editable de Reporte */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Reporte para el Gemelo: {activeUser.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sede: {activeUser.baseCity} ({activeUser.scope}) • Tu Gemelo usará estos datos si delegas una reunión.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Gemelo sincronizado</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {currentMemberReport.lastUpdated}
                </span>
              </div>
            </div>

            {reportSavedNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center space-x-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Reporte guardado exitosamente. Tu Gemelo de Sincronía ahora cuenta con la información más reciente para representarte en reuniones.
                </span>
              </div>
            )}

            <form onSubmit={handleSaveReport} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Avances completados */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Avances Completados (Qué hice):</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Entregables listos</span>
                  </label>
                  <textarea
                    value={formAdvances}
                    onChange={(e) => setFormAdvances(e.target.value)}
                    rows={4}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium leading-relaxed"
                    placeholder="1. Tokenización v2 completa&#10;2. Especificaciones de componentes..."
                    required
                  />
                </div>

                {/* Pendientes actuales */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Pendientes Actuales (Qué falta):</span>
                    <span className="text-[10px] text-amber-600 font-semibold">En curso</span>
                  </label>
                  <textarea
                    value={formPendings}
                    onChange={(e) => setFormPendings(e.target.value)}
                    rows={4}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium leading-relaxed"
                    placeholder="1. Validación de contratos GraphQL&#10;2. Cierre de cronograma..."
                    required
                  />
                </div>

                {/* Bloqueos o notas */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Bloqueos o Notas para el Gemelo:</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">Límites de alcance</span>
                  </label>
                  <textarea
                    value={formBlockers}
                    onChange={(e) => setFormBlockers(e.target.value)}
                    rows={4}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium leading-relaxed"
                    placeholder="No aceptar nuevos módulos sin deliberación previa."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">
                  La información guardada se usará fielmente si delegas una sesión a tu Gemelo de IA.
                </span>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Guardar Reporte y Actualizar Gemelo</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sección: Reuniones Delegadas al Gemelo */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Reuniones Delegadas a mi Gemelo ({delegatedMeetings.length})
                </h3>
              </div>
              <button
                onClick={() => setIsMeetingsDrawerOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
              >
                <span>Abrir bandeja de reuniones</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {delegatedMeetings.length === 0 ? (
              <div className="p-6 text-center border border-dashed rounded-xl bg-slate-50/50 text-slate-500 text-xs space-y-1">
                <Calendar className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">No tienes reuniones delegadas actualmente</p>
                <p className="text-[11px] text-slate-400">
                  Puedes delegar cualquier reunión a tu Gemelo desde el botón "Reuniones" en la barra superior.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Instrucción Activa de Representación:</strong> Tu Gemelo asistirá a las siguientes sesiones exponiendo tu reporte guardado (Avances y Pendientes). Cualquier requerimiento sobrevenido se canalizará a tu bandeja de Aprobación Humana.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {delegatedMeetings.map((meet) => {
                    const cityKey = activeUser.baseCity.toLowerCase().includes('tokio')
                      ? 'tokio'
                      : activeUser.baseCity.toLowerCase().includes('berl')
                      ? 'berlin'
                      : 'guadalajara';
                    const localTime = meet.localTimes?.[cityKey] || meet.utcTime;

                    return (
                      <div
                        key={meet.id}
                        className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 text-xs space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900">{meet.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Convocado por {meet.organizerName} · {meet.site}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
                            Gemelo Asignado
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-indigo-100">
                          <span className="font-semibold">Tu hora local: {localTime}</span>
                          <span className="font-mono text-slate-400">{meet.utcTime}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400">
                            Agenda: {meet.hasAgenda24h ? 'Validada ≥24h' : 'Sin agenda'}
                          </span>
                          <button
                            onClick={() => updateMeetingAttendance(meet.id, activeUserId, 'attending')}
                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                          >
                            Cambiar a: Asistir en vivo
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: Minutas y Consola */}
      {activeTab === 'minutas-consola' && (
        <div className="space-y-6">
          {/* SECCIÓN A: Resumen de Reuniones Recientes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Resumen de Reuniones Recientes
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                {recentMeetings.length > 0 ? (
                  <button
                    onClick={clearRecentMeetings}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center space-x-1"
                    title="Limpiar historial de minutas recientes"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpiar historial</span>
                  </button>
                ) : (
                  <button
                    onClick={restoreRecentMeetings}
                    className="px-2.5 py-1 rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold transition-colors flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restaurar reuniones</span>
                  </button>
                )}
              </div>
            </div>

            {/* Estado vacío claro con texto oficial */}
            {recentMeetings.length === 0 ? (
              <div className="py-10 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-1.5">
                <FileText className="w-8 h-8 text-slate-300" />
                <h4 className="text-xs font-bold text-slate-700">Sin reuniones recientes</h4>
                <p className="text-[11px] text-slate-500 max-w-sm">
                  No se han registrado sesiones tácticas en este periodo. Cuando se efectúe una reunión asíncrona, el Gemelo archivará aquí su minuta automáticamente.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recentMeetings.map((meet) => (
                  <div
                    key={meet.id}
                    className="rounded-xl border border-slate-200 p-4 bg-slate-50/40 hover:bg-white hover:border-indigo-200 transition-all text-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{meet.title}</h4>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span>{meet.date}</span>
                          <span>•</span>
                          <span>{meet.time}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.2 rounded-full border border-indigo-200">
                        Minuta validada
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1 bg-white p-2 rounded-lg border border-slate-200/70">
                      <div className="flex items-center space-x-1 text-slate-700 truncate">
                        <Users className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-semibold">Presentes:</span>
                        <span className="text-slate-600 truncate">
                          {meet.participants.map(p => `${p.name} (${p.site})`).join(', ')}
                        </span>
                      </div>
                      {meet.coveredAbsentees && meet.coveredAbsentees.length > 0 && (
                        <div className="flex items-center space-x-1 text-indigo-700 truncate">
                          <Bot className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="font-semibold">Cubiertos por Gemelo:</span>
                          <span className="text-indigo-900 truncate">
                            {meet.coveredAbsentees.map(a => `${a.name} (${a.site})`).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <span className="font-bold text-slate-700 text-[10px] uppercase">
                        Acuerdos:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                        {meet.agreements.map((agr, idx) => (
                          <li key={idx}>{agr}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Aprobado por: <strong>{meet.verifiedByHuman}</strong></span>
                      <span className="text-indigo-600 font-semibold">Gobernanza activa</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECCIÓN B: Consola Interactiva y Modo Respaldo Manual */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Consola Interactiva de Reunión
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Representando a: <strong className="text-indigo-700">{activeUser.name}</strong> ({activeUser.baseCity})
              </span>
            </div>

            {twinAiEnabled ? (
              <div className="space-y-4">
                {/* Presets interculturales */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                    Casos Típicos de Comunicación Intercultural:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {CULTURAL_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition-all"
                      >
                        <div className="text-[11px] font-bold text-slate-800 leading-tight">
                          {preset.label}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 italic truncate">
                          "{preset.rawText}"
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formulario de Intervención */}
                <form onSubmit={handleProcessIntervention} className="space-y-2 pt-1 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Quién habla en la reunión:
                      </label>
                      <select
                        value={selectedSpeakerId}
                        onChange={(e) => setSelectedSpeakerId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:ring-1 focus:ring-indigo-500"
                      >
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} · {member.baseCity} ({member.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Intervención planteada:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={interventionText}
                          onChange={(e) => setInterventionText(e.target.value)}
                          placeholder="Escribe o selecciona una frase..."
                          className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-medium focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center space-x-1 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Procesar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Resultado de la interacción */}
                {lastConsoleInteraction && (
                  <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-1.5 text-[11px]">
                      <span className="font-bold text-indigo-950">
                        Intervención de: {lastConsoleInteraction.speakerName} ({lastConsoleInteraction.speakerSite})
                      </span>
                      <span className="text-indigo-700">
                        Canalizado a Solicitudes ({lastConsoleInteraction.timestamp})
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-indigo-200">
                      <span className="font-bold text-indigo-700 text-[10px] uppercase flex items-center space-x-1">
                        <Bot className="w-3 h-3" />
                        <span>Respuesta formulada por el Gemelo:</span>
                      </span>
                      <p className="font-semibold text-indigo-950 mt-0.5 leading-relaxed">
                        "{lastConsoleInteraction.gemeloReply}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Modo Respaldo Manual */
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-bold flex items-center space-x-1.5">
                    <Power className="w-4 h-4 text-amber-600" />
                    <span>Protocolo de Respaldo Manual Activo</span>
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Motor automático pausado. Las minutas y acuerdos son registrados manualmente por el integrante en turno garantizando la continuidad operativa.
                  </p>
                </div>

                {manualSavedNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Minuta manual registrada por {activeUser.name}.</span>
                  </div>
                )}

                <form onSubmit={handleSaveManualSummary} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Puntos Clave:
                      </label>
                      <textarea
                        value={manualKeyPoints}
                        onChange={(e) => setManualKeyPoints(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                        placeholder="Resumen de temas tratados..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Acuerdos Ratificados:
                      </label>
                      <textarea
                        value={manualDecisions}
                        onChange={(e) => setManualDecisions(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                        placeholder="Resoluciones acordadas..."
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">
                      Responsable: <strong>{activeUser.name}</strong> ({activeUser.baseCity})
                    </span>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-colors shadow-sm flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Archivar Minuta Manual</span>
                    </button>
                  </div>
                </form>

                {manualSummaries.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-700 uppercase">
                      Minutas Manuales Registradas:
                    </span>
                    {manualSummaries.map((m) => (
                      <div key={m.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{m.authorName} ({m.authorCity})</span>
                          <span className="text-[10px] text-slate-400">{m.date} {m.timestamp}</span>
                        </div>
                        <p className="text-slate-600">Puntos: {m.keyPoints}</p>
                        <p className="text-indigo-900 font-semibold">Acuerdos: {m.decisions}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Solicitar más detalles por correo */}
      {emailModalOpen && activeEmailTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Solicitar Más Detalles por Correo
                </h3>
              </div>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {emailSentNotice ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Consulta enviada correctamente</h4>
                <p className="text-xs text-slate-500">
                  El mensaje fue programado hacia {activeEmailTarget.requesterName} ({activeEmailTarget.requesterSite}).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Destinatario (Para):
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${activeEmailTarget.requesterName} (${activeEmailTarget.requesterSite}) <${activeEmailTarget.requesterEmail}>`}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-600 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Asunto:
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cuerpo del mensaje:
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={6}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 font-medium focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    Sincronización asíncrona • SYNC 2030
                  </span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setEmailModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Consulta</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}