import { Module } from "@nestjs/common";
import { LibrosService } from "./libros.service";
import { LibrosController } from "./libros.controller";
import { LibrosDTO } from "./dto/libros.dto";

@Module({

    imports: [LibrosDTO],
    controllers: [LibrosController],
    providers: [LibrosService],
    exports: [],

}) export class LibrosModule {}