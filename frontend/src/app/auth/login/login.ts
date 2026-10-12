import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { LoginApiClient } from "./login-api-client";
import { AuthStore } from "../auth-store";
import { Button } from "primeng/button";
import { Password } from "primeng/password";
import { InputText } from "primeng/inputtext";

@Component({
    selector: "app-login",
    templateUrl: "./login.html",
    styleUrl: "./login.css",
    imports: [ReactiveFormsModule, InputText, Password, Button]
})

export class Login {
    private readonly messageService: MessageService = inject(MessageService);
    private readonly loginApiClient: LoginApiClient = inject(LoginApiClient);
    private readonly authStore: AuthStore = inject(AuthStore);
    private readonly router: Router = inject(Router);

    form: FormGroup = new FormGroup({
        nombre: new FormControl(null, Validators.required),
        clave: new FormControl(null, Validators.required)
    })

    iniciarSesion(){
        if (!this.form.valid){
            this.messageService.add({severity: "error", summary: "Las credenciales ingresadas no son válidas"})
        }

        const nombre: string = this.form.value.nombre;
        const clave: string = this.form.value.clave;

        this.loginApiClient.iniciarSesion(nombre,clave).subscribe({
            next: (res) => {
                this.authStore.guardarToken(res.accessToken)
                this.router.navigateByUrl("/turnos")
            },
            error: (err) => {
                this.messageService.add({severity: "error", summary: "Error al iniciar sesión"})
            }
        });
    }

}