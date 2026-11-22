# Spec Delta: demo-persistencia

## Purpose

Garantiza que el prototipo opere con los 7 integrantes reales, persista el estado en localStorage, permita reiniciar a un estado limpio en un clic, funcione 100% offline y facilite la ejecución fluida del pitch directivo de 90 segundos.

## ADDED Requirements

### Requirement: Datos semilla con los 7 integrantes reales
El sistema SHALL precargar en `src/data/seedData.js` a los 7 integrantes reales del equipo con sus roles, sedes de referencia y responsabilidades: Osvaldo Meza, Jorge Moranchel, Alan Gadiel, Brayan Beltrán, Nicholas Sotelo, Iván Ortega y Fernando Garrido, permitiendo seleccionar el usuario activo en la barra superior.

#### Scenario: Cambio de integrante activo
- **WHEN** el usuario selecciona a Brayan Beltrán (Guadalajara) en el selector de usuario activo
- **THEN** las aprobaciones humanas y acciones registradas en el sistema quedan firmadas a nombre de Brayan Beltrán

### Requirement: Persistencia en localStorage y reinicio de datos demo
El sistema SHALL sincronizar automáticamente todo el estado operativo en `localStorage` y ofrecer un botón visible `Reiniciar datos demo` que restaure el estado inicial limpio para ensayar o presentar el pitch.

#### Scenario: Reinicio limpio antes del pitch
- **WHEN** el usuario hace clic en `Reiniciar datos demo`
- **THEN** el sistema restablece tarjetas, mensajes del Gemelo, agenda, cola del Escudo Anti-Fatiga, modo IA y métricas a los valores iniciales de `seedData.js`

### Requirement: Operación 100% offline con extensión opcional de LLM
El sistema SHALL ejecutar toda la lógica de traducción cultural, candado de aprobación, bloqueos y las 7 pruebas funcionales en local sin requerir conexión a internet, ofreciendo opcionalmente en Ajustes la configuración de un endpoint compatible con OpenAI/LiteLLM.

#### Scenario: Ejecución sin conexión a internet
- **WHEN** el prototipo corre sin conectividad externa ni clave de API configurada
- **THEN** todas las vistas, el traductor de tono, el candado humano y las 7 pruebas QA operan sin errores ni bloqueos

### Requirement: Flujo asistido para la demostración de 90 segundos
El sistema SHALL facilitar la ejecución secuencial de los 5 pasos de la demo de 90 segundos (mensaje ambiguo de Tokio → traducción y semáforo → aprobación con un clic desde Guadalajara → tarjeta actualizada en Tablero por Valor → Sala de Alineación conceptual) sin requerir entrada manual repetitiva.

#### Scenario: Recorrido completo del pitch de 90 segundos
- **WHEN** el presentador inicia el flujo con el mensaje precargado de Tokio en el Gemelo de Sincronía, aprueba como integrante de Guadalajara y navega al Tablero y a la Sala de Alineación
- **THEN** cada paso refleja de inmediato el cambio de estado generado en el paso anterior con continuidad visual completa
