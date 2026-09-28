import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  EstadoReserva,
  RolUsuario,
} from '../common/enums/roles-estados.enum';
import type { UsuarioAutenticado } from '../common/interfaces/usuario-autenticado.interface';
import { Medico } from '../entities/medico.entity';
import { Reserva } from '../entities/reserva.entity';
import { CambiarEstadoReservaDto } from './dto/cambiar-estado-reserva.dto';
import { ConsultarReservasMedicoDto } from './dto/consultar-reservas-medico.dto';
import { ReservaResponseDto } from './dto/reserva-response.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservasRepo: Repository<Reserva>,
    @InjectRepository(Medico)
    private readonly medicosRepo: Repository<Medico>,
  ) {}

  /** Turnos de un médico en una fecha puntual, ordenados por horario. */
  async listarPorMedicoYFecha(
    usuario: UsuarioAutenticado,
    query: ConsultarReservasMedicoDto,
  ): Promise<ReservaResponseDto[]> {
    const idMedico = await this.resolverIdMedico(usuario, query.id_medico);
    const { inicio, fin } = this.rangoDelDia(query.fecha);

    const reservas = await this.reservasRepo.find({
      where: { id_medico: idMedico, fecha_hora: Between(inicio, fin) },
      relations: { paciente: true },
      order: { fecha_hora: 'ASC' },
    });
    return reservas.map((r) => ReservaResponseDto.fromEntity(r));
  }

  /** El médico marca un turno propio como ATENDIDO o AUSENTE. */
  async cambiarEstado(
    id: number,
    dto: CambiarEstadoReservaDto,
    usuario: UsuarioAutenticado,
  ): Promise<ReservaResponseDto> {
    const medico = await this.medicosRepo.findOne({
      where: { id_usuario: usuario.id },
    });
    if (!medico) throw new ForbiddenException('El usuario no es un médico');

    const reserva = await this.buscarReserva(id);
    if (reserva.id_medico !== medico.id) {
      throw new ForbiddenException('El turno pertenece a otro médico');
    }
    if (reserva.estado !== EstadoReserva.ACTIVO) {
      throw new BadRequestException(
        `Solo se pueden actualizar turnos ACTIVOS (estado actual: ${reserva.estado})`,
      );
    }

    reserva.estado = dto.estado;
    return ReservaResponseDto.fromEntity(await this.reservasRepo.save(reserva));
  }

  /** El administrador cancela un turno hasta el instante en que inicia la consulta. */
  async cancelarComoAdmin(id: number): Promise<ReservaResponseDto> {
    const reserva = await this.buscarReserva(id);

    if (reserva.estado !== EstadoReserva.ACTIVO) {
      throw new BadRequestException(
        `Solo se pueden cancelar turnos ACTIVOS (estado actual: ${reserva.estado})`,
      );
    }
    if (new Date().getTime() > reserva.fecha_hora.getTime()) {
      throw new BadRequestException(
        'No se puede cancelar un turno cuya consulta ya inició',
      );
    }

    reserva.estado = EstadoReserva.CANCELADO;
    return ReservaResponseDto.fromEntity(await this.reservasRepo.save(reserva));
  }

  // ---------- helpers ----------

  private async buscarReserva(id: number): Promise<Reserva> {
    const reserva = await this.reservasRepo.findOne({ where: { id } });
    if (!reserva) throw new NotFoundException(`No existe la reserva ${id}`);
    return reserva;
  }

  private async resolverIdMedico(
    usuario: UsuarioAutenticado,
    idMedicoQuery?: number,
  ): Promise<number> {
    if (usuario.rol === RolUsuario.MEDICO) {
      const medico = await this.medicosRepo.findOne({
        where: { id_usuario: usuario.id },
      });
      if (!medico) throw new ForbiddenException('El usuario no es un médico');
      return medico.id;
    }
    if (idMedicoQuery === undefined) {
      throw new BadRequestException('id_medico es obligatorio');
    }
    const existe = await this.medicosRepo.existsBy({ id: idMedicoQuery });
    if (!existe) throw new NotFoundException(`No existe el médico ${idMedicoQuery}`);
    return idMedicoQuery;
  }

  /** [00:00:00.000, 23:59:59.999] de la fecha, en hora local (columna `timestamp`). */
  private rangoDelDia(fecha: string): { inicio: Date; fin: Date } {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const inicio = new Date(anio, mes - 1, dia, 0, 0, 0, 0);
    if (
      inicio.getFullYear() !== anio ||
      inicio.getMonth() !== mes - 1 ||
      inicio.getDate() !== dia
    ) {
      throw new BadRequestException(`La fecha ${fecha} no es válida`);
    }
    const fin = new Date(anio, mes - 1, dia, 23, 59, 59, 999);
    return { inicio, fin };
  }
}
