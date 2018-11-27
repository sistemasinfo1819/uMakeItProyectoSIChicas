import { Component, OnInit, TemplateRef } from '@angular/core';
import { CartService } from 'src/app/services/carrito.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Orden } from 'src/app/models/orden';
import { OrdenesService } from 'src/app/services/ordenes.service';

declare let paypal: any;

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  cart: any;
  total: number = 0;
  iva: number = 0;
  totalIva: number =0;
  User_id: string;
  extrasName: string;
  paypalLoad: boolean = true;
  addScript: boolean = false;
  modalRef: BsModalRef;

  constructor( 
    private CarritoService: CartService,
    public auth: AuthService,
    private router: Router,
    private ordenesService: OrdenesService,
    private modalService: BsModalService 
    ) { }

    ngOnInit() {
      this.auth.usuario.subscribe(usuario => {
        if(usuario){
          this.CarritoService.ValidarCart();
          this.CarritoService.myCart(usuario.uid).subscribe(Cart => {
            this.cart = Cart.payload.data();
            this.User_id = usuario.uid;
            this.getTotal();
          })
        }
      })
    }

  getTotal(){
    this.total = this.CarritoService.totalPrice(this.cart.products);
    this.iva = this.total * 0.12;
    this.totalIva = this.total + this.iva;
  }

  paypalConfig = {
    env: 'sandbox',

    style: {
      label: 'paypal',
      size:  'responsive',    // small | medium | large | responsive
      shape: 'rect',     // pill | rect
      color: 'black',     // gold | blue | silver | black
      tagline: false      
  },
    client: {
        sandbox: 'AQvTDwg9nlJi-ogMz6I5dccLSF4pkv7PT8-t_4Cg7Cr4idGRlOmV9tDrbw-94YjigMbLirO-FZKUbBMn',
        production: '<production-key>'
    },
    commit: true,
    payment: (data, actions) => {
        return actions.payment.create({
            payment: {
                transactions: [
                    {
                        amount: { total: this.totalIva , currency: 'USD' }
                    }
                ]
            }
        })
    },
  
    // onAuthorize() is called when the buyer approves the payment
    onAuthorize:(data, actions) => {
  
        // Make a call to the REST api to execute the payment
        return actions.payment.execute().then((payment) => {
            this.Comprar();
            this.modalRef.hide();
        })
    }
  };

    MetodoPrueba(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if(!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = true;
      })
    }
  }

  addPaypalScript(){
      this.addScript = true;
      return new Promise((resolve, reject) => {
        let scriptElement = document.createElement('script');
        scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js'
        scriptElement.onload = resolve;
        document.body.appendChild(scriptElement);
      })
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    this.MetodoPrueba();
  }

  decline(): void {
    this.modalRef.hide();
  }
  Comprar(){
    let orden: Orden = {
      uid: this.User_id,
      producto: this.cart.products,
      precio: this.totalIva,
    };
    this.ordenesService.save(orden);
    this.CarritoService.resetCart(this.User_id).then(() => {
      this.router.navigate(['orden']);
    })
  }
}
