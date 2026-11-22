/**
 * Servicio de Inteligencia Cultural y Gemelo de Sincronía (SYNC 2030)
 * Lógica 100% local, determinista y offline
 * Capa de servicio desacoplada para facilitar la conexión futura de un LLM externo
 */

// Casos y patrones lingüísticos precargados
export const CULTURAL_PRESETS = [
  {
    id: 'preset-tokio-deadline',
    label: 'Tokio (Alto contexto / Cortesía indirecta)',
    originSite: 'tokio',
    author: 'Alan Gadiel',
    siteLabel: 'Tokio',
    email: 'alan.gadiel@sync2030.global',
    rawText: 'Quizá sería posible revisar esto con más calma.',
    context: 'Discusión sobre la fecha de entrega del Sistema de Diseño v2.',
  },
  {
    id: 'preset-berlin-direct',
    label: 'Berlín (Bajo contexto / Crítica técnica directa)',
    originSite: 'berlin',
    author: 'Jorge Moranchel',
    siteLabel: 'Berlín',
    email: 'jorge.moranchel@sync2030.global',
    rawText: 'Esto está mal, hay que rehacerlo.',
    context: 'Revisión técnica de integración de contratos de API.',
  },
  {
    id: 'preset-berlin-scope',
    label: 'Berlín (Solicitud de nuevo módulo en sprint)',
    originSite: 'berlin',
    author: 'Jorge Moranchel',
    siteLabel: 'Berlín',
    email: 'jorge.moranchel@sync2030.global',
    rawText: 'Necesitamos agregar un nuevo módulo de analíticas en este sprint para cerrar el ciclo.',
    context: 'Petición sobrevenida durante la sesión de alineación.',
  },
  {
    id: 'preset-gdl-speed',
    label: 'Guadalajara (Iteración rápida / Liberación continua)',
    originSite: 'guadalajara',
    author: 'Brayan Beltrán',
    siteLabel: 'Guadalajara',
    email: 'brayan.beltran@sync2030.global',
    rawText: 'Liberemos esta versión hoy y vamos corrigiendo detalles sobre la marcha.',
    context: 'Despliegue del endpoint de autenticación.',
  },
];

// Reportes iniciales por integrante activo ("Mi Reporte para el Gemelo")
export const MEMBER_DEFAULT_REPORTS = {
  'osvaldo-meza': {
    advances: '1. Tablero por valor estructurado con límite WIP en 2 tarjetas por persona.\n2. Criterios de aceptación estandarizados para pases a producción.\n3. Monitoreo del avance global del sprint 12 sin sobreasignación horaria.',
    pendings: '1. Facilitación de sesión de alineación sobre contratos de integración entre sedes.\n2. Revisión de tiempos de respuesta asíncronos en el canal de ingeniería.',
    blockers: 'Pendiente de confirmación del acuerdo de horas de corte entre Guadalajara y Berlín.',
    lastUpdated: 'Hoy a las 09:15 CST',
  },
  'jorge-moranchel': {
    advances: '1. Arquitectura del Gemelo de Sincronía desacoplada en capa de servicios.\n2. Motor determinista de análisis semántico y traducción de intenciones.\n3. Integración de candados inviolables contra compromisos no autorizados.',
    pendings: '1. Conexión de interfaz con el Tablero por Valor para sincronización bidireccional.\n2. Pruebas de resiliencia con el protocolo de respaldo manual rotativo.',
    blockers: 'Ninguno en este momento. Módulo de IA listo para operar offline.',
    lastUpdated: 'Hoy a las 14:20 CET',
  },
  'alan-gadiel': {
    advances: '1. Exportación de tokens de diseño v2 en JSON compatible con Tailwind.\n2. Componentes base en Figma documentados con estados hover y dark mode.\n3. Mapeo de pantallas para el Escudo Anti-Fatiga y salas inmersivas.',
    pendings: '1. Alinear con Backend (Brayan Beltrán) las especificaciones de padding en contratos de API.\n2. Ratificar fechas de entrega del sprint evitando horas extraordinarias.',
    blockers: 'Riesgo de sobrecarga si se incorporan nuevos requerimientos sin planificar.',
    lastUpdated: 'Hoy a las 18:30 JST',
  },
  'brayan-beltran': {
    advances: '1. Microservicios de sincronización con almacenamiento local robusto.\n2. Reglas de cálculo horario de zonas UTC+9, UTC+1 y UTC-6.\n3. Enrutamiento del Escudo Anti-Fatiga para envíos programados.',
    pendings: '1. Pruebas de integración de endpoints con el sistema de tokens de diseño.\n2. Validar con Berlín el esquema GraphQL antes del release.',
    blockers: 'Se requiere consenso sobre la validación estricta de esquemas antes de desplegar.',
    lastUpdated: 'Hoy a las 11:00 CST',
  },
  'nicholas-sotelo': {
    advances: '1. Esquema de métricas para el % de aplicación de las 8 prácticas.\n2. Auditoría del Semáforo Cultural y contadores regresivos de 24 horas.\n3. Normalización de registros de decisiones para auditoría continua.',
    pendings: '1. Consolidar el panel de indicadores de retorno (horas en vivo, bienestar digital).\n2. Automatizar asignación de embajadores neutrales en conflictos nivel rojo.',
    blockers: 'A la espera del cierre de la jornada de Berlín para consolidar datos de la semana.',
    lastUpdated: 'Hoy a las 10:45 CST',
  },
  'ivan-ortega': {
    advances: '1. Matriz de validación para las 7 reglas operativas de SYNC 2030.\n2. Auditoría de accesibilidad y consistencia de diseño en desktop.\n3. Verificación de compilación limpia y ausencia de dependencias externas.',
    pendings: '1. Revisar trazabilidad de minutas entre sesiones asíncronas.\n2. Inspeccionar flujo de solicitudes de aclaración por correo.',
    blockers: 'Ninguno crítico.',
    lastUpdated: 'Hoy a las 15:10 CET',
  },
  'fernando-garrido': {
    advances: '1. Documentación de políticas de agenda previa de 24 horas y actas oficiales.\n2. Lineamientos del Escudo Anti-Fatiga (pausas de 10 min tras 2h inmersivas).\n3. Glosario intercultural para Tokio, Berlín y Guadalajara.',
    pendings: '1. Archivar minutas de la sesión táctica semanal.\n2. Revisar índice de respuestas asíncronas dentro de las 24 horas hábiles.',
    blockers: 'Requiere firmas de aprobación humana en dos minutas pendientes.',
    lastUpdated: 'Hoy a las 17:50 JST',
  },
};

