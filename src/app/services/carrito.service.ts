import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Producto } from "../models/producto";

import { isNullOrUndefined, isUndefined } from 'util';
import { AuthService } from './auth.service';
import { TiendaService } from './tienda.service';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  Productos = []
  ProductoTemporal
  constructor(
    public auth: AuthService,
    private afs: AngularFirestore,
    private tiendaService: TiendaService
  ) { }

  createCart(id){
    this.afs.collection('Carritos').doc(id).set(
      {id: id, products: [], totalProducts: 0}
    )
  }

  myCart(uid){
    return this.afs.doc(`Carritos/${uid}`).snapshotChanges();
  }

  myCartRef(uid){
    return this.afs.collection('Carritos').doc(uid).ref;
  }

  addProduct(producto, cantidad: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.usuario.subscribe(usuarioData => {
        if(usuarioData){
          const cartRef = this.myCartRef(usuarioData.uid);
          cartRef.get().then(doc => {
            let cartData = doc.data();
            let productsInCart = cartData.products;
            for (let i = 0; i < cantidad; i++) {
              if(!isUndefined(producto.extras)){
                const productToCart = {
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  extras: producto.extras,
                  cantidad: 1
                }
                const exist = CartService.findEqualProducts(productsInCart, productToCart);
                console.log(exist);
                if(!exist){
                  productsInCart.push(productToCart);
                  cartData.totalProducts += 1;
                }else {
                  exist.cantidad +=1;
                  cartData.totalProducts +=1;
                }

                }else{
                  const productToCart = {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: 1
                  }
                const exist = CartService.FindEqualProductsWithouExtra(productsInCart, producto);
                  if(!exist){
                    productsInCart.push(productToCart);
                    cartData.totalProducts += 1;
                  }else {
                    exist.cantidad +=1;
                    cartData.totalProducts +=1;
                  }
                }
              }
          return cartRef.update(cartData).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          });
          })
        }
      })
    })
  }

  static findEqualProducts(productsInCart, producto){
    if(!isNullOrUndefined(productsInCart)){
      for (let i = 0; i < productsInCart.length; i++) {
        if(productsInCart[i].id == producto.id){
          if(productsInCart[i].extras.length == producto.extras.length){
            let cantidad = productsInCart[i].extras.length;
            let match = 0;
            for (let j = 0; j < productsInCart[i].extras.length; j++) {
              for (let k = 0; k < producto.extras.length; k++) {
                if(productsInCart[i].extras[j].nombreExtra == producto.extras[k].nombreExtra){
                  if(productsInCart[i].extras[j].anadido == producto.extras[k].anadido){
                    match += 1;
                  }
                } 
              }
            }
            if(cantidad == match){
              console.log("llegue");
              return productsInCart[i];
            }
          }
        }
      }
    }
    return null;
  }
  static FindEqualProductsWithouExtra(productsInCart, producto){
    if(!isNullOrUndefined(productsInCart)){
      for (let i = 0; i < productsInCart.length; i++) {
        if(productsInCart[i].id == producto.id){
          if(isNullOrUndefined(productsInCart.extras)){
            return productsInCart[i];
          }
        }    
      }
    }
    return null;
  }
  static totalProducts(product: Producto[]) {
    let sum = 0;
    for (let i = 0; i < product.length; i++) {
      sum += parseInt(product[i]['cantidad'])
    }
    return sum;
  }

  resetCart(uid): Promise<any>{
    return new Promise((resolve, reject) => {
      const ref = this.myCartRef(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        cartData.products = [];
        cartData.totalProducts = 0;
        return ref.update(cartData).then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }

  totalPrice(products: Producto[]): number {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += (parseInt(products[i]['cantidad']) * products[i]['precio']);
    }
    return total;
  }

  removeProduct(product, uid, index): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.myCartRef(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        let productsInCart = cartData.products;
        let totalQty = cartData.totalProducts;
        cartData.totalProducts = parseInt(totalQty) - parseInt(product.cantidad);

        cartData.products = [
          ...productsInCart.slice(0, index),
          ...productsInCart.slice(index + 1)
        ];
        return ref.update(cartData).then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }
  //Metodo que se encargara de modificar MyCart
  ValidarCart(){
    return new Promise((resolve, reject) => {
      this.auth.usuario.subscribe(Usuario => {
        if(Usuario){
          const cartRef = this.myCartRef(Usuario.uid);
          cartRef.get().then(doc => {
            let cartData = doc.data();
            for (let i = 0; i < cartData.products.length; i++) {
              let producto = cartData.products[i];
              this.tiendaService.ValidarProducto(producto.id).subscribe(Data => {
                if(!isNullOrUndefined(Data)){
                  producto.nombre = Data.nombre;
                  producto.precio = Data.precio;
                  if(!isNullOrUndefined(Data.extras)){
                    producto.extras = Data.extras;
                  }else {
                    producto.extras = [];
                  }
                }else {
                  this.removeProduct(producto, Usuario.uid, i);
                }
                if(i+1 == cartData.products.length){
                  return cartRef.update(cartData).then(() => {
                    resolve(true);
                  }).catch((err) => {
                    reject(err);
                  });
                }
              }) 
            }
          })
        }
      })
    })
  }
}
