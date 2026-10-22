import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from "primeng/card";
import { Button } from "primeng/button";
import { AuthStore } from '../auth/auth-store';

@Component({
  selector: 'app-home',
  imports: [CardModule, Button, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly authStore = inject(AuthStore);

  get rutaTurnos(): string {
    switch (this.authStore.obtenerRol()) {
      case 'PACIENTE':
        return '/inicio/paciente/turnos';
      case 'MEDICO':
        return '/inicio/medico/turnos';
      case 'ADMINISTRADOR':
        return '/inicio/admin/turnos';
      default:
        return '/inicio/home';
    }
  }
}
