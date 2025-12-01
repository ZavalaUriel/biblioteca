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
    genero: Genero;

    @Column({ type: 'longtext' })
    portada: string;

    @Column({ type: 'longtext' })
    archivo_pdf: string;

    @Column({ type: 'varchar', length: 255, default: 'Universidad Tecnológica de La Habana', nullable: true })
    universidad: string;

}

export enum Genero {
    FICCION = 'Ficción',
    NO_FICCION = 'No Ficción',
    MISTERIO = 'Misterio',
    FANTASIA = 'Fantasía',
    CIENCIA_FICCION = 'Ciencia Ficción',
    ROMANCE = 'Romance',
    HISTORICO = 'Histórico',
    BIOGRAFIA = 'Biografía',
    AUTOAYUDA = 'Autoayuda',
    POESIA = 'Poesía'
}