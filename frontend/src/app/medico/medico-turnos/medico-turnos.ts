import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TurnosService } from '../../services/turnos.service';
import { ReservaResponse } from '../../reservas/reservas-api-client';
import { fechaLocal, ZONA_CLINICA } from '../../utils/fecha';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-medico-turnos',
  imports: [DatePipe, TableModule, ButtonModule],
  templateUrl: './medico-turnos.html',
  styleUrl: './medico-turnos.css',
})
export class MedicoTurnos {
  private turnosService = inject(TurnosService);

  readonly zona = ZONA_CLINICA;
  fecha = signal(fechaLocal());
  turnos = signal<ReservaResponse[]>([]);
  cargando = signal(false);
  error = signal('');
  exito = signal('');

  constructor() {
    this.cargar();
  }

  cambiarFecha(valor: string) {
    if (!valor) return;
    this.fecha.set(valor);
    this.exito.set('');
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.turnosService.listarPorMedicoYFecha(this.fecha()).subscribe({
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

  marcar(turno: ReservaResponse, estado: 'ATENDIDO' | 'AUSENTE') {
    this.error.set('');
    this.exito.set('');
    this.turnosService.cambiarEstado(turno.id, estado).subscribe({
      next: () => {
        this.exito.set(`Turno marcado como ${estado}`);
        this.cargar();
      },
      error: (e) => this.error.set(mensajeDeError(e, 'No se pudo actualizar el turno')),
    });
  }
}