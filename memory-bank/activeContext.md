# Active Context: SYNC 2030

## Foco Actual
- **Fase:** Módulo 3 Implementado: Tablero por Valor y Semáforo Cultural (`TableroValorView.jsx`).
- **Estado de código:** `npm run build` pasa limpiamente en 1.54s sin errores ni advertencias. Cero términos escolares o etiquetas prohibidas en la UI (100% conforme a la Regla de Producto Real).

## Decisiones e Implementaciones Recientes

### 1. Construcción del Módulo 3: Tablero por Valor y Semáforo Cultural
- **Arquitectura desacoplada de reglas (`src/utils/boardRules.js`):**
  - Definición de 4 columnas: `Por hacer`, `En curso`, `En revisión` y `Terminado`.
  - Semáforo Cultural: Verde (Bajo riesgo), Amarillo (Atención pronta) y Rojo (Alerta crítica con SLA 24h y embajador neutral).
  - Algoritmo de asignación automática de Embajador Neutral según cruce de sedes:
    * Tokio–Berlín → Brayan Beltrán (Guadalajara).
    * Guadalajara–Berlín → Alan Gadiel (Tokio).
    * Tokio–Guadalajara → Osvaldo Meza (con apoyo de Berlín).
  - Regla estricta de entrada a "En curso": validación de `ownerId` no vacío y `acceptanceCriteria` con texto sustancial.
  - Límite WIP: validación de máximo 2 tarjetas activas en "En curso" por integrante.
  - Formateador de tiempo regresivo en tiempo real `formatRemainingTime(expiresAt)`.

- **Componentes Modulares en `src/components/views/tablero/`:**
  1. `KanbanColumn.jsx`: Encabezado limpio con conteo, indicador de límite WIP en "En curso" e inserción rápida de tarjetas.
  2. `KanbanCard.jsx`: Tarjetas compactas con borde izquierdo de acento visual según semáforo, banderas de sedes (`🇯🇵 Tokio`, `🇲🇽 Guadalajara`, `🇩🇪 Berlín`), avatar del responsable, OKR vinculado, resumen de criterio de aceptación, navegación rápida entre columnas, y para tarjetas en rojo: reloj regresivo 24:00:00 en tiempo real, badge del embajador neutral asignado y botón de intervención directa.
  3. `CardDetailModal.jsx`: Modal de detalle y edición rápida que permite ajustar título, columna, responsable, sedes, criterio de aceptación, OKR, semáforo cultural con previsualización reactiva del embajador neutral y advertencia del SLA 24h, además de bitácora de intervenciones previas.
  4. `NewCardModal.jsx`: Modal de creación de iniciativas con cálculo reactivo del embajador si se crea en rojo y validación de gobernanza.
  5. `AmbassadorInterventionModal.jsx`: Modal de mediación del embajador neutral para tarjetas rojas, con información de sedes en cruce, tiempo restante del SLA, plantillas de acuerdos interculturales rápidos, registro de bitácora y selector de nuevo estado (Amarillo o Verde).
  6. `GovernanceAlertModal.jsx`: Modal de bloqueo corporativo ante violaciones de la Regla Estricta de Entrada (con botón para completar requisitos en el acto) o del Límite WIP (aviso amigable de protección del enfoque y bienestar digital).

- **Sincronización Bidireccional en `SyncContext.jsx`:**
  - Métodos `moveCard`, `updateCard`, `createCard` y `resolveRedCard` con persistencia en `localStorage`.
  - Precarga de tarjetas representativas en las 4 columnas con los 7 integrantes reales:
    * `card-1`: En curso (Amarillo) — Alan Gadiel (Tokio & GDL).
    * `card-2`: En curso (Rojo con cuenta regresiva de 24h activa y embajador Brayan Beltrán) — Brayan Beltrán (Tokio & Berlín).
    * `card-9`: En curso (Verde) — Alan Gadiel (Tokio). Nota: con `card-1` y `card-9`, Alan Gadiel alcanza el límite WIP de 2 tarjetas, permitiendo verificar el bloqueo WIP inmediatamente.
    * `card-3` y `card-6`: En revisión (Verde) — Nicholas Sotelo e Iván Ortega.
    * `card-4`: Por hacer (Incompleta sin dueño ni criterio para probar la regla de entrada).
    * `card-5`: Por hacer — Jorge Moranchel.
    * `card-7` y `card-8`: Terminado — Fernando Garrido y Osvaldo Meza.
  - Sincronización automática de acuerdos confirmados en el Gemelo de Sincronía (Módulo 2) hacia las tarjetas correspondientes del tablero.

- **Filtros Rápidos en `TableroValorView.jsx`:**
  - Filtro por color de semáforo (`Todos`, `Rojo` con conteo, `Amarillo`, `Verde`).
  - Filtro por sede (`Todas`, `Tokio`, `Guadalajara`, `Berlín`).
  - Filtro por integrante (`Todos`, + los 7 integrantes reales).

## Siguientes Pasos
- Construir el **Módulo 4: Medición (% de Aplicación y Retorno)** (`MedicionView.jsx`):
  - Calculadora interactiva de la fórmula oficial de 8 prácticas ponderadas (suman 100%).
  - Clasificación automática: Consolidado (Verde ≥85%), En adopción (Amarillo 70–84.9%) y En riesgo (Rojo <70%).
  - Panel de 7 indicadores de impacto/retorno diferenciando "Línea base" vs "Meta semana 12 (supuesto)".
