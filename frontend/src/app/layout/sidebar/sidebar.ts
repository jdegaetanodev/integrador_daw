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
      label: "inicio",
      icon: "pi pi-home",
      routerLink: "/inicio"
    },
    {
      label: "turnos",
      icon: "pi pi-bars",
      routerLink: "/turnos"
    },
  ]
}
