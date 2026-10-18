import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MedicosService } from '../../services/medicos.service';
import { TurnosService } from '../../services/turnos.service';
import { Medico } from '../../models/medico.model';
import { armarFechaHora, fechaLocal, HORAS_TURNO, sumarDias } from '../../utils/fecha';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-admin-reservar',
  imports: [ButtonModule],
  templateUrl: './admin-reservar.html',
  styleUrl: './admin-reservar.css',
})
export class AdminReservar {
  private medicosService = inject(MedicosService);
  private turnosService = inject(TurnosService);

  readonly horas = HORAS_TURNO;
  readonly minFecha = fechaLocal();
  readonly maxFecha = fechaLocal(sumarDias(new Date(), 30));

  medicos = signal<Medico[]>([]);
  error = signal('');
  exito = signal('');
  enviando = signal(false);

  constructor() {
    this.medicosService.listar().subscribe({
      next: (m) => this.medicos.set(m),
      error: (e) => this.error.set(mensajeDeError(e, 'No se pudieron cargar los médicos')),
    });
  }

  etiqueta(m: Medico): string {
    const nombre = m.apellidos ? ` - ${m.apellidos}, ${m.nombres ?? ''}` : '';
    return `Mat. ${m.matricula}${nombre}`;
  }

  reservar(idMedico: string, idPaciente: string, fecha: string, hora: string) {
    this.error.set('');
    this.exito.set('');

    const medico = Number(idMedico);
    const paciente = Number(idPaciente);
    if (!medico) {
      this.error.set('Elegí un médico');
      return;
    }
    if (!Number.isInteger(paciente) || paciente < 1) {
      this.error.set('Ingresá el id del paciente (número entero)');
      return;
    }
    if (!fecha) {
      this.error.set('Elegí una fecha');
      return;
    }
    if (!hora) {
      this.error.set('Elegí una hora');
      return;
    }

    this.enviando.set(true);
    this.turnosService
      .reservar({ id_medico: medico, id_paciente: paciente, fecha_hora: armarFechaHora(fecha, hora) })
      .subscribe({
        next: () => {
          this.exito.set('Turno reservado correctamente');
          this.enviando.set(false);
        },
        error: (e) => {
          this.error.set(mensajeDeError(e, 'No se pudo reservar el turno'));
          this.enviando.set(false);
        },
      });
  }
}