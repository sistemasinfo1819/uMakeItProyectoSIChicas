import { Component, OnInit, TemplateRef } from '@angular/core';
import { TiendaService } from '../../services/tienda.service';
import { Producto } from 'src/app/models/producto';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Extras } from 'src/app/models/extras';
import { Usuario } from 'src/app/models/usuario';
import { CartService } from '../../services/carrito.service'
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  
})
export class HomeComponent implements OnInit {

  entradas: any[] = [];
  principales: any[] = [];
  postres: any[] = [];
  modalRef: BsModalRef;
  productoCarrito: Producto;
  usuario: Usuario;
  carrito: any
  constructor(private servicioTienda: TiendaService, private modalService: BsModalService,
    public carritoService: CartService,
    public router: Router,
    public auth: AuthService,

    ) { }

  ngOnInit() {
    this.getEntradas();
    this.getPrincipales();
    this.getPostres();
    this.auth.usuario.subscribe(data => {
      if(data){
        const cartRef = this.carritoService.myCartRef(data.uid).get();
        cartRef.then((cart) => {
          if(cart.exists) {
            this.carritoService.myCart(data.uid).subscribe(myCart => {
              this.carrito = myCart.payload.data();
            })
          } else {
            this.carritoService.createCart(data.uid);
            this.carritoService.myCart(data.uid).subscribe(myCart => {
              this.carrito = myCart.payload.data();
            })
          }
        })
    }
    })
  }

  openModal(template: TemplateRef<any>, producto: Producto) {
    this.productoCarrito =  {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      disponible: producto.disponible,
      photoUrl: producto.photoUrl,
      tipo: producto.tipo,
      extras: producto.extras,
      id: producto.id
    };
    this.modalRef = this.modalService.show(template);
  }
  getEntradas() {
    this.servicioTienda.getEntradas().subscribe(entradas => this.entradas = entradas);
  }
  getPrincipales() {
    this.servicioTienda.getPrincipales().subscribe(principales => this.principales = principales);
  }
  getPostres() {
    this.servicioTienda.getPostres().subscribe(postres => this.postres = postres);
  }

  CambioExtra(extra: Extras, indice: number){
   if(extra.anadido == false) {
     this.productoCarrito.extras[indice].anadido = true;
     this.productoCarrito.precio += extra.precio;
   }
   else{
    this.productoCarrito.extras[indice].anadido = false;
    this.productoCarrito.precio += (-1*extra.precio);
   }
  }
  decline(): void {
    if(this.productoCarrito.extras != null){
    this.productoCarrito.extras.forEach(extra => {
      extra.anadido = false;
    });
  }
    this.modalRef.hide();
  }

  confirm(cantidad: HTMLInputElement){
    const cantidadValue = parseInt(cantidad.value);
    this.carritoService.addProduct(this.productoCarrito, cantidadValue);
    if(this.productoCarrito.extras != null){
      this.productoCarrito.extras.forEach(extra => {
        extra.anadido = false;
      });
    }
    this.modalRef.hide();
  }

  IrAlCarrito(){
     this.router.navigate(['/carrito']);
  }
}
