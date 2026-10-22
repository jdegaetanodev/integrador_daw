import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

export type RolUsuario = "MEDICO" | "PACIENTE" | "ADMINISTRADOR";

@Injectable({
    providedIn: "root"
})

export class AuthStore {
    private readonly router: Router = inject(Router);

    guardarSesion(token: string, rol: RolUsuario, nombres: string): void{
        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("rolUsuario", rol);
        sessionStorage.setItem("nombresUsuario", nombres);
    }

    obtenerToken(): string | null{
        return sessionStorage.getItem("accessToken");
    }

    obtenerRol(): RolUsuario | null {
        const rol = sessionStorage.getItem("rolUsuario");

        if (rol === "MEDICO" || rol === "PACIENTE" || rol === "ADMINISTRADOR") {
            return rol;
        }

        return null;
    }

    obtenerNombres(): string | null {
        const nombres = sessionStorage.getItem("nombresUsuario")?.trim();
        return nombres || null;
    }

    cerrarSesion(): void{
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("rolUsuario");
        sessionStorage.removeItem("nombresUsuario");
        this.router.navigateByUrl("/login");
    }
}
