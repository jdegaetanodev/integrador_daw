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

  items: MenuItem[] = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      routerLink: "/inicio"
    },
    {
      label: "Turnos",
      icon: "pi pi-bars",
      routerLink: "/turnos"
    },
    ...(this.authStore.obtenerRol() === 'ADMINISTRADOR'
      ? [{
          label: "Valor de consulta",
          icon: "pi pi-dollar",
          routerLink: "/inicio/admin/medicos"
        }]
      : []),
  ]
}