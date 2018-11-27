import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CartService } from '../../services/carrito.service'
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  cart: any;
  total: number = 0;
  iva: number = 0;
  totalIva: number =0;
  User_id: string;


  constructor(
    private CarritoService: CartService,
    public auth: AuthService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.auth.usuario.subscribe(usuario => {
      if(usuario){
        this.CarritoService.ValidarCart().then(() => {
          this.CarritoService.myCart(usuario.uid).subscribe(Cart => {
            this.cart = Cart.payload.data();
            this.User_id = usuario.uid;
            this.getTotal();
          })
        })
      }
    })
  }
  getTotal(){
    this.total = this.CarritoService.totalPrice(this.cart.products);
    this.iva = this.total * 0.12;
    this.totalIva = this.total + this.iva;
  }

  
  Eliminar(product, index){
    this.CarritoService.removeProduct(product, this.cart.id, index);
  }
    
  clearCart(){
    this.CarritoService.resetCart(this.User_id);
  }
  IrCheckout(){
    this.router.navigate(['pago']);
  }
}