/**
 * Detecta si el mensaje contiene solicitudes de cambio de alcance o módulos nuevos
 */
export function detectScopeChange(text) {
  if (!text) return false;
  const normalized = text.toLowerCase();
  const scopeKeywords = [
    'nuevo módulo',
    'nuevo modulo',
    'nuevos módulos',
    'nuevos modulos',
    'cambiar alcance',
    'cambio de alcance',
    'nueva funcionalidad',
    'nuevas funcionalidades',
    'agregar pantalla',
    'agregar funcionalidad',
    'extender alcance',
    'meter otro requerimiento',
    'ampliar sprint',
    'incluir modulo',
    'incluir módulo',
    'añadir módulo',
    'añadir modulo',
    'sumar requerimiento',
  ];

  return scopeKeywords.some(keyword => normalized.includes(keyword));
}

/**
 * Analiza el tono cultural y semántico del mensaje de forma determinista y local
 */
export function analyzeCulturalTone(rawText, originSite = 'tokio') {
  const text = (rawText || '').trim();
  const isScope = detectScopeChange(text);

  // Caso 1: Detección de cambio de alcance o módulo nuevo (Candado inviolable)
  if (isScope) {
    return {
      type: 'scope_change',
      isScopeChange: true,
      originalText: text,
      detectedCulture: originSite,
      riskLevel: 'rojo',
      interpretationRisk: 'Intento de compromiso no planificado que alteraría la capacidad pactada para el sprint.',
      intendedMeaning: 'Se está solicitando incorporar una nueva funcionalidad o módulo que no forma parte del alcance acordado en el tablero.',
      culturalAdvice: 'El Gemelo tiene prohibición estricta de comprometer al integrante ausente o al equipo en adiciones de alcance sin deliberación previa.',
      recommendedAction: 'Rechazar compromiso inmediato y retener en la bandeja de Solicitudes y Cambios Sugeridos.',
      gemeloReply: 'Como Gemelo de Sincronía, no tengo facultades para comprometer al equipo en nuevos módulos ni modificaciones de alcance. He canalizado formalmente la solicitud a la bandeja de Solicitudes y Cambios Sugeridos para deliberación y aprobación humana.',
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
    lower.includes('pensarlo un poco más') ||
    lower.includes('pensarlo un poco mas')
  ) {
    return {
      type: 'cultural_translation',
      isScopeChange: false,
      originalText: text,
      detectedCulture: 'tokio',
      culturalStyle: 'Alto contexto (Comunicación implícita orientada a la armonía relacional)',
      riskLevel: 'amarillo',
      interpretationRisk: 'Berlín o Guadalajara pueden interpretar erróneamente que la revisión es opcional o de baja prioridad.',
      intendedMeaning: 'No estoy de acuerdo con la fecha límite propuesta y considero que comprometería la calidad técnica y el diseño del entregable.',
      culturalAdvice: 'En la cultura empresarial japonesa, el desacuerdo directo con un plazo se formula como una invitación a reflexionar para preservar el consenso del grupo (Wa).',
      recommendedAction: 'Hacer explícita la objeción sobre el cronograma y pactar un criterio de aceptación sin horas extraordinarias.',
      gemeloReply: 'Comprendo la inquietud sobre los plazos. Con base en el reporte de avance de mi representado, proponemos revisar el alcance crítico para salvaguardar la calidad técnica antes de fijar la fecha final.',
    };
  }

  // Caso 3: Bajo contexto / crítica técnica directa (Ejemplo Berlín)
  if (
    lower.includes('está mal') ||
    lower.includes('esta mal') ||
    lower.includes('hay que rehacerlo') ||
    lower.includes('no sirve') ||
    lower.includes('bloquea todo') ||
    lower.includes('inaceptable')
  ) {
    return {
      type: 'cultural_translation',
      isScopeChange: false,
      detectedCulture: 'berlin',
      culturalStyle: 'Bajo contexto (Directo, pragmático y centrado estrictamente en el artefacto técnico)',
      riskLevel: 'rojo',
      interpretationRisk: 'Tokio o Guadalajara pueden percibir la frase como un juicio negativo hacia la competencia profesional de la persona.',
      intendedMeaning: 'Existe un error técnico en el contrato de integración que impide continuar; la crítica se dirige al código, no a la persona.',
      culturalAdvice: 'En los entornos de ingeniería alemanes, la retroalimentación directa y sin rodeos es sinónimo de rigor profesional y honestidad, no de hostilidad interpersonal.',
      recommendedAction: 'Despersonalizar la observación, aislar el contrato técnico afectado y acordar una sesión de revisión de esquemas.',
      gemeloReply: 'Hemos registrado la observación técnica sobre la integración. Procedemos a revisar los logs del esquema conjunto para subsanar el bloqueo técnico de inmediato.',
    };
  }

  // Caso 4: Iteración rápida / velocidad de entrega (Ejemplo Guadalajara)
  if (
    lower.includes('sobre la marcha') ||
    lower.includes('liberemos hoy') ||
    lower.includes('después arreglamos') ||
    lower.includes('despues arreglamos') ||
    lower.includes('vamos viendo')
  ) {
    return {
      type: 'cultural_translation',
      isScopeChange: false,
      detectedCulture: 'guadalajara',
      culturalStyle: 'Ágil iterativo (Orientado a la entrega continua y feedback empírico rápido)',
      riskLevel: 'amarillo',
      interpretationRisk: 'Berlín puede interpretar falta de disciplina en calidad; Tokio puede percibir riesgo reputacional para el producto.',
      intendedMeaning: 'Se busca comprobar la hipótesis de negocio cuanto antes con un despliegue controlado, asumiendo una deuda técnica acotada.',
      culturalAdvice: 'En el ecosistema tecnológico de Guadalajara se privilegia la resolución práctica; es indispensable formalizar criterios de aceptación mínimos para evitar retrabajo.',
      recommendedAction: 'Establecer una compuerta de calidad explícita con pruebas automatizadas previas al despliegue.',
      gemeloReply: 'Avanzamos con la iteración rápida bajo la condición de que los contratos críticos de API cuenten con pruebas automatizadas aprobadas en el pipeline.',
    };
  }

  // Caso 5: Comunicación neutra estándar
  return {
    type: 'cultural_translation',
    isScopeChange: false,
    originalText: text,
    detectedCulture: originSite,
    culturalStyle: 'Comunicación profesional estándar',
    riskLevel: 'verde',
    interpretationRisk: 'Bajo riesgo de fricción o malentendido intercultural.',
    intendedMeaning: text,
    culturalAdvice: 'El mensaje es directo, constructivo y respeta los principios de sincronía asíncrona.',
    recommendedAction: 'Proceder con la respuesta habitual y registrar en la bitácora.',
    gemeloReply: `Entendido: "${text}". Hemos tomado nota y queda registrado en la bitácora de sincronía para seguimiento del equipo.`,
  };
}

/**
 * Genera la respuesta del Gemelo durante una sesión de reunión
 * Expone avances del ausente, nunca compromete nuevos módulos y genera la solicitud
 */
export function processMeetingIntervention({ speaker, originSite, rawText, activeUser, userReport }) {
  const analysis = analyzeCulturalTone(rawText, originSite);
  const isScope = analysis.isScopeChange;

  let gemeloResponseText = '';

  if (isScope) {
    gemeloResponseText = `Como Gemelo de Sincronía representando a ${activeUser.name} (${activeUser.baseCity}), tengo la directriz estricta de no comprometer alcance ni nuevos módulos fuera de la planeación. He registrado la petición de ${speaker.name} (${speaker.baseCity}) en la bandeja de "Solicitudes y Cambios Sugeridos" para su deliberación y aprobación humana formal.`;
  } else if (analysis.riskLevel === 'amarillo' && originSite === 'tokio') {
    gemeloResponseText = `En representación de ${activeUser.name}: "Hemos considerado la propuesta de cronograma. Respetando el reporte de avances (${userReport?.advances ? 'avances registrados' : 'actividades en curso'}), proponemos revisar el alcance crítico para garantizar la calidad del entregable antes de comprometer la fecha final."`;
  } else if (analysis.riskLevel === 'rojo' && originSite === 'berlin') {
    gemeloResponseText = `En representación de ${activeUser.name}: "Recibimos la observación técnica de ${speaker.name}. La prioridad de nuestra jornada es resolver la integración sin fricciones. Nuestros pendientes actuales indican: ${userReport?.pendings?.split('\n')[0] || 'revisión de contratos'}. Coordinaremos la corrección de inmediato."`;
  } else {
    gemeloResponseText = `En representación de ${activeUser.name} (${activeUser.baseCity}): "${analysis.gemeloReply}"`;
  }

  const generatedRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    requesterName: speaker.name,
    requesterSite: speaker.baseCity,
    requesterEmail: speaker.email || `${speaker.id ? speaker.id.replace('-', '.') : 'integrante'}@sync2030.global`,
    requestedText: rawText,
    originalText: rawText,
    intendedMeaning: analysis.intendedMeaning,
    riskLevel: analysis.riskLevel,
    interpretationRisk: analysis.interpretationRisk,
    culturalAdvice: analysis.culturalAdvice,
    isScopeChange: isScope,
    gemeloResponse: gemeloResponseText,
    status: 'pending', // 'pending' | 'approved' | 'rejected' | 'postponed'
    createdAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    targetCardId: isScope ? 'card-3' : (analysis.riskLevel === 'rojo' ? 'card-2' : 'card-1'),
  };

  return {
    analysis,
    gemeloResponseText,
    generatedRequest,
  };
}

