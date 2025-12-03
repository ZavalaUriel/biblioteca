import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuarios.entity';

@Injectable()
export class UsuarioDao {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async obtenerTodos(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return await this.usuarioRepository.findOneBy({ id });
  }

  async buscarPorNombre(username: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOneBy({ username });
  }

  async guardar(usuario: Usuario): Promise<Usuario> {
    return await this.usuarioRepository.save(usuario);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    await this.usuarioRepository.update(usuario.id, usuario);
    return this.buscarPorId(usuario.id) as Promise<Usuario>;
  }

  async eliminar(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}
