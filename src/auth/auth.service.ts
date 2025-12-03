import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioDao } from '../modules/usuarios/dao/usuario.dao';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioDao: UsuarioDao,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usuarioDao.buscarPorNombre(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const validUser = await this.validateUser(user.username, user.password);
    if (!validUser) {
      throw new UnauthorizedException();
    }
    const payload = {
      username: validUser.nombre,
      sub: validUser.id,
      rol: validUser.rol,
    };
    return {
      access_token: this.jwtService.sign(payload),
      id: validUser.id,
      nombre: validUser.nombre,
      nombreCompleto: validUser.nombreCompleto,
      rol: validUser.rol,
    };
  }
}
