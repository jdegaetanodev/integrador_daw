import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaResponse } from '../reservas/reservas-api-client';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class TurnosService {
  private http = inject(HttpClient);

  // Médico: sus turnos de la fecha. Admin: hay que pasar idMedico.
  listarPorMedicoYFecha(fecha: string, idMedico?: number): Observable<ReservaResponse[]> {
    let params = new HttpParams().set('fecha', fecha);
    if (idMedico !== undefined) params = params.set('id_medico', idMedico);
    return this.http.get<ReservaResponse[]>(`${API}/reservas/medico`, { params });
  }

  cambiarEstado(id: number, estado: 'ATENDIDO' | 'AUSENTE'): Observable<ReservaResponse> {
    return this.http.patch<ReservaResponse>(`${API}/reservas/${id}/estado`, { estado });
  }

  listarTodas(): Observable<ReservaResponse[]> {
    return this.http.get<ReservaResponse[]>(`${API}/reservas`);
  }

  cancelar(id: number): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${API}/reservas/${id}/cancelar`, {});
  }

  //Horarios libres de un medico en una fecha "YYYY-MM-DD"devuelve por ejemplo ['08:00:00', '10:00:00']
   consultarDisponibilidad(idMedico: number, fecha: string): Observable<string[]> {
    const params = new HttpParams().set('id_medico', idMedico).set('fecha', fecha);
    return this.http.get<string[]>(`${API}/reservas/disponibilidad`, { params });
  }
  
  reservar(body: {
    id_medico: number;
    fecha_hora: string;
    id_paciente?: number;
  }): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(`${API}/reservas`, body);
  }
}