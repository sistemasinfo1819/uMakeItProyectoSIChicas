import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent implements OnInit {

  constructor(public authentication: AngularFireAuth) { }

  ngOnInit() {
  }

  RecuperarContrasena(email: HTMLInputElement){
    var emailPassword = email.value
    this.authentication.auth.sendPasswordResetEmail(emailPassword).then(function() {
      alert("email sent")
    }).catch(function(error) {
      alert(error.message);
    });
  }

}
