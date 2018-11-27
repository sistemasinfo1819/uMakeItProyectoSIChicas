import { Component, TemplateRef } from '@angular/core';
import {Router} from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import{ UserService } from '../../services/usuario.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AngularFireAuth]
})

export class LoginComponent {

  email: string;
  modalRef: BsModalRef;
  
  constructor(public auth: AuthService, 
    public db: AngularFirestore,
    public router: Router, private modalService: BsModalService,
    public UsuarioService: UserService) { }

  ngOnInit() {
    
  }

  Registrar(Email: HTMLInputElement, Password: HTMLInputElement){
    var emailRegistro = Email.value;
    var contrasenaRegistro = Password.value;
    this.auth.signUp(emailRegistro, contrasenaRegistro)
    .then(credentials => {
      const Usuario = credentials.user;

      const usuario = {
        uid: Usuario.uid,
        email : Usuario.email,
        name :  Usuario.email,
        role : 'customer',
      }
      this.db.collection('usuarios').doc(Usuario.uid).set(usuario).then(() => {
        this.auth.emailAndPassword(emailRegistro, contrasenaRegistro).then(() => {
          this.router.navigate(['home']);
        }).catch(err => {
          alert(err.message);
        })
      }).catch(err => {
        alert(err.message);
      })
    }).catch(err => {
      alert(err.message);
    })
  }

  Iniciar(Email: HTMLInputElement, Password: HTMLInputElement){
    var emailLogin = Email.value;
    var contrasenaLogin = Password.value;
    this.auth.emailAndPassword(emailLogin, contrasenaLogin).then(credentials => {
    }).catch(err => {
      alert(err.message);
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
