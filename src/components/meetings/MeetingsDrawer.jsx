import React, { useState } from 'react';
import { useSync } from '../../context/SyncContext';
import {
  Calendar,
  X,
  CheckCircle2,
  Clock,
  Shield,
  ShieldAlert,
  Bot,
  UserCheck,
  Plus,
  Send,
  AlertCircle,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function MeetingsDrawer({ isOpen, onClose }) {
  const {
    activeUser,
    activeUserId,
    teamMembers,
    meetings,
    updateMeetingAttendance,
    createMeeting,
  } = useSync();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSite, setNewSite] = useState(activeUser.baseCity);
  const [newUtcTime, setNewUtcTime] = useState('13:00 UTC');
  const [newHasAgenda, setNewHasAgenda] = useState(true);
  const [newTopics, setNewTopics] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState(
    teamMembers.map(m => m.id)
  );
  const [creationNotice, setCreationNotice] = useState(false);

  if (!isOpen) return null;

  // Calcular la hora local para el usuario activo
  const getMeetingLocalTime = (meeting) => {
    const cityKey = activeUser.baseCity.toLowerCase().includes('tokio')
      ? 'tokio'
      : activeUser.baseCity.toLowerCase().includes('berl')
      ? 'berlin'
      : 'guadalajara';
    return meeting.localTimes?.[cityKey] || meeting.utcTime;
  };

  // Manejar creación de reunión
  const handleCreateMeeting = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const topicsArray = newTopics
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    // Calcular horas locales aproximadas según horario seleccionado
    let localMap = {
      guadalajara: '07:00 CST',
      berlin: '14:00 CET',
      tokio: '22:00 JST',
    };

    if (newUtcTime === '12:00 UTC') {
      localMap = { guadalajara: '06:00 CST', berlin: '13:00 CET', tokio: '21:00 JST' };
    } else if (newUtcTime === '14:30 UTC') {
      localMap = { guadalajara: '08:30 CST', berlin: '15:30 CET', tokio: '23:30 JST' };
    }

    createMeeting({
      title: newTitle,
      site: newSite,
      utcTime: newUtcTime,
      localTimes: localMap,
      hasAgenda24h: newHasAgenda,
      agendaTopics: topicsArray.length > 0 ? topicsArray : ['Alineación táctica de sincronía'],
      participantIds: selectedParticipants,
    });

    setCreationNotice(true);
    setTimeout(() => {
      setCreationNotice(false);
      setIsCreating(false);
      setNewTitle('');
      setNewTopics('');
    }, 1500);
  };

  const toggleParticipant = (memberId) => {
    if (selectedParticipants.includes(memberId)) {
      if (selectedParticipants.length > 1) {
        setSelectedParticipants(selectedParticipants.filter(id => id !== memberId));
      }
    } else {
      setSelectedParticipants([...selectedParticipants, memberId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo semitransparente */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-200">
          {/* Encabezado del Drawer */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Convocatorias y Reuniones
                </h3>
                <p className="text-[11px] text-slate-500">
                  {activeUser.name} · {activeUser.baseCity}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsCreating(!isCreating)}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-colors ${
                  isCreating
                    ? 'bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50'
                }`}
                title={isCreating ? 'Volver a convocatorias' : 'Nueva reunión'}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isCreating ? 'Ver lista' : 'Convocar'}</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notificación de Creación */}
          {creationNotice && (
            <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Convocatoria publicada y notificada a los participantes.</span>
            </div>
          )}

          {/* Contenido con scroll independiente */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Formulario de Nueva Convocatoria */}
            {isCreating ? (
              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Nueva Convocatoria de Reunión</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Gobernanza 24h</span>
                </div>

                <form onSubmit={handleCreateMeeting} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Título de la reunión:
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ej. Alineación de contratos y esquema GraphQL"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Sede convocante:
                      </label>
                      <select
                        value={newSite}
                        onChange={(e) => setNewSite(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 font-medium"
                      >
                        <option value="Guadalajara">Guadalajara (UTC-6)</option>
                        <option value="Berlín">Berlín (UTC+1)</option>
                        <option value="Tokio">Tokio (UTC+9)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Horario base:
                      </label>
                      <select
                        value={newUtcTime}
                        onChange={(e) => setNewUtcTime(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 font-medium"
                      >
                        <option value="12:00 UTC">12:00 UTC (Semana A)</option>
                        <option value="13:00 UTC">13:00 UTC (Semana B)</option>
                        <option value="14:30 UTC">14:30 UTC (Extraordinaria)</option>
                      </select>
                    </div>
                  </div>

                  {/* Participantes */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Participantes Convocados:</span>
                      <span className="text-[10px] text-indigo-600 font-normal">
                        {selectedParticipants.length} seleccionados
                      </span>
                    </label>
                    <div className="max-h-28 overflow-y-auto bg-white border border-slate-300 rounded-lg p-2 space-y-1">
                      {teamMembers.map(member => (
                        <label
                          key={member.id}
                          className="flex items-center space-x-2 text-[11px] text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedParticipants.includes(member.id)}
                            onChange={() => toggleParticipant(member.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                          <span className="font-medium truncate">{member.name}</span>
                          <span className="text-[10px] text-slate-400">({member.baseCity})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gobernanza de Agenda 24h */}
                  <div className="p-2.5 rounded-lg border bg-white border-slate-200 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newHasAgenda}
                        onChange={(e) => setNewHasAgenda(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">
                          Publicar con Agenda Validada ≥ 24h
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Cumple la política de gobernanza y previene el bloqueo de sala.
                        </span>
                      </div>
                    </label>

                    {newHasAgenda && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Temas de la agenda (uno por línea):
                        </label>
                        <textarea
                          value={newTopics}
                          onChange={(e) => setNewTopics(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500"
                          placeholder="1. Revisión de entregables&#10;2. Acuerdos de integración..."
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-colors shadow-sm flex items-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar Convocatoria</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {/* Listado de Reuniones */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Reuniones Convocadas ({meetings.length})
                </span>
                <span className="text-[11px]">Zona: {activeUser.baseCity}</span>
              </div>

              {meetings.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-xl text-slate-400 text-xs">
                  No hay convocatorias activas en este periodo.
                </div>
              ) : (
                meetings.map((meeting) => {
                  const currentStatus = meeting.attendees?.[activeUserId] || 'pending';
                  const isDelegated = currentStatus === 'delegated_twin';
                  const isAttending = currentStatus === 'attending';
                  const localTime = getMeetingLocalTime(meeting);

                  return (
                    <div
                      key={meeting.id}
                      className={`rounded-xl border p-4 transition-all text-xs space-y-3 ${
                        isDelegated
                          ? 'bg-indigo-50/40 border-indigo-200 ring-1 ring-indigo-300'
                          : isAttending
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      {/* Cabecera de la reunión */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs leading-snug">
                            {meeting.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Convocado por <strong className="text-slate-700">{meeting.organizerName}</strong> · {meeting.site}
                          </p>
                        </div>

                        {/* Estado de agenda 24h */}
                        {meeting.hasAgenda24h ? (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 flex items-center space-x-1"
                            title="Cumple la política de gobernanza previa"
                          >
                            <Shield className="w-3 h-3 text-emerald-600" />
                            <span>Agenda 24h</span>
                          </span>
                        ) : (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 shrink-0 flex items-center space-x-1"
                            title="Sin agenda 24h: Sala sujeta a bloqueo/cancelación"
                          >
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>Sin Agenda 24h</span>
                          </span>
                        )}
                      </div>

                      {/* Horario en zona local */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="font-semibold text-[11px]">Tu hora local:</span>
                          <span className="font-mono font-bold text-slate-900">{localTime}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {meeting.utcTime}
                        </span>
                      </div>

                      {/* Temas de agenda */}
                      {meeting.agendaTopics && meeting.agendaTopics.length > 0 && (
                        <div className="text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-700 block mb-0.5">Temas:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-500">
                            {meeting.agendaTopics.map((t, idx) => (
                              <li key={idx}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Selector de Asistencia (Cualquier momento) */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wider block">
                          Mi Asistencia ({activeUser.name}):
                        </span>

                        <div className="grid grid-cols-3 gap-1.5">
                          {/* Opción 1: Pendiente */}
                          <button
                            type="button"
                            onClick={() => updateMeetingAttendance(meeting.id, activeUserId, 'pending')}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border text-center ${
                              currentStatus === 'pending'
                                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Pendiente
                          </button>

                          {/* Opción 2: Asistiré en vivo */}
                          <button
                            type="button"
                            onClick={() => updateMeetingAttendance(meeting.id, activeUserId, 'attending')}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border text-center ${
                              currentStatus === 'attending'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Asistiré en vivo
                          </button>

                          {/* Opción 3: Delegar a Gemelo */}
                          <button
                            type="button"
                            onClick={() => updateMeetingAttendance(meeting.id, activeUserId, 'delegated_twin')}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border text-center ${
                              currentStatus === 'delegated_twin'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'
                            }`}
                            title="Delegar representación al Gemelo de Sincronía"
                          >
                            Enviar a Gemelo
                          </button>
                        </div>
                      </div>

                      {/* Aviso claro cuando se delega al Gemelo */}
                      {isDelegated && (
                        <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 text-[11px] space-y-1">
                          <div className="flex items-center space-x-1.5 font-bold text-indigo-800">
                            <Bot className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>Delegado al Gemelo de IA</span>
                          </div>
                          <p className="text-[10px] text-indigo-900/90 leading-relaxed">
                            Tu Gemelo asistirá en tu representación durante la sesión asíncrona exponiendo tu reporte guardado (<strong>Avances y Pendientes</strong>) y protegiendo el alcance frente a nuevos módulos.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Pie del Drawer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
            <span>SYNC 2030 • Sincronía Asíncrona</span>
            <button
              onClick={onClose}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Cerrar bandeja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}