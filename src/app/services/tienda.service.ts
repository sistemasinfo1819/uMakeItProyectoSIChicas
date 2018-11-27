import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto';
@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  //Cambiar Nombres
  productCollection: AngularFirestoreCollection;
  productDoc: AngularFirestoreDocument;
  productos: Observable<any>;
  entradas: Observable<any>;
  principales: Observable<any>;
  postres: Observable<any>;
  producto: Observable<any>;

  constructor( 
    private Firestore: AngularFirestore) {
      this.productCollection = this.Firestore.collection('Comidas');
  }
  //Me devuelve todos los productos
  getProductos():Observable<any[]>{
    this.productos = this.productCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(action => {
          const data = action.payload.doc.data();
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.productos;
  }
  //Me devuelve todas las entradas
  getEntradas():Observable<any[]>{
    this.entradas = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data();
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.entradas.pipe(map(arr => arr.filter( r => r.tipo === "entrada")))
  }
  //Me devuelve todos los principales
  getPrincipales():Observable<any[]>{
    this.principales = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data();
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.principales.pipe(map(arr => arr.filter( r => r.tipo === "principal")))
  }
  //Me devuelve todos los postres
  getPostres():Observable<any[]>{
    this.postres = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data();
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.postres.pipe(map(arr => arr.filter( r => r.tipo === "postre")))
  }
  agregarProducto(producto: Producto){
    producto = JSON.parse(JSON.stringify(producto));
    this.productCollection.add(producto);
  }

  modificarProducto(producto: Producto){
    this.productDoc=this.Firestore.doc(`Comidas/${producto.id}`);
    this.productDoc.update(producto);
    // this.productDoc=this.Firestore.doc(`Comidas/${producto.id}`);
    // this.productDoc.update(Object.assign({}, producto));
  
  }

  eliminarProducto(producto){
    this.productDoc=this.Firestore.doc(`Comidas/${producto.id}`);
    this.productDoc.delete();
  }

  ValidarProducto( idProducto: string){
    this.productDoc = this.Firestore.doc<Producto>(`Comidas/${idProducto}`);
    this.producto = this.productDoc.snapshotChanges().pipe(map(action => {
      if(action.payload.exists == false){
        return null;
      }else{
        const data = action.payload.data() as Producto;
        data.id = action.payload.id;
        if(data.disponible == true){
          return data;
        }else{
          return null;
        }
      }
    }));
    return this.producto;
  }
}

