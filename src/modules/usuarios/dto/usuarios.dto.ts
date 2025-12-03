// dto para la entidad Usuarios

import { IsString } from 'class-validator';
import { RolesEnum } from 'src/auth/decorators/roles.decorator';

export class UsuariosDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  nombreCompleto: string;

  @IsString()
  rol: RolesEnum;
}
