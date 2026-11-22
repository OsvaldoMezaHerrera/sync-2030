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

const LOCAL_STORAGE_KEY = 'sync2030_state_v1';

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

  // Estado del Escudo Anti-Fatiga y Simulación Horaria
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

  // Tarjetas del Tablero
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

  // Guardar en localStorage cuando cambie el estado operativo
  useEffect(() => {
    const stateToSave = {
      activeUserId,
      scheduleWeek,
      agendaState,
      antiFatigueMessages,
      cards,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error al guardar en localStorage', e);
    }
  }, [activeUserId, scheduleWeek, agendaState, antiFatigueMessages, cards]);

  // Función para reiniciar los datos demo limpios (Prueba de pitch y reseteo oficial)
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

  // Alternar estado de la agenda de 24h antes (Prueba QA #5)
  const toggleAgenda24h = () => {
    setAgendaState(prev => ({
      ...prev,
      published24hBefore: !prev.published24hBefore,
      publishedAt: !prev.published24hBefore ? new Date().toISOString() : null,
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
