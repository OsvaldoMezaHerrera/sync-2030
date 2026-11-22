# Active Context: SYNC 2030

## Foco Actual
- **Fase:** Módulo 4: Medición de Aplicación e Impacto (`MedicionView.jsx`) completamente implementado y verificado.
- **Estado de código:** `npm run build` pasa limpiamente en 1.52s sin errores ni advertencias. Cero términos escolares o etiquetas prohibidas en la UI (100% conforme a la Regla de Producto Real).

## Decisiones e Implementaciones Recientes

### 1. Construcción del Módulo 4: Medición de Aplicación e Impacto (`MedicionView.jsx`)
- **Organización en 2 Pestañas Internas Limpias (anti-scroll excesivo):**
  - **Pestaña 1: Índice de Aplicación (% de Adopción)**
    * **Resumen Ejecutivo Superior (`ExecutiveSummaryBar.jsx`):**
      - Cálculo en tiempo real con la fórmula oficial ponderada: `% Aplicación = Σ (peso_i × cumplimiento_i) ÷ 100`.
      - Semáforo automático oficial:
        - Consolidado (Verde): 85% o más.
        - En adopción (Amarillo): 70% a 84.9%.
        - En riesgo (Rojo): menos de 70%.
      - Barra de progreso discreta y continua con los 3 hitos de referencia: Semana 4 (60%), Semana 8 (75%) y Semana 12 (85%), con marcadores visuales e indicadores de superación de hito.
      - Desglose compacto de cantidad de prácticas en estado Consolidado, En adopción y En riesgo.
    * **Panel de las 8 Prácticas Ponderadas (`PracticesTable.jsx`):**
      - Lista compacta con los pesos exactos (15, 10, 10, 15, 15, 10, 15 y 10 = 100% calibrado).
      - Cada fila incluye: ID, nombre de la práctica, responsable, frecuencia (semanal / quincenal), badge de peso, control deslizante (`slider`) + campo numérico editable con sincronización bidireccional instantánea y cálculo de contribución ponderada en puntos.
    * **Registro de Auditoría Semanal por Muestreo (`AuditLogSection.jsx`):**
      - Panel de control de calidad bajo la responsabilidad de Iván Ortega (QA / Auditor de Procesos).
      - Formulario ágil de verificación por muestreo: selección de práctica, toma automática del valor reportado, captura del valor auditado por muestreo, cálculo de discrepancia en tiempo real y detección destacada de alerta si la diferencia supera el 10%.
      - Bitácora histórica interactiva con registros previos de conformidad y alerta, fecha, semana y hallazgos.
  - **Pestaña 2: Retorno en Cohesión e Innovación**
    * **Tarjeta de Síntesis Ejecutiva:**
      - Lema corporativo *"No gestionamos horas. Gestionamos impacto."* y métricas agregadas de reducción de reuniones (-50% vs meta -60%), bienestar digital (72/100 vs meta 75/100) y metas alcanzadas.
    * **Tarjetas de los 7 Indicadores de Impacto (`KpiCard.jsx`):**
      - 5 indicadores base: Horas de reuniones en vivo, Bienestar digital (0–100), Conflictos escalados a gerencia, Confianza intercultural (1–5), Entregas a tiempo.
      - 2 indicadores de innovación: Retrabajo por entrega y Mejoras aplicadas por sprint.
      - Cada tarjeta expone con claridad: Línea base, Valor actual y Meta Semana 12 (marcada explícitamente como supuesto proyectado).
      - Barra de progreso que calcula el porcentaje de avance hacia la meta respetando la dirección de mejora (reducción en horas, retrabajo y conflictos; incremento en bienestar, confianza, entregas a tiempo y mejoras).
      - Modal de edición discreto (`KpiEditModal.jsx`) para actualizar mediciones operativas con notas de justificación y autor.

### 2. Persistencia y Gestión Global en `SyncContext.jsx`
- Estados reactivos `practices`, `kpis` y `auditLogs` sincronizados con `localStorage`.
- Cálculo memoizado reactivo de `adoptionScore` y `adoptionStatus`.
- Métodos `updatePracticePercent`, `updateKpiValue` y `addAuditLog`.
- Integración completa en `resetSystemData` para restaurar los datos semilla oficiales ante cualquier prueba.

## Siguientes Pasos
- Validación integral de extremo a extremo de las 7 pruebas funcionales gerenciales definidas en `memory-bank/projectbrief.md`.
- Verificación final de flujos transversales entre Gemelo de Sincronía, Tablero por Valor y Medición de Impacto.
