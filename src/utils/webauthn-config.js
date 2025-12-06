// Determinar el RP_ID dinámicamente según el entorno
// Esto permite que funcione en localhost y en producción sin cambios manuales
const hostname = window.location.hostname;

// En producción (sauldev.es), el RP ID suele ser el dominio raíz (sin subdominios si quieres compartir credenciales)
// En desarrollo, es 'localhost'
export const RP_ID = hostname === 'localhost' ? 'localhost' : 'sauldev.es';

console.log(`[WebAuthn] Configured RP_ID: ${RP_ID}`);
