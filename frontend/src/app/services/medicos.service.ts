import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from '../models/medico.model';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class MedicosService {
  private http = inject(HttpClient);

  listar(): Observable<Medico[]> {
    return this.http.get<Medico[]>(`${API}/medicos`);
  }

  actualizarValor(id: number, valor_consulta: number): Observable<Medico> {
    return this.http.patch<Medico>(`${API}/admin/medicos/${id}/valor-consulta`, { valor_consulta });
  }
}