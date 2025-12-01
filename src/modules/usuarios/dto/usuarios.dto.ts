// dto para la entidad Usuarios

import { RolesEnum } from "src/auth/decorators/roles.decorator";

export class UsuariosDto {

    username: string;
    password: string;
    nombreCompleto: string;
    rol: RolesEnum;

}