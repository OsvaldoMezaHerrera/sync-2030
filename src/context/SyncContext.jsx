import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TEAM_MEMBERS,
  SITES_CONFIG,
  ROTATING_SCHEDULE,
  IMMERSIVE_ROOMS,
  INITIAL_AGENDA_STATE,
  INITIAL_CARDS,
  PRACTICES_SEED,
  RETURN_KPIS
} from '../data/seedData';
import { INITIAL_DRAFT_MINUTES } from '../services/gemeloService';

const LOCAL_STORAGE_KEY = 'sync2030_state_v1';

const INITIAL_PROPOSALS = [
  {
    id: 'prop-seed-1',
    type: 'cultural_translation',
    title: 'Alineación de Cronograma — Sistema de Diseño v2',
    originSite: 'tokio',
    author: 'Alan Gadiel (Tokio)',
    originalText: 'Quizá sería posible revisar esto con más calma.',
    intendedMeaning: 'No estoy de acuerdo con la fecha límite propuesta y considero que comprometería la calidad técnica del entregable.',
    riskLevel: 'amarillo',
    interpretationRisk: 'Berlín o Guadalajara pueden interpretar que la revisión es opcional o secundaria.',
    proposedResponse: 'Comprendo la inquietud sobre el cronograma. Propongo revisar el alcance crítico del entregable para asegurar la calidad antes de fijar la fecha definitiva.',
    targetCardId: 'card-1',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    createdAt: new Date().toISOString(),
    approvedBy: null,
    finalText: null,
  }
];

