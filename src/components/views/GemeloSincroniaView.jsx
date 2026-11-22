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
  XCircle,
  Clock,
  Mail,
  Send,
  Power,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Lock,
  ChevronRight,
  Trash2,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  ArrowRight,
  Info,
  Check
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
  } = useSync();

  // 1. Estados para SECCIÓN 1: Mi Reporte para el Gemelo
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

  // 2. Estados para SECCIÓN 4: Consola de Reunión
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(() => {
    // Seleccionar por defecto un integrante distinto al activo
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

  // Manejar apertura de modal de correo
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

    // Registrar automáticamente en la bandeja de "Solicitudes y Cambios Sugeridos"
    addSuggestedRequest(result.generatedRequest);
  };

  // Cargar preset en la consola de reunión
  const handleSelectPreset = (preset) => {
    setInterventionText(preset.rawText);
    const matchedMember = teamMembers.find(m => m.name.toLowerCase().includes(preset.author.toLowerCase())) || teamMembers[0];
    setSelectedSpeakerId(matchedMember.id);
  };

  // Guardar minuta manual rotativa
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

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Encabezado del Módulo y Conmutador de Respaldo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Asistencia e Inteligencia Cultural
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Integración Asíncrona Global
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center space-x-2">
            <span>Gemelo de Sincronía</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Representación de integrantes ausentes por huso horario, traducción de intenciones culturales y candado estricto de gobernanza donde el humano siempre tiene la decisión final.
          </p>
        </div>

        {/* Interruptor de Modo Respaldo Manual */}
        <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm shrink-0">
          <div className="flex items-center space-x-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                twinAiEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            ></span>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800">
                {twinAiEnabled ? 'Motor de IA Activo' : 'Modo Respaldo Manual'}
              </div>
              <div className="text-[10px] text-slate-500">
                {twinAiEnabled ? 'Análisis local determinista' : 'Plan de contingencia operativo'}
              </div>
            </div>
          </div>

          <button
            onClick={toggleTwinAi}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
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

      {/* SECCIÓN 1: Mi Reporte para el Gemelo (Qué hice / Qué falta) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Mi Reporte para el Gemelo (Qué hice / Qué falta)
                </h3>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  {activeUser.name} · {activeUser.baseCity}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Define los avances y límites para que tu Gemelo represente fielmente tu jornada durante tu ausencia.
              </p>
            </div>
          </div>

          {/* Confirmación visual de sincronización */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Gemelo actualizado</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {currentMemberReport.lastUpdated}
            </span>
          </div>
        </div>

        {reportSavedNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center space-x-2.5 font-semibold transition-all">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Reporte guardado exitosamente. Tu Gemelo de Sincronía ahora cuenta con la información más reciente para representarte en reuniones.
            </span>
          </div>
        )}

        <form onSubmit={handleSaveReport} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Avances completados */}
            <div className="space-y-1.5">
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
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Pendientes Actuales (Qué falta):</span>
                <span className="text-[10px] text-amber-600 font-semibold">En curso</span>
              </label>
              <textarea
                value={formPendings}
                onChange={(e) => setFormPendings(e.target.value)}
                rows={4}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium leading-relaxed"
                placeholder="1. Validación con Backend de contratos GraphQL&#10;2. Cierre de cronograma..."
                required
              />
            </div>

            {/* Bloqueos o notas estratégicas */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Bloqueos o Notas para la Reunión:</span>
                <span className="text-[10px] text-indigo-600 font-semibold">Directrices del ausente</span>
              </label>
              <textarea
                value={formBlockers}
                onChange={(e) => setFormBlockers(e.target.value)}
                rows={4}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium leading-relaxed"
                placeholder="No aceptar nuevos módulos sin deliberación. Priorizar reducción de retrabajo."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Cualquier cambio guardado se reflejará de inmediato cuando otros integrantes consulten a tu Gemelo en sesiones asíncronas.
            </span>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center space-x-2"
            >
              <SaveIcon className="w-3.5 h-3.5" />
              <span>Guardar Reporte y Actualizar Gemelo</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: Resumen de Reuniones Recientes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Resumen de Reuniones Recientes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Minutas consolidadas por el Gemelo con participantes, acuerdos y cobertura de integrantes ausentes.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {recentMeetings.length > 0 ? (
              <button
                onClick={clearRecentMeetings}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center space-x-1"
                title="Limpiar historial de minutas recientes"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar historial</span>
              </button>
            ) : (
              <button
                onClick={restoreRecentMeetings}
                className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold transition-colors flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar reuniones</span>
              </button>
            )}
          </div>
        </div>

        {/* Estado vacío claro o lista de reuniones */}
        {recentMeetings.length === 0 ? (
          <div className="py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">Sin reuniones recientes</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              No se han registrado sesiones tácticas en este periodo. Cuando se efectúe una reunión asíncrona, el Gemelo archivará aquí su minuta automáticamente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentMeetings.map((meet) => (
              <div
                key={meet.id}
                className="rounded-xl border border-slate-200 p-4 bg-slate-50/40 hover:bg-white hover:border-indigo-200 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{meet.title}</h4>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-medium">{meet.date}</span>
                      <span>•</span>
                      <span>{meet.time}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                    Minuta validada
                  </span>
                </div>

                {/* Participantes y ausentes */}
                <div className="text-xs space-y-1 bg-white p-2.5 rounded-lg border border-slate-200/70">
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold">Presentes:</span>
                    <span className="text-slate-600 truncate">
                      {meet.participants.map(p => `${p.name} (${p.site})`).join(', ')}
                    </span>
                  </div>
                  {meet.coveredAbsentees && meet.coveredAbsentees.length > 0 && (
                    <div className="flex items-center space-x-1.5 text-indigo-700">
                      <Bot className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold">Cubiertos por Gemelo:</span>
                      <span className="text-indigo-900 truncate">
                        {meet.coveredAbsentees.map(a => `${a.name} (${a.site})`).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Puntos clave */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                    Puntos Clave y Acuerdos:
                  </span>
                  <ul className="space-y-1 pl-4 list-disc text-slate-600 text-[11px]">
                    {meet.agreements.map((agr, idx) => (
                      <li key={idx} className="leading-relaxed">{agr}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Aprobado por: <strong className="text-slate-600">{meet.verifiedByHuman}</strong></span>
                  <span className="text-indigo-600 font-semibold">Gobernanza activa</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECCIÓN 3: Solicitudes y Cambios Sugeridos (Aprobación Humana) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Solicitudes y Cambios Sugeridos (Aprobación Humana)
                </h3>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {pendingRequestsCount} Pendiente{pendingRequestsCount !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Regla inviolable: Todo ajuste, solicitud de nuevo módulo o traducción de tono requiere decisión humana explícita.
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
            Firma en curso: <span className="font-bold text-indigo-600">{activeUser.name}</span> ({activeUser.baseCity})
          </div>
        </div>

        {/* Tarjetas de Solicitud */}
        <div className="space-y-4">
          {suggestedRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic border border-dashed rounded-xl">
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
                  className={`rounded-2xl border p-5 transition-all ${
                    isApproved
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : isRejected
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : isPostponed
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  {/* Encabezado de la solicitud: quién la pidió y sede */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">
                          {req.requesterName} · <span className="text-indigo-600">{req.requesterSite}</span>
                        </span>
                        {req.isScopeChange && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                            Nuevo Módulo / Alcance
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
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

                  {/* Bloque de Traducción de Tono Cultural */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Mensaje Original en Sesión:
                      </span>
                      <p className="text-xs font-semibold text-slate-800 italic">
                        "{req.originalText}"
                      </p>
                      {req.interpretationRisk && (
                        <div className="text-[11px] text-amber-800 pt-1 flex items-start space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>Riesgo de interpretación: {req.interpretationRisk}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        Intención Real Descodificada:
                      </span>
                      <p className="text-xs font-bold text-indigo-950">
                        "{req.intendedMeaning}"
                      </p>
                      {req.culturalAdvice && (
                        <div className="text-[11px] text-slate-600 pt-1 flex items-start space-x-1">
                          <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>Pauta cultural: {req.culturalAdvice}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Respuesta formulada por el Gemelo */}
                  {req.gemeloResponse && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-0.5 mb-3">
                      <span className="font-bold text-indigo-700 text-[11px]">
                        Postura del Gemelo en la reunión:
                      </span>
                      <p className="italic text-slate-800">
                        "{req.gemeloResponse}"
                      </p>
                    </div>
                  )}

                  {/* Acciones de la Tarjeta de Solicitud (3 acciones obligatorias) */}
                  {isPending && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      {/* Acción 3: Rechazar / Posponer */}
                      <button
                        onClick={() => rejectSuggestedRequest(req.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                      >
                        Rechazar
                      </button>

                      <button
                        onClick={() => postponeSuggestedRequest(req.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-amber-700 transition-colors"
                      >
                        Posponer
                      </button>

                      {/* Acción 2: Solicitar más detalles (Correo) */}
                      <button
                        onClick={() => handleOpenEmailModal(req)}
                        className="px-3.5 py-1.5 rounded-xl border border-indigo-200 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center space-x-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Solicitar más detalles (Correo)</span>
                      </button>

                      {/* Acción 1: Confirmar / Aprobar */}
                      <button
                        onClick={() => approveSuggestedRequest(req.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
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
                        <span>Aprobado por: {req.approvedBy} a las {req.approvedAt}</span>
                      </span>
                      <button
                        onClick={() => setCurrentView('tablero-valor')}
                        className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 text-xs"
                      >
                        <span>Ver impacto en Tablero por Valor</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECCIÓN 4: Consola de Reunión y Modo Respaldo Manual */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Consola de Reunión y Modo Respaldo Manual
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingresa intervenciones de otros integrantes para verificar la respuesta del Gemelo y la protección estricta del alcance.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Representando a: <strong className="text-indigo-700">{activeUser.name}</strong> ({activeUser.baseCity})
          </span>
        </div>

        {/* Consola Interactiva (cuando el motor IA está activo) */}
        {twinAiEnabled ? (
          <div className="space-y-4">
            {/* Presets rápidos */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
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
            <form onSubmit={handleProcessIntervention} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Selector de quién habla y su sede */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quién habla en la reunión:
                  </label>
                  <select
                    value={selectedSpeakerId}
                    onChange={(e) => setSelectedSpeakerId(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-1 focus:ring-indigo-500"
                  >
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} · {member.baseCity} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Texto de intervención */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Intervención planteada:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={interventionText}
                      onChange={(e) => setInterventionText(e.target.value)}
                      placeholder="Escribe o selecciona una frase..."
                      className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-medium focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center space-x-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Procesar en Reunión</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Resultado de la interacción en vivo */}
            {lastConsoleInteraction && (
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3 transition-all">
                <div className="flex items-center justify-between text-xs border-b border-indigo-100 pb-2">
                  <span className="font-bold text-indigo-950">
                    Intervención recibida de: {lastConsoleInteraction.speakerName} ({lastConsoleInteraction.speakerSite})
                  </span>
                  <span className="text-[11px] text-indigo-700 font-semibold">
                    Registrado en Solicitudes Sugeridas a las {lastConsoleInteraction.timestamp}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">
                      Intervención original:
                    </span>
                    <p className="italic text-slate-800 mt-0.5">
                      "{lastConsoleInteraction.rawText}"
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-indigo-200">
                    <span className="font-bold text-indigo-700 text-[10px] uppercase flex items-center space-x-1">
                      <Bot className="w-3 h-3" />
                      <span>Respuesta formulada por el Gemelo de Sincronía:</span>
                    </span>
                    <p className="font-semibold text-indigo-950 mt-1 leading-relaxed">
                      "{lastConsoleInteraction.gemeloReply}"
                    </p>
                  </div>

                  {lastConsoleInteraction.analysis?.isScopeChange && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[11px] font-semibold flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        Candado de gobernanza activado: La solicitud de cambio de alcance fue denegada automáticamente y canalizada a la bandeja de Solicitudes y Cambios Sugeridos.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MODO RESPALDO MANUAL (Protocolo Rotativo) */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <span className="font-bold flex items-center space-x-1.5">
                <Power className="w-4 h-4 text-amber-600" />
                <span>Protocolo de Respaldo Manual Activo</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                El motor automático se encuentra pausado. En este modo de contingencia, las minutas y acuerdos son registrados manualmente por el integrante en turno garantizando la continuidad operativa.
              </p>
            </div>

            {manualSavedNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center space-x-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Minuta manual registrada bajo la firma de {activeUser.name}.</span>
              </div>
            )}

            <form onSubmit={handleSaveManualSummary} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Puntos Clave Discutidos:
                  </label>
                  <textarea
                    value={manualKeyPoints}
                    onChange={(e) => setManualKeyPoints(e.target.value)}
                    rows={3}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Resumen de temas tratados en la reunión..."
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
                    rows={3}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Compromisos y resoluciones acordadas..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Próximas Acciones y Criterios:
                </label>
                <input
                  type="text"
                  value={manualNextActions}
                  onChange={(e) => setManualNextActions(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Acciones asignadas con responsable y fecha límite..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  Responsable en turno: <strong>{activeUser.name}</strong> ({activeUser.baseCity})
                </span>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Archivar Minuta Manual</span>
                </button>
              </div>
            </form>

            {/* Lista de minutas manuales registradas */}
            {manualSummaries.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 uppercase">
                  Minutas de Respaldo Manual Registradas:
                </span>
                <div className="space-y-2">
                  {manualSummaries.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>Registrada por: {m.authorName} ({m.authorCity})</span>
                        <span className="text-[10px] text-slate-500">{m.date} - {m.timestamp}</span>
                      </div>
                      <p className="text-slate-700"><strong>Puntos:</strong> {m.keyPoints}</p>
                      <p className="text-indigo-900 font-semibold"><strong>Acuerdos:</strong> {m.decisions}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: Solicitar más detalles (Correo) */}
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

// Icono auxiliar para guardar
function SaveIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}
