import { Injectable } from "@nestjs/common";
import { LibrosEntity } from "../entities/libros.entity";
import { LibrosDTO } from "../dto/libros.dto";
import { LibroDao } from "../dao/libro.dao";


@Injectable()
export class LibroCqrs {
    constructor(
        private readonly libroDao: LibroDao
    ) { }

    async registrarLibro(librosDto: LibrosDTO): Promise<LibrosEntity> {
        // We need to create the entity first. Since DAO expects entity for save, 
        // we can either move creation to DAO or keep it here. 
        // Pattern says CQRS > DAO. 
        // Let's create a helper in DAO or just instantiate here if Entity is simple.
        // Better: Let DAO handle the saving of the entity.
        // But we need to convert DTO to Entity. 
        const nuevoLibro = new LibrosEntity();
        Object.assign(nuevoLibro, librosDto);
        return await this.libroDao.guardar(nuevoLibro);
    }


    async eliminarLibro(id: number): Promise<void> {
        await this.libroDao.eliminar(id);
    }

    async actualizarLibro(id: number, librosDto: LibrosDTO): Promise<LibrosEntity> {
        // We need to fetch, update, and save.
        // Or just save with ID if it exists?
        // TypeORM save with ID updates if exists.
        const libro = new LibrosEntity();
        libro.id = id;
        Object.assign(libro, librosDto);
        return await this.libroDao.guardar(libro);
    }

}
