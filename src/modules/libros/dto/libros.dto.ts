import { IsOptional, IsString } from "class-validator";
import { Genero } from "../entities/libros.entity";


export class LibrosDTO {

    @IsString()
    titulo: string;
    
    @IsString()
    autor: string;

    @IsString()
    genero: Genero;

    @IsString()
    portada: string;

    @IsString()
    archivo_pdf: string;

    @IsOptional()
    @IsString()
    universidad?: string; 


}