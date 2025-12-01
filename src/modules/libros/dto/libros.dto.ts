import { Genero } from "../entities/libros.entity";


export class LibrosDTO {

    titulo: string;
    autor: string;
    genero: Genero;
    portada: string;
    archivo_pdf: string;

}