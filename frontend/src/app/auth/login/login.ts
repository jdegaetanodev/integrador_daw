import { Component, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { LoginApiClient } from "./login-api-client";
import { AuthStore } from "../auth-store";
import { Button } from "primeng/button";
import { Password } from "primeng/password";
import { InputText } from "primeng/inputtext";
import { FloatLabel } from "primeng/floatlabel";

@Component({
    selector: "app-login",
    templateUrl: "./login.html",
    styleUrl: "./login.css",
    imports: [ReactiveFormsModule, InputText, Password, FloatLabel, Button]
})

export class Login {
    private readonly messageService: MessageService = inject(MessageService);
    private readonly loginApiClient: LoginApiClient = inject(LoginApiClient);
    private readonly authStore: AuthStore = inject(AuthStore);
    private readonly router: Router = inject(Router);

    form: FormGroup = new FormGroup({
        documento: new FormControl(null, Validators.required),
        clave: new FormControl(null, [
            Validators.required,
            Validators.minLength(6)
        ])
    })

    iniciarSesion(){
        if (!this.form.valid){
            this.messageService.add({severity: "error", summary: "Las credenciales ingresadas no son válidas"})
            return;
        }

        const documento: string = this.form.value.documento;
        const clave: string = this.form.value.clave;

        this.loginApiClient.iniciarSesion(documento, clave).subscribe({
            next: (res) => {
                this.authStore.guardarSesion(
                    res.access_token,
                    res.usuario.rol,
                    res.usuario.nombres,
                )
                this.router.navigateByUrl("/inicio")
            },
            error: (err: HttpErrorResponse) => {
                const responseMessage = err.error?.message;
                const detail = Array.isArray(responseMessage)
                    ? responseMessage.join(", ")
                    : typeof responseMessage === "string"
                        ? responseMessage
                        : "Verificá el documento y la clave.";

                this.messageService.add({
                    severity: "error",
                    summary: "Error al iniciar sesión",
                    detail
                })
            }
        });
    }

}