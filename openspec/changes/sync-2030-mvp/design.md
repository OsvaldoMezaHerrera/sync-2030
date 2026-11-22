# Diseño Arquitectónico: SYNC 2030

## Context

Proyecto greenfield en `/home/osvl/Proyectos/sync-2030` sobre Fedora Linux 44 con Node.js v22 y npm. Ver `proposal.md` para la motivación y las 5 especificaciones en `specs/*/spec.md` para los contratos de comportamiento. La aplicación debe estar 100% en español, portar la marca **SYNC 2030** (*"No gestionamos horas. Gestionamos impacto."*), operar offline por defecto y pasar las 7 pruebas funcionales obligatorias de QA.

## Goals / Non-Goals

**Goals:**
- Entregar una SPA rápida, clara y ejecutiva en React + Vite + Tailwind CSS + Lucide React con 4 vistas navegables desde una barra lateral persistente.
- Garantizar determinismo y cero fallos durante la demo en vivo de 90 segundos mediante motor local de reglas culturales + estado persistente en `localStorage` + botón `Reiniciar datos demo`.
- Hacer explícitas y auditables las 7 pruebas funcionales de QA (con alertas visuales claras, bloqueos reales y contadores en vivo).
- Mantener la arquitectura modular, legible y fácil de extender con un endpoint opcional OpenAI/LiteLLM.

**Non-Goals:**
- No implementar backend propio, base de datos externa ni autenticación real con contraseñas (se usa selector de integrante activo).
- No implementar videoconferencia WebRTC ni motor 3D WebGL para las Salas Inmersivas (se diseñan como maqueta conceptual interactiva 2D claramente etiquetada).
- No depender de servicios externos ni conexión a internet para ninguna de las 7 pruebas obligatorias.

## Decisions

### 1. Gestión de estado centralizado con React Context + `localStorage`
- **Decisión:** Crear un único `SyncContext` (`src/context/SyncContext.jsx`) con `useReducer` sincronizado a `localStorage` bajo una clave versionada (`sync2030_state_v1`), inicializado desde `src/data/seedData.js`.
- **Razón:** Las 4 vistas comparten estado acoplado (aprobar una traducción en el Gemelo actualiza una tarjeta en el Tablero y se refleja en la Sala de Alineación y en las métricas). `useReducer` permite centralizar las validaciones de dominio (WIP ≤ 2, regla de entrada, embajador neutral, bloqueo de alcance) de forma predecible y auditable.
- **Alternativas consideradas:** Redux Toolkit o Zustand (descartadas para mantener cero dependencias adicionales innecesarias sobre el stack solicitado).

### 2. Motor de dominio puro en `src/utils/` (100% offline y testeable)
- **Decisión:** Separar toda la lógica de negocio en módulos puros de JavaScript:
  - `src/utils/culturalEngine.js`: analizador de tono cultural (diccionario de patrones de alto contexto Tokio, bajo contexto Berlín, iteración Guadalajara y detector de solicitudes de alcance/módulos nuevos) + conector opcional `fetch` a OpenAI/LiteLLM con fallback automático al motor local.
  - `src/utils/timezoneUtils.js`: cálculo de hora local por offset fijo/IANA (Tokio UTC+9, Berlín UTC+1, Guadalajara UTC-6), estado `Activo` (09:00–18:00 local) vs `Descanso`, cálculo de próxima mañana (09:00 local) para el Escudo Anti-Fatiga y reloj regresivo de 24h (`HH:MM:SS`).
  - `src/utils/boardRules.js`: validación de entrada a `En curso` (dueño + criterio de aceptación), límite WIP ≤ 2 por persona y tabla de asignación automática de embajador neutral por par de sedes.
  - `src/utils/metricsCalculator.js`: fórmula `% Aplicación = Σ (peso_i × cumplimiento_i) ÷ 100` y clasificación de semáforo (`Consolidado`, `En adopción`, `En riesgo`).
- **Razón:** Mantiene los componentes React enfocados en presentación e interacción, y permite validar las 7 pruebas de QA de manera determinista.

### 3. Estructura de archivos y componentes
```text
src/
├── main.jsx
├── App.jsx
├── index.css
├── context/
│   └── SyncContext.jsx
├── data/
│   └── seedData.js                 # 7 integrantes reales, tarjetas semilla, mensajes demo, 8 prácticas, 7 KPIs
├── utils/
│   ├── culturalEngine.js           # Traductor de tono + detector de cambio de alcance + cliente LLM opcional
│   ├── timezoneUtils.js            # Relojes Tokio/Berlín/Guadalajara, Escudo Anti-Fatiga, countdown 24h
│   ├── boardRules.js               # Regla de entrada, WIP <= 2, embajador neutral automático
│   └── metricsCalculator.js        # Fórmula 8 prácticas y semáforo de adopción
└── components/
    ├── layout/
    │   ├── Sidebar.jsx             # 4 vistas + estado del Gemelo + acceso rápido a Guía Demo 90s
    │   ├── TopBar.jsx              # Marca SYNC 2030, selector de integrante activo, botón Reiniciar datos demo, Ajustes LLM
    │   └── DemoBanner.jsx          # Indicador compacto opcional del progreso de la demo de 90s (pasos 1 a 5)
    ├── views/
    │   ├── PanelGlobalView.jsx     # Relojes, Semana A/B, Escudo Anti-Fatiga, Validador Agenda 24h, 4 Salas Inmersivas
    │   ├── GemeloSincroniaView.jsx # Reporte ausente, traductor de tono, candado humano, bandeja alcance, Simular Falla IA
    │   ├── TableroValorView.jsx    # Kanban 4 columnas, regla entrada, WIP, Semáforo Cultural + alerta 24h embajador
    │   └── MedicionView.jsx        # Calculadora 8 prácticas + tabla 7 indicadores (Línea base vs Meta semana 12 supuesto)
    └── shared/
        ├── SettingsModal.jsx       # Configuración opcional OpenAI/LiteLLM (desactivada por defecto)
        ├── StatusBadge.jsx         # Insignias semánticas Verde/Amarillo/Rojo y estados
        └── CountdownTimer.jsx      # Reloj regresivo en vivo de 24:00:00 para tarjetas en Rojo
```

