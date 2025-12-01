

export class LibroViewModel {

    titulo: string;
    universidad: string;
    genero: string;
    portada: string; 
    archivo_pdf: string; 
    esExterno: boolean;


    static fromEntity(libro: any, origen: string): LibroViewModel {
        return {
            titulo: libro.titulo,
            universidad: libro.universidad,
            genero: libro.genero,
            portada: libro.portada,
            archivo_pdf: libro.archivo_pdf,
            esExterno: origen === 'externo',
        };
    }



}