import { Controller } from "@nestjs/common";
import { Get, Post, Put, Delete, Param, Body, Query } from "@nestjs/common"
import { LibrosDTO } from "./dto/libros.dto";
import { LibroDao } from "./dao/libro.dao";
import { LibroCqrs } from "./cqrs/libro.cqrs";
import { UtlApiService } from "./infrastructure/utl-api.service";
import { LibroViewModel } from "./viewmodel/libro.viewmodel";

@Controller('libro')
export class LibrosController {

    constructor(
        private readonly libroDao: LibroDao,
        private readonly libroCqrs: LibroCqrs,
        private readonly utlApiService: UtlApiService
    ) { }

    @Get('/')
    async getLibros(@Query('q') query: string) {
        // Search local books
        const librosLocales = query
            ? await this.libroDao.buscarLibrosPorTitulo(query)
            : await this.libroDao.obtenerTodos();

        const viewModelsLocales = librosLocales.map(l => LibroViewModel.fromEntity(l, 'interno'));

        // Search external books (Student requirement: "Buscador de los alumnos")
        // Only if query is present? Or always? Requirement says "al acceder algún alumno, el sistema consulte de forma global"
        // But usually search is triggered. Let's assume if query is present or just fetch all if possible (but external might need query).
        // Requirement: "si yo estudio en la Universidad Tecnológica de León y lanzo una búsqueda... el sistema realice una búsqueda en las bibliotecas de todas las universidades"

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

    @Post('/create')
    async createLibro(@Body() LibrosDTO: LibrosDTO) {
        return this.libroCqrs.registrarLibro(LibrosDTO);
    }

    @Put('/update/:id')
    async updateLibro(@Param('id') id: number, @Body() LibrosDTO: LibrosDTO) {
        return this.libroCqrs.actualizarLibro(id, LibrosDTO);
    }

    @Delete('/delete/:id')
    async deleteLibro(@Param('id') id: number) {
        return this.libroCqrs.eliminarLibro(id);
    }
}