import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario';
import { switchMap } from 'rxjs/operators';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuario: Observable<Usuario>;
  role: string = "";
  constructor(
    private afAuth: AngularFireAuth, 
    private afs: AngularFirestore,
    private router: Router) { 
      this.usuario = this.afAuth.authState.pipe(switchMap(Usuario => {
        if(Usuario){
          return this.afs.doc<Usuario>(`usuarios/${Usuario.uid}`).valueChanges()
        }else {
          return of(null);
        }
      }))
    }

  public emailAndPassword(email, password)
  {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(credentials => {
      this.usuario.subscribe(user => 
        {
          this.role = user.role
          if(this.role == 'customer'){
            this.router.navigate(['home']);
          }else if(this.role == 'admin'){
            this.router.navigate(['administrador']);
          }
        });
    });
  }

  public signUp(email, password)
  {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public ForgotPassword(email)
  {
    this.afAuth.auth.sendPasswordResetEmail(email).then(function() {
      alert("email sent")
    }).catch(function(error) {
      alert(error.message);
    });
  }

  public signOut() 
  {
    this.afAuth.auth.signOut().then(() => 
    this.router.navigate(['/login']));
  }

}
