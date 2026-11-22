# Active Context: SYNC 2030

## Foco Actual
- **Fase:** Ajuste de Layout global (menú y barra fija con scroll exclusivo en `<main>`) y Módulo 2 (Gemelo de Sincronía) rediseñado y completado con éxito.
- **Estado de código:** `npm run build` pasa limpiamente en 1.45s sin errores ni advertencias. Cero términos escolares o etiquetas QA en la interfaz, 100% conforme a la Regla de Producto Real.

## Decisiones e Implementaciones Recientes

### 1. Ajuste de Layout (Estructura Fija con Scroll Independiente)
- **`App.jsx`:** Contenedor principal con `h-screen overflow-hidden flex flex-col`. La fila inferior contiene el sidebar y el área de contenido dentro de un contenedor flex con `overflow-hidden`.
- **`TopBar.jsx`:** Fijada arriba con `h-16 shrink-0` y z-index 20.
- **`Sidebar.jsx`:** Fijada a la izquierda con `shrink-0 h-full overflow-y-auto`, garantizando que no se desplace al interactuar con el contenido.
- **`<main>`:** Único contenedor con scroll independiente gracias a `flex-1 overflow-y-auto min-w-0`.

### 2. Módulo 2: Gemelo de Sincronía (`GemeloSincroniaView.jsx` y `src/services/gemeloService.js`)
- **Capa Desacoplada (`gemeloService.js`):**
  - Lógica 100% local, determinista y offline lista para enchufar un LLM en el futuro sin modificar la UI.
  - `detectScopeChange`: Detección estricta de palabras clave asociadas a ampliación de sprint o módulos nuevos.
  - `analyzeCulturalTone`: Descodificación intercultural (Tokio: alto contexto indirecto; Berlín: bajo contexto crítico directo; Guadalajara: iteración rápida) con cálculo de nivel de riesgo ('verde', 'amarillo', 'rojo').
  - `processMeetingIntervention`: Genera la respuesta del Gemelo ante intervenciones en reuniones, protege el alcance y genera la solicitud automática para la bandeja humana.
- **Sección 1: Mi Reporte para el Gemelo (Qué hice / Qué falta):**
  - Formulario editable sincronizado por integrante activo (`activeUserId`), guardando: *Avances completados*, *Pendientes actuales* y *Bloqueos o notas*.
  - Botón de guardado y confirmación visual inmediata ("Gemelo actualizado" con hora de sincronización).
- **Sección 2: Resumen de Reuniones Recientes:**
  - Minutas generadas por el Gemelo con fecha, participantes, puntos clave y acuerdos.
  - Botón de limpieza de historial y estado vacío claro con la etiqueta exacta: **"Sin reuniones recientes"**.
- **Sección 3: Solicitudes y Cambios Sugeridos (Aprobación Humana):**
  - Muestra cambios y módulos solicitados en reunión destacando quién los pidió y su sede (Jorge Moranchel · Berlín, Alan Gadiel · Tokio, etc.).
  - Bloque integrado de Traducción Cultural (*Mensaje original* vs *Intención real* y semáforo sugerido) con ejemplos de Tokio y Berlín precargados.
  - 3 acciones operativas:
    1. *Confirmar / Aprobar:* valida el cambio y actualiza `SyncContext` / Tablero por Valor.
    2. *Solicitar más detalles (Correo):* modal rápido prellenado con el destinatario exacto (`nombre (sede) <correo>`), asunto y mensaje corporativo para aclarar requerimientos.
    3. *Rechazar / Posponer:* descarta o difiere la solicitud con confirmación visual.
- **Sección 4: Consola de Reunión y Modo Respaldo Manual:**
  - Consola interactiva para simular intervenciones seleccionando integrante y sede. El Gemelo responde exponiendo avances y pendientes del ausente, deniega compromisos de nuevos módulos o alcance, y canaliza automáticamente la petición a la bandeja de Solicitudes y Cambios Sugeridos.
  - Interruptor visible de *Modo Respaldo Manual* para pausar el motor de IA y registrar minutas rotativas manuales.

## Siguientes Pasos
- Construir el **Módulo 3: Tablero por Valor + Semáforo Cultural** (`TableroValorView.jsx` y `src/utils/boardRules.js`):
  - Columnas Kanban (`Por hacer`, `En curso` con WIP ≤ 2 por persona, `En revisión`, `Terminado`).
  - Regla estricta de entrada a `En curso` (bloqueo si falta dueño o criterio de aceptación).
  - Semáforo Cultural con cuenta regresiva en vivo de 24:00:00 y asignación automática del embajador neutral según el par de sedes en conflicto.
