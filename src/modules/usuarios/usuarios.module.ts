import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuariosController } from "./usuarios.controller";
import { UsuarioDao } from "./dao/usuario.dao";
import { UsuarioCqrs } from "./cqrs/usuario.cqrs";
import { Usuario } from "./entities/usuarios.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Usuario])],
    controllers: [UsuariosController],
    providers: [UsuarioDao, UsuarioCqrs],
    exports: [UsuarioDao], // Export DAO for Auth module if needed
}) export class UsuariosModule { }