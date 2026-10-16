import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type EstadoReserva = 'ACTIVO' | 'ATENDIDO' | 'AUSENTE' | 'CANCELADO';

export interface MedicoReserva {
  id: number;
  matricula: number;
  apellidos: string;
  nombres: string;
}

export interface PacienteReserva {
  id: number;
  documento: string;
  apellidos: string;
  nombres: string;
  email: string;
}

export interface ReservaResponse {
  id: number;
  fecha_hora: string;
  estado: EstadoReserva;
  valor_consulta: number;
  medico?: MedicoReserva;
  paciente?: PacienteReserva;
}

@Injectable({
  providedIn: 'root',
})
export class ReservasApiClient {
  private readonly httpClient = inject(HttpClient);

  obtenerReservas(): Observable<ReservaResponse[]> {
    return this.httpClient.get<ReservaResponse[]>('/api/v1/reservas');
  }
}
