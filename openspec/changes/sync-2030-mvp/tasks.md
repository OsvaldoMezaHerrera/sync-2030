# Tasks: SYNC 2030 MVP

## 1. Inicialización y configuración del proyecto

- [x] 1.1 Inicializar el proyecto React + Vite + Tailwind CSS + Lucide React en la raíz (`/home/osvl/Proyectos/sync-2030`), configurar `index.html` en español con título **SYNC 2030** y verificar que `npm install && npm run build` compilan sin errores.
- [x] 1.2 Crear `src/data/seedData.js` con los 7 integrantes reales (Osvaldo Meza, Jorge Moranchel, Alan Gadiel, Brayan Beltrán, Nicholas Sotelo, Iván Ortega, Fernando Garrido), tarjetas semilla (incluyendo tarjeta incompleta para Prueba #4 y tarjetas para las 3 combinaciones de sedes), mensajes culturales precargados, 8 prácticas ponderadas (suma = 100%) y 7 indicadores de retorno; verificar consistencia de pesos y estructura.

## 2. Motores de dominio y estado persistente

- [ ] 2.1 Implementar los módulos puros en `src/utils/`: `culturalEngine.js` (traductor de tono Tokio/Berlín/Guadalajara + detector de cambio de alcance + cliente opcional OpenAI/LiteLLM con fallback local), `timezoneUtils.js` (relojes Tokio UTC+9, Berlín UTC+1, Guadalajara UTC-6, Escudo Anti-Fatiga y countdown 24h), `boardRules.js` (regla de entrada, WIP ≤ 2, asignación de embajador neutral) y `metricsCalculator.js` (fórmula de 8 prácticas y semáforo de adopción); verificar que cada regla responda correctamente a sus casos límite.
- [x] 2.2 Implementar `src/context/SyncContext.jsx` con sincronización automática con `localStorage` (`sync2030_state_v1`), incluyendo acción `resetDemoData`, selector de integrante activo y persistencia tras recargar y restauración limpia al reiniciar.

## 3. Shell de navegación y controles de Demo

- [x] 3.1 Construir `Sidebar.jsx`, `TopBar.jsx` con la identidad **SYNC 2030** (*"No gestionamos horas. Gestionamos impacto."*), selector de los 7 integrantes reales, botón visible `Reiniciar datos demo` y placeholders funcionales; verificar navegación entre las 4 vistas sin errores de consola.

## 4. Vista 1: Panel Global y Juntas Asíncronas

- [x] 4.1 Implementar `PanelGlobalView.jsx` con relojes en vivo y estado `Activo`/`Descanso` para Tokio, Berlín y Guadalajara, selector de Horario Rotativo (Semana A 12:00 UTC y Semana B 13:00 UTC con compensación de Berlín), simulador de Escudo Anti-Fatiga (con opción de simular hora nocturna para Prueba #6) y reglas de bienestar.
- [x] 4.2 Implementar el Validador de Junta con Agenda 24h antes (bloqueo/cancelación si falta agenda — Prueba #5) y la maqueta conceptual claramente etiquetada de las 4 Salas Inmersivas (Sala de Alineación con avatares, tablero compartido y sin reloj visible; Sala de Ensayo; Sala de Mentoría; Sala de Calma); verificar Pruebas #5 y #6 en vivo.

## 5. Vista 2: Gemelo de Sincronía

- [ ] 5.1 Implementar `GemeloSincroniaView.jsx` con reporte previo del ausente, borrador de minuta automática, traductor de tono cultural con frases precargadas y entrada libre (Prueba #2), candado inviolable *"El humano siempre aprueba"* con botones `Aprobar`, `Editar y aprobar` y `Rechazar` (Prueba #1), y bandeja `Pendiente de aprobación humana` para cambios de alcance/módulos nuevos.
- [ ] 5.2 Implementar el botón `Simular Falla de IA` que apaga el Gemelo y activa el registro de resumen manual rotativo con aprobación humana sin perder decisiones (Prueba #7) y conectar la aprobación del mensaje de Tokio con la actualización inmediata de la tarjeta en el Tablero por Valor; verificar Pruebas #1, #2 y #7 en vivo.

## 6. Vista 3: Tablero por Valor + Semáforo Cultural

- [ ] 6.1 Implementar `TableroValorView.jsx` con columnas `Por hacer`, `En curso` (máximo 2 tarjetas por persona), `En revisión` y `Terminado`, creación/edición de tarjetas con dueño, criterio de aceptación, OKR, sedes y Semáforo Cultural, y validación de regla estricta de entrada a `En curso` (Prueba #4).
- [ ] 6.2 Implementar la lógica interactiva del Semáforo Cultural (Verde/Amarillo/Rojo) con cuenta regresiva visible de 24:00:00 y asignación automática del embajador neutral para Tokio–Berlín (Brayan Beltrán), Guadalajara–Berlín (Alan Gadiel) y Tokio–Guadalajara (Osvaldo Meza con apoyo de Berlín); verificar Pruebas #3 y #4 en vivo.

## 7. Vista 4: Medición (% de Aplicación y Retorno)

- [ ] 7.1 Implementar `MedicionView.jsx` con la calculadora interactiva de las 8 prácticas ponderadas (pesos, responsables y cadencias exactas), clasificación automática (`Consolidado` ≥85%, `En adopción` 70–84.9%, `En riesgo` <70%) y panel de los 7 indicadores de retorno diferenciando `Línea base` vs `Meta semana 12 (supuesto)`; verificar cálculo exacto de la fórmula en los 3 rangos.

## 8. Verificación integral, Demo 90s y cierre de QA

- [ ] 8.1 Ejecutar `npm run build` sin errores y validar de extremo a extremo las 7 pruebas funcionales obligatorias y el guion completo de la demostración de 90 segundos en el navegador, actualizando `memory-bank/activeContext.md` y `memory-bank/progress.md` con los resultados.
