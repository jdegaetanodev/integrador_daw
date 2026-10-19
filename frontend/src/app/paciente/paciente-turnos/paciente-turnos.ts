import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TurnosService } from '../../services/turnos.service';
import { ReservaResponse } from '../../reservas/reservas-api-client';
import { ZONA_CLINICA } from '../../utils/fecha';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-paciente-turnos',
  imports: [DatePipe, CurrencyPipe, TableModule, ButtonModule],
  templateUrl: './paciente-turnos.html',
  styleUrl: './paciente-turnos.css',
})
export class PacienteTurnos {
  private turnosService = inject(TurnosService);

  readonly zona = ZONA_CLINICA;
  activos = signal<ReservaResponse[]>([]);
  historicos = signal<ReservaResponse[]>([]);
  cargando = signal(false);
  error = signal('');
  exito = signal('');

  constructor() {
    this.cargar();
  }

  // Como el usuario es paciente, el backend devuelve solo sus turnos
  cargar() {
    this.cargando.set(true);
    this.turnosService.listarTodas().subscribe({
      next: (r) => {
        const ordenados = [...r].sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora));
        this.activos.set(ordenados.filter((t) => this.esActivo(t)));
        // Historial: el más reciente primero
        this.historicos.set(ordenados.filter((t) => !this.esActivo(t)).reverse());
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeDeError(e, 'No se pudieron cargar tus turnos'));
        this.cargando.set(false);
      },
    });
  }

  // Activo: estado ACTIVO y todavía no empezó
  esActivo(t: ReservaResponse): boolean {
    return t.estado === 'ACTIVO' && new Date(t.fecha_hora) > new Date();
  }

  // El paciente puede cancelar hasta las 23:59 del día anterior al turno (misma regla que el backend)
  puedeCancelar(t: ReservaResponse): boolean {
    if (t.estado !== 'ACTIVO') return false;
    const turno = new Date(t.fecha_hora);
    const limite = new Date(turno.getFullYear(), turno.getMonth(), turno.getDate() - 1, 23, 59, 59);
    return new Date() <= limite;
  }

  cancelar(t: ReservaResponse) {
    if (!confirm('¿Cancelar este turno?')) return;
    this.error.set('');
    this.exito.set('');
    this.turnosService.cancelar(t.id).subscribe({
      next: (r) => {
        this.exito.set(r.mensaje ?? 'Turno cancelado');
        this.cargar();
      },
      error: (e) => this.error.set(mensajeDeError(e, 'No se pudo cancelar el turno')),
    });
  }
}