
export const ZONA_CLINICA = 'UTC';

export const HORAS_TURNO = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
];

function dosDigitos(n: number): string {
  return String(n).padStart(2, '0');
}

// Fecha local en formato YYYY-MM-DD (toISOString daría la de UTC y de noche es el día siguiente)
export function fechaLocal(d: Date = new Date()): string {
  return `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}`;
}

export function sumarDias(d: Date, dias: number): Date {
  const copia = new Date(d);
  copia.setDate(copia.getDate() + dias);
  return copia;
}

export function armarFechaHora(fecha: string, hora: string): string {
  return `${fecha}T${hora}:00.000Z`;
}