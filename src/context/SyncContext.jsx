import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  TEAM_MEMBERS,
  SITES_CONFIG,
  ROTATING_SCHEDULE,
  IMMERSIVE_ROOMS,
  INITIAL_AGENDA_STATE,
  INITIAL_CARDS,
  PRACTICES_SEED,
  RETURN_KPIS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MEETING_INVITATIONS
} from '../data/seedData';
import {
  MEMBER_DEFAULT_REPORTS,
  INITIAL_MEETINGS_HISTORY,
  INITIAL_SUGGESTED_REQUESTS
} from '../services/gemeloService';
import {
  calculateNeutralAmbassador,
  validateEntryRule,
  validateWipLimit
} from '../utils/boardRules';

const LOCAL_STORAGE_KEY = 'sync2030_state_v3';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  // 1. Integrante Activo
  const [activeUserId, setActiveUserId] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.activeUserId) return parsed.activeUserId;
      } catch (e) {}
    }
    return 'osvaldo-meza';
  });

  // 2. Vista de navegación actual
  const [currentView, setCurrentView] = useState('panel-global');

  // 2.1 Menú lateral colapsable
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isSidebarCollapsed === 'boolean') return parsed.isSidebarCollapsed;
      } catch (e) {}
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  // 3. Horario Rotativo y Agenda 24h
  const [scheduleWeek, setScheduleWeek] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.scheduleWeek) return parsed.scheduleWeek;
      } catch (e) {}
    }
    return 'A';
  });

  const [agendaState, setAgendaState] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.agendaState) return parsed.agendaState;
      } catch (e) {}
    }
    return INITIAL_AGENDA_STATE;
  });

  // 4. Escudo Anti-Fatiga y Perspectiva Horaria
  const [simulationScenario, setSimulationScenario] = useState('real');
  
  const [antiFatigueMessages, setAntiFatigueMessages] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.antiFatigueMessages) return parsed.antiFatigueMessages;
      } catch (e) {}
    }
    return [
      {
        id: 'msg-seed-1',
        senderId: 'alan-gadiel',
        targetSite: 'guadalajara',
        recipient: 'Brayan Beltrán',
        text: 'He actualizado las especificaciones de padding en el sistema de diseño.',
        isUrgent: false,
        isDelayed: true,
        scheduledDelivery: 'Próxima mañana local (09:00 CST)',
        timestamp: new Date().toISOString(),
      }
    ];
  });

  // 5. Tarjetas del Tablero por Valor
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.cards) return parsed.cards;
      } catch (e) {}
    }
    return INITIAL_CARDS;
  });

  // 6. ESTADO DEL GEMELO DE SINCRONÍA (MÓDULO 2)
  // 6.1 Reportes personales por integrante
  const [userReports, setUserReports] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.userReports) return parsed.userReports;
      } catch (e) {}
    }
    return MEMBER_DEFAULT_REPORTS;
  });

  // 6.2 Historial de reuniones recientes
  const [recentMeetings, setRecentMeetings] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.recentMeetings)) return parsed.recentMeetings;
      } catch (e) {}
    }
    return INITIAL_MEETINGS_HISTORY;
  });

  // 6.3 Solicitudes y Cambios Sugeridos (Aprobación Humana)
  const [suggestedRequests, setSuggestedRequests] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.suggestedRequests)) return parsed.suggestedRequests;
      } catch (e) {}
    }
    return INITIAL_SUGGESTED_REQUESTS;
  });

  // 6.4 Motor de IA vs Respaldo Manual
  const [twinAiEnabled, setTwinAiEnabled] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.twinAiEnabled === 'boolean') return parsed.twinAiEnabled;
      } catch (e) {}
    }
    return true;
  });

  // 6.5 Minutas de respaldo manual
  const [manualSummaries, setManualSummaries] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.manualSummaries)) return parsed.manualSummaries;
      } catch (e) {}
    }
    return [];
  });

  // 7. Bandeja de Convocatorias a Reuniones
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.meetings)) return parsed.meetings;
      } catch (e) {}
    }
    return INITIAL_MEETING_INVITATIONS;
  });

  const [isMeetingsDrawerOpen, setIsMeetingsDrawerOpen] = useState(false);

  // 8. MÓDULO 4: MEDICIÓN DE APLICACIÓN E IMPACTO
  // 8.1 Las 8 prácticas ponderadas
  const [practices, setPractices] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.practices) && parsed.practices.length > 0) return parsed.practices;
      } catch (e) {}
    }
    return PRACTICES_SEED;
  });

  // 8.2 Los 7 indicadores de impacto/retorno
  const [kpis, setKpis] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.kpis) && parsed.kpis.length > 0) return parsed.kpis;
      } catch (e) {}
    }
    return RETURN_KPIS;
  });

  // 8.3 Bitácora de verificaciones semanales de auditoría (QA / Iván Ortega)
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.auditLogs) && parsed.auditLogs.length > 0) return parsed.auditLogs;
      } catch (e) {}
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Cálculo en tiempo real de la Fórmula Oficial de % de Aplicación
  // % Aplicación = Σ (peso_i × cumplimiento_i) ÷ 100
  const adoptionScore = useMemo(() => {
    if (!practices || practices.length === 0) return 0;
    const totalWeighted = practices.reduce((acc, curr) => {
      const weight = Number(curr.weight) || 0;
      const percent = Number(curr.currentPercent) || 0;
      return acc + (weight * percent);
    }, 0);
    return Math.round((totalWeighted / 100) * 10) / 10; // 1 decimal de precisión
  }, [practices]);

  // Semáforo oficial de adopción:
  // - Consolidado (Verde): 85% o más
  // - En adopción (Amarillo): 70% a 84.9%
  // - En riesgo (Rojo): menos de 70%
  const adoptionStatus = useMemo(() => {
    if (adoptionScore >= 85) {
      return {
        level: 'consolidado',
        color: 'verde',
        label: 'Consolidado',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        textClass: 'text-emerald-700',
        accentBg: 'bg-emerald-500',
        lightBg: 'bg-emerald-50',
        borderClass: 'border-emerald-300',
        description: 'La adopción de prácticas supera el umbral objetivo de la Semana 12 (≥ 85%). Operación asíncrona estabilizada.'
      };
    }
    if (adoptionScore >= 70) {
      return {
        level: 'en-adopcion',
        color: 'amarillo',
        label: 'En adopción',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        textClass: 'text-amber-700',
        accentBg: 'bg-amber-500',
        lightBg: 'bg-amber-50',
        borderClass: 'border-amber-300',
        description: 'El equipo se encuentra dentro de la franja esperada entre Semanas 4 y 12 (70% - 84.9%). Se requiere mantener la cadencia.'
      };
    }
    return {
      level: 'en-riesgo',
      color: 'rojo',
      label: 'En riesgo',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      textClass: 'text-rose-700',
      accentBg: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      borderClass: 'border-rose-300',
      description: 'El índice se encuentra por debajo del 70%. Se recomienda auditoría de procesos y alineación con los embajadores de sede.'
    };
  }, [adoptionScore]);

  // Actualizar cumplimiento de una práctica ponderada
  const updatePracticePercent = (practiceId, newPercent) => {
    const clamped = Math.max(0, Math.min(100, Math.round(Number(newPercent) || 0)));
    setPractices(prev =>
      prev.map(p => (p.id === practiceId ? { ...p, currentPercent: clamped } : p))
    );
  };

  // Actualizar un indicador de impacto / retorno
  const updateKpiValue = (kpiId, newValue, note = '') => {
    const numVal = Number(newValue);
    if (isNaN(numVal)) return { success: false, message: 'Valor no numérico' };

    setKpis(prev =>
      prev.map(kpi => {
        if (kpi.id === kpiId) {
          // Evaluar si alcanza la meta proyectada
          let isTargetReached = false;
          if (kpi.direction === 'decrease') {
            isTargetReached = numVal <= kpi.targetValue;
          } else {
            isTargetReached = numVal >= kpi.targetValue;
          }

          const newStatus = isTargetReached ? 'meta-alcanzada' : 'en-camino';
          const updateRecord = {
            previousValue: kpi.currentValue,
            newValue: numVal,
            updatedAt: new Date().toISOString(),
            updatedBy: `${activeUser.name} (${activeUser.baseCity})`,
            note: note || 'Ajuste de medición operativa de sprint',
          };

          return {
            ...kpi,
            currentValue: numVal,
            status: newStatus,
            lastUpdated: updateRecord,
            history: [...(kpi.history || []), updateRecord],
          };
        }
        return kpi;
      })
    );
    return { success: true };
  };

  // Registrar nueva auditoría semanal por muestreo (Iván Ortega / QA)
  const addAuditLog = ({ practiceId, auditedPercent, observations, week = 'Semana 12' }) => {
    const practice = practices.find(p => p.id === practiceId);
    if (!practice) return { success: false, message: 'Práctica no encontrada' };

    const reported = practice.currentPercent;
    const audited = Math.max(0, Math.min(100, Math.round(Number(auditedPercent) || 0)));
    const discrepancy = Math.abs(reported - audited);
    const hasAlert = discrepancy > 10;

    const newLog = {
      id: `audit-${Date.now()}`,
      week,
      practiceId,
      practiceName: practice.name,
      reportedPercent: reported,
      auditedPercent: audited,
      discrepancy,
      status: hasAlert ? 'alerta' : 'conformidad',
      auditor: `${activeUser.name} (${activeUser.role} / ${activeUser.baseCity})`,
      date: new Date().toISOString().split('T')[0],
      observations: observations || (hasAlert ? 'Discrepancia superior al 10% detectada en el muestreo. Se activa seguimiento preventivo.' : 'Muestreo conforme dentro del margen de tolerancia.'),
    };

    setAuditLogs(prev => [newLog, ...prev]);
    return { success: true, log: newLog, hasAlert };
  };

  // Persistencia en localStorage
  useEffect(() => {
    const stateToSave = {
      activeUserId,
      isSidebarCollapsed,
      scheduleWeek,
      agendaState,
      antiFatigueMessages,
      cards,
      userReports,
      recentMeetings,
      suggestedRequests,
      twinAiEnabled,
      manualSummaries,
      meetings,
      practices,
      kpis,
      auditLogs,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error al guardar estado de SYNC 2030 en localStorage', e);
    }
  }, [
    activeUserId,
    isSidebarCollapsed,
    scheduleWeek,
    agendaState,
    antiFatigueMessages,
    cards,
    userReports,
    recentMeetings,
    suggestedRequests,
    twinAiEnabled,
    manualSummaries,
    meetings,
    practices,
    kpis,
    auditLogs,
  ]);

  // Usuario activo resuelto
  const activeUser = TEAM_MEMBERS.find(m => m.id === activeUserId) || TEAM_MEMBERS[0];

  // Métodos de gestión de datos
  const resetSystemData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setActiveUserId('osvaldo-meza');
    setScheduleWeek('A');
    setAgendaState(INITIAL_AGENDA_STATE);
    setSimulationScenario('real');
    setAntiFatigueMessages([
      {
        id: 'msg-seed-1',
        senderId: 'alan-gadiel',
        targetSite: 'guadalajara',
        recipient: 'Brayan Beltrán',
        text: 'He actualizado las especificaciones de padding en el sistema de diseño.',
        isUrgent: false,
        isDelayed: true,
        scheduledDelivery: 'Próxima mañana local (09:00 CST)',
        timestamp: new Date().toISOString(),
      }
    ]);
    setCards(INITIAL_CARDS);
    setUserReports(MEMBER_DEFAULT_REPORTS);
    setRecentMeetings(INITIAL_MEETINGS_HISTORY);
    setSuggestedRequests(INITIAL_SUGGESTED_REQUESTS);
    setTwinAiEnabled(true);
    setManualSummaries([]);
    setMeetings(INITIAL_MEETING_INVITATIONS);
    setPractices(PRACTICES_SEED);
    setKpis(RETURN_KPIS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentView('panel-global');
  };

  // Envío en Escudo Anti-Fatiga
  const sendAntiFatigueMessage = ({ targetSite, recipient, text, isUrgent, isDelayed, scheduledDelivery }) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: activeUserId,
      targetSite,
      recipient,
      text,
      isUrgent,
      isDelayed,
      scheduledDelivery,
      timestamp: new Date().toISOString(),
    };
    setAntiFatigueMessages(prev => [newMessage, ...prev]);
  };

  // Alternar publicación de agenda de 24 horas antes
  const toggleAgenda24h = () => {
    setAgendaState(prev => ({
      ...prev,
      published24hBefore: !prev.published24hBefore,
      publishedAt: !prev.published24hBefore ? new Date().toISOString() : null,
    }));
  };

  // Actualizar reporte individual de un integrante para el Gemelo
  const saveUserReport = (userId, reportData) => {
    setUserReports(prev => ({
      ...prev,
      [userId]: {
        ...reportData,
        lastUpdated: `Hoy a las ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      },
    }));
  };

  // Limpiar y restaurar historial de reuniones
  const clearRecentMeetings = () => {
    setRecentMeetings([]);
  };

  const restoreRecentMeetings = () => {
    setRecentMeetings(INITIAL_MEETINGS_HISTORY);
  };

  // Agregar nueva solicitud sugerida a la bandeja
  const addSuggestedRequest = (req) => {
    setSuggestedRequests(prev => [req, ...prev]);
  };

  // Candado de Aprobación Humana: Confirmar / Aprobar
  const approveSuggestedRequest = (requestId, customNote = null) => {
    setSuggestedRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'approved',
            approvedBy: `${activeUser.name} (${activeUser.baseCity})`,
            approvedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            humanNote: customNote,
          };
        }
        return r;
      })
    );

    // Sincronizar en el Tablero por Valor si hay tarjeta vinculada
    const targetReq = suggestedRequests.find(r => r.id === requestId);
    if (targetReq && targetReq.targetCardId) {
      setCards(prevCards =>
        prevCards.map(c => {
          if (c.id === targetReq.targetCardId) {
            const isRed = targetReq.riskLevel === 'rojo';
            const neutralAmb = isRed ? calculateNeutralAmbassador(c.sites) : c.neutralAmbassador;
            return {
              ...c,
              culturalTrafficLight: targetReq.riskLevel || c.culturalTrafficLight,
              acceptanceCriteria: c.acceptanceCriteria || `Aprobado en sesión: ${targetReq.intendedMeaning}`,
              lastHumanSync: `${activeUser.name} a las ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
              redCountdownExpiresAt: isRed ? (c.redCountdownExpiresAt || new Date(Date.now() + 24 * 3600 * 1000).toISOString()) : c.redCountdownExpiresAt,
              neutralAmbassador: neutralAmb,
              redAlertTriggeredAt: isRed ? (c.redAlertTriggeredAt || new Date().toISOString()) : c.redAlertTriggeredAt,
            };
          }
          return c;
        })
      );
    }
  };

  // MÓDULO 3: GOBERNANZA Y GESTIÓN DEL TABLERO POR VALOR
  // 1. Mover tarjeta entre columnas con validación estricta de gobernanza
  const moveCard = (cardId, targetColumn) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return { success: false, reason: 'NOT_FOUND', message: 'Tarjeta no encontrada.' };

    if (card.column === targetColumn) {
      return { success: true };
    }

    // Regla estricta de entrada a "En curso"
    if (targetColumn === 'en-curso') {
      const entryValidation = validateEntryRule(card);
      if (!entryValidation.isValid) {
        return {
          success: false,
          reason: 'ENTRY_RULE',
          missing: entryValidation.missing,
          message: entryValidation.message,
          card,
        };
      }

      // Límite WIP: Máximo 2 tarjetas en curso por integrante
      const wipValidation = validateWipLimit(cards, card.ownerId, card.id);
      if (!wipValidation.allowed) {
        return {
          success: false,
          reason: 'WIP_LIMIT',
          ownerId: card.ownerId,
          message: wipValidation.message,
          card,
        };
      }
    }

    setCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, column: targetColumn } : c))
    );

    return { success: true };
  };

  // 2. Actualizar tarjeta con validaciones y cálculo del semáforo
  const updateCard = (cardId, updatedFields) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return { success: false, reason: 'NOT_FOUND', message: 'Tarjeta no encontrada.' };

    const candidate = { ...card, ...updatedFields };

    // Si la tarjeta está o pasa a "En curso", validar reglas de gobernanza
    if (candidate.column === 'en-curso') {
      const entryValidation = validateEntryRule(candidate);
      if (!entryValidation.isValid) {
        return {
          success: false,
          reason: 'ENTRY_RULE',
          missing: entryValidation.missing,
          message: entryValidation.message,
          card: candidate,
        };
      }

      const wipValidation = validateWipLimit(cards, candidate.ownerId, cardId);
      if (!wipValidation.allowed) {
        return {
          success: false,
          reason: 'WIP_LIMIT',
          ownerId: candidate.ownerId,
          message: wipValidation.message,
          card: candidate,
        };
      }
    }

    // Si cambia a "rojo" y no tenía cuenta regresiva activa
    if (candidate.culturalTrafficLight === 'rojo') {
      candidate.neutralAmbassador = calculateNeutralAmbassador(candidate.sites || card.sites);
      if (!candidate.redCountdownExpiresAt) {
        candidate.redCountdownExpiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
        candidate.redAlertTriggeredAt = new Date().toISOString();
      }
    } else if (card.culturalTrafficLight === 'rojo' && candidate.culturalTrafficLight !== 'rojo') {
      // Si baja de rojo a amarillo o verde
      candidate.redCountdownExpiresAt = null;
    }

    setCards(prev => prev.map(c => (c.id === cardId ? candidate : c)));
    return { success: true, card: candidate };
  };

  // 3. Crear nueva tarjeta con validaciones iniciales
  const createCard = (cardData) => {
    const newId = `card-${Date.now()}`;
    const sites = Array.isArray(cardData.sites) && cardData.sites.length > 0 ? cardData.sites : ['Guadalajara'];
    const trafficLight = cardData.culturalTrafficLight || 'verde';

    const candidate = {
      id: newId,
      title: cardData.title || 'Iniciativa sin título',
      column: cardData.column || 'por-hacer',
      ownerId: cardData.ownerId || '',
      acceptanceCriteria: cardData.acceptanceCriteria || '',
      okr: cardData.okr || 'Impacto operativo verificado',
      sites,
      culturalTrafficLight: trafficLight,
      createdAt: new Date().toISOString(),
      redCountdownExpiresAt: null,
      neutralAmbassador: null,
      frictionReason: cardData.frictionReason || '',
    };

    // Si se crea directamente en rojo
    if (candidate.culturalTrafficLight === 'rojo') {
      candidate.neutralAmbassador = calculateNeutralAmbassador(candidate.sites);
      candidate.redCountdownExpiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      candidate.redAlertTriggeredAt = new Date().toISOString();
    }

    // Si se crea directamente en "En curso"
    if (candidate.column === 'en-curso') {
      const entryValidation = validateEntryRule(candidate);
      if (!entryValidation.isValid) {
        return {
          success: false,
          reason: 'ENTRY_RULE',
          missing: entryValidation.missing,
          message: entryValidation.message,
          card: candidate,
        };
      }

      const wipValidation = validateWipLimit(cards, candidate.ownerId, null);
      if (!wipValidation.allowed) {
        return {
          success: false,
          reason: 'WIP_LIMIT',
          ownerId: candidate.ownerId,
          message: wipValidation.message,
          card: candidate,
        };
      }
    }

    setCards(prev => [candidate, ...prev]);
    return { success: true, card: candidate };
  };

  // 4. Registrar intervención del embajador neutral para resolver una alerta roja
  const resolveRedCard = (cardId, newTrafficLight = 'amarillo', resolutionNote = '') => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return { success: false, message: 'Tarjeta no encontrada.' };

    const resolutionEntry = {
      resolvedAt: new Date().toISOString(),
      resolvedTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      resolvedBy: card.neutralAmbassador || `${activeUser.name} (${activeUser.baseCity})`,
      previousLight: 'rojo',
      newLight: newTrafficLight,
      note: resolutionNote || 'Intervención de mediación cultural completada satisfactoriamente.',
    };

    setCards(prev =>
      prev.map(c => {
        if (c.id === cardId) {
          return {
            ...c,
            culturalTrafficLight: newTrafficLight,
            redCountdownExpiresAt: null,
            lastResolution: resolutionEntry,
            resolutionHistory: [...(c.resolutionHistory || []), resolutionEntry],
          };
        }
        return c;
      })
    );

    return { success: true };
  };

  // Candado de Aprobación Humana: Rechazar
  const rejectSuggestedRequest = (requestId, reason = '') => {
    setSuggestedRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'rejected',
            rejectedBy: `${activeUser.name} (${activeUser.baseCity})`,
            rejectedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            rejectionReason: reason || 'Desestimado por directrices de alcance del sprint.',
          };
        }
        return r;
      })
    );
  };

  // Candado de Aprobación Humana: Posponer
  const postponeSuggestedRequest = (requestId) => {
    setSuggestedRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'postponed',
            postponedBy: `${activeUser.name} (${activeUser.baseCity})`,
            postponedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return r;
      })
    );
  };

  // Alternar motor de IA del Gemelo
  const toggleTwinAi = () => {
    setTwinAiEnabled(prev => !prev);
  };

  // Registrar resumen manual rotativo
  const addManualSummary = ({ keyPoints, decisions, nextActions }) => {
    const newSummary = {
      id: `manual-${Date.now()}`,
      authorName: activeUser.name,
      authorCity: activeUser.baseCity,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      keyPoints,
      decisions,
      nextActions,
      verifiedByHuman: true,
    };
    setManualSummaries(prev => [newSummary, ...prev]);
  };

  // 7. Gestión de Reuniones e Invitaciones (Bandeja / Drawer)
  const updateMeetingAttendance = (meetingId, memberId, newStatus) => {
    setMeetings(prev =>
      prev.map(m => {
        if (m.id === meetingId) {
          return {
            ...m,
            attendees: {
              ...m.attendees,
              [memberId]: newStatus,
            },
          };
        }
        return m;
      })
    );
  };

  const createMeeting = ({
    title,
    site = activeUser.baseCity,
    utcTime = '13:00 UTC',
    localTimes = null,
    hasAgenda24h = true,
    agendaTopics = [],
    participantIds = [],
  }) => {
    // Generar horas aproximadas por sede si no se proporcionan
    const defaultLocalTimes = localTimes || {
      guadalajara: '07:00 CST',
      berlin: '14:00 CET',
      tokio: '22:00 JST',
    };

    const initialAttendees = {};
    TEAM_MEMBERS.forEach(member => {
      if (participantIds.length === 0 || participantIds.includes(member.id)) {
        initialAttendees[member.id] = member.id === activeUserId ? 'attending' : 'pending';
      }
    });

    const newMeeting = {
      id: `meet-inv-${Date.now()}`,
      title: title || 'Alineación Asíncrona Extraordinaria',
      organizerId: activeUserId,
      organizerName: activeUser.name,
      site,
      utcTime,
      localTimes: defaultLocalTimes,
      hasAgenda24h,
      agendaTopics: agendaTopics.length > 0 ? agendaTopics : ['Puntos de sincronía operativa sin sobreasignación'],
      attendees: initialAttendees,
      createdAt: 'Hace un momento',
    };

    setMeetings(prev => [newMeeting, ...prev]);
    return newMeeting;
  };

  return (
    <SyncContext.Provider
      value={{
        activeUser,
        activeUserId,
        setActiveUserId,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        currentView,
        setCurrentView,
        scheduleWeek,
        setScheduleWeek,
        agendaState,
        setAgendaState,
        toggleAgenda24h,
        simulationScenario,
        setSimulationScenario,
        antiFatigueMessages,
        sendAntiFatigueMessage,
        cards,
        setCards,
        moveCard,
        updateCard,
        createCard,
        resolveRedCard,
        resetSystemData,

        // Módulo 2: Gemelo de Sincronía
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

        // Bandeja de Convocatorias a Reuniones
        meetings,
        setMeetings,
        isMeetingsDrawerOpen,
        setIsMeetingsDrawerOpen,
        updateMeetingAttendance,
        createMeeting,

        // Módulo 4: Medición de Aplicación e Impacto
        practices,
        updatePracticePercent,
        adoptionScore,
        adoptionStatus,
        kpis,
        updateKpiValue,
        auditLogs,
        addAuditLog,

        // Catálogos globales
        teamMembers: TEAM_MEMBERS,
        sitesConfig: SITES_CONFIG,
        rotatingSchedule: ROTATING_SCHEDULE,
        immersiveRooms: IMMERSIVE_ROOMS,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync debe utilizarse dentro de un SyncProvider');
  }
  return context;
}
