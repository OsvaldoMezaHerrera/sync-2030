# Propuesta: Arquitectura MVP de SYNC 2030

## Why

Los equipos híbridos distribuidos entre **Tokio (Diseño)**, **Guadalajara (Ingeniería)** y **Berlín (Ingeniería)** enfrentan fricciones culturales silenciosas, fatiga por husos horarios extremos y juntas sin valor ni acuerdos claros. **SYNC 2030** (*"No gestionamos horas. Gestionamos impacto."*) requiere un prototipo web funcional en React + Vite + Tailwind CSS + Lucide React que permita ejecutar en vivo el pitch directivo de **90 segundos**, operar 100% en modo offline y aprobar las **7 pruebas funcionales obligatorias** definidas por QA.

## What Changes

- **Aplicación web SPA en español (React + Vite + Tailwind CSS + Lucide React):** Navegación lateral persistente con 4 vistas principales, barra superior con identidad **SYNC 2030**, selector de usuario activo (los 7 integrantes reales) y botón visible de **"Reiniciar datos demo"**.
- **Panel Global y Juntas Asíncronas:** Relojes en vivo con estado de jornada para Tokio (UTC+9), Berlín (UTC+1) y Guadalajara (UTC-6), selector de Horario Rotativo (Semana A / Semana B), simulador del Escudo Anti-Fatiga, validador de Junta con Agenda (24h antes) y maqueta conceptual etiquetada de las 4 Salas Inmersivas.
- **Gemelo de Sincronía:** Asistente de IA local/offline con reporte de ausencias, traductor de tono cultural (*Qué dijo* vs *Lo que realmente quiso decir*), candado inviolable *"El humano siempre aprueba"* (incluyendo bloqueo de cambios de alcance sin autorización) y botón **"Simular Falla de IA"** (Plan Manual rotativo).
- **Tablero por Valor + Semáforo Cultural:** Flujo Kanban (`Por hacer`, `En curso` con límite WIP de 2 tarjetas por persona, `En revisión`, `Terminado`), regla de entrada estricta (dueño y criterio de aceptación obligatorios) y Semáforo Cultural (Verde, Amarillo, Rojo con cuenta regresiva de 24h y asignación automática de embajador neutral según el par de sedes en conflicto).
- **Medición (% de Aplicación y Retorno):** Calculadora interactiva de las 8 prácticas ponderadas (suman 100%) con clasificación automática y tablero de los 7 indicadores de retorno diferenciando *Línea base* vs *Meta semana 12 (supuesto)*.
- **Persistencia local y soporte de Demo 90s:** Datos semilla de los 7 integrantes reales en `src/data/seedData.js`, sincronización con `localStorage`, guía rápida / flujo conectado para ejecutar la demo de 90 segundos sin fricción y configuración opcional de endpoint compatible con OpenAI/LiteLLM (sin romper el modo 100% offline).

## Capabilities

### New Capabilities
- `panel-global`: Relojes en vivo por sede, horario rotativo Semana A/B, simulador de Escudo Anti-Fatiga, validador de junta con agenda 24h antes y maqueta conceptual de 4 Salas Inmersivas.
- `gemelo-sincronia`: Cobertura de ausencias, traductor de tono cultural (Tokio/Berlín/Guadalajara), candado "El humano siempre aprueba", bloqueo de alcance no aprobado y conmutador de Falla de IA (Plan Manual).
- `tablero-valor`: Tablero Kanban por valor con límite WIP, regla de entrada estricta (dueño + criterio de aceptación) y Semáforo Cultural con cuenta regresiva de 24h y asignación automática de embajador neutral.
- `medicion-impacto`: Calculadora ponderada de 8 prácticas para el % de Aplicación y panel de 7 indicadores de retorno (Línea base vs Meta semana 12 supuesto).
- `demo-persistencia`: Datos semilla de los 7 integrantes reales, persistencia en `localStorage`, reinicio limpio de datos demo, configuración opcional de LLM y flujo de demostración en vivo de 90 segundos.

### Modified Capabilities
<!-- Ninguna capacidad previa existe; proyecto nuevo (greenfield). -->

## Impact

- **Código nuevo:** Inicialización del proyecto Vite + React + Tailwind CSS + Lucide React en la raíz de `/home/osvl/Proyectos/sync-2030` (`package.json`, `vite.config.js`, `tailwind.config.js`, `index.html`, `src/`).
- **Datos y estado:** Contexto global en React (`SyncContext`) sincronizado con `localStorage` y sembrado desde `src/data/seedData.js`.
- **Dependencias:** `react`, `react-dom`, `lucide-react`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`.
- **Operación:** Sin backend obligatorio; 100% funcional offline para la defensa en vivo, con punto de extensión opcional hacia API OpenAI/LiteLLM.
