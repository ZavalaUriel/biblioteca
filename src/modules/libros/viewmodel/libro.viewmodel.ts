

export class LibroViewModel {

    titulo: string;
    universidad: string;
    genero: string;
    portada: string; // Base64 para mostrar la imagen
    esExterno: boolean;


    static fromEntity(libro: any, origen: string): LibroViewModel {
        return {
            titulo: libro.titulo,
            universidad: libro.universidad,
            genero: libro.genero,
            portada: libro.portada,
            esExterno: origen === 'externo',
        };
    }



}