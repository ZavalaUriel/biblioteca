import { Injectable } from '@nestjs/common';
import { UsuariosDto } from './dto/usuarios.dto';
import { Usuario } from './entities/usuarios.entity';
import { DatabaseConnection } from 'src/connection/database/database.module';


@Injectable()
export class UsuariosService {

   
    private databaseConnection: DatabaseConnection;

    constructor(databaseConnection: DatabaseConnection) {
        this.databaseConnection = databaseConnection;
    }

    async getAllUsuarios() {
        const connection = this.databaseConnection.getConnection();
        const [rows] = await connection.query('SELECT * FROM usuarios');
        return rows;
    }

    async createUsuario(usuariosDto: UsuariosDto)  {
        const connection = this.databaseConnection.getConnection();
        const response = await connection.query('INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?, ?)', usuariosDto);
        return response;
    }

    async updateUsuario(id: number, data: Partial<Usuario>) {
        const connection = this.databaseConnection.getConnection();
        const response = connection.query('UPDATE')
    }

    async deleteUsuario(id: number): Promise<void> {
        const connection = this.databaseConnection.getConnection();
        const response = connection.query('')
    }
}