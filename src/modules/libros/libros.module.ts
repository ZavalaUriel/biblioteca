import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosController } from './libros.controller';
import { LibrosDTO } from './dto/libros.dto';
import { LibroDao } from './dao/libro.dao';
import { LibroViewModel } from './viewmodel/libro.viewmodel';
import { LibroCqrs } from './cqrs/libro.cqrs';
import { UtlApiService } from './infrastructure/utl-api.service';
import { LibrosEntity } from './entities/libros.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LibrosEntity]), LibrosDTO],
  controllers: [LibrosController],
  providers: [LibroDao, LibroViewModel, LibroCqrs, UtlApiService],
  exports: [],
})
export class LibrosModule {}
