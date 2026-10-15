import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-header',
  imports: [Menu],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  items: MenuItem[] = [
    {
      label: "iniciar sesión",
      icon: "pi pi-user",
      routerLink: "/login"
    }
  ]
}
