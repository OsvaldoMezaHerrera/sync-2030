# Spec Delta: tablero-valor

## Purpose

Gestiona la ejecución del equipo por impacto y valor en lugar de horas, aplicando reglas estrictas de entrada, límites de trabajo en curso (WIP) y el Semáforo Cultural con escalamiento automático a embajadores neutrales.

## ADDED Requirements

### Requirement: Flujo Kanban por valor con límite WIP
El sistema SHALL organizar las tarjetas en cuatro columnas: `Por hacer`, `En curso`, `En revisión` y `Terminado`, mostrando en cada tarjeta su título, dueño, criterio de aceptación, OKR vinculado, sede(s) afectada(s) y color del Semáforo Cultural, y limitando `En curso` a un máximo de 2 tarjetas por persona.

#### Scenario: Bloqueo por exceso de WIP en columna En curso
- **WHEN** el usuario intenta mover una tercera tarjeta del mismo dueño a la columna `En curso`
- **THEN** el sistema bloquea el movimiento e informa que se superó el límite máximo de 2 tarjetas `En curso` por persona

### Requirement: Regla estricta de entrada a En curso (Prueba QA #4)
El sistema SHALL bloquear el paso de cualquier tarjeta a la columna `En curso` si no tiene definidos tanto el campo `dueño` como el campo `criterio de aceptación`.

#### Scenario: Intento de mover tarjeta incompleta a En curso
- **WHEN** el usuario intenta mover a `En curso` una tarjeta sin dueño o sin criterio de aceptación
- **THEN** el sistema impide el cambio de columna y muestra un mensaje de bloqueo indicando el campo faltante

#### Scenario: Movimiento válido a En curso
- **WHEN** el usuario completa el dueño y el criterio de aceptación de la tarjeta y la mueve a `En curso` (sin exceder el límite WIP)
- **THEN** el sistema actualiza la columna de la tarjeta a `En curso`

### Requirement: Semáforo Cultural y alerta crítica con embajador neutral (Prueba QA #3)
El sistema SHALL permitir clasificar cada tarjeta en `Verde` (bajo riesgo), `Amarillo` (fricción creciente) o `Rojo` (crítico); cuando una tarjeta pasa a `Rojo`, el sistema SHALL activar una cuenta regresiva visible de 24 horas y asignar automáticamente al embajador neutral según el par de sedes involucradas: Tokio–Berlín → Brayan Beltrán (Guadalajara), Guadalajara–Berlín → Alan Gadiel (Tokio), Tokio–Guadalajara → Osvaldo Meza (con apoyo de Berlín).

#### Scenario: Activación de Semáforo en Rojo entre Tokio y Berlín
- **WHEN** una tarjeta con fricción entre Tokio y Berlín se marca en estado `Rojo`
- **THEN** el sistema muestra una alerta crítica, inicia un reloj regresivo visible de 24:00:00 y asigna automáticamente a Brayan Beltrán (Guadalajara) como embajador neutral

#### Scenario: Activación de Semáforo en Rojo entre Guadalajara y Berlín
- **WHEN** una tarjeta con fricción entre Guadalajara y Berlín se marca en estado `Rojo`
- **THEN** el sistema asigna automáticamente a Alan Gadiel (Tokio) y activa la cuenta regresiva de 24 horas

#### Scenario: Activación de Semáforo en Rojo entre Tokio y Guadalajara
- **WHEN** una tarjeta con fricción entre Tokio y Guadalajara se marca en estado `Rojo`
- **THEN** el sistema asigna automáticamente a Osvaldo Meza (con apoyo de Berlín) y activa la cuenta regresiva de 24 horas
