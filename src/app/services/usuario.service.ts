import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<Usuario>;
  userDoc: AngularFirestoreDocument<Usuario>;
  users: Observable<Usuario[]>;
  user: Observable<Usuario>;
  uid: string;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) 
  { 
    this.userCollection = this.afs.collection('usuarios', ref => ref);
    this.user = this.afAuth.authState.pipe(switchMap(User => 
      {
        //Usuario conectado:
        if( User )
        {
          return this.afs.doc<Usuario>(`users/${User.uid}`).valueChanges();
        }
        //Usuario desconectado:
        else 
        {
          return of(null);
        }
      }))
  }
  
  //Crear Usuario:
  crearUser(user: Usuario)
  {
    this.userCollection.doc(user.uid).set(user);
  }

  //Obtener Usuario:
  getUsuarios():Observable<Usuario[]>
  {
    this.users = this.userCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(action => {
          const data = action.payload.doc.data() as Usuario;
          data.uid = action.payload.doc.id;
          return data;
      });
    }));
    return this.users;
  }

  //Obtener usuario:
  getUser( idUser: string)
  {
    this.userDoc = this.afs.doc<Usuario>(`usuarios/${idUser}`);
    this.user = this.userDoc.snapshotChanges().pipe(map(action => {
      if(action.payload.exists == false){
        return null;
      }else{
        const data = action.payload.data() as Usuario;
        data.uid = action.payload.id;
        return data;
      }
    }));
    return this.user;
  }

  //Actualizar usuario:
  updateUser(user: Usuario)
  {
    this.userDoc = this.afs.doc(`usuarios/${user.uid}`);
    this.userDoc.update(user);
  }
  //Borrar usuario:
  deleteUser(user: Usuario){
    this.userDoc = this.afs.doc(`usuarios/${user.uid}`);
    this.userDoc.delete();
  }


}
