import { Injectable } from "@nestjs/common";
import { Usuario } from "../entities/usuarios.entity";
import { UsuariosDto } from "../dto/usuarios.dto";
import { UsuarioDao } from "../dao/usuario.dao";

@Injectable()
export class UsuarioCqrs {
    constructor(
        private readonly usuarioDao: UsuarioDao
    ) { }

    async crearUsuario(usuarioDto: UsuariosDto): Promise<Usuario> {
        const nuevoUsuario = new Usuario();
        // Map DTO to Entity. DTO has username, Entity has nombre.
        nuevoUsuario.nombre = usuarioDto.username;
        nuevoUsuario.password = usuarioDto.password;
        nuevoUsuario.rol = usuarioDto.rol;
        return await this.usuarioDao.guardar(nuevoUsuario);
    }

    async actualizarUsuario(id: number, usuarioDto: UsuariosDto): Promise<Usuario> {
        const usuario = new Usuario();
        usuario.id = id;
        usuario.nombre = usuarioDto.username;
        usuario.password = usuarioDto.password;
        usuario.rol = usuarioDto.rol;
        return await this.usuarioDao.guardar(usuario);
    }

    async eliminarUsuario(id: number): Promise<void> {
        await this.usuarioDao.eliminar(id);
    }
}