const INITIAL_SCOPE_REQUESTS = [
  {
    id: 'scope-seed-1',
    requester: 'Iván Ortega (Berlín)',
    originSite: 'berlin',
    requestedScope: 'Incorporación de módulo de métricas predictivas no planificado en sprint 12.',
    gemeloResponse: 'El Gemelo de Sincronía no cuenta con facultades para comprometer al equipo en nuevos módulos o cambios de alcance. Solicitud derivada a Aprobación Humana.',
    status: 'pending_review',
    timestamp: new Date().toISOString(),
  }
];

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  // Inicialización desde localStorage con fallback a datos semilla
  const [activeUserId, setActiveUserId] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.activeUserId) return parsed.activeUserId;
      } catch (e) {
        console.error('Error al cargar activeUserId de localStorage', e);
      }
    }
    return 'osvaldo-meza';
  });

  const [currentView, setCurrentView] = useState('panel-global');

  // Estado del Horario Rotativo y la Agenda de la Junta Semanal
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

  // Estado del Escudo Anti-Fatiga y Perspectiva Horaria
  const [simulationScenario, setSimulationScenario] = useState('real'); // 'real' | 'tokyo-night' | 'berlin-night' | 'gdl-night'
  
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

  // Tarjetas del Tablero por Valor
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

  // ESTADO DEL GEMELO DE SINCRONÍA (MÓDULO 2)
  const [twinAiEnabled, setTwinAiEnabled] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.twinAiEnabled === 'boolean') return parsed.twinAiEnabled;
      } catch (e) {}
    }
    return true; // Motor IA activo por defecto
  });

  const [pendingProposals, setPendingProposals] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pendingProposals) return parsed.pendingProposals;
      } catch (e) {}
    }
    return INITIAL_PROPOSALS;
  });

  const [pendingScopeRequests, setPendingScopeRequests] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pendingScopeRequests) return parsed.pendingScopeRequests;
      } catch (e) {}
    }
    return INITIAL_SCOPE_REQUESTS;
  });

  const [manualSummaries, setManualSummaries] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.manualSummaries) return parsed.manualSummaries;
      } catch (e) {}
    }
    return [];
  });

  const [sessionMinutes, setSessionMinutes] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.sessionMinutes) return parsed.sessionMinutes;
      } catch (e) {}
    }
    return INITIAL_DRAFT_MINUTES;
  });

  // Guardar en localStorage cuando cambie el estado operativo
  useEffect(() => {
    const stateToSave = {
      activeUserId,
      scheduleWeek,
      agendaState,
      antiFatigueMessages,
      cards,
      twinAiEnabled,
      pendingProposals,
      pendingScopeRequests,
      manualSummaries,
      sessionMinutes,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error al guardar en localStorage', e);
    }
  }, [
    activeUserId,
    scheduleWeek,
    agendaState,
    antiFatigueMessages,
    cards,
    twinAiEnabled,
    pendingProposals,
    pendingScopeRequests,
    manualSummaries,
    sessionMinutes,
  ]);

  // Función para restaurar los datos iniciales limpios
  const resetDemoData = () => {
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
    setTwinAiEnabled(true);
    setPendingProposals(INITIAL_PROPOSALS);
    setPendingScopeRequests(INITIAL_SCOPE_REQUESTS);
    setManualSummaries([]);
    setSessionMinutes(INITIAL_DRAFT_MINUTES);
    setCurrentView('panel-global');
  };

  // Envío o encolado de mensajes en el Escudo Anti-Fatiga
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

  // Alternar estado de la agenda de 24h antes
  const toggleAgenda24h = () => {
    setAgendaState(prev => ({
      ...prev,
      published24hBefore: !prev.published24hBefore,
      publishedAt: !prev.published24hBefore ? new Date().toISOString() : null,
    }));
  };

  // Alternar modo de respaldo manual (Apagar/Encender IA del Gemelo)
  const toggleTwinAi = () => {
    setTwinAiEnabled(prev => !prev);
  };

  // Agregar nueva propuesta generada desde el análisis del Gemelo
  const addProposal = (proposal) => {
    const newProposal = {
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      approvedBy: null,
      finalText: null,
      ...proposal,
    };
    setPendingProposals(prev => [newProposal, ...prev]);
    return newProposal;
  };

  // Candado de Aprobación Humana: Aprobar propuesta y sincronizar con Tablero por Valor
  const approveProposal = (proposalId, customText = null) => {
    const user = TEAM_MEMBERS.find(m => m.id === activeUserId) || TEAM_MEMBERS[0];

    setPendingProposals(prev =>
      prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            status: 'approved',
            approvedBy: `${user.name} (${user.baseCity})`,
            finalText: customText || p.proposedResponse,
            approvedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Si la propuesta está vinculada a una tarjeta del tablero, actualizarla
    const targetProposal = pendingProposals.find(p => p.id === proposalId);
    if (targetProposal && targetProposal.targetCardId) {
      setCards(prevCards =>
        prevCards.map(c => {
          if (c.id === targetProposal.targetCardId) {
            return {
              ...c,
              culturalTrafficLight: targetProposal.riskLevel || c.culturalTrafficLight,
              acceptanceCriteria: c.acceptanceCriteria || 'Criterios de integración y cronograma ratificados por el equipo.',
              lastHumanSync: `${user.name} el ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
            };
          }
          return c;
        })
      );
    }
  };

  // Candado de Aprobación Humana: Rechazar propuesta
  const rejectProposal = (proposalId) => {
    const user = TEAM_MEMBERS.find(m => m.id === activeUserId) || TEAM_MEMBERS[0];
    setPendingProposals(prev =>
      prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            status: 'rejected',
            approvedBy: `Rechazado por ${user.name} (${user.baseCity})`,
            rejectedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  // Agregar solicitud de cambio de alcance retenida
  const addScopeRequest = (requestData) => {
    const newReq = {
      id: `scope-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending_review',
      ...requestData,
    };
    setPendingScopeRequests(prev => [newReq, ...prev]);
  };

  // Registrar resumen manual rotativo (cuando el motor IA está en modo respaldo)
  const addManualSummary = ({ keyPoints, decisions, nextActions }) => {
    const user = TEAM_MEMBERS.find(m => m.id === activeUserId) || TEAM_MEMBERS[0];
    const newSummary = {
      id: `manual-${Date.now()}`,
      authorName: user.name,
      authorCity: user.baseCity,
      timestamp: new Date().toISOString(),
      keyPoints,
      decisions,
      nextActions,
      verifiedByHuman: true,
    };
    setManualSummaries(prev => [newSummary, ...prev]);
  };

  // Aprobar minuta de sesión
  const approveSessionMinutes = () => {
    const user = TEAM_MEMBERS.find(m => m.id === activeUserId) || TEAM_MEMBERS[0];
    setSessionMinutes(prev => ({
      ...prev,
      status: 'published',
      approvedBy: `${user.name} (${user.baseCity})`,
      publishedAt: new Date().toISOString(),
    }));
  };

  const activeUser = TEAM_MEMBERS.find(m => m.id === activeUserId) || TEAM_MEMBERS[0];

  return (
    <SyncContext.Provider
      value={{
        activeUser,
        activeUserId,
        setActiveUserId,
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
        resetDemoData,
        // Capacidades Módulo 2
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
        // Catálogos
        teamMembers: TEAM_MEMBERS,
        sitesConfig: SITES_CONFIG,
        rotatingSchedule: ROTATING_SCHEDULE,
        immersiveRooms: IMMERSIVE_ROOMS,
        practices: PRACTICES_SEED,
        kpis: RETURN_KPIS,
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
