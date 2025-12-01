import { Controller, UseGuards } from "@nestjs/common";
import { Get, Post, Put, Delete, Param, Body, Query } from "@nestjs/common"
import { LibrosDTO } from "./dto/libros.dto";
import { LibroDao } from "./dao/libro.dao";
import { LibroCqrs } from "./cqrs/libro.cqrs";
import { UtlApiService } from "./infrastructure/utl-api.service";
import { LibroViewModel } from "./viewmodel/libro.viewmodel";
import { JwtAuthGuard} from "src/auth/guard/jwt-auth.guard";
import { RolesAuthGuard } from "src/auth/guard/roles-auth.guard";
import { Roles, RolesEnum } from "src/auth/decorators/roles.decorator";

@Controller('libro')
export class LibrosController {

    constructor(
        private readonly libroDao: LibroDao,
        private readonly libroCqrs: LibroCqrs,
        private readonly utlApiService: UtlApiService
    ) { }

    
    @Get('/')
    async getLibros(@Query('q') query: string) {
        

        const librosLocales = query
            ? await this.libroDao.buscarLibrosPorTitulo(query)
            : await this.libroDao.obtenerTodos();

        const viewModelsLocales = librosLocales.map(l => LibroViewModel.fromEntity(l, 'interno'));

        let viewModelsExternos: LibroViewModel[] = [];
        if (query) {
            try {
                const librosExternos = await this.utlApiService.buscarLibrosExterno(query);
                viewModelsExternos = librosExternos.map((l: any) => LibroViewModel.fromEntity(l, 'externo'));
            } catch (e) {
                console.error("Error fetching external books", e);
            }
        }

        return [...viewModelsLocales, ...viewModelsExternos];
    }

    @UseGuards(JwtAuthGuard, RolesAuthGuard)
    @Roles(RolesEnum.BIBLIOTECARIO)
    @Post('/create')
    async createLibro(@Body() LibrosDTO: LibrosDTO) {
        try {
            const response = await this.libroCqrs.registrarLibro(LibrosDTO);
            return {message: 'Libro creado exitosamente'};
        } catch (error) {
            return {message: 'Error al crear el libro', error: error.message};
        }
    }

    @UseGuards(JwtAuthGuard, RolesAuthGuard)
    @Roles(RolesEnum.BIBLIOTECARIO) 
    @Put('/update/:id')
    async updateLibro(@Param('id') id: number, @Body() LibrosDTO: LibrosDTO) {
        try {
            const response = await this.libroCqrs.actualizarLibro(id, LibrosDTO);
            return {message: 'Libro actualizado exitosamente'};
        } catch (error) {
            return {message: 'Error al actualizar el libro', error: error.message};
        }
    }

    @UseGuards(JwtAuthGuard, RolesAuthGuard)
    @Roles(RolesEnum.BIBLIOTECARIO)
    @Delete('/delete/:id')
    async deleteLibro(@Param('id') id: number) {
        try {
            await this.libroCqrs.eliminarLibro(id);
            return {message: 'Libro eliminado exitosamente'};
        } catch (error) {
            return {message: 'Error al eliminar el libro', error: error.message};
        }
    }
}