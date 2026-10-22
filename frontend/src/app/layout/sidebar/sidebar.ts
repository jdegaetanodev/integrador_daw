import { Component, inject } from '@angular/core';
import { Router } from "@angular/router";
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { AuthStore } from '../../auth/auth-store';

@Component({
  selector: 'app-sidebar',
  imports: [Menu],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})

export class Sidebar {
  private readonly router: Router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly rol = this.authStore.obtenerRol();

  items: MenuItem[] = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      routerLink: "/inicio"
    },
    ...(this.rol === 'MEDICO'
      ? [{
          label: "Mis turnos",
          icon: "pi pi-calendar",
          routerLink: "/inicio/medico/turnos"
        }]
      : []),
    ...(this.rol === 'ADMINISTRADOR'
      ? [
          {
            label: "Gestión de turnos",
            icon: "pi pi-calendar",
            routerLink: "/inicio/admin/turnos"
          },
          {
            label: "Reservar turno",
            icon: "pi pi-plus",
            routerLink: "/inicio/admin/reservar"
          },
          {
            label: "Valor de consulta",
            icon: "pi pi-dollar",
            routerLink: "/inicio/admin/medicos"
          },
        ]
      : []),
    ...(this.rol === 'PACIENTE'
      ? [
          {
            label: "Mis turnos",
            icon: "pi pi-calendar",
            routerLink: "/inicio/paciente/turnos"
          },
          {
            label: "Reservar turno",
            icon: "pi pi-plus",
            routerLink: "/inicio/paciente/reservar"
          },
        ]
      : []),
  ]
}