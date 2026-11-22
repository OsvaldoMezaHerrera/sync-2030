/**
 * Servicio de Inteligencia Cultural y Gemelo de Sincronía
 * Lógica 100% local, determinista y offline
 * Diseñado como capa de servicio desacoplada para facilitar la conexión futura de un LLM externo
 */

// Casos y patrones lingüísticos precargados
export const CULTURAL_PRESETS = [
  {
    id: 'tokio-deadline',
    label: 'Tokio (Alto contexto / Cortesía indirecta)',
    originSite: 'tokio',
    author: 'Alan Gadiel (Tokio)',
    rawText: 'Quizá sería posible revisar esto con más calma.',
    context: 'Discusión sobre la fecha de entrega del Sistema de Diseño v2.',
  },
  {
    id: 'berlin-direct',
    label: 'Berlín (Bajo contexto / Crítica técnica directa)',
    originSite: 'berlin',
    author: 'Jorge Moranchel (Berlín)',
    rawText: 'Esto está mal, hay que rehacerlo.',
    context: 'Revisión técnica de integración de contratos de API.',
  },
  {
    id: 'gdl-speed',
    label: 'Guadalajara (Iteración rápida / Liberación continua)',
    originSite: 'guadalajara',
    author: 'Brayan Beltrán (Guadalajara)',
    rawText: 'Liberemos esta versión hoy y vamos corrigiendo detalles sobre la marcha.',
    context: 'Despliegue del endpoint de autenticación.',
  },
  {
    id: 'scope-change-attempt',
    label: 'Solicitud no autorizada (Cambio de alcance)',
    originSite: 'berlin',
    author: 'Iván Ortega (Berlín)',
    rawText: 'Necesitamos agregar un nuevo módulo de analíticas en este sprint para cerrar el ciclo.',
    context: 'Petición sobrevenida durante la sesión de alineación.',
  },
];

// Datos del integrante ausente por huso horario para cobertura inteligente
export const ABSENT_MEMBER_REPORT = {
  memberId: 'alan-gadiel',
  name: 'Alan Gadiel',
  site: 'Tokio',
  timezone: 'Asia/Tokyo (UTC+9)',
  currentStatus: 'Horario de descanso local (Turno nocturno)',
  lastSyncDate: 'Hoy a las 18:30 JST (hace 8 horas)',
  completedAdvances: [
    'Exportación completa de tokens de diseño v2 en formato JSON compatible con Tailwind.',
    'Documentación de componentes base en Figma para el equipo de Frontend.',
    'Revisión inicial del flujo de estados para el Escudo Anti-Fatiga.',
  ],
  pendingItems: [
    'Definición de criterios de aceptación con Backend (Brayan Beltrán) para contratos de API.',
    'Acuerdo formal sobre la fecha límite de integración del sprint actual.',
  ],
  standingGuardrails: [
    'No aceptar adiciones de alcance sin validación previa del Scrum Master (Osvaldo Meza).',
    'Priorizar reducción de retrabajo antes de añadir nuevos flujos.',
  ],
};

/**
 * Detecta si el mensaje contiene solicitudes de cambio de alcance o módulos nuevos
 */
export function detectScopeChange(text) {
  const normalized = text.toLowerCase();
  const scopeKeywords = [
    'nuevo módulo',
    'nuevo modulo',
    'cambiar alcance',
    'cambio de alcance',
    'nueva funcionalidad',
    'agregar pantalla',
    'agregar funcionalidad',
    'extender alcance',
    'meter otro requerimiento',
    'ampliar sprint',
    'incluir modulo',
    'incluir módulo',
  ];

  return scopeKeywords.some(keyword => normalized.includes(keyword));
}

/**
 * Analiza el tono cultural y semántico del mensaje de forma determinista y local
 */
