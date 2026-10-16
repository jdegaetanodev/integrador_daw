import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  ReservasApiClient,
  ReservaResponse,
} from '../../../reservas/reservas-api-client';

@Component({
  selector: 'app-table',
  imports: [TableModule, DatePipe, CurrencyPipe],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements OnInit {
  private readonly reservasApiClient = inject(ReservasApiClient);

  reservas: ReservaResponse[] = [];
  cargando = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.reservasApiClient.obtenerReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.cargando = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las reservas.';
        this.cargando = false;
      },
    });
  }
}
