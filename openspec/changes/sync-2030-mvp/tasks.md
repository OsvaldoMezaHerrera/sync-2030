# Tasks: SYNC 2030 MVP

## 1. Inicialización y configuración del proyecto

- [x] 1.1 Inicializar el proyecto React + Vite + Tailwind CSS + Lucide React en la raíz (`/home/osvl/Proyectos/sync-2030`), configurar `index.html` en español con título **SYNC 2030** y verificar que `npm install && npm run build` compilan sin errores.
- [x] 1.2 Crear `src/data/seedData.js` con los 7 integrantes reales (Osvaldo Meza, Jorge Moranchel, Alan Gadiel, Brayan Beltrán, Nicholas Sotelo, Iván Ortega, Fernando Garrido), tarjetas semilla (incluyendo tarjeta incompleta para Prueba #4 y tarjetas para las 3 combinaciones de sedes), mensajes culturales precargados, 8 prácticas ponderadas (suma = 100%) y 7 indicadores de retorno; verificar consistencia de pesos y estructura.

## 2. Motores de dominio y estado persistente

- [x] 2.1 Implementar los módulos puros en `src/utils/` y `src/services/gemeloService.js` (traductor de tono Tokio/Berlín/Guadalajara + detector de cambio de alcance desacoplado para LLM futuro, timezoneUtils con relojes y Escudo Anti-Fatiga); verificar determinismo y respuesta a casos límite.
- [x] 2.2 Implementar `src/context/SyncContext.jsx` con sincronización automática con `localStorage` (`sync2030_state_v1`), incluyendo acción `resetDemoData`, selector de integrante activo, candado de aprobación humana, persistencia tras recargar y restauración limpia al reiniciar.

## 3. Shell de navegación y controles de Demo

- [x] 3.1 Construir `Sidebar.jsx`, `TopBar.jsx` con la identidad **SYNC 2030** (*"No gestionamos horas. Gestionamos impacto."*), selector de los 7 integrantes reales, menú discreto de ajustes de entorno y placeholders funcionales; verificar navegación entre las 4 vistas sin errores de consola.

## 4. Vista 1: Panel Global y Juntas Asíncronas

- [x] 4.1 Implementar `PanelGlobalView.jsx` con relojes en vivo y estado `Activo`/`Descanso` para Tokio, Berlín y Guadalajara, selector de Horario Rotativo (Semana A 12:00 UTC y Semana B 13:00 UTC con compensación de Berlín), simulador de Escudo Anti-Fatiga (con perspectiva horaria para pruebas nocturnas) y reglas de bienestar.
- [x] 4.2 Implementar la Política de Agenda 24h (bloqueo/cancelación de sala si falta agenda previa) y los Espacios Inmersivos (Sala de Alineación con avatares, tablero compartido y sin reloj visible; Sala de Ensayo; Sala de Mentoría; Sala de Calma).

## 5. Vista 2: Gemelo de Sincronía

- [x] 5.1 Implementar `GemeloSincroniaView.jsx` con reporte previo del ausente, consola de minuta estructurada, traductor de tono cultural con presets y entrada libre, candado inviolable *"El humano siempre aprueba"* con botones `Aprobar y sincronizar`, `Editar` y `Rechazar`, y bandeja de solicitudes de alcance no autorizadas.
- [x] 5.2 Implementar el interruptor de Modo Respaldo Manual que desactiva el motor de IA y activa el registro de bitácora manual rotativa con firma humana sin perder decisiones, conectando la aprobación de propuestas con la actualización de la tarjeta correspondiente en el Tablero por Valor.

## 6. Vista 3: Tablero por Valor + Semáforo Cultural

- [ ] 6.1 Implementar `TableroValorView.jsx` con columnas `Por hacer`, `En curso` (máximo 2 tarjetas por persona), `En revisión` y `Terminado`, creación/edición de tarjetas con dueño, criterio de aceptación, OKR, sedes y Semáforo Cultural, y validación de regla estricta de entrada a `En curso` (Prueba #4).
- [ ] 6.2 Implementar la lógica interactiva del Semáforo Cultural (Verde/Amarillo/Rojo) con cuenta regresiva visible de 24:00:00 y asignación automática del embajador neutral para Tokio–Berlín (Brayan Beltrán), Guadalajara–Berlín (Alan Gadiel) y Tokio–Guadalajara (Osvaldo Meza con apoyo de Berlín); verificar Pruebas #3 y #4 en vivo.

## 7. Vista 4: Medición (% de Aplicación y Retorno)

- [ ] 7.1 Implementar `MedicionView.jsx` con la calculadora interactiva de las 8 prácticas ponderadas (pesos, responsables y cadencias exactas), clasificación automática (`Consolidado` ≥85%, `En adopción` 70–84.9%, `En riesgo` <70%) y panel de los 7 indicadores de retorno diferenciando `Línea base` vs `Meta semana 12 (supuesto)`; verificar cálculo exacto de la fórmula en los 3 rangos.

## 8. Verificación integral, Demo 90s y cierre de QA

- [ ] 8.1 Ejecutar `npm run build` sin errores y validar de extremo a extremo las 7 pruebas funcionales obligatorias y el guion completo de la demostración de 90 segundos en el navegador, actualizando `memory-bank/activeContext.md` y `memory-bank/progress.md` con los resultados.
