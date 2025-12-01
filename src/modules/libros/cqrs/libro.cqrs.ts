import { Injectable, NotFoundException } from "@nestjs/common";
import { LibrosEntity } from "../entities/libros.entity";
import { LibrosDTO } from "../dto/libros.dto";
import { LibroDao } from "../dao/libro.dao";


@Injectable()
export class LibroCqrs {
    constructor(
        private readonly libroDao: LibroDao
    ) { }

    async registrarLibro(librosDto: LibrosDTO): Promise<LibrosEntity> {
        
        const nuevoLibro = new LibrosEntity();
        Object.assign(nuevoLibro, librosDto);
        return await this.libroDao.guardar(nuevoLibro);
    }


    async eliminarLibro(id: number): Promise<void> {
        await this.libroDao.eliminar(id);
    }

    async actualizarLibro(id: number, librosDto: LibrosDTO): Promise<LibrosEntity> {
        await this.libroDao.actualizar(id, librosDto);
        const libro = await this.libroDao.obtenerPorId(id);
        if (!libro) {
            throw new NotFoundException(`Libro con id ${id} no encontrado`);
        }
        return libro;
    }

}
