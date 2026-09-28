import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { EstadoReserva } from '../common/enums/roles-estados.enum';
import { Medico } from './medico.entity';
import { Usuario } from './usuario.entity';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_medico' })
  id_medico: number;

  @ManyToOne(() => Medico, (medico) => medico.reservas)
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;

  @Column({ name: 'id_paciente' })
  id_paciente: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservasPaciente)
  @JoinColumn({ name: 'id_paciente' })
  paciente: Usuario;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.ACTIVO,
  })
  estado: EstadoReserva;

  // Se congela el valor de la consulta al momento de la reserva
  @Column({ type: 'int' })
  valor_consulta: number;
}