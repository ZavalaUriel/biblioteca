import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../modules/usuarios/usuarios.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        UsuariosModule,
        PassportModule,
        JwtModule.register({
            secret: 'secretKey', // In production use env var
            signOptions: { expiresIn: '60m' },
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }