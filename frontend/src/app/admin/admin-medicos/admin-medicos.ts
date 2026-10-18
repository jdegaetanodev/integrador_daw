import { Component, inject, signal } from '@angular/core';
import { MedicosService } from '../../services/medicos.service';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-admin-medicos',
  imports: [],
  templateUrl: './admin-medicos.html',
  styleUrl: './admin-medicos.css',
})
export class AdminMedicos {
  private medicos = inject(MedicosService);

  lista = signal<Medico[]>([]);
  error = signal('');
  exito = signal('');

  constructor() {
    this.cargar();
  }

  cargar() {
    this.medicos.listar().subscribe({
      next: (m) => this.lista.set(m),
      error: () => this.error.set('No se pudieron cargar los médicos'),
    });
  }

  guardar(medico: Medico, valor: string) {
    this.error.set('');
    this.exito.set('');

    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 1) {
      this.error.set('El valor de la consulta debe ser un número entero mayor o igual a 1');
      return;
    }

    this.medicos.actualizarValor(medico.id, numero).subscribe({
      next: () => {
        this.exito.set('Valor actualizado correctamente');
        this.cargar();
      },
      error: (e) => this.error.set(e.error?.message ?? 'No se pudo actualizar el valor'),
    });
  }
}