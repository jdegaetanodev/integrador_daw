import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})

export class LoginApiClient{
    private readonly httpClient: HttpClient = inject(HttpClient)

    iniciarSesion(documento: string, clave: string): Observable<{access_token: string}>{
        return this.httpClient.post<{access_token: string}>("/api/v1/auth/login", {documento, clave});
    }
}