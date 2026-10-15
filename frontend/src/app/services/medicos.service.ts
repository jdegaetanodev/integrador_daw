import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Medico } from '../models/medico.model';

// TODO: pasar a false cuando el backend esté listo
const USAR_MOCK = true;

@Injectable({ providedIn: 'root' })
export class MedicosService {
  private http = inject(HttpClient);

  private mock: Medico[] = [
    { id: 1, id_usuario: 101, matricula: 12345, valor_consulta: 15000, nombres: 'Ana', apellidos: 'Pérez' },
    { id: 2, id_usuario: 102, matricula: 23456, valor_consulta: 18000, nombres: 'Luis', apellidos: 'Gómez' },
    { id: 3, id_usuario: 103, matricula: 34567, valor_consulta: 16500, nombres: 'Marta', apellidos: 'Sosa' },
  ];

  listar(): Observable<Medico[]> {
    if (USAR_MOCK) {
      return of(this.mock.map((m) => ({ ...m })));
    }
    return this.http.get<Medico[]>('/api/medicos');
  }

  actualizarValor(id: number, valor_consulta: number): Observable<Medico> {
    if (USAR_MOCK) {
      const medico = this.mock.find((m) => m.id === id)!;
      medico.valor_consulta = valor_consulta;
      return of({ ...medico });
    }
    return this.http.patch<Medico>(`/api/medicos/${id}`, { valor_consulta });
  }
}