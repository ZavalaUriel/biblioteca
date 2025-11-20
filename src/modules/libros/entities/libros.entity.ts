import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('libros')
export class LibrosEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    titulo: string;

    @Column({ type: 'varchar', length: 255 })
    autor: string;

    @Column({ type: 'varchar', length: 100 })
    genero: string;

    @Column({ type: 'longtext' })
    portada: string;

    @Column({ type: 'longtext' })
    archivo_pdf: string;

}