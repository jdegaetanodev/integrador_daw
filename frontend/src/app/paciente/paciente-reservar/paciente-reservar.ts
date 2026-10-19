import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MedicosService } from '../../services/medicos.service';
import { TurnosService } from '../../services/turnos.service';
import { Medico } from '../../models/medico.model';
import { armarFechaHora, fechaLocal, HORAS_TURNO, sumarDias, ZONA_CLINICA } from '../../utils/fecha';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-paciente-reservar',
  imports: [CurrencyPipe, DatePipe, ButtonModule],
  templateUrl: './paciente-reservar.html',
  styleUrl: './paciente-reservar.css',
})
export class PacienteReservar {
  private medicosService = inject(MedicosService);
  private turnosService = inject(TurnosService);

  readonly zona = ZONA_CLINICA;
  readonly horas = HORAS_TURNO;
  readonly minFecha = fechaLocal();
  readonly maxFecha = fechaLocal(sumarDias(new Date(), 30));

  medicos = signal<Medico[]>([]);
  medico = signal<Medico | null>(null);
  fecha = signal('');
  libres = signal<string[]>([]);
  hora = signal('');
  error = signal('');
  exito = signal('');
  enviando = signal(false);

  constructor() {
    this.medicosService.listar().subscribe({
      next: (m) => this.medicos.set(m),
      error: (e) => this.error.set(mensajeDeError(e, 'No se pudieron cargar los médicos')),
    });
  }

  elegirMedico(id: string) {
    this.medico.set(this.medicos().find((m) => m.id === Number(id)) ?? null);
    this.cargarHorarios();
  }

  elegirFecha(valor: string) {
    if (valor && (valor < this.minFecha || valor > this.maxFecha)) {
      this.error.set('Elegí una fecha entre hoy y los próximos 30 días');
      this.fecha.set('');
    } else {
      this.error.set('');
      this.fecha.set(valor);
    }
    this.cargarHorarios();
  }

  // Pide al backend los horarios libres del médico en la fecha elegida
  cargarHorarios() {
    this.hora.set('');
    this.libres.set([]);
    const medico = this.medico();
    if (!medico || !this.fecha()) return;

    this.turnosService.consultarDisponibilidad(medico.id, this.fecha()).subscribe({
      // El backend devuelve '08:00:00' y HORAS_TURNO usa '08:00'
      next: (r) => this.libres.set(r.map((h) => h.slice(0, 5))),
      error: (e) => this.error.set(mensajeDeError(e, 'No se pudieron cargar los horarios')),
    });
  }

  // Libre si el backend la devolvió, todavía no pasó y no supera los 30 días
  estaLibre(hora: string): boolean {
    if (!this.libres().includes(hora)) return false;
    const inicio = new Date(armarFechaHora(this.fecha(), hora));
    const ahora = new Date();
    return inicio > ahora && inicio <= sumarDias(ahora, 30);
  }

  fechaHoraElegida(): string {
    return armarFechaHora(this.fecha(), this.hora());
  }

  reservar() {
    const medico = this.medico();
    if (!medico || !this.fecha() || !this.hora()) return;

    this.error.set('');
    this.exito.set('');
    this.enviando.set(true);
    // El paciente no manda id_paciente: el backend lo toma del token
    this.turnosService
      .reservar({ id_medico: medico.id, fecha_hora: this.fechaHoraElegida() })
      .subscribe({
        next: () => {
          this.exito.set('Turno reservado correctamente. Lo podés ver en Mis turnos.');
          this.enviando.set(false);
          this.cargarHorarios();
        },
        error: (e) => {
          this.error.set(mensajeDeError(e, 'No se pudo reservar el turno'));
          this.enviando.set(false);
          this.cargarHorarios();
        },
      });
  }
}