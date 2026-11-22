import React, { useState, useEffect } from 'react';
import { useSync } from '../../context/SyncContext';
import {
  getSiteTime,
  isSiteActive,
  formatLocalTime,
  formatLocalDate,
  calculateNextMorningDelivery,
  TIMEZONES
} from '../../utils/timezoneUtils';
import {
  Clock,
  Calendar,
  Shield,
  ShieldAlert,
  Send,
  Lock,
  Unlock,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

export default function PanelGlobalView() {
  const {
    sitesConfig,
    scheduleWeek,
    setScheduleWeek,
    rotatingSchedule,
    agendaState,
    toggleAgenda24h,
    simulationScenario,
    setSimulationScenario,
    antiFatigueMessages,
    sendAntiFatigueMessage,
    activeUser,
    teamMembers,
    immersiveRooms,
  } = useSync();

  // Pestaña activa interna
  const [activeTab, setActiveTab] = useState('jornadas'); // 'jornadas' | 'gobernanza'

  // Reloj local en tiempo real
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formulario interactivo del Escudo Anti-Fatiga
  const [targetSite, setTargetSite] = useState('tokio');
  const [recipient, setRecipient] = useState('Alan Gadiel');
  const [messageText, setMessageText] = useState('Por favor revisar los tokens del navbar cuando inicie tu jornada.');
  const [isUrgent, setIsUrgent] = useState(false);
  const [notification, setNotification] = useState(null);

  // Espacio inmersivo seleccionado
  const [selectedRoomId, setSelectedRoomId] = useState('alineacion');

  // Calcular hora base considerando perspectiva horaria
  const getSimulatedDate = () => {
    if (simulationScenario === 'tokyo-night') {
      const d = new Date();
      d.setUTCHours(18, 0, 0, 0);
      return d;
    }
    if (simulationScenario === 'berlin-night') {
      const d = new Date();
      d.setUTCHours(1, 0, 0, 0);
      return d;
    }
    if (simulationScenario === 'gdl-night') {
      const d = new Date();
      d.setUTCHours(5, 0, 0, 0);
      return d;
    }
    return now;
  };

  const simulatedDate = getSimulatedDate();

  // Estado de cada sede
  const tokyoTime = getSiteTime('tokio', simulatedDate);
  const berlinTime = getSiteTime('berlin', simulatedDate);
  const gdlTime = getSiteTime('guadalajara', simulatedDate);

  const siteTimes = {
    tokio: { date: tokyoTime, active: isSiteActive(tokyoTime) },
    berlin: { date: berlinTime, active: isSiteActive(berlinTime) },
    guadalajara: { date: gdlTime, active: isSiteActive(gdlTime) },
  };

  const currentRotating = rotatingSchedule.weeks[scheduleWeek];

  // Manejador del envío en el Escudo Anti-Fatiga
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const targetSiteActive = siteTimes[targetSite]?.active;

    // Regla del Escudo Anti-Fatiga: si NO es urgente y el destinatario está en DESCANSO, se difiere a la mañana
    const isDelayed = !isUrgent && !targetSiteActive;
    const scheduledDelivery = isDelayed
      ? calculateNextMorningDelivery(targetSite, simulatedDate)
      : 'Envío inmediato (En jornada laboral o marcado como urgente)';

    sendAntiFatigueMessage({
      targetSite,
      recipient,
      text: messageText,
      isUrgent,
      isDelayed,
      scheduledDelivery,
    });

    if (isDelayed) {
      setNotification({
        type: 'shield',
        title: 'Escudo Anti-Fatiga Activado — Entrega Programada',
        message: `El mensaje para ${recipient} (${TIMEZONES[targetSite]?.name}) fue retenido porque su sede está en horario de descanso. Se programó para: ${scheduledDelivery}`,
      });
    } else {
      setNotification({
        type: 'immediate',
        title: 'Mensaje Enviado Inmediatamente',
        message: `Entregado al destinatario en ${TIMEZONES[targetSite]?.name} sin diferimiento.`,
      });
    }

    setMessageText('');
    setTimeout(() => setNotification(null), 7000);
  };

  const selectedRoom = immersiveRooms.find(r => r.id === selectedRoomId) || immersiveRooms[0];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Banner Notificación temporal del Escudo */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-start space-x-3 transition-all ${
            notification.type === 'shield'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          {notification.type === 'shield' ? (
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs">
            <h4 className="font-bold">{notification.title}</h4>
            <p className="mt-0.5 leading-relaxed">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Encabezado del Módulo y Perspectiva Horaria */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Control Operativo
            </span>
            <span className="text-xs text-slate-500">
              Sincronía Continua en 3 Continentes
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Panel Global y Juntas Asíncronas
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Visibilidad horaria, rotación equitativa de juntas y gobernanza de salas.
          </p>
        </div>

        {/* Perspectiva Horaria */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold text-slate-600">Simulación:</span>
          <select
            value={simulationScenario}
            onChange={(e) => setSimulationScenario(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="real">Hora local de sistema</option>
            <option value="tokyo-night">Noche en Tokio (03:00 JST)</option>
            <option value="berlin-night">Noche en Berlín (02:00 CET)</option>
            <option value="gdl-night">Noche en Guadalajara (23:00 CST)</option>
          </select>
        </div>
      </div>

      {/* Navegación por Pestañas Internas */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('jornadas')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'jornadas'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jornadas y Horario Rotativo</span>
        </button>

        <button
          onClick={() => setActiveTab('gobernanza')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'gobernanza'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Gobernanza y Salas</span>
        </button>
      </div>

      {/* CONTENIDO PESTAÑA 1: Jornadas y Horario Rotativo */}
      {activeTab === 'jornadas' && (
        <div className="space-y-6">
          {/* Relojes en vivo por sede */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sitesConfig.map((site) => {
              const siteState = siteTimes[site.id];
              const localTimeStr = formatLocalTime(siteState.date);
              const localDateStr = formatLocalDate(siteState.date);
              const isActive = siteState.active;

              return (
                <div
                  key={site.id}
                  className={`rounded-2xl border p-5 transition-all shadow-sm ${
                    isActive
                      ? 'bg-white border-emerald-200 ring-1 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{site.flag}</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{site.name}</h3>
                        <span className="text-[11px] text-slate-500 font-medium">{site.utcLabel} • {site.focus}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1.5 ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700 border border-slate-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      <span>{isActive ? 'Jornada Activa' : 'Descanso'}</span>
                    </span>
                  </div>

                  <div className="my-3">
                    <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                      {localTimeStr}
                    </div>
                    <div className="text-xs text-slate-500 capitalize mt-0.5">
                      {localDateStr}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Horario laboral:</span>
                      <span className="font-medium text-slate-700">{site.workHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Embajador cultural:</span>
                      <span className="font-medium text-slate-700">{site.leadAmbassador}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Horario Rotativo de la Junta Semanal */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Horario Rotativo de la Junta Semanal (45 min)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Principio de sacrificio compartido: ninguna sede cede de forma consecutiva.
                </p>
              </div>

              {/* Selector de Semana A o Semana B */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setScheduleWeek('A')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    scheduleWeek === 'A'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semana A (12:00 UTC)
                </button>
                <button
                  onClick={() => setScheduleWeek('B')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    scheduleWeek === 'B'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semana B (13:00 UTC)
                </button>
              </div>
            </div>

            {/* Detalle de la semana seleccionada */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-600">🇲🇽 Guadalajara (UTC-6)</div>
                <div className="text-xl font-black text-slate-900 mt-1">
                  {currentRotating.times.guadalajara}
                </div>
                {scheduleWeek === 'A' && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Cede este ciclo (madruga 06:00)
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-600">🇩🇪 Berlín (UTC+1)</div>
                <div className="text-xl font-black text-slate-900 mt-1">
                  {currentRotating.times.berlin}
                </div>
                <span className="inline-block mt-2 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Compensa: Agenda 24h + Acta
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-600">🇯🇵 Tokio (UTC+9)</div>
                <div className="text-xl font-black text-slate-900 mt-1">
                  {currentRotating.times.tokio}
                </div>
                {scheduleWeek === 'B' && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Cede este ciclo (tarde noche 22:00)
                  </span>
                )}
              </div>
            </div>

            {/* Regla de compensación de Berlín */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex items-start space-x-2 text-xs text-indigo-950">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p>
                <strong>Regla de Equidad Cultural: </strong>
                {rotatingSchedule.compensationRule} {currentRotating.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: Gobernanza y Salas */}
      {activeTab === 'gobernanza' && (
        <div className="space-y-6">
          {/* Fila: Política de Agenda 24h y Escudo Anti-Fatiga */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tarjeta 1: Política de Agenda 24h */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Política de Agenda 24h
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Control de Agenda
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  La Sala de Alineación exige agenda validada con ≥24h de antelación para asegurar sesiones focalizadas y prevenir reuniones improductivas.
                </p>

                <div className="mt-4 p-4 rounded-xl border space-y-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Estado de la Agenda:</span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 ${
                        agendaState.published24hBefore
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {agendaState.published24hBefore ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Agenda Publicada ≥ 24h</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Sin Agenda Previa (Bloqueada)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div><strong>Título:</strong> {agendaState.title}</div>
                    <div><strong>Responsable:</strong> {agendaState.author}</div>
                    <div><strong>Temas:</strong> {agendaState.topics.join(' • ')}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={toggleAgenda24h}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm ${
                    agendaState.published24hBefore
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {agendaState.published24hBefore ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Desactivar agenda (Activar bloqueo de sala)</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Confirmar agenda 24h (Habilitar sala)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tarjeta 2: Escudo Anti-Fatiga */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Escudo Anti-Fatiga
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Protocolo Activo
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Mensajes no urgentes fuera de horario local se retienen hasta las 09:00 del destinatario.
              </p>

              <form onSubmit={handleSendMessage} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Sede Destino:
                    </label>
                    <select
                      value={targetSite}
                      onChange={(e) => {
                        const site = e.target.value;
                        setTargetSite(site);
                        if (site === 'tokio') setRecipient('Alan Gadiel');
                        else if (site === 'berlin') setRecipient('Jorge Moranchel');
                        else setRecipient('Brayan Beltrán');
                      }}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="tokio">Tokio ({siteTimes.tokio.active ? 'Activo' : 'Descanso'})</option>
                      <option value="berlin">Berlín ({siteTimes.berlin.active ? 'Activo' : 'Descanso'})</option>
                      <option value="guadalajara">Guadalajara ({siteTimes.guadalajara.active ? 'Activo' : 'Descanso'})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Destinatario:
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={2}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Escribe un mensaje de trabajo..."
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Urgente (Excepción directa)
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar con Escudo</span>
                  </button>
                </div>
              </form>

              {/* Mensajes gestionados */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                  Cola de Mensajes ({antiFatigueMessages.length}):
                </span>
                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                  {antiFatigueMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-2"
                    >
                      <div className="flex-1 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-800">{msg.recipient}</span>
                          <span className="text-[10px] text-slate-400">({TIMEZONES[msg.targetSite]?.name || msg.targetSite})</span>
                          {msg.isUrgent ? (
                            <span className="text-[9px] bg-rose-100 text-rose-700 px-1 py-0.2 rounded font-bold">Urgente</span>
                          ) : msg.isDelayed ? (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold">Programado</span>
                          ) : (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">Enviado</span>
                          )}
                        </div>
                        <p className="text-slate-600 italic truncate mt-0.5">"{msg.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Espacios Inmersivos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Espacios Inmersivos
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Entornos inmersivos para sincronía cultural y deliberación sin fricción visual.
                </p>
              </div>

              {/* Selector de Salas */}
              <div className="flex flex-wrap gap-1.5">
                {immersiveRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedRoomId === room.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Inspección de la Sala Seleccionada */}
            {selectedRoomId === 'alineacion' ? (
              !agendaState.published24hBefore ? (
                <div className="bg-rose-50 border-2 border-dashed border-rose-300 rounded-2xl p-6 text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-rose-900">
                    Sala de Alineación Bloqueada por Regla de Gobernanza
                  </h4>
                  <p className="text-xs text-rose-700 max-w-lg mx-auto">
                    No se detectó agenda registrada con al menos 24 horas de antelación. En SYNC 2030, una reunión sin agenda previa se cancela automáticamente para proteger el tiempo del equipo.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={toggleAgenda24h}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      Registrar Agenda 24h y Desbloquear Sala
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Encabezado de la Sala de Alineación */}
                  <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Sala de Alineación en Vivo
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <EyeOff className="w-4 h-4 text-indigo-400" />
                      <span>Sin reloj visible (Regla Anti-Ansiedad)</span>
                    </div>
                  </div>

                  {/* Avatares del equipo en la mesa inmersiva */}
                  <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 text-white space-y-5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        Avatares en mesa virtual (Cámara opcional y respetada):
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                        {teamMembers.map((member) => (
                          <div
                            key={member.id}
                            className={`p-2.5 rounded-xl border flex flex-col items-center text-center space-y-1 transition-all ${
                              member.id === activeUser.id
                                ? 'bg-indigo-900/50 border-indigo-400 ring-2 ring-indigo-500'
                                : 'bg-slate-800/60 border-slate-700'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-full ${member.avatarColor} text-white font-black text-xs flex items-center justify-center shadow-md`}>
                              {member.avatarInitials}
                            </div>
                            <span className="text-[11px] font-bold leading-tight line-clamp-1">{member.name}</span>
                            <span className="text-[10px] text-slate-400 leading-tight">{member.baseCity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tablero compartido */}
                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                          Tablero Compartido en Tiempo Real
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Sincronizado con el Tablero por Valor
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                          <div className="font-bold text-slate-300 text-[11px] mb-0.5">🎨 Tokio (Diseño):</div>
                          <p className="text-slate-400 text-[10px]">Sistema de Diseño v2 exportado a tokens Figma.</p>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                          <div className="font-bold text-slate-300 text-[11px] mb-0.5">⚙️ Guadalajara (Ingeniería):</div>
                          <p className="text-slate-400 text-[10px]">Integración API GraphQL y esquemas validados.</p>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                          <div className="font-bold text-slate-300 text-[11px] mb-0.5">🤖 Berlín (IA & QA):</div>
                          <p className="text-slate-400 text-[10px]">Gemelo de sincronía y auditoría de decisiones.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                      {selectedRoom.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{selectedRoom.name}</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedRoom.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Reglas de Gobernanza:</span>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
                      {selectedRoom.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Capacidades del Entorno:</span>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
                      {selectedRoom.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}