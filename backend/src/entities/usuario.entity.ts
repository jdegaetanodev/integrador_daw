import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { EstadoUsuario, RolUsuario } from '../common/enums/roles-estados.enum';
import { Medico } from './medico.entity';
import { Reserva } from './reserva.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  documento: string;

  @Column({ type: 'text' })
  apellidos: string;

  @Column({ type: 'text' })
  nombres: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  clave: string;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.ACTIVO,
  })
  estado: EstadoUsuario;

  @Column({
    type: 'enum',
    enum: RolUsuario,
  })
  rol: RolUsuario;

  // Relación 1 a 1 con Medico (si el rol es MEDICO)
  @OneToOne(() => Medico, (medico) => medico.usuario)
  medico: Medico;

  // Reservas solicitadas por este usuario como paciente
  @OneToMany(() => Reserva, (reserva) => reserva.paciente)
  reservasPaciente: Reserva[];
}