// Historial inicial de reuniones recientes
export const INITIAL_MEETINGS_HISTORY = [
  {
    id: 'meet-01',
    title: 'Sesión de Sincronía Táctica — Sprint 12',
    date: '21 de Noviembre, 2026',
    time: '13:00 UTC (Semana A)',
    participants: [
      { name: 'Osvaldo Meza', site: 'Guadalajara', role: 'Facilitador' },
      { name: 'Jorge Moranchel', site: 'Berlín', role: 'Ingeniero de IA' },
      { name: 'Brayan Beltrán', site: 'Guadalajara', role: 'Backend' },
      { name: 'Nicholas Sotelo', site: 'Guadalajara', role: 'Líder de Datos' },
    ],
    coveredAbsentees: [
      { name: 'Alan Gadiel', site: 'Tokio', reason: 'Huso horario nocturno (22:00 JST)' },
      { name: 'Fernando Garrido', site: 'Tokio', reason: 'Huso horario nocturno (22:00 JST)' },
    ],
    keyPoints: [
      'Presentación automática de avances de Tokio mediante su Gemelo (tokens JSON de diseño v2 concluidos).',
      'Discusión sobre la compatibilidad de contratos GraphQL entre Berlín y Guadalajara.',
      'Rechazo formal del Gemelo de Tokio a una ampliación del sprint no acordada previamente.',
    ],
    agreements: [
      'Ratificar que no se aceptan nuevos módulos sin validación previa en el Tablero por Valor.',
      'Liberar esquema v2 de tokens para pruebas de integración el próximo ciclo de mañana local.',
      'Mantener la junta de 45 minutos estrictos con agenda verificada.',
    ],
    verifiedByHuman: 'Osvaldo Meza (Scrum Master)',
  },
  {
    id: 'meet-02',
    title: 'Alineación de Arquitectura de Datos y Métricas',
    date: '18 de Noviembre, 2026',
    time: '12:00 UTC (Semana A)',
    participants: [
      { name: 'Nicholas Sotelo', site: 'Guadalajara', role: 'Líder de Datos' },
      { name: 'Jorge Moranchel', site: 'Berlín', role: 'Ingeniero de IA' },
      { name: 'Iván Ortega', site: 'Berlín', role: 'Aseguramiento de Calidad' },
    ],
    coveredAbsentees: [
      { name: 'Alan Gadiel', site: 'Tokio', reason: 'Turno asíncrono' },
    ],
    keyPoints: [
      'Revisión del cálculo ponderado de las 8 prácticas para el indicador del % de aplicación.',
      'Configuración de las reglas de disparo del Semáforo Cultural (reloj regresivo de 24 horas para rojos).',
    ],
    agreements: [
      'El 15% del peso de adopción corresponde a la firma humana obligatoria con el Gemelo.',
      'Asignación automática de embajador neutral cuando se active alerta roja entre sedes.',
    ],
    verifiedByHuman: 'Nicholas Sotelo (Líder de Datos)',
  },
];

