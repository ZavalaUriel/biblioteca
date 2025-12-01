import { Controller } from "@nestjs/common";
import { Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import { UsuariosDto } from "./dto/usuarios.dto";
import { UsuarioDao } from "./dao/usuario.dao";
import { UsuarioCqrs } from "./cqrs/usuario.cqrs";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { RolesAuthGuard } from "src/auth/guard/roles-auth.guard";
import { UseGuards } from "@nestjs/common";
import { RolesEnum, Roles } from "src/auth/decorators/roles.decorator";

@Controller('/admin/usuario')
export class UsuariosController {

    constructor(
        private readonly usuarioDao: UsuarioDao,
        private readonly usuarioCqrs: UsuarioCqrs
    ) { }

    @UseGuards(JwtAuthGuard, RolesAuthGuard)
    @Roles(RolesEnum.BIBLIOTECARIO)
    @Get('/')
    async getUsuarios() {
        return this.usuarioDao.obtenerTodos();
    }

    @UseGuards(JwtAuthGuard, RolesAuthGuard)
    @Roles(RolesEnum.BIBLIOTECARIO)
    @Post('/create')
    async createUsuario(@Body() UsuariosDto: UsuariosDto) {
        try {
            const response = await this.usuarioCqrs.crearUsuario(UsuariosDto);
            return {message: 'Usuario creado exitosamente'};
        } catch (error) {
            return {message: 'Error al crear el usuario', error: error.message};
        }
    }

    @UseGuards(JwtAuthGuard, RolesAuthGuard)
    @Roles(RolesEnum.BIBLIOTECARIO)
    @Put('/update/:id')
    async updateUsuario(@Param('id') id: number, @Body() UsuariosDto: UsuariosDto) {
        try {
            const response = await this.usuarioCqrs.actualizarUsuario(id, UsuariosDto);
            return {message: 'Usuario actualizado exitosamente'};
        } catch (error) {
            return {message: 'Error al actualizar el usuario', error: error.message};
        }
    }

    @UseGuards(JwtAuthGuard, RolesAuthGuard)
    @Roles(RolesEnum.BIBLIOTECARIO)
    @Delete('/delete/:id')
    async deleteUsuario(@Param('id') id: number) {
        try {  
            await this.usuarioCqrs.eliminarUsuario(id);
            return {message: 'Usuario eliminado exitosamente'};
        } catch (error) {
            return {message: 'Error al eliminar el usuario', error: error.message};
        }
    }

}