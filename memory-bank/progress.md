# Progress: SYNC 2030

## Completado
- [x] Lectura y alineación con `AGENTS.md`, `projectbrief.md`, `productContext.md` y `techContext.md`.
- [x] Plan de arquitectura registrado y validado en OpenSpec (`openspec/changes/sync-2030-mvp/`).
- [x] Inicialización del proyecto con Vite + React + Tailwind CSS + Lucide React.
- [x] Creación de `src/data/seedData.js` con los 7 integrantes reales, salas inmersivas, 8 prácticas ponderadas, 7 indicadores de retorno y convocatorias iniciales de reunión.
- [x] Creación de `src/utils/timezoneUtils.js` con cálculo horario en vivo y Escudo Anti-Fatiga.
- [x] Creación de `src/context/SyncContext.jsx` con persistencia en `localStorage`, selector de usuario activo, ajustes de entorno ("Restaurar datos iniciales") y gestión de convocatorias a reuniones.
- [x] **Ajuste de Layout y Corrección de Scroll:**
  - Contenedor raíz con `h-screen overflow-hidden flex flex-col` en `App.jsx`.
  - `TopBar.jsx` fija en la parte superior con `shrink-0`.
  - `Sidebar.jsx` fija a la izquierda sin desplazamiento con `h-full overflow-y-auto shrink-0`.
  - Contenedor `<main>` con `useRef` y `useEffect` ligado a la vista activa que reinicia el scroll a la parte superior (`scrollTo({ top: 0, behavior: 'instant' })`).
- [x] **Bandeja Sobrepuesta de Convocatorias a Reuniones (Drawer en TopBar):**
  - Botón limpio en `TopBar.jsx` con badge indicando el número de invitaciones pendientes del usuario activo.
  - Drawer lateral deslizable (`MeetingsDrawer.jsx`) con fondo semitransparente.
  - Consulta de reuniones con título, convocante, sede, hora en zona local y estado de agenda 24h.
  - Cambio de estado de asistencia en cualquier momento: `Pendiente`, `Asistiré en vivo` o `No puedo asistir — Enviar a mi Gemelo de IA`.
  - Notificación explícita de representación con reporte guardado (Avances y Pendientes).
  - Formulario ágil para crear nuevas convocatorias con selección de sede, horario, participantes y agenda previa 24h.
- [x] **Refinamiento UI/UX y Organización por Pestañas:**
  - **Módulo 1: Panel Global y Juntas Asíncronas (`PanelGlobalView.jsx`):**
    - Pestaña 1: *Jornadas y Horario Rotativo* (Relojes por sede + Horario Semanal A/B).
    - Pestaña 2: *Gobernanza y Salas* (Política de Agenda 24h, Escudo Anti-Fatiga y Espacios Inmersivos).
  - **Módulo 2: Gemelo de Sincronía (`GemeloSincroniaView.jsx`):**
    - Pestaña 1: *Solicitudes y Aprobaciones* con contador badge de pendientes, Traductor Cultural (*Mensaje original* vs *Intención real* y semáforo) y 3 acciones operativas (Confirmar, Solicitar detalles por correo prellenado, Rechazar/Posponer).
    - Pestaña 2: *Mi Reporte al Gemelo* (Qué hice, qué falta, bloqueos y bloque de Reuniones Delegadas al Gemelo enlazadas a `SyncContext`).
    - Pestaña 3: *Minutas y Consola* (Resumen con estado vacío *"Sin reuniones recientes"*, consola interactiva de intervención y conmutador de Respaldo Manual con bitácora rotativa).
- [x] **Módulo 3: Tablero por Valor y Semáforo Cultural (`TableroValorView.jsx` y `src/utils/boardRules.js`):**
  - Tablero Kanban con 4 columnas limpias: `Por hacer`, `En curso`, `En revisión` y `Terminado`.
  - Tarjetas compactas con borde izquierdo de acento visual según el Semáforo Cultural (Verde, Amarillo o Rojo), flags de sedes (`🇯🇵 Tokio`, `🇲🇽 Guadalajara`, `🇩🇪 Berlín`), avatar del responsable, OKR vinculado y criterio de aceptación.
  - **Regla Estricta de Entrada:** Bloquea mover cualquier tarjeta a "En curso" si le falta dueño o criterio de aceptación con aviso corporativo explicativo (`GovernanceAlertModal`) y acceso directo a completarlo.
  - **Límite WIP:** Máximo 2 tarjetas en "En curso" por integrante; bloqueo inmediato y notificación de bienestar digital si se intenta asignar una tercera.
  - **Semáforo Cultural y SLA 24h:**
    - Alertas Rojas activan reloj regresivo de 24:00:00 en tiempo real y asignación automática del embajador neutral según el cruce de sedes:
      * Tokio–Berlín → Brayan Beltrán (Guadalajara).
      * Guadalajara–Berlín → Alan Gadiel (Tokio).
      * Tokio–Guadalajara → Osvaldo Meza (con apoyo de Berlín).
    - Botón en tarjetas rojas y modal especializado (`AmbassadorInterventionModal`) para registrar acuerdos de mediación cultural y pasar la tarjeta a Amarillo o Verde.
  - **Sincronización bidireccional:** Conexión en tiempo real con las aprobaciones confirmadas en el Gemelo de Sincronía.
  - Barra superior de filtros rápidos por Semáforo, por Sede y por Integrante.
  - Modal de detalle y edición rápida (`CardDetailModal`) y modal de nueva tarjeta (`NewCardModal`).
- [x] **Mejoras UI/UX, Layout Colapsable y Ordenamiento Automático:**
  - Menú lateral colapsable con botón discreto en `TopBar.jsx` y `Sidebar.jsx`, transición fluida de 200ms y expansión completa del contenedor `<main>`.
  - Ordenamiento automático estricto dentro de cada columna: Prioridad Semáforo Cultural (Rojo > Amarillo > Verde) con desempate por FIFO (marca temporal `createdAt`).
  - Indicador discreto en cabecera del tablero: "Orden: Semáforo + FIFO".
  - Scroll vertical independiente en cada una de las 4 columnas con encabezado fijo (`sticky top-0`).
  - Resaltado visual temporal (~2s) y notificación toast en la esquina inferior derecha confirmando traslados de columna y actualizaciones.
- [x] Verificación de compilación: `npm run build` ejecutado exitosamente en 1.47s sin errores ni advertencias.
- [x] Auditoría de términos de UI: 100% libre de términos prohibidos ("Demo", "Prueba QA", "Pitch", "Maqueta conceptual", etc.).

## En Curso / Próximos Hitos
- [ ] **Módulo 4:** Medición (% de Aplicación con fórmula ponderada de 8 prácticas y panel de 7 indicadores de impacto/retorno).
- [ ] Validación de extremo a extremo de las 7 pruebas funcionales y ejecución de la demostración gerencial.
