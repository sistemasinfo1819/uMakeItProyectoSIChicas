import {Routes, RouterModule, Router} from '@angular/router';
import {NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import{HomeComponent} from './components/home/home.component';
import{LoginComponent} from'./components/login/login.component';
import{PagoComponent} from'./components/pago/pago.component';
import{CarritoComponent} from'./components/carrito/carrito.component';
import{AdmComponent} from'./components/adm/adm.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import {CambiarClaveComponent} from './components/cambiar-clave/cambiar-clave.component';
import { OrdenComponent } from './components/orden/orden.component';

const ROUTES: Routes=[

    {path: 'administrador',component:AdmComponent},
    {path: 'carrito',component:CarritoComponent},
    {path: 'login',component:LoginComponent},
    {path: 'home',component:HomeComponent},
    {path: 'pago',component:PagoComponent},
    {path: 'recuperar',component:RecuperarContrasenaComponent},
    {path: 'cambiarClave',component:CambiarClaveComponent},
    {path: 'orden',component: OrdenComponent},
    {path:'**', redirectTo:'login', pathMatch:'full'},

];

export const APP_ROUTING=RouterModule.forRoot(ROUTES);
