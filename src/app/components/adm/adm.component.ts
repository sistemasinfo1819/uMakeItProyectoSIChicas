import { Component, OnInit,TemplateRef } from '@angular/core';
import { TiendaService } from '../../services/tienda.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Producto } from 'src/app/models/producto';
import { Extras } from 'src/app/models/extras';
import { AuthService } from '../../services/auth.service';
import { AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-adm',
  templateUrl: './adm.component.html',
  styleUrls: ['./adm.component.css']
})
export class AdmComponent implements OnInit {

  entradas: any[] = [];
  principales: any[] = [];
  postres: any[] = [];
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  producto: Producto = new Producto();
  producto2: Producto = new Producto();
  uploadProgress: Observable<number>; 
  ref: AngularFireStorageReference;
  downloadURL: Observable<string>;
  imageUrl: string = null;
  oldimageUrl: string = null;
  constructor(private servicioTienda: TiendaService,private modalService: BsModalService, public auth: AuthService, 
    private storage: AngularFireStorage) { }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  modificarP(producto: Producto, template: TemplateRef<any>, nombreE :HTMLInputElement, precioE: HTMLInputElement) {
    // Solo las dos primeras eran las que se usaban antes
    this.producto2 = producto;
    console.log(this.producto2);
    this.modalRef2 = this.modalService.show(template);

  if(this.producto2.extras == null){
    //this.producto2.extras = Array(new Extras(parseFloat(precioE.value), nombreE.value))
    this.producto2.extras=[];
    }
  }
  
  //Andir
  confirm(nombreP :HTMLInputElement ,descripcionP:HTMLInputElement,precioP:HTMLInputElement,disponibilidadP:HTMLInputElement, tipoP :HTMLInputElement): void {
    //Validaciones de cada campo
    if(nombreP.value === ""){
      alert("Debe insertar un nombre");
      return;
    }else if(descripcionP.value === ""){
      alert("Debe insertar una descripcion");
      return;
    }else if(precioP.value === ""){
      alert("Debe insertar un precio");
      return;
     } else if(tipoP.value === ""){
        alert("Debe insertar un tipo");
        return;
     }else if(disponibilidadP.value===""){
      alert("Debe insertar la disponibilidad");
      return;
     }else if(this.imageUrl == null){
      alert("Debe ingresar una foto");
      return;
     }else {
      var productoNuevo = {
        nombre: nombreP.value,
        precio: parseFloat(precioP.value),
        descripcion: descripcionP.value,
        photoUrl: this.imageUrl,
        tipo: tipoP.value,
        disponible: true,
     }
    if(disponibilidadP.value == "Disponible"){
      productoNuevo.disponible= true;
    }
    else{
      productoNuevo.disponible= false;
    }
    this.servicioTienda.agregarProducto(productoNuevo);
    this.modalRef.hide();
  }
}
deleteImage(urlToDelete: string)
  {
    this.storage.refFromURL(urlToDelete).delete().toPromise().then( () => {
      // Successfully deleted
      }).catch( err => {
        // Handle err
    });
  }
  confirm2(Disponible: HTMLInputElement){
    if(this.imageUrl!=null)
    {
      this.oldimageUrl=this.producto2.photoUrl;
      this.producto2.photoUrl=this.imageUrl;
      this.deleteImage(this.oldimageUrl);
      this.imageUrl=null;
    }
    if(Disponible.value == "Disponible"){
      this.producto2.disponible= true;
    }
    else{
      this.producto2.disponible= false;
    }
    
    this.servicioTienda.modificarProducto(this.producto2);
    this.modalRef2.hide();
  }
 
  decline(): void {
    this.modalRef.hide();
  }

  decline2(): void {
    this.modalRef2.hide();
  }

  ngOnInit() {
    this.getEntradas();
    this.getPrincipales();
    this.getPostres();

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

  eliminarP(producto: Producto){
    this.servicioTienda.eliminarProducto(producto);
  }

  anadirExtra(nombreE :HTMLInputElement, precioE: HTMLInputElement){
   const nombre=nombreE.value;
   const precio=parseFloat(precioE.value);
    //var extra: Extras = new Extras(parseFloat(precioE.value), nombreE.value );
    var extra={
    nombreExtra: nombre,
    precio: precio,
    anadido: false
    }
    if(this.producto2.extras == null){
      //this.producto2.extras = Array(new Extras(parseFloat(precioE.value), nombreE.value))
      this.producto2.extras=[];

    }else {
      this.producto2.extras.push(extra);
    }
    this.modalRef2.hide();
  }

  upload(event) 
  {
    // Obtiene la imagen:
    const file = event.target.files[0];
    
    // Genera un ID random para la imagen:
    const randomId = Math.random().toString(36).substring(2);
    const filepath = `${randomId}`;
    // Cargar imagen:
    const task = this.storage.upload(filepath, file);
    this.ref = this.storage.ref(filepath);
    // Observa los cambios en el % de la barra de progresos:
    this.uploadProgress = task.percentageChanges();
    // Notifica cuando la URL de descarga está disponible:
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();  
        this.downloadURL.subscribe(url => 
          {
            this.imageUrl = url
          });
      })
    ).subscribe();
  }
}
