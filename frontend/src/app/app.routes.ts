import { Routes } from '@angular/router';
import { Login } from "./auth/login/login"
import { MainLayout } from "./layout/main-layout/main-layout"
import { Home } from "./home/home"

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
        /*
        La propiedad "children" configura qué componente mostrar en el router-outlet del main layout, definido en su respectivo html
        {
            path: "turnos",
            component: Turnos,
        },
        {
            path: "adminstracion",
            component: Administracion,
            data: { roles: ['ADMINISTRADOR'] } <- Para proteger una ruta con roleGuard
        },*/
        ]},
        { path: "**", redirectTo: "login" }
    ];
