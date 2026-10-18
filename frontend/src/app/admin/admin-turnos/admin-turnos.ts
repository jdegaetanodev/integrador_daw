import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TurnosService } from '../../services/turnos.service';
import { ReservaResponse } from '../../reservas/reservas-api-client';
import { ZONA_CLINICA } from '../../utils/fecha';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-admin-turnos',
  imports: [DatePipe, CurrencyPipe, TableModule, ButtonModule],
  templateUrl: './admin-turnos.html',
  styleUrl: './admin-turnos.css',
})
export class AdminTurnos {
  private turnosService = inject(TurnosService);

  readonly zona = ZONA_CLINICA;
  turnos = signal<ReservaResponse[]>([]);
  cargando = signal(false);
  error = signal('');
  exito = signal('');

  constructor() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.turnosService.listarTodas().subscribe({
      next: (r) => {
        this.turnos.set([...r].sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora)));
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeDeError(e, 'No se pudieron cargar los turnos'));
        this.cargando.set(false);
      },
    });
  }

  // El admin puede cancelar hasta que empieza la consulta; el backend es quien decide
  puedeCancelar(t: ReservaResponse): boolean {
    return t.estado === 'ACTIVO' && new Date(t.fecha_hora) > new Date();
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