import { Extras } from "./extras";

export class Producto {
    nombre: string;
    descripcion: string;
    precio: number;
    disponible: boolean;
    photoUrl: string;
    id?: string;
    tipo: string;
    extras?: Extras[];
}
