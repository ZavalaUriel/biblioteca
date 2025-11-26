import { Controller } from "@nestjs/common";
import { Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import { UsuariosDto } from "./dto/usuarios.dto";
import { UsuarioDao } from "./dao/usuario.dao";
import { UsuarioCqrs } from "./cqrs/usuario.cqrs";

@Controller('usuario')
export class UsuariosController {

    constructor(
        private readonly usuarioDao: UsuarioDao,
        private readonly usuarioCqrs: UsuarioCqrs
    ) { }

    @Get('/')
    async getUsuarios() {
        return this.usuarioDao.obtenerTodos();
    }

    @Post('/create')
    async createUsuario(@Body() UsuariosDto: UsuariosDto) {
        return this.usuarioCqrs.crearUsuario(UsuariosDto);
    }

    @Put('/update/:id')
    async updateUsuario(@Param('id') id: number, @Body() UsuariosDto: UsuariosDto) {
        return this.usuarioCqrs.actualizarUsuario(id, UsuariosDto);
    }

    @Delete('/delete/:id')
    async deleteUsuario(@Param('id') id: number) {
        return this.usuarioCqrs.eliminarUsuario(id);
    }

}