export function analyzeCulturalTone(rawText, originSite = 'tokio') {
  const text = rawText.trim();
  const isScopeChange = detectScopeChange(text);

  // Caso 1: Detección de cambio de alcance no autorizado (Candado inviolable)
  if (isScopeChange) {
    return {
      type: 'scope_alert',
      isScopeChange: true,
      originalText: text,
      detectedCulture: originSite,
      riskLevel: 'rojo',
      interpretationRisk: 'Intento de compromiso no autorizado sobre la capacidad del sprint.',
      intendedMeaning: 'Se está solicitando una ampliación de alcance o un nuevo módulo sin contar con la aprobación del responsable del tablero ni del integrante ausente.',
      culturalAdvice: 'El Gemelo de Sincronía tiene prohibido aceptar compromisos en nombre de integrantes ausentes.',
      recommendedAction: 'Rechazo automático de compromiso y transferencia obligatoria a la bandeja de Aprobación Humana.',
      autoReply: 'El Gemelo de Sincronía no cuenta con facultades para comprometer al equipo en nuevos módulos o cambios de alcance. La solicitud ha sido registrada y derivada a la bandeja de Aprobación Humana.',
      suggestedCardUpdate: null,
    };
  }

  const lower = text.toLowerCase();

  // Caso 2: Alto contexto / cortesía indirecta (Ejemplo Tokio)
  if (
    lower.includes('con más calma') ||
    lower.includes('con mas calma') ||
    lower.includes('quizá sería posible') ||
    lower.includes('quiza seria posible') ||
    lower.includes('revisar esto luego') ||
    lower.includes('pensarlo un poco más')
  ) {
    return {
      type: 'cultural_translation',
      isScopeChange: false,
      originalText: text,
      detectedCulture: 'tokio',
      culturalStyle: 'Alto contexto (Comunicación implícita de cortesía)',
      riskLevel: 'amarillo',
      interpretationRisk: 'Berlín o Guadalajara pueden interpretar que la revisión es opcional o secundaria.',
      intendedMeaning: 'No estoy de acuerdo con la fecha límite propuesta y considero que comprometería la calidad técnica del entregable.',
      culturalAdvice: 'En la cultura empresarial japonesa, el desacuerdo con plazos se formula como sugerencia reflexiva para preservar la armonía relacional (Wa).',
      recommendedAction: 'Hacer explícita la objeción sobre el cronograma y negociar un criterio de aceptación ajustado.',
      proposedResponse: 'Comprendo la inquietud sobre el cronograma. Propongo revisar el alcance crítico del entregable para asegurar la calidad antes de fijar la fecha definitiva.',
      targetCardId: 'card-1',
      suggestedCardUpdate: {
        culturalTrafficLight: 'amarillo',
        statusNotice: 'Desacuerdo de cronograma identificado. Requiere alineación de criterios.',
      },
    };
  }

  // Caso 3: Bajo contexto / crítica técnica directa (Ejemplo Berlín)
  if (
    lower.includes('está mal') ||
    lower.includes('esta mal') ||
    lower.includes('hay que rehacerlo') ||
    lower.includes('no sirve') ||
    lower.includes('bloquea todo')
  ) {
    return {
      type: 'cultural_translation',
      isScopeChange: false,
      originalText: text,
      detectedCulture: 'berlin',
      culturalStyle: 'Bajo contexto (Directo y enfocado estrictamente en la tarea)',
      riskLevel: 'rojo',
      interpretationRisk: 'Tokio o Guadalajara pueden recibir el señalamiento como un ataque personal hacia la competencia del autor.',
      intendedMeaning: 'Existe un error técnico en el contrato de integración que impide avanzar; la observación se refiere al artefacto de código, no a la persona.',
      culturalAdvice: 'En los equipos de ingeniería alemanes, la crítica directa y sin preámbulos es vista como profesionalismo y honestidad técnica, no como hostilidad.',
      recommendedAction: 'Reformular con separación explícita entre la persona y el bloqueo técnico.',
      proposedResponse: 'Hemos identificado una discrepancia técnica en el esquema de integración. Revisemos conjuntamente los logs para corregir la causa raíz sin dilación.',
      targetCardId: 'card-2',
      suggestedCardUpdate: {
        culturalTrafficLight: 'rojo',
        statusNotice: 'Fricción técnica detectada. Se sugiere mediación de embajador neutral si persiste.',
      },
    };
  }

  // Caso 4: Iteración rápida / orientación a entrega (Ejemplo Guadalajara)
  if (
    lower.includes('sobre la marcha') ||
    lower.includes('liberemos hoy') ||
    lower.includes('después arreglamos') ||
    lower.includes('vamos viendo')
  ) {
    return {
      type: 'cultural_translation',
      isScopeChange: false,
      originalText: text,
      detectedCulture: 'guadalajara',
      culturalStyle: 'Ágil iterativo (Orientado a velocidad y retroalimentación empírica)',
      riskLevel: 'amarillo',
      interpretationRisk: 'Berlín puede interpretar falta de rigurosidad técnica; Tokio puede percibir riesgo a la reputación del producto.',
      intendedMeaning: 'Se busca validar el valor de negocio de inmediato mediante un despliegue parcial, asumiendo una deuda técnica acotada.',
      culturalAdvice: 'El ecosistema de ingeniería en Guadalajara valora la resolución expedita, requiriendo documentar formalmente los criterios de aceptación para no generar retrabajo.',
      recommendedAction: 'Establecer una compuerta de calidad explícita antes de la liberación.',
      proposedResponse: 'Avanzamos con el despliegue parcial condicionado a que los contratos críticos de API cuenten con pruebas de regresión automáticas.',
      targetCardId: 'card-1',
      suggestedCardUpdate: {
        culturalTrafficLight: 'verde',
        statusNotice: 'Liberación iterativa aprobada con compuerta de calidad técnica.',
      },
    };
  }

  // Análisis por defecto para cualquier otro mensaje libre
  return {
    type: 'cultural_translation',
    isScopeChange: false,
    originalText: text,
    detectedCulture: originSite,
    culturalStyle: 'Comunicación estándar de trabajo',
    riskLevel: 'verde',
    interpretationRisk: 'Bajo riesgo de malentendido intercultural.',
    intendedMeaning: text,
    culturalAdvice: 'El tono es claro y respeta los principios de sincronía asíncrona.',
    recommendedAction: 'Proceder con la respuesta habitual.',
    proposedResponse: `Confirmado: "${text}". Procedemos con el seguimiento en el tablero por valor.`,
    targetCardId: null,
    suggestedCardUpdate: null,
  };
}

/**
 * Minuta estructurada generada por el Gemelo
 */
export const INITIAL_DRAFT_MINUTES = {
  sessionTitle: 'Sesión de Sincronía Táctica — Sprint 12',
  date: '2026-11-21',
  participantsPresent: ['Osvaldo Meza (GDL)', 'Jorge Moranchel (BER)', 'Brayan Beltrán (GDL)', 'Nicholas Sotelo (GDL)'],
  coveredAbsent: ['Alan Gadiel (TOK)', 'Fernando Garrido (TOK)'],
  keyDecisions: [
    'Se ratificó la regla de no comprometer horas extras y priorizar el cumplimiento del OKR de retrabajo.',
    'El Gemelo de Sincronía representó la postura de Tokio salvaguardando la calidad del Sistema de Diseño v2.',
  ],
  actionItems: [
    { id: 'act-1', task: 'Validar tokens JSON exportados contra esquema GraphQL', owner: 'Brayan Beltrán', site: 'Guadalajara', deadline: 'Próxima jornada' },
    { id: 'act-2', task: 'Verificar compatibilidad de contratos en suite de pruebas', owner: 'Iván Ortega', site: 'Berlín', deadline: '24 horas hábiles' },
  ],
  status: 'pending_human_approval',
};
