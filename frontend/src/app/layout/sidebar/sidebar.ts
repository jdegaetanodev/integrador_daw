import { Component, inject } from '@angular/core';
import { Router } from "@angular/router";
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-sidebar',
  imports: [Menu],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})

export class Sidebar {
  private readonly router: Router = inject(Router);

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
  ]
}
