import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})

export class LoginApiClient{
    private readonly httpClient: HttpClient = inject(HttpClient)

    iniciarSesion(nombre: string, clave: string): Observable<{accessToken: string}>{
        return this.httpClient.post<{accessToken: string}>("/api/v1/auth", {nombre, clave});
    }
}