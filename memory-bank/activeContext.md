# Active Context: SYNC 2030

## Foco Actual
- **Fase:** Mejora Integral de UI/UX, Corrección de Scroll por Navegación y Flujo de Reuniones Asíncronas (Drawer en TopBar con delegación al Gemelo).
- **Estado de código:** `npm run build` pasa limpiamente en 1.40s sin errores ni advertencias. Cero términos escolares o etiquetas QA en la interfaz, 100% conforme a la Regla de Producto Real.

## Decisiones e Implementaciones Recientes

### 1. Corrección de Scroll al Cambiar de Vista (`App.jsx`)
- Se implementó `mainContentRef` con `useRef` enlazado al elemento `<main>` scrollable.
- `useEffect` suscrito a `currentView`: ejecuta `mainContentRef.current?.scrollTo({ top: 0, behavior: 'instant' })` cada vez que el usuario navega entre módulos en el Sidebar.

### 2. Bandeja Sobrepuesta de Convocatorias a Reuniones (`TopBar.jsx` y `MeetingsDrawer.jsx`)
- **Acceso Directo y Notificaciones en `TopBar`:**
  - Botón limpio de "Reuniones" con badge dinámico que contabiliza las invitaciones pendientes del integrante activo (`pendingInvitationsCount`).
  - Al hacer clic abre el drawer lateral deslizante con fondo semitransparente (`backdrop-blur-sm`).
- **Gestión Integral en el Drawer (`MeetingsDrawer.jsx`):**
  - Lista de convocatorias con título, convocante y sede, hora local calculada para el integrante activo (ej. `07:00 CST`, `14:00 CET`, `22:00 JST`) y estado de gobernanza (Agenda validada ≥24h vs Sin agenda 24h).
  - Selector de 3 estados modificable en cualquier momento: `Pendiente`, `Asistiré en vivo` o `No puedo asistir — Enviar a mi Gemelo de IA` (incluso si antes había aceptado).
  - Al delegar a su Gemelo de IA, se muestra un aviso explícito confirmando que el Gemelo asistirá presentando el reporte guardado (Avances y Pendientes).
  - Formulario de **Nueva Convocatoria:** permite definir título, sede convocante, horario base (12:00 UTC, 13:00 UTC, 14:30 UTC), participantes convocados y cumplimiento de agenda validada ≥24h con temas específicos.

### 3. Refinamiento UI/UX y Menor Densidad Visual
- **`PanelGlobalView.jsx` (2 Pestañas Internas Limpias):**
  1. *Jornadas y Horario Rotativo:* Relojes por sede en vivo (Guadalajara, Berlín, Tokio) con estado Activo/Descanso, selector de perspectiva horaria y Horario Semanal A/B con compensación equitativa para Berlín.
  2. *Gobernanza y Salas:* Política de Agenda 24h con conmutador de validación, Escudo Anti-Fatiga con cola de entrega programada, y Espacios Inmersivos (Sala de Alineación en vivo con avatares o bloqueada si falta agenda previa; Salas de Ensayo, Mentoría y Calma).
- **`GemeloSincroniaView.jsx` (3 Pestañas Internas Limpias):**
  1. *Solicitudes y Aprobaciones:* Contador badge de solicitudes pendientes en la pestaña; solicitudes con solicitante/sede, bloque de Traductor Cultural (*Mensaje original* vs *Intención real* y semáforo de riesgo) y las 3 acciones: Confirmar/Aprobar, Solicitar detalles por correo (con modal prellenado corporativo) y Rechazar/Posponer.
  2. *Mi Reporte al Gemelo:* Formulario editable por integrante activo (avances, pendientes, bloqueos), confirmación de sincronización y **bloque de Reuniones Delegadas al Gemelo** enlazado a `SyncContext` con acceso directo a la bandeja.
  3. *Minutas y Consola:* Resumen de minutas recientes con estado vacío oficial *"Sin reuniones recientes"*, consola interactiva de intervenciones con presets interculturales y Modo Respaldo Manual con bitácora rotativa.

## Siguientes Pasos
- Construir el **Módulo 3: Tablero por Valor + Semáforo Cultural** (`TableroValorView.jsx` y `src/utils/boardRules.js`):
  - Columnas Kanban (`Por hacer`, `En curso` con límite WIP ≤ 2 por persona, `En revisión`, `Terminado`).
  - Regla estricta de entrada a `En curso` (bloqueo si falta dueño o criterio de aceptación).
  - Semáforo Cultural con cuenta regresiva en vivo de 24:00:00 y asignación automática del embajador neutral según el par de sedes en conflicto.
