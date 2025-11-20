import { Controller } from "@nestjs/common";
import { LibrosService } from "./libros.service";
import { Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import { LibrosDTO } from "./dto/libros.dto";

@Controller('libro')
export class LibrosController {

    constructor (private readonly librosService: LibrosService) {this.librosService = librosService;}

    @Get('/')
    async getLibros() {
        return this.librosService.getAllLibros();
    }

    @Post('/create')
    async createLibro(@Body() LibrosDTO: LibrosDTO) {
        return this.librosService.createLibro(LibrosDTO);
    }

    @Put('/update/:id')
    async updateLibro(@Param('id') id: number, @Body() LibrosDTO: LibrosDTO) {
        return this.librosService.updateLibro(id, LibrosDTO);
    }

    @Delete('/delete/:id')
    async deleteLibro(@Param('id') id: number) {
        return this.librosService.deleteLibro(id);
    }
}