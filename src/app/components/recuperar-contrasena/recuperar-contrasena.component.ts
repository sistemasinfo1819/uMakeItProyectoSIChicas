import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent implements OnInit {

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
