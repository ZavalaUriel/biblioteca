import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum, ROLES } from '../decorators/roles.decorator';
import { CanActivate } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.rol) {
      throw new ForbiddenException({ message: 'Usuario no autenticado' });
    }

    const hasRole = requiredRoles.some((roles) => user.rol === roles);

    if (!hasRole) {
      throw new ForbiddenException({
        message: 'No tienes permiso para acceder a este recurso',
      });
    }
    return true;
  }
}
