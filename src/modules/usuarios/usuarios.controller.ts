import { Controller } from "@nestjs/common";
import { UsuariosService } from './usuarios.service'
import { Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import { UsuariosDto } from "./dto/usuarios.dto";

@Controller('usuario')
export class UsuariosController {

    constructor (private readonly usuariosService: UsuariosService) {this.usuariosService = usuariosService;}

    @Get('/')
    async getUsuarios() {
        return this.usuariosService.getAllUsuarios();
    }

    @Post('/create')
    async createUsuario(@Body() UsuariosDto: UsuariosDto) {
        return this.usuariosService.createUsuario(UsuariosDto);
    }

    @Put('/update/:id')
    async updateUsuario(@Param('id') id: number, @Body() UsuariosDto: UsuariosDto) {
        return this.usuariosService.updateUsuario(id, UsuariosDto);
    }

    @Delete('/delete/:id')
    async deleteUsuario(@Param('id') id: number) {
        return this.usuariosService.deleteUsuario(id);
    }

}