# Spec Delta: medicion-impacto

## Purpose

Permite auditar el porcentaje real de adopción del sistema SYNC 2030 mediante la fórmula oficial de 8 prácticas ponderadas y presentar los 7 indicadores de impacto y retorno diferenciando línea base y metas proyectadas.

## ADDED Requirements

### Requirement: Calculadora interactiva de % de Aplicación (8 prácticas = 100%)
El sistema SHALL calcular en tiempo real el porcentaje de aplicación mediante la fórmula `% Aplicación = Σ (peso_i × cumplimiento_i) ÷ 100` sobre las 8 prácticas oficiales con sus pesos, responsables y cadencias exactas:
1. El humano aprueba con el Gemelo (15% | Jorge | Semanal)
2. Semáforo activo en tarjetas (10% | Nicholas | Semanal)
3. Rojos atendidos en ≤24h (10% | Alan y Brayan | Semanal)
4. Tablero por valor completo (15% | Osvaldo | Semanal)
5. Juntas rediseñadas con agenda y acta (15% | Fernando | Semanal)
6. Respuesta asíncrona en ≤24h hábiles (10% | Fernando | Semanal)
7. Mentoría y plan personal (15% | Osvaldo | Quincenal)
8. Escudo anti-fatiga respetado (10% | Fernando | Quincenal)

#### Scenario: Clasificación automática de adopción
- **WHEN** el usuario ajusta el porcentaje de cumplimiento (0 a 100%) de cualquiera de las 8 prácticas
- **THEN** el sistema recalcula el % de Aplicación al instante y clasifica el estado en `Consolidado` (Verde, ≥85%), `En adopción` (Amarillo, 70%–84.9%) o `En riesgo` (Rojo, <70%)

### Requirement: Panel de 7 Indicadores de Retorno (Línea base vs Meta semana 12)
El sistema SHALL mostrar los 7 indicadores oficiales de impacto/retorno (5 base y 2 de innovación) diferenciando claramente la columna/etiqueta `Línea base` frente a `Meta semana 12 (supuesto)`:
- Horas de reuniones en vivo: 60% menos
- Bienestar digital (0–100): 75 de 100
- Conflictos escalados a gerencia: 50% menos
- Confianza intercultural (1–5): +0.5 puntos frente a semana 1
- Entregas a tiempo: 85%
- Retrabajo por entrega: 30% menos
- Mejoras del equipo aplicadas: al menos 1 por sprint

#### Scenario: Visualización transparente de supuestos de retorno
- **WHEN** el usuario abre la vista Medición (% de Aplicación y Retorno)
- **THEN** el sistema muestra los 7 indicadores con su valor de `Línea base` y su `Meta semana 12 (supuesto)` claramente etiquetados para evitar presentar proyecciones como resultados históricos
