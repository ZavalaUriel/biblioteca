import { Injectable } from "@nestjs/common";
import { LibrosDTO } from "./dto/libros.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LibrosEntity } from "./entities/libros.entity";


@Injectable()
export class LibrosService {

    constructor(
        @InjectRepository(LibrosEntity)
        private readonly librosRepository: Repository<LibrosEntity>,
    ) { }

    async getAllLibros(){
        return await this.librosRepository.find();
    }

    async createLibro(librosDto: LibrosDTO){
        const nuevoLibro = this.librosRepository.create(librosDto);
        return await this.librosRepository.save(nuevoLibro);
    }

    async updateLibro(id: number, librosDto: LibrosDTO){
        await this.librosRepository.update(id, librosDto);
        return this.librosRepository.findOneBy({id});
    }

    async deleteLibro(id: number){
        return await this.librosRepository.delete(id);
    }


}