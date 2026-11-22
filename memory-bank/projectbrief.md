# Project Brief: SYNC 2030 (Plan de Intervención Gerencial - Horizonte 2030)

## Propósito y Demo de 90 Segundos (Pitch Directivo)
Prototipo web funcional para defender ante el panel el sistema **SYNC 2030** para equipos híbridos globales en tres sedes: **Tokio (Diseño)**, **Guadalajara (Ingeniería)** y **Berlín (Ingeniería)**.
Debe permitir ejecutar en vivo la **demostración de 90 segundos**:
1. Entra un mensaje ambiguo de Tokio al Gemelo de Sincronía.
2. El Gemelo traduce el tono ("lo que realmente quiso decir") y el Semáforo lo marca en amarillo o rojo.
3. Un integrante de Guadalajara aprueba o corrige la respuesta con un clic ("El humano siempre aprueba").
4. La tarjeta del tablero por valor se actualiza con dueño, criterio de aceptación, OKR y color del Semáforo.
5. Se muestra la vista conceptual (claramente etiquetada como maqueta) de la Sala de Alineación inmersiva con avatares.

## Equipo Real (Datos Semilla)
- **Osvaldo Meza:** Líder del proyecto / Scrum Master (Transversal) — Dueño del Tablero por valor.
- **Jorge Moranchel:** Ingeniero de IA (Ref: Berlín) — Dueño del Gemelo de Sincronía.
- **Alan Gadiel:** Frontend / Embajador cultural de Tokio.
- **Brayan Beltrán:** Backend / Embajador cultural de Guadalajara.
- **Nicholas Sotelo:** Bases de datos / Líder de datos (Ref: Guadalajara) — Dueño del Semáforo Cultural y medición.
- **Iván Ortega:** QA (Ref: Berlín / propuesta embajador Berlín) — Ejecuta las 7 pruebas y auditoría semanal.
- **Fernando Garrido:** Documentador (Ref: Tokio) — Registro de decisiones, actas y Escudo Anti-Fatiga.

## Módulos Principales (4 Vistas en Barra Lateral)
1. **Panel Global y Juntas Asíncronas:**
   - Relojes en vivo y estado de jornada (Activo / Descanso) para Tokio (UTC+9), Berlín (UTC+1) y Guadalajara (UTC-6).
   - Selector de Horario Rotativo de la junta semanal de 45 min (Semana A y Semana B).
   - Simulador de **Escudo Anti-Fatiga** (mensajes no urgentes fuera de horario local se programan para la mañana del destinatario) y **Validador de Junta con Agenda** (bloquea/cancela la sala si no hay agenda 24h antes).
   - Vista de **4 Salas Inmersivas (Maqueta conceptual):** Sala de Alineación (avatares, tablero compartido, sin reloj visible), Sala de Ensayo, Sala de Mentoría y Sala de Calma.

2. **Gemelo de Sincronía (Asistente de IA y Ausencia):**
   - Cubre ausencias por huso horario: expone el reporte previo del ausente (qué hizo y qué falta) y toma minuta automática.
   - **Traductor de tono cultural:** detecta frases de alto contexto (Tokio) y bajo contexto directo (Berlín) mostrando "Qué dijo" vs "Lo que realmente quiso decir".
   - **Candado inviolable ("El humano siempre aprueba"):** ningún mensaje ni compromiso sale sin clic humano (Aprobar / Editar / Rechazar). Si en una reunión alguien pide un módulo nuevo o cambio de alcance, el Gemelo rechaza comprometerse y lo guarda en "Pendiente de aprobación humana".
   - **Botón "Simular Falla de IA" (Plan Manual / Escenario 3):** apaga el Gemelo y activa el modo de resúmenes manuales rotativos sin perder decisiones.

3. **Tablero por Valor + Semáforo Cultural:**
   - Columnas: `Por hacer`, `En curso` (máximo 2 tarjetas por persona), `En revisión`, `Terminado`.
   - **Regla de entrada estricta:** bloquea pasar una tarjeta a `En curso` si no tiene **dueño** y **criterio de aceptación** definidos. Cada tarjeta muestra también su OKR vinculado, sede afectada y color del Semáforo.
   - **Semáforo Cultural:**
     - **Verde:** bajo riesgo / ajustes menores.
     - **Amarillo:** fricción creciente / atención pronta.
     - **Rojo (Crítico):** cuenta regresiva visible de **24 horas** y asignación automática de embajador neutral:
       - Tokio–Berlín → interviene **Brayan Beltrán** (Guadalajara).
       - Guadalajara–Berlín → interviene **Alan Gadiel** (Tokio).
       - Tokio–Guadalajara → interviene **Osvaldo Meza** (con apoyo de Berlín).

4. **Medición (% de Aplicación y Retorno):**
   - Calculadora interactiva de la fórmula oficial de **8 prácticas ponderadas** (suman 100%) con clasificación automática: Consolidado (Verde ≥85%), En adopción (Amarillo 70–84.9%) y En riesgo (Rojo <70%).
   - Panel con los 7 indicadores de impacto/retorno (5 base + 2 de innovación) diferenciando claramente "Línea base" vs "Meta semana 12 (supuesto)".

## Las 7 Pruebas Funcionales Obligatorias (Criterio de Aceptación QA)
1. **El humano siempre aprueba:** ningún mensaje/compromiso del Gemelo se envía sin clic explícito.
2. **Traducción de tono:** ingresar *"Quizá sería posible revisar esto con más calma"* lo marca como desacuerdo probable y propone versión explícita.
3. **Semáforo en rojo:** marcar una tarjeta en rojo dispara alerta al embajador neutral y muestra el reloj regresivo de 24h.
4. **Regla de entrada del tablero:** intentar mover a `En curso` una tarjeta sin dueño o sin criterio de aceptación muestra bloqueo.
5. **Junta sin agenda:** intentar abrir la Sala de Alineación sin agenda 24h antes la bloquea/cancela.
6. **Escudo anti-fatiga:** enviar mensaje no urgente fuera de horario local lo programa para la mañana del destinatario.
7. **Falla de la IA:** activar modo falla apaga el Gemelo y permite registrar resumen manual rotativo con aprobación humana.
