import { Routes } from '@angular/router';
import { Login } from "./auth/login/login"
import { MainLayout } from "./layout/main-layout/main-layout"
import { Home } from "./home/home"
import { roleGuard } from "./auth/role-guard"
import { AdminMedicos } from "./admin/admin-medicos/admin-medicos"
import { MedicoTurnos } from "./medico/medico-turnos/medico-turnos"
import { AdminTurnos } from "./admin/admin-turnos/admin-turnos"
import { AdminReservar } from "./admin/admin-reservar/admin-reservar"


export const routes: Routes = [
    { path: "login", component: Login },
    {
        path: "inicio",
        component: MainLayout,
        children: [{
            path: "",
            redirectTo: "home",
            pathMatch: "full"
        },
        {
            path: "home",
            component: Home,
        },
        {
            path: "admin/medicos",
            component: AdminMedicos,
            canActivate: [roleGuard],
            data: { roles: ['ADMINISTRADOR'] },
        },
        {
            path: "medico/turnos",
            component: MedicoTurnos,
            canActivate: [roleGuard],
            data: { roles: ['MEDICO'] },
        },
        {
            path: "admin/turnos",
            component: AdminTurnos,
            canActivate: [roleGuard],
            data: { roles: ['ADMINISTRADOR'] },
        },
        {
            path: "admin/reservar",
            component: AdminReservar,
            canActivate: [roleGuard],
            data: { roles: ['ADMINISTRADOR'] },
        },
        ]
    },
    { path: "**", redirectTo: "login" }
];