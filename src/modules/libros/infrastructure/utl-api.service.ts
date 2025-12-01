import { Injectable } from "@nestjs/common";

@Injectable()
export class UtlApiService {

    async buscarLibrosExterno(titulo: string): Promise<any> {
        try {
            const urlEquipo = `http://localhost:3001/libros/buscar?q=${titulo}`;

            const respuesta = await fetch(urlEquipo, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!respuesta.ok) {
                throw new Error(`Error al conectar con UTL: ${respuesta.statusText}`);
            }

            const data = await respuesta.json();

            return data || [];
        } catch (error) {
            console.error('Error al buscar libros externo:', error);
            throw error;
        }
    }

}
