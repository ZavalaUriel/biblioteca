import { Module } from '@nestjs/common';
import mysql from 'mysql2/promise';
// aqui van las configuraciones de la base de datos MYSQL

export class DatabaseConnection {
  private pool: mysql.Pool;

  constructor() {
    this.connect();
  }

  private async connect() {
    // Crear un pool de conexiones en lugar de una sola conexión
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // Configuraciones del pool para evitar timeouts
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 60000,
      // Configuraciones para     mantener la conexión activa
      enableKeepAlive: true,
      keepAliveInitialDelay: 60000,
    });

    // Verificar conexión inicial
    try {
      const connection = await this.pool.getConnection();
      console.log('Conexión a la base de datos establecida.');
      connection.release();
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  }

  public getConnection() {
    return this.pool;
  }
}

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseConnection],
  exports: [DatabaseConnection],
})
export class DatabaseModule {}
