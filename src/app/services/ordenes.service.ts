import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Orden } from '../models/orden';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  ordenCollection: AngularFirestoreCollection<Orden>;
  ordenDoc: AngularFirestoreDocument<Orden>;
  ordenes: Observable<Orden[]>;
  orden: Observable<Orden>;

  constructor(private afs: AngularFirestore, private auth: AuthService) { 
    this.auth.usuario.subscribe((usuario)=> {
      this.ordenCollection = this.afs.collection<Orden>('ordenes', ref => ref.where('uid', '==' , usuario.uid))
    })
  }
  
  getorders(uid?: string) {
    if(uid){
      this.ordenes = this.ordenCollection.snapshotChanges().pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Orden;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
      return this.ordenes;
    }
  }

  getorder(id: string) {
    return this.afs.doc<Orden>(`ordenes/${id}`);
  }

  save(orden: Orden){
    this.ordenCollection.add(orden);
  }

}
