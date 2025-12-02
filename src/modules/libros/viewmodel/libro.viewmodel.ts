

export class LibroViewModel {

    id: number;
    titulo: string;
    universidad: string;
    autor: string;
    genero: string;
    portada: string; 
    pdf: string; 
    esExterno: boolean;


    static fromEntity(libro: any, origen: string): LibroViewModel {
        const esExterno = origen === 'externo';
        
        return {
            id: libro.id,
            titulo: libro.titulo,
            universidad: libro.universidad,
            autor: libro.autor,
            genero: libro.genero,
            portada: libro.portada,
            // Mapeo diferente según origen
            pdf: esExterno 
                ? (libro.pdf || libro.url_pdf || libro.link_pdf || libro.archivo_pdf || '') 
                : libro.archivo_pdf,
            esExterno,
        };
    }



}