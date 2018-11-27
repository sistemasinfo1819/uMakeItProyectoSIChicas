export class Extras {
    precio?: number;
    nombreExtra?: string;
    anadido?:boolean;
    constructor(precio, nombre, anadido){
        this.precio = precio;
        this.nombreExtra = nombre;
        this.anadido= anadido;
    }
}
