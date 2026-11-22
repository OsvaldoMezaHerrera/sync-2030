# Active Context: SYNC 2030

## Foco Actual
- **Fase:** Limpieza y refinamiento empresarial de la UI del Módulo 1 en cumplimiento estricto con la Regla de Producto Real de `AGENTS.md`.
- **Estado de código:** Compilación validada con `npm run build` sin errores.

## Cambios Recientes (Refinamiento Producto Real)
- **TopBar.jsx:**
  - Se retiró el botón visible de "Reiniciar datos demo".
  - Se implementó un menú discreto de ajustes (`Settings`) en la esquina superior derecha con la opción *"Restaurar datos iniciales"* y retroalimentación sutil *"Entorno restaurado"*.
  - Se limpió el tooltip del selector de integrantes a *"Cambiar usuario activo"*.
- **Sidebar.jsx:**
  - Se eliminó la etiqueta *"Pitch 90s"* del pie de navegación, reemplazándola por el indicador corporativo *"SYNC 2030 Enterprise • Producción"*.
- **PanelGlobalView.jsx:**
  - Se eliminaron todos los badges y etiquetas que referenciaban *"Prueba QA #5"* y *"Prueba QA #6"*.
  - Se renombró el selector de simulación horaria a *"Perspectiva horaria"* con opciones ejecutivas (*"Hora local de sistema"*, *"Turno nocturno Tokio"*, *"Turno nocturno Berlín"*, *"Turno nocturno Guadalajara"*).
  - Se renombró la sección a **"Política de Agenda 24h"** con acciones profesionales (*"Confirmar publicación de agenda 24h (Habilitar sala)"* / *"Desactivar agenda 24h (Activar bloqueo de sala)"*).
  - Se renombró la sección de mensajería a **"Escudo Anti-Fatiga"** con badge corporativo *"Protocolo Activo"* y notificaciones formales de entrega programada.
  - Se renombraron las salas a **"Espacios Inmersivos"**, eliminando por completo cualquier mención a *"Maqueta conceptual"* en la Sala de Alineación y en el resto de los espacios inmersivos.
- **seedData.js:**
  - Se renombró la tarjeta semilla incompleta a *"Estandarización de Esquemas GraphQL de Integración"* manteniendo la ausencia de dueño y criterios de aceptación para la regla de entrada.

## Siguientes Pasos
- Proceder con la implementación del **Módulo 2: Gemelo de Sincronía** (`GemeloSincroniaView.jsx` y `culturalEngine.js`) asegurando desde el inicio un lenguaje 100% empresarial (sin términos escolares ni etiquetas QA visibles).
