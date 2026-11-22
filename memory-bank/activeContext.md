# Active Context: SYNC 2030

## Foco Actual
- **Fase:** Módulo 1 completado y compilado con éxito.
- **Estado de código:** El proyecto compila limpiamente (`npm run build` en 1.50s sin errores). Layout, navegación, datos semilla y la Vista 1 (Panel Global y Juntas Asíncronas) están plenamente operativos.

## Decisiones e Implementaciones Recientes
- Se configuró Vite + React + Tailwind CSS + Lucide React en la raíz `/home/osvl/Proyectos/sync-2030`.
- Se crearon los datos semilla oficiales en `src/data/seedData.js` con los 7 integrantes reales:
  - Osvaldo Meza (Líder / Scrum Master)
  - Jorge Moranchel (Ingeniero de IA)
  - Alan Gadiel (Frontend / Embajador cultural de Tokio)
  - Brayan Beltrán (Backend / Embajador cultural de Guadalajara)
  - Nicholas Sotelo (Líder de datos / Semáforo Cultural)
  - Iván Ortega (QA / Auditor de las 7 pruebas)
  - Fernando Garrido (Documentador / Escudo Anti-Fatiga)
- Se implementó `src/utils/timezoneUtils.js` con soporte en tiempo real y selector de escenarios horarios simulados (Permite demostrar la Prueba QA #6 a cualquier hora del día forzando descanso nocturno en Tokio, Berlín o Guadalajara).
- Se implementó `SyncContext.jsx` con persistencia en `localStorage` y botón de `Reiniciar datos demo`.
- Se construyó el layout institucional en `TopBar.jsx` y `Sidebar.jsx` con la marca **SYNC 2030** (*"No gestionamos horas. Gestionamos impacto."*) y navegación activa entre las 4 vistas.
- Se implementó `PanelGlobalView.jsx` que cubre:
  1. Relojes en vivo y badge de `Jornada Activa` / `Descanso` para Tokio (UTC+9), Berlín (UTC+1) y Guadalajara (UTC-6).
  2. Horario Rotativo de 45 min con selector de Semana A (12:00 UTC) y Semana B (13:00 UTC), detallando el principio de sacrificio equitativo y la regla de compensación de Berlín (envía agenda 24h antes y coordina acta).
  3. **Prueba QA #5 (Validador de Junta con Agenda 24h):** Bloqueo/cancelación de la Sala de Alineación si no hay agenda previa con botón para simular o validar la agenda.
  4. **Prueba QA #6 (Escudo Anti-Fatiga):** Retención automática de mensajes no urgentes dirigidos a sedes en descanso, programándolos para las 09:00 hora local del destinatario con cola visible.
  5. **Maqueta Conceptual de las 4 Salas Inmersivas:** Sala de Alineación (claramente etiquetada como maqueta, con avatares de los 7 integrantes, cámara opcional, tablero compartido en vivo y sin reloj visible), Sala de Ensayo, Sala de Mentoría y Sala de Calma.

## Siguientes Pasos
1. Implementar el **Módulo 2: Gemelo de Sincronía** (`GemeloSincroniaView.jsx` y `culturalEngine.js`):
   - Cobertura de ausencias y reporte previo.
   - Traductor cultural con casos precargados (Tokio: *"Quizá sería posible revisar esto con más calma"*, Berlín: *"Esto está mal, hay que rehacerlo"*).
   - Candado inviolable *"El humano siempre aprueba"* (Prueba QA #1 y #2).
   - Bloqueo y bandeja de cambios de alcance no autorizados.
   - Botón `Simular Falla de IA` con resumen manual rotativo (Prueba QA #7).
2. Conectar la aprobación humana del mensaje de Tokio con la actualización de la tarjeta en el Tablero por Valor para completar la secuencia de la demo de 90 segundos.
