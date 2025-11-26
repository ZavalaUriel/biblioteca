import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { LibrosEntity } from "../entities/libros.entity";

@Injectable()
export class LibroDao {

    constructor(
        @InjectRepository(LibrosEntity)
        private readonly libroRepository: Repository<LibrosEntity>
    ) { }


    async buscarLibrosPorTitulo(titulo: string): Promise<LibrosEntity[]> {
        return await this.libroRepository.find({
            where: { titulo: Like(`%${titulo}%`) } // Asumiendo búsqueda exacta o ajusta con Like
        });
    }

    async obtenerTodos(): Promise<LibrosEntity[]> {
        return await this.libroRepository.find();
    }

    async guardar(libro: LibrosEntity): Promise<LibrosEntity> {
        return await this.libroRepository.save(libro);
    }

    async eliminar(id: number): Promise<void> {
        await this.libroRepository.delete(id);
    }
}