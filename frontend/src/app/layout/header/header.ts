import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
//import { AuthStore } from "../../auth/auth-store";
//import { inject } from "@angular/core";

@Component({
  selector: 'app-header',
  imports: [Menu],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  //private readonly authStore = inject(AuthStore);

  items: MenuItem[] = [
    {
      label: "Cerrar sesión",
      icon: "pi pi-user",
      routerLink: "/login"
    }
  ]
}
