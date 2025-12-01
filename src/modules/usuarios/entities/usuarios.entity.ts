import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';
import { RolesEnum } from 'src/auth/decorators/roles.decorator';

@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn()
    @Generated('increment')
    id: number;

    @Column({ type: 'varchar', length: 100 })
    username: string;
   
    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Column({ type: 'varchar', length: 100 })
    nombreCompleto: string;
    
    // Solo podra ser bibliotecario o alumno
    @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.ALUMNO })
    rol: RolesEnum;
}