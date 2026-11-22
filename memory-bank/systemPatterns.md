# System Patterns: Arquitectura de SYNC 2030

## Visión General de Arquitectura
Aplicación SPA (Single Page Application) en español construida con **React + Vite + Tailwind CSS + Lucide React**, diseñada para operar **100% offline** mediante motores de dominio locales y estado sincronizado con `localStorage`, con extensión opcional hacia una API compatible con OpenAI/LiteLLM.

## Estructura de Carpetas Planificada
```text
src/
├── main.jsx
├── App.jsx
├── index.css
├── context/
│   └── SyncContext.jsx            # Estado global (useReducer) + persistencia localStorage + RESET_DEMO_DATA
├── data/
│   └── seedData.js                # 7 integrantes reales, tarjetas semilla, frases culturales, 8 prácticas, 7 KPIs
├── utils/
│   ├── culturalEngine.js          # Traductor de tono (Tokio/Berlín/Guadalajara), bloqueo de alcance, cliente LLM opcional
│   ├── timezoneUtils.js           # Relojes en vivo UTC+9 / UTC+1 / UTC-6, Escudo Anti-Fatiga, countdown 24h
│   ├── boardRules.js              # Regla estricta de entrada a En curso, límite WIP <= 2, embajador neutral automático
│   └── metricsCalculator.js       # Fórmula oficial % Aplicación (8 prácticas = 100%) y clasificación
└── components/
    ├── layout/
    │   ├── Sidebar.jsx            # Navegación de las 4 vistas + estado del Gemelo
    │   ├── TopBar.jsx             # Marca SYNC 2030, selector de integrante activo, Reiniciar datos demo, Ajustes
    │   └── DemoBanner.jsx         # Barra compacta de seguimiento para el pitch de 90 segundos
    ├── views/
    │   ├── PanelGlobalView.jsx    # Vista 1: Relojes, Semana A/B, Escudo Anti-Fatiga, Validador Agenda 24h, 4 Salas Inmersivas
    │   ├── GemeloSincroniaView.jsx# Vista 2: Reporte ausente, traductor de tono, candado humano, Falla de IA
    │   ├── TableroValorView.jsx   # Vista 3: Kanban 4 columnas, regla entrada, WIP, Semáforo Cultural + alerta 24h
    │   └── MedicionView.jsx       # Vista 4: Calculadora 8 prácticas + 7 indicadores (Línea base vs Meta semana 12)
    └── shared/
        ├── SettingsModal.jsx      # Configuración opcional OpenAI/LiteLLM
        ├── StatusBadge.jsx        # Etiquetas de estado y semáforo
        └── CountdownTimer.jsx     # Reloj regresivo de 24:00:00 en vivo
```

## Patrones Clave de Dominio
1. **Estado Único y Flujo Cruzado (`SyncContext`):**
   - Aprobar una traducción en `GemeloSincroniaView` actualiza directamente la tarjeta vinculada en `TableroValorView` (dueño, criterio de aceptación, OKR y color del Semáforo) y se refleja en el tablero compartido de la `Sala de Alineación (Maqueta conceptual)`.
   - Clave de persistencia: `sync2030_state_v1` en `localStorage`, reiniciable en un clic mediante `Reiniciar datos demo`.
2. **Reglas de Negocio Puras (`src/utils/`):**
   - **Candado inviolable:** ninguna salida del Gemelo se aplica sin acción explícita (`APPROVE_TRANSLATION`, `EDIT_AND_APPROVE`, `REJECT_TRANSLATION`). Solicitudes de cambio de alcance o módulos nuevos pasan automáticamente a `pendingScopeRequests`.
   - **Semáforo Cultural → Embajador Neutral:**
     - `Tokio–Berlín` → **Brayan Beltrán** (Guadalajara)
     - `Guadalajara–Berlín` → **Alan Gadiel** (Tokio)
     - `Tokio–Guadalajara` → **Osvaldo Meza** (con apoyo de Berlín)
   - **Regla de entrada y WIP del Tablero:** bloquear paso a `En curso` si falta `ownerId` o `acceptanceCriteria`, o si el dueño ya tiene 2 tarjetas en `En curso`.
   - **Escudo Anti-Fatiga y Agenda 24h:** diferir mensajes no urgentes a las 09:00 hora local si la sede destino está en `Descanso`; bloquear apertura de la Sala de Alineación si `agendaPublished24h === false`.
3. **Resiliencia Offline:**
   - El motor local `culturalEngine.js` resuelve las traducciones culturales y detección de alcance sin red; el cliente LLM es estrictamente opcional y hace fallback automático al motor local ante cualquier fallo.

## Trazabilidad con OpenSpec
- Planificación oficial guardada en `openspec/changes/sync-2030-mvp/` (`proposal.md`, `design.md`, `tasks.md` y 5 especificaciones en `specs/`).
