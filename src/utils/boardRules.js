/**
 * Reglas de gobernanza y semáforo cultural para el Tablero por Valor (SYNC 2030)
 * Lógica 100% local, determinista y offline
 */

export const BOARD_COLUMNS = [
  {
    id: 'por-hacer',
    title: 'Por hacer',
    subtitle: 'Backlog priorizado',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  {
    id: 'en-curso',
    title: 'En curso',
    subtitle: 'Límite WIP: máx. 2 por integrante',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'en-revision',
    title: 'En revisión',
    subtitle: 'Aseguramiento de calidad y revisión cruzada',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'terminado',
    title: 'Terminado',
    subtitle: 'Entregables completados',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

export const CULTURAL_LIGHTS = {
  verde: {
    id: 'verde',
    label: 'Bajo riesgo / Ajustes menores',
    shortLabel: 'Verde',
    colorClass: 'border-l-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    ringColor: 'ring-emerald-500',
  },
  amarillo: {
    id: 'amarillo',
    label: 'Fricción creciente / Atención pronta',
    shortLabel: 'Amarillo',
    colorClass: 'border-l-amber-500',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    ringColor: 'ring-amber-500',
  },
  rojo: {
    id: 'rojo',
    label: 'Alerta crítica / Embajador neutral (SLA 24h)',
    shortLabel: 'Rojo',
    colorClass: 'border-l-rose-500',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotColor: 'bg-rose-500',
    ringColor: 'ring-rose-500',
  },
};

/**
 * Determina el Embajador Neutral asignado según el cruce de sedes:
 * - Tokio–Berlín → Brayan Beltrán (Guadalajara)
 * - Guadalajara–Berlín → Alan Gadiel (Tokio)
 * - Tokio–Guadalajara → Osvaldo Meza (con apoyo de Berlín)
 */
export function calculateNeutralAmbassador(sites = []) {
  if (!Array.isArray(sites) || sites.length === 0) {
    return 'Osvaldo Meza (Guadalajara)';
  }

  const normalized = sites.map(s => s.toLowerCase().trim());
  const hasTokio = normalized.some(s => s.includes('tokio') || s.includes('tokyo'));
  const hasBerlin = normalized.some(s => s.includes('berlin') || s.includes('berlín'));
  const hasGdl = normalized.some(s => s.includes('guadalajara') || s.includes('gdl'));

  // Tokio - Berlín (Fricción alto contexto vs bajo contexto directo) -> Interviene Guadalajara
  if (hasTokio && hasBerlin && !hasGdl) {
    return 'Brayan Beltrán (Guadalajara)';
  }

  // Guadalajara - Berlín (Fricción iterativo rápido vs rigor estructurado) -> Interviene Tokio
  if (hasGdl && hasBerlin && !hasTokio) {
    return 'Alan Gadiel (Tokio)';
  }

  // Tokio - Guadalajara (Fricción indirecto/consenso vs liberación ágil) -> Interviene Osvaldo Meza (Scrum Master transversal)
  if (hasTokio && hasGdl && !hasBerlin) {
    return 'Osvaldo Meza (con apoyo de Berlín)';
  }

  // Si abarca las 3 sedes
  if (hasTokio && hasBerlin && hasGdl) {
    return 'Osvaldo Meza (con apoyo de Berlín)';
  }

  // Sede individual o casos especiales
  if (hasTokio) return 'Brayan Beltrán (Guadalajara)';
  if (hasBerlin) return 'Alan Gadiel (Tokio)';
  if (hasGdl) return 'Osvaldo Meza (con apoyo de Berlín)';

  return 'Osvaldo Meza (Scrum Master)';
}

/**
 * Valida la Regla Estricta de Entrada para mover a "En curso"
 * Bloquea mover si no tiene dueño y criterio de aceptación completos.
 */
export function validateEntryRule(card) {
  const missing = [];
  
  if (!card.ownerId || !card.ownerId.trim()) {
    missing.push('dueño');
  }

  if (!card.acceptanceCriteria || !card.acceptanceCriteria.trim()) {
    missing.push('criterio de aceptación');
  }

  if (missing.length > 0) {
    return {
      isValid: false,
      missing,
      message: `Para pasar a "En curso", la tarjeta debe tener definido: ${missing.join(' y ')}.`,
    };
  }

  return {
    isValid: true,
    missing: [],
    message: null,
  };
}

/**
 * Valida el Límite WIP de máximo 2 tarjetas en "En curso" por integrante.
 * @param {Array} cards - Todas las tarjetas del tablero
 * @param {string} ownerId - ID del integrante asignado
 * @param {string} currentCardId - ID de la tarjeta que se está evaluando (para no contarse a sí misma si ya estaba en curso)
 */
export function validateWipLimit(cards, ownerId, currentCardId = null) {
  if (!ownerId) {
    return {
      allowed: false,
      currentCount: 0,
      limit: 2,
      message: 'No se puede validar el límite de trabajo en curso sin un responsable asignado.',
    };
  }

  const inProgressCardsOfOwner = cards.filter(
    c => c.column === 'en-curso' && c.ownerId === ownerId && c.id !== currentCardId
  );

  const currentCount = inProgressCardsOfOwner.length;

  if (currentCount >= 2) {
    return {
      allowed: false,
      currentCount,
      limit: 2,
      message: `El integrante seleccionado ya cuenta con ${currentCount} tarjetas en curso (límite máximo: 2). Debe concluir o liberar una tarjeta antes de asumir nuevo trabajo.`,
    };
  }

  return {
    allowed: true,
    currentCount,
    limit: 2,
    message: null,
  };
}

/**
 * Formatea el tiempo restante para el reloj regresivo de 24 horas del Semáforo Rojo
 */
export function formatRemainingTime(expiresAt) {
  if (!expiresAt) return { formatted: '24:00:00', isExpired: false, hours: 24, minutes: 0, seconds: 0 };

  const target = new Date(expiresAt).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return {
      formatted: '00:00:00 (SLA Vencido)',
      isExpired: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, '0');
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return {
    formatted,
    isExpired: false,
    hours,
    minutes,
    seconds,
  };
}

/**
 * Ordenamiento automático estricto de tarjetas:
 * 1. Prioridad por Semáforo Cultural: Rojo siempre arriba, luego Amarillo en medio y Verde hasta abajo.
 * 2. Desempate por FIFO (First In, First Out): entre tarjetas del mismo color, la más antigua (menor createdAt) primero.
 */
export function sortCardsTrafficLightFIFO(cardsList = []) {
  const PRIORITY_MAP = {
    rojo: 1,
    amarillo: 2,
    verde: 3,
  };

  return [...cardsList].sort((a, b) => {
    const pA = PRIORITY_MAP[a.culturalTrafficLight] || 4;
    const pB = PRIORITY_MAP[b.culturalTrafficLight] || 4;

    if (pA !== pB) {
      return pA - pB;
    }

    // Desempate por FIFO: la más antigua primero (createdAt menor / anterior)
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeA - timeB;
  });
}