// Solicitudes iniciales precargadas para la bandeja de Aprobación Humana
export const INITIAL_SUGGESTED_REQUESTS = [
  {
    id: 'req-seed-tokio',
    requesterName: 'Alan Gadiel',
    requesterSite: 'Tokio',
    requesterEmail: 'alan.gadiel@sync2030.global',
    requestedText: 'Quizá sería posible revisar esto con más calma.',
    originalText: 'Quizá sería posible revisar esto con más calma.',
    intendedMeaning: 'No estoy de acuerdo con la fecha límite propuesta y considero que comprometería la calidad técnica y el diseño del entregable.',
    riskLevel: 'amarillo',
    interpretationRisk: 'Berlín o Guadalajara pueden interpretar erróneamente que la revisión es opcional o de baja prioridad.',
    culturalAdvice: 'En la cultura empresarial japonesa, el desacuerdo directo con un plazo se formula como una invitación a reflexionar para preservar el consenso del grupo (Wa).',
    isScopeChange: false,
    gemeloResponse: 'Comprendo la inquietud sobre los plazos. Con base en el reporte de avance de mi representado, proponemos revisar el alcance crítico para salvaguardar la calidad técnica antes de fijar la fecha final.',
    status: 'pending',
    createdAt: 'Hoy a las 13:12 UTC',
    targetCardId: 'card-1',
  },
  {
    id: 'req-seed-berlin',
    requesterName: 'Jorge Moranchel',
    requesterSite: 'Berlín',
    requesterEmail: 'jorge.moranchel@sync2030.global',
    requestedText: 'Esto está mal, hay que rehacerlo.',
    originalText: 'Esto está mal, hay que rehacerlo.',
    intendedMeaning: 'Existe un error técnico en el contrato de integración que impide continuar; la crítica se dirige al artefacto de código, no a la persona.',
    riskLevel: 'rojo',
    interpretationRisk: 'Tokio o Guadalajara pueden percibir la frase como un juicio negativo hacia la competencia profesional de la persona.',
    culturalAdvice: 'En los entornos de ingeniería alemanes, la retroalimentación directa y sin rodeos es sinónimo de rigor profesional y honestidad, no de hostilidad interpersonal.',
    isScopeChange: false,
    gemeloResponse: 'Hemos registrado la observación técnica sobre la integración. Procedemos a revisar los logs del esquema conjunto para subsanar el bloqueo técnico de inmediato.',
    status: 'pending',
    createdAt: 'Hoy a las 13:20 UTC',
    targetCardId: 'card-2',
  },
  {
    id: 'req-seed-scope',
    requesterName: 'Iván Ortega',
    requesterSite: 'Berlín',
    requesterEmail: 'ivan.ortega@sync2030.global',
    requestedText: 'Necesitamos agregar un nuevo módulo de analíticas en este sprint para cerrar el ciclo.',
    originalText: 'Necesitamos agregar un nuevo módulo de analíticas en este sprint para cerrar el ciclo.',
    intendedMeaning: 'Se está solicitando incorporar una nueva funcionalidad o módulo que no forma parte del alcance acordado en el tablero.',
    riskLevel: 'rojo',
    interpretationRisk: 'Intento de compromiso no planificado que alteraría la capacidad pactada para el sprint.',
    culturalAdvice: 'El Gemelo tiene prohibición estricta de comprometer al integrante ausente o al equipo en adiciones de alcance sin deliberación previa.',
    isScopeChange: true,
    gemeloResponse: 'Como Gemelo de Sincronía, no tengo facultades para comprometer al equipo en nuevos módulos ni modificaciones de alcance. He canalizado formalmente la solicitud a la bandeja de Solicitudes y Cambios Sugeridos para deliberación y aprobación humana.',
    status: 'pending',
    createdAt: 'Hoy a las 13:28 UTC',
    targetCardId: 'card-3',
  },
];
