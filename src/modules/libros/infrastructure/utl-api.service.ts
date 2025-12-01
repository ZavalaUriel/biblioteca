import { Injectable } from "@nestjs/common";

@Injectable()
export class UtlApiService {

    async buscarLibrosExterno(titulo: string): Promise<any> {
        try {
            const urlEquipo = `http://192.168.1.50:3000/libros/buscar?q=${titulo}`;

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

            return data.libros || [];
        } catch (error) {
            console.error('Error al buscar libros externo:', error);
            throw error;
        }
    }

}
