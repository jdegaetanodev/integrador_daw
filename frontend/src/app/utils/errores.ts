import { HttpErrorResponse } from '@angular/common/http';

// Nest devuelve message como texto o como arreglo (errores de validación de DTOs)
export function mensajeDeError(e: unknown, porDefecto: string): string {
  const msg = (e as HttpErrorResponse)?.error?.message;
  if (Array.isArray(msg)) return msg.join('. ');
  return typeof msg === 'string' ? msg : porDefecto;
}