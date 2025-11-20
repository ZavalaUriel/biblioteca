import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;
   
    @Column({ type: 'varchar', length: 100 })
    password: string;
    
    @Column({ type: 'varchar', length: 100, unique: true })
    rol: string;
}