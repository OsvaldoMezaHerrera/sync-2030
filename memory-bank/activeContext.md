# Active Context: SYNC 2030

## Foco Actual
- **Fase:** Módulo 2 (Gemelo de Sincronía) completado y compilado con éxito.
- **Estado de código:** `npm run build` pasa limpiamente en 1.49s sin errores. Toda la interfaz cumple al 100% con la Regla de Producto Real (sin términos escolares ni etiquetas QA).

## Decisiones e Implementaciones Recientes (Módulo 2)
- **Servicio Desacoplado (`src/services/gemeloService.js`):**
  - Implementación 100% local y determinista (cero consumo de tokens, compatible offline).
  - Análisis cultural con detección de intenciones:
    - Tokio (alto contexto indirecto): *"Quizá sería posible revisar esto con más calma"* → Desacuerdo con la fecha límite / protección de calidad.
    - Berlín (bajo contexto directo): *"Esto está mal, hay que rehacerlo"* → Error técnico de integración, no ataque personal.
    - Guadalajara (iteración rápida): Orientación a entrega empírica con compuerta de calidad.
  - Detector de cambio de alcance (`detectScopeChange`): Detecta peticiones no planificadas de nuevos módulos o alteración del sprint y bloquea el compromiso automático.
- **Estado Global (`SyncContext.jsx`):**
  - Añadido `twinAiEnabled`, `pendingProposals`, `pendingScopeRequests`, `manualSummaries`, `sessionMinutes`.
  - Acción `approveProposal`: Registra la firma humana de la persona activa y sincroniza de inmediato la tarjeta correspondiente en el Tablero por Valor (`card-1`).
  - Acción `rejectProposal` y `addManualSummary`.
- **Vista [`GemeloSincroniaView.jsx`](file:///home/osvl/Proyectos/sync-2030/src/components/views/GemeloSincroniaView.jsx):**
  - **Panel de Cobertura de Ausencia:** Reporte previo del ausente por huso horario (Alan Gadiel - Tokio) con entregables terminados, pendientes críticos y directrices permanentes.
  - **Consola de Minuta Estructurada:** Acuerdos y acciones por sede, con firma humana requerida para su publicación oficial.
  - **Traductor de Tono Cultural:** Presets rápidos, diagnóstico de riesgo, comparativa *Mensaje Original* vs *Intención Real*, y botón de transferencia a la bandeja de aprobación humana.
  - **Candado de Aprobación Humana ("El humano siempre aprueba"):** Bandeja de propuestas con botones `Aprobar y sincronizar`, `Editar` y `Rechazar`, enlace directo hacia el Tablero por Valor tras aprobar, y bandeja de solicitudes de alcance retenidas por el Gemelo.
  - **Interruptor de Modo Respaldo Manual:** Conmutador en el encabezado que desactiva la IA y activa el protocolo de bitácora manual rotativo preservando las decisiones previas.

## Siguientes Pasos
- Construir el **Módulo 3: Tablero por Valor + Semáforo Cultural** (`TableroValorView.jsx` y `src/utils/boardRules.js`):
  - Columnas Kanban (`Por hacer`, `En curso` con WIP ≤ 2 por persona, `En revisión`, `Terminado`).
  - Regla estricta de entrada a `En curso` (bloqueo si falta dueño o criterio de aceptación).
  - Semáforo Cultural (Verde, Amarillo, Rojo con cuenta regresiva en vivo de 24:00:00 y asignación automática del embajador neutral según el par de sedes en conflicto).
