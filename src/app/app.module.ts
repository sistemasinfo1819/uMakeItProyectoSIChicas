import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import{APP_ROUTING} from './app.routes';
import { AdmComponent } from './components/adm/adm.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { PagoComponent } from './components/pago/pago.component';
import { environment } from '../environments/environment.prod';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component'
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { CambiarClaveComponent } from './components/cambiar-clave/cambiar-clave.component';
import { OrdenComponent } from './components/orden/orden.component';
import {AngularFireStorageModule} from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdmComponent,
    CarritoComponent,
    PagoComponent,
    RecuperarContrasenaComponent,
    CambiarClaveComponent,
    OrdenComponent,
    
  ],
  imports: [
    BrowserModule, APP_ROUTING,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ModalModule.forRoot(),
    FormsModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
