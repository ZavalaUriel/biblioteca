import { Injectable } from "@nestjs/common";

@Injectable()
export class UtlApiService {

    async buscarLibrosExterno(titulo: string): Promise<any> {
        try {
            const urlEquipo = titulo 
                ? `http://10.115.128.134:3001/libros/buscar?q=${titulo}`
                : `http://10.115.128.134:3001/libros/buscar`;

            const respuesta = await fetch(urlEquipo, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-biblioteca-request': 'true' 
                },
            });
            
            if (!respuesta.ok) {
                console.error(`Error al conectar con UTL: ${respuesta.status} ${respuesta.statusText}`);
                return []; 
            }

            const data = await respuesta.json();

            console.log('📚 Libros externos recibidos:', data.length);

            return data || [];
        } catch (error) {
            console.error('Error al buscar libros externo:', error);
            return []; 
        }
    }

}
