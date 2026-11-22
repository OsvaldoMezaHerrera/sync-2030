# Spec Delta: gemelo-sincronia

## Purpose

Proporciona el asistente de IA local (Gemelo de Sincronía) que cubre ausencias entre husos horarios, traduce el tono cultural entre Tokio, Berlín y Guadalajara, aplica el candado inviolable de aprobación humana y soporta un plan de contingencia manual ante fallas de la IA.

## ADDED Requirements

### Requirement: Cobertura de ausencias y minuta automática
El sistema SHALL mostrar el reporte previo del integrante ausente por huso horario (qué hizo y qué falta) y generar un borrador de minuta automática que requiere validación humana antes de publicarse.

#### Scenario: Consulta de reporte de ausencia
- **WHEN** el usuario consulta la vista Gemelo de Sincronía
- **THEN** el sistema presenta el resumen previo del ausente (completado y pendiente) junto con el borrador de minuta automática pendiente de aprobación

### Requirement: Traductor de tono cultural (Prueba QA #2)
El sistema SHALL analizar mensajes entrantes identificando patrones de alto contexto (Tokio), bajo contexto directo (Berlín) e iteración rápida (Guadalajara), mostrando explícitamente `Qué dijo`, `Riesgo de interpretación`, `Lo que realmente quiso decir`, el nivel sugerido del Semáforo Cultural y una propuesta de respuesta explícita.

#### Scenario: Traducción del mensaje ambiguo de Tokio en la demo
- **WHEN** el usuario ingresa o selecciona la frase "Quizá sería posible revisar esto con más calma"
- **THEN** el sistema la clasifica como desacuerdo probable de alto contexto (Tokio), muestra como traducción real "No estoy de acuerdo con la fecha límite propuesta.", sugiere marcar la tarjeta asociada en Amarillo o Rojo y propone una respuesta explícita

#### Scenario: Traducción de frase directa de Berlín
- **WHEN** el usuario ingresa o selecciona la frase "Esto está mal, hay que rehacerlo."
- **THEN** el sistema detecta tono directo de bajo contexto (Berlín), advierte que Tokio podría leerlo como ataque personal y muestra la traducción real enfocada en el error técnico de integración

### Requirement: Candado inviolable "El humano siempre aprueba" (Prueba QA #1)
El sistema SHALL impedir que cualquier mensaje traducido, respuesta sugerida o compromiso del Gemelo se envíe o aplique sin un clic explícito humano (`Aprobar`, `Editar y aprobar` o `Rechazar`), y SHALL rechazar comprometerse ante solicitudes de módulos nuevos o cambios de alcance enviándolas al estado `Pendiente de aprobación humana`.

#### Scenario: Aprobación humana de respuesta y actualización del tablero
- **WHEN** un integrante (p. ej. de Guadalajara) hace clic en `Aprobar` o `Editar y aprobar` sobre una propuesta del Gemelo vinculada a una tarjeta
- **THEN** el sistema marca el mensaje como aprobado por ese integrante, registra la decisión y actualiza la tarjeta correspondiente en el Tablero por Valor con dueño, criterio de aceptación, OKR y color del Semáforo

#### Scenario: Solicitud de cambio de alcance o módulo nuevo sin autorización
- **WHEN** se ingresa una solicitud de módulo nuevo o cambio de alcance al Gemelo
- **THEN** el sistema rechaza comprometerse automáticamente y coloca la solicitud en la bandeja `Pendiente de aprobación humana`

### Requirement: Simulación de Falla de IA y Plan Manual Rotativo (Prueba QA #7)
El sistema SHALL incluir un control visible `Simular Falla de IA` que desactiva el Gemelo de Sincronía y habilita un formulario de resumen manual rotativo con aprobación humana, preservando todas las decisiones previas.

#### Scenario: Activación del modo Falla de IA
- **WHEN** el usuario activa `Simular Falla de IA`
- **THEN** el sistema muestra un estado de contingencia manual, deshabilita la generación automática del Gemelo, conserva el historial de decisiones y permite registrar un resumen manual asignado al responsable rotativo con botón explícito de aprobación humana
