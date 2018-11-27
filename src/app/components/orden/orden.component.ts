import { Component, OnInit, TemplateRef  } from '@angular/core';
import { Orden } from 'src/app/models/orden';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { AuthService } from 'src/app/services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css']
})
export class OrdenComponent implements OnInit {
  orders: Orden[];
  modalRef: BsModalRef;
  selectedOrder;
  constructor(  private ordenesService: OrdenesService,
    private auth: AuthService,private modalService: BsModalService) { }

  openModal(template: TemplateRef<any>, orden) {
    this.selectedOrder = orden;
    console.log(this.selectedOrder);
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit() {
    this.getOrders();
  }
  getOrders() {
    this.auth.usuario.subscribe(user => {
        this.ordenesService.getorders(user.uid).subscribe(orders => this.orders = orders);
    })
  }

  
}
