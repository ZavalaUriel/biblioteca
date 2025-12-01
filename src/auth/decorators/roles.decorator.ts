import { SetMetadata } from '@nestjs/common';

export enum RolesEnum {
    ADMIN = 'admin',
    BIBLIOTECARIO = 'bibliotecario',
    ALUMNO = 'alumno'
}

export const ROLES = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES, roles);