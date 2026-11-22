/**
 * Utilidades para cálculo de husos horarios y reglas del Escudo Anti-Fatiga
 * Sedes: Tokio (UTC+9), Berlín (UTC+1), Guadalajara (UTC-6)
 */

export const TIMEZONES = {
  tokio: { id: 'tokio', name: 'Tokio', offset: 9, iana: 'Asia/Tokyo', flag: '🇯🇵' },
  berlin: { id: 'berlin', name: 'Berlín', offset: 1, iana: 'Europe/Berlin', flag: '🇩🇪' },
  guadalajara: { id: 'guadalajara', name: 'Guadalajara', offset: -6, iana: 'America/Mexico_City', flag: '🇲🇽' },
};

/**
 * Obtiene la hora en formato Date ajustada a la sede considerando un offset o simulatedHourUTC
 */
export function getSiteTime(siteId, simulatedUtcDate = null) {
  const baseDate = simulatedUtcDate ? new Date(simulatedUtcDate) : new Date();
  const config = TIMEZONES[siteId.toLowerCase()];
  if (!config) return baseDate;

  // Calculamos la hora UTC y sumamos el offset específico
  const utcMillis = baseDate.getTime() + (baseDate.getTimezoneOffset() * 60000);
  const siteMillis = utcMillis + (config.offset * 3600000);
  return new Date(siteMillis);
}

/**
 * Determina si la hora local se encuentra dentro de la jornada laboral activa (09:00 - 18:00)
 */
export function isSiteActive(localDate) {
  const hours = localDate.getHours();
  return hours >= 9 && hours < 18;
}

/**
 * Formatea una fecha local en cadena legible HH:mm:ss y fecha
 */
export function formatLocalTime(localDate) {
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const seconds = String(localDate.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function formatLocalDate(localDate) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return localDate.toLocaleDateString('es-ES', options);
}

/**
 * Calcula la hora programada de la próxima mañana (09:00) para el Escudo Anti-Fatiga
 */
export function calculateNextMorningDelivery(targetSiteId, simulatedUtcDate = null) {
  const currentLocal = getSiteTime(targetSiteId, simulatedUtcDate);
  const deliveryDate = new Date(currentLocal);

  // Si aún no son las 9am del mismo día, se programa para hoy a las 9am
  if (currentLocal.getHours() < 9) {
    deliveryDate.setHours(9, 0, 0, 0);
  } else {
    // Si ya pasaron las 9am o son más de las 18:00, se programa para mañana a las 9am
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    deliveryDate.setHours(9, 0, 0, 0);
  }

  const hours = String(deliveryDate.getHours()).padStart(2, '0');
  const minutes = String(deliveryDate.getMinutes()).padStart(2, '0');
  const dateFormatted = deliveryDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });

  return `${dateFormatted} a las ${hours}:${minutes} (hora local de ${TIMEZONES[targetSiteId]?.name || targetSiteId})`;
}
