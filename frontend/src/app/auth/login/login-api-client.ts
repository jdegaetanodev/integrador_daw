import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RolUsuario } from "../auth-store";

export interface LoginResponse {
    access_token: string;
    usuario: {
        rol: RolUsuario;
        nombres: string;
    };
}

@Injectable({
    providedIn: "root"
})

export class LoginApiClient{
    private readonly httpClient: HttpClient = inject(HttpClient)

    iniciarSesion(documento: string, clave: string): Observable<LoginResponse>{
        return this.httpClient.post<LoginResponse>("/api/v1/auth/login", {documento, clave});
    }
}