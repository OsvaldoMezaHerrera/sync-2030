# Spec Delta: panel-global

## Purpose

Proporciona visibilidad operativa en tiempo real para las tres sedes globales de SYNC 2030 (Tokio, Berlín y Guadalajara), regula el horario rotativo semanal, protege el bienestar mediante el Escudo Anti-Fatiga, exige agenda previa para abrir juntas y presenta la maqueta conceptual de las 4 Salas Inmersivas.

## ADDED Requirements

### Requirement: Relojes en vivo y estado de jornada por sede
El sistema SHALL mostrar relojes actualizados en tiempo real y el estado de jornada (`Activo` o `Descanso`) para Tokio (UTC+9), Berlín (UTC+1) y Guadalajara (UTC-6), permitiendo además simular una hora de prueba para validar reglas horarias.

#### Scenario: Visualización de las tres sedes
- **WHEN** el usuario abre la vista Panel Global y Juntas Asíncronas
- **THEN** el sistema muestra la hora local actual y el estado de jornada de Tokio (UTC+9), Berlín (UTC+1) y Guadalajara (UTC-6)

### Requirement: Selector de Horario Rotativo semanal
El sistema SHALL ofrecer un selector entre Semana A (12:00 UTC: Guadalajara 06:00 cede, Berlín 13:00, Tokio 21:00) y Semana B (13:00 UTC: Guadalajara 07:00, Berlín 14:00, Tokio 22:00 cede) para la junta semanal de 45 minutos, indicando explícitamente la compensación de Berlín (envía agenda 24h antes y coordina acta).

#### Scenario: Cambio entre Semana A y Semana B
- **WHEN** el usuario alterna el selector de Semana A a Semana B
- **THEN** el sistema actualiza las horas locales mostradas para las tres sedes e indica qué sede cede el horario y la regla de compensación de Berlín

### Requirement: Escudo Anti-Fatiga en mensajería fuera de horario (Prueba QA #6)
El sistema SHALL interceptar cualquier mensaje marcado como no urgente enviado a un destinatario fuera de su horario laboral local y programarlo automáticamente para el inicio de la mañana local del destinatario, mostrando la hora programada y las reglas vigentes del Escudo Anti-Fatiga (máximo 2h seguidas en espacio inmersivo con pausa de 10 min, avatar sin cámara válido, ventana asíncrona de 24h hábiles).

#### Scenario: Envío de mensaje no urgente fuera de horario local
- **WHEN** el usuario envía un mensaje no urgente hacia una sede que se encuentra en estado `Descanso`
- **THEN** el sistema retiene el envío inmediato, lo marca como programado para la mañana siguiente (09:00 hora local del destinatario) y lo registra en la cola del Escudo Anti-Fatiga

#### Scenario: Envío de mensaje en horario activo
- **WHEN** el usuario envía un mensaje hacia una sede en estado `Activo`
- **THEN** el sistema permite su entrega inmediata y registra el envío sin diferimiento

### Requirement: Validador de Junta con Agenda 24 horas antes (Prueba QA #5)
El sistema SHALL bloquear o cancelar la apertura de la Sala de Alineación si no existe una agenda registrada con al menos 24 horas de anticipación.

#### Scenario: Intento de abrir Sala de Alineación sin agenda previa
- **WHEN** el usuario intenta abrir la Sala de Alineación cuando el indicador de agenda 24h antes está ausente o incompleto
- **THEN** el sistema bloquea el acceso, muestra un mensaje de cancelación/bloqueo por falta de agenda 24h antes y ofrece registrar la agenda

#### Scenario: Apertura permitida con agenda válida
- **WHEN** el usuario registra o valida una agenda con al menos 24 horas de anticipación y abre la Sala de Alineación
- **THEN** el sistema permite el ingreso a la maqueta conceptual de la Sala de Alineación

### Requirement: Vista de 4 Salas Inmersivas como Maqueta Conceptual
El sistema SHALL mostrar una sección claramente etiquetada como `Maqueta conceptual` con las 4 salas: Sala de Alineación (avatares del equipo, tablero compartido sincronizado con las tarjetas actuales y sin reloj visible), Sala de Ensayo, Sala de Mentoría y Sala de Calma.

#### Scenario: Inspección de la Sala de Alineación durante la demo
- **WHEN** el usuario visualiza la Sala de Alineación con agenda válida
- **THEN** el sistema muestra la etiqueta visible `Maqueta conceptual`, los avatares de los integrantes sin cámara obligatoria, el estado del tablero compartido y omite cualquier reloj visible dentro de la sala
