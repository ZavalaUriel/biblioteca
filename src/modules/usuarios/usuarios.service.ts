import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuarios.entity';


@Injectable()
export class UsuariosService {

    constructor (
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {  }

    async getAllUsuarios() {
        return await this.usuarioRepository.find();
    }

    async createUsuario(data: Partial<Usuario>): Promise<Usuario> {
        const newUsuario = this.usuarioRepository.create(data);
        return await this.usuarioRepository.save(newUsuario);
    }

    async updateUsuario(id: number, data: Partial<Usuario>) {
        await this.usuarioRepository.update(id, data);
        return this.usuarioRepository.findOneBy({ id });
    }

    async deleteUsuario(id: number): Promise<void> {
        await this.usuarioRepository.delete(id);
    }
}