### 4. Diseño visual ejecutivo y accesible (Tailwind CSS)
- **Decisión:** Paleta limpia de alta legibilidad sobre fondo claro neutro (`slate-50` / `white`) con barra lateral oscura (`slate-900`) para contraste ejecutivo, acentos institucionales en índigo/azul (`indigo-600`) y colores semánticos estrictos para el Semáforo Cultural (`emerald`, `amber`, `rose`).
- **Razón:** Ideal para proyección en sala ante un panel directivo (evita fatiga visual y pérdida de contraste en proyectores).

### 5. Flujo integrado de la Demo de 90 segundos
- **Decisión:** Precargar en `seedData.js` el caso exacto de la demo:
  1. Tarjeta objetivo en el Tablero (`"Integración de sistema de diseño v2 — Tokio/Guadalajara"`) vinculada al OKR `"Reducir retrabajo entre Diseño e Ingeniería en 30%"`.
  2. Mensaje precargado de Tokio (Fernando Garrido / Alan Gadiel): *"Quizá sería posible revisar esto con más calma."* disponible con un clic en el Gemelo de Sincronía.
  3. Al procesarlo, el Gemelo muestra *Qué dijo* vs *Lo que realmente quiso decir*, sugiere Semáforo **Amarillo/Rojo** y espera aprobación humana.
  4. Con el usuario activo en Guadalajara (**Brayan Beltrán** o **Nicholas Sotelo**), un clic en **"Aprobar y sincronizar con Tablero"** firma la aprobación, actualiza la tarjeta del Tablero (dueño, criterio de aceptación, OKR y color del Semáforo) y muestra un acceso directo a la **Tablero por Valor** y luego a la **Sala de Alineación (Maqueta conceptual)** con agenda ya validada o validable en 1 clic.
- **Razón:** Permite completar los 5 pasos del pitch en menos de 90 segundos sin tipear texto largo frente al panel, pero también permite escribir cualquier frase libre en vivo.

### 6. Modelo de datos principal (`seedData.js`)
- `team`: los 7 integrantes reales con `{ id, name, role, site, timezone, responsibility, avatarInitials, color }`.
- `meeting`: `{ weekMode: 'A' | 'B', agendaPublished24h: false, agendaText: '', activeRoom: null }`. (Inicia con `agendaPublished24h: false` o con toggle visible para demostrar la Prueba #5 en vivo).
- `antiFatigue`: `{ simulatedHourUTC: null, queuedMessages: [], sentMessages: [] }`.
- `twin`: `{ aiFailed: false, absentReport: {...}, draftMinutes: {...}, translations: [...], pendingScopeRequests: [...], manualSummaries: [...] }`.
- `cards`: tarjetas en las 4 columnas, incluyendo al menos una tarjeta en `Por hacer` sin dueño ni criterio de aceptación (lista para demostrar la Prueba #4 en 1 clic) y tarjetas en las tres combinaciones de sedes para probar la Prueba #3.
- `practices`: las 8 prácticas con pesos que suman 100%, responsables, cadencias y cumplimiento inicial editable.
- `kpis`: los 7 indicadores con `category` (`Base` | `Innovación`), `baseline` y `targetWeek12` (marcado como supuesto).

## Risks / Trade-offs

- **[Riesgo] Diferencia horaria real durante la presentación:** Si la presentación ocurre a una hora en que todas las sedes están activas, probar el Escudo Anti-Fatiga (Prueba #6) podría depender del reloj del sistema. → **Mitigación:** En el simulador del Escudo Anti-Fatiga se muestra la hora real de cada sede (en vivo) y un selector rápido de "Hora simulada / Escenario nocturno" para forzar estado `Descanso` en Tokio o Berlín durante la demostración.
- **[Riesgo] Estado modificado durante ensayos antes del pitch:** → **Mitigación:** Botón persistente **"Reiniciar datos demo"** en la barra superior que limpia `localStorage` y recarga `seedData.js` al instante.
- **[Riesgo] Confusión sobre la naturaleza de las 4 Salas Inmersivas:** → **Mitigación:** Etiqueta destacada `"Maqueta conceptual"` en el encabezado de la sección y dentro de cada sala, y ausencia deliberada de reloj visible en la Sala de Alineación.
- **[Riesgo] Falla de red si alguien activa el modo LLM opcional:** → **Mitigación:** El modo offline es el predeterminado y cualquier error de `fetch` cae automáticamente al motor local `culturalEngine.js` con un aviso discreto.
