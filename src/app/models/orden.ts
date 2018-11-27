import { Producto } from "./producto";

export class Orden {
    id?: string;
    uid: string;
    producto: Producto[] = [];
    precio: number
}
