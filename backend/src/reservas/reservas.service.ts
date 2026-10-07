import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reserva } from '../entities/reserva.entity';
import { Medico } from '../entities/medico.entity';
import { Usuario } from '../entities/usuario.entity';
import { CrearReservaDto } from './dto/crear-reserva.dto';
import { ReservaResponseDto } from './dto/reserva-response.dto';
import { EstadoReserva, RolUsuario } from '../common/enums/roles-estados.enum';
import { ConsultarReservasMedicoDto } from './dto/consultar-reservas-medico.dto';
import { CambiarEstadoReservaDto } from './dto/cambiar-estado-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async crear(dto: CrearReservaDto, usuarioSolicitante: Usuario): Promise<ReservaResponseDto> {
    const fechaReserva = new Date(dto.fecha_hora);
    const ahora = new Date();

    if (isNaN(fechaReserva.getTime())) {
      throw new BadRequestException('Fecha y hora inválidas');
    }

    // 1. Regla: Turnos de 8:00 a 16:00, duración de 1 hora exacta (minutos y segundos en 0)
    const hora = fechaReserva.getUTCHours();
    const minutos = fechaReserva.getUTCMinutes();
    const segundos = fechaReserva.getUTCSeconds();

    if (minutos !== 0 || segundos !== 0 || hora < 8 || hora >= 16) {
      throw new BadRequestException(
        'Los turnos son de 1 hora en punto entre las 8:00 y las 16:00 (último turno a las 15:00 hs)',
      );
    }

    // 2. Regla: No turnos en el pasado ni a más de 30 días
    if (fechaReserva <= ahora) {
      throw new BadRequestException('No se pueden reservar turnos en fechas u horarios pasados');
    }

    const limite30Dias = new Date();
    limite30Dias.setDate(ahora.getDate() + 30);
    if (fechaReserva > limite30Dias) {
      throw new BadRequestException('No se pueden reservar turnos con más de 30 días de anticipación');
    }

    // 3. Determinar paciente destinatario
    let idPacienteFinal: number;
    if (usuarioSolicitante.rol === RolUsuario.PACIENTE) {
      idPacienteFinal = usuarioSolicitante.id;
    } else if (usuarioSolicitante.rol === RolUsuario.ADMINISTRADOR) {
      if (!dto.id_paciente) {
        throw new BadRequestException('El administrador debe indicar el id_paciente');
      }
      const paciente = await this.usuarioRepository.findOne({
        where: { id: dto.id_paciente, rol: RolUsuario.PACIENTE },
      });
      if (!paciente) {
        throw new NotFoundException('El paciente especificado no existe o no tiene rol PACIENTE');
      }
      idPacienteFinal = paciente.id;
    } else {
      throw new ForbiddenException('Los médicos no tienen permisos para reservar turnos');
    }

    // 4. Validar existencia del médico
    const medico = await this.medicoRepository.findOne({
      where: { id: dto.id_medico },
      relations: { usuario: true },
    });
    if (!medico) {
      throw new NotFoundException('El médico seleccionado no existe');
    }

    // 5. Regla: Bloquear solapamientos (mismo médico, misma fecha_hora y estado ACTIVO)
    const turnoExistente = await this.reservaRepository.findOne({
      where: {
        id_medico: medico.id,
        fecha_hora: fechaReserva,
        estado: EstadoReserva.ACTIVO,
      },
    });

    if (turnoExistente) {
      throw new ConflictException('El médico ya posee un turno reservado en ese horario');
    }

    // 6. Regla: Congelar valor_consulta vigente del médico en la reserva
    const nuevaReserva = this.reservaRepository.create({
      id_medico: medico.id,
      id_paciente: idPacienteFinal,
      fecha_hora: fechaReserva,
      estado: EstadoReserva.ACTIVO,
      valor_consulta: medico.valor_consulta,
    });

    const guardada = await this.reservaRepository.save(nuevaReserva);

    return {
      id: guardada.id,
      fecha_hora: guardada.fecha_hora,
      estado: guardada.estado,
      valor_consulta: guardada.valor_consulta,
    };
  }

  // Cancelación de reservas con validación según rol
  async cancelar(idReserva: number, usuario: Usuario): Promise<{ mensaje: string }> {
    const reserva = await this.reservaRepository.findOne({
      where: { id: idReserva },
      relations: { paciente: true },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado !== EstadoReserva.ACTIVO) {
      throw new BadRequestException(`No se puede cancelar una reserva en estado ${reserva.estado}`);
    }

    const ahora = new Date();
    const fechaTurno = new Date(reserva.fecha_hora);

    if (usuario.rol === RolUsuario.PACIENTE) {
      if (reserva.id_paciente !== usuario.id) {
        throw new ForbiddenException('No puedes cancelar turnos de otros pacientes');
      }

      // Regla Paciente: Hasta las 23:59 del día anterior a la consulta
      const limiteCancelacion = new Date(
        fechaTurno.getFullYear(),
        fechaTurno.getMonth(),
        fechaTurno.getDate() - 1,
        23,
        59,
        59,
        999,
      );

      if (ahora > limiteCancelacion) {
        throw new BadRequestException(
          'Los pacientes solo pueden cancelar el turno hasta las 23:59 del día anterior a la consulta',
        );
      }
    } else if (usuario.rol === RolUsuario.ADMINISTRADOR) {
      // Regla Administrador: Hasta el momento en que inicia la consulta
      if (ahora >= fechaTurno) {
        throw new BadRequestException('No se puede cancelar un turno cuya hora de inicio ya transcurrió');
      }
    } else {
      throw new ForbiddenException('No tienes permisos para cancelar reservas');
    }

    reserva.estado = EstadoReserva.CANCELADO;
    await this.reservaRepository.save(reserva);

    return { mensaje: 'Turno cancelado exitosamente' };
  }
  async cancelarComoAdmin(idReserva: number): Promise<ReservaResponseDto> {
  const reserva = await this.reservaRepository.findOne({
    where: { id: idReserva },
    relations: {
      medico: { usuario: true },
      paciente: true,
    },
  });

  if (!reserva) {
    throw new NotFoundException('Reserva no encontrada');
  }

  if (reserva.estado !== EstadoReserva.ACTIVO) {
    throw new BadRequestException(
      `No se puede cancelar una reserva en estado ${reserva.estado}`,
    );
  }

  const ahora = new Date();
  const fechaTurno = new Date(reserva.fecha_hora);

  // El administrador puede cancelar hasta antes del inicio exacto del turno.
  if (ahora >= fechaTurno) {
    throw new BadRequestException(
      'No se puede cancelar un turno cuya hora de inicio ya llegó',
    );
  }

  reserva.estado = EstadoReserva.CANCELADO;

  const actualizada = await this.reservaRepository.save(reserva);

  return {
    id: actualizada.id,
    fecha_hora: actualizada.fecha_hora,
    estado: actualizada.estado,
    valor_consulta: actualizada.valor_consulta,
    medico: actualizada.medico
      ? {
          id: actualizada.medico.id,
          matricula: actualizada.medico.matricula,
          apellidos: actualizada.medico.usuario.apellidos,
          nombres: actualizada.medico.usuario.nombres,
        }
      : undefined,
    paciente: actualizada.paciente
      ? {
          id: actualizada.paciente.id,
          documento: actualizada.paciente.documento,
          apellidos: actualizada.paciente.apellidos,
          nombres: actualizada.paciente.nombres,
          email: actualizada.paciente.email,
        }
      : undefined,
  };
}
  // Listar turnos según el rol del usuario autenticado
  async listarTurnos(usuario: Usuario): Promise<ReservaResponseDto[]> {
    let whereCondition: any = {};

    if (usuario.rol === RolUsuario.PACIENTE) {
      whereCondition = { id_paciente: usuario.id };
    } else if (usuario.rol === RolUsuario.MEDICO) {
      const medico = await this.medicoRepository.findOne({ where: { id_usuario: usuario.id } });
      if (!medico) throw new NotFoundException('Perfil de médico no encontrado');
      whereCondition = { id_medico: medico.id };
    }
    // Si es ADMINISTRADOR, whereCondition queda vacío y lista todas las reservas

    const reservas = await this.reservaRepository.find({
      where: whereCondition,
      relations: {
        medico: { usuario: true },
        paciente: true,
      },
      order: { fecha_hora: 'ASC' },
    });

    return reservas.map((r) => ({
      id: r.id,
      fecha_hora: r.fecha_hora,
      estado: r.estado,
      valor_consulta: r.valor_consulta,
      medico: r.medico
        ? {
            id: r.medico.id,
            matricula: r.medico.matricula,
            apellidos: r.medico.usuario.apellidos,
            nombres: r.medico.usuario.nombres,
          }
        : undefined,
      paciente: r.paciente
        ? {
            id: r.paciente.id,
            documento: r.paciente.documento,
            apellidos: r.paciente.apellidos,
            nombres: r.paciente.nombres,
            email: r.paciente.email,
          }
        : undefined,
    }));
  }

  async consultarDisponibilidad(dto: { id_medico: number; fecha: string }): Promise<string[]> {
    const { id_medico, fecha } = dto;

    const medico = await this.medicoRepository.findOne({
      where: { id: id_medico },
    });
    if (!medico) {
      throw new NotFoundException('El médico seleccionado no existe');
    }

    // Horarios válidos de 8:00 a 16:00 (turnos de 1 hora)
    const slotsHorarios = [
      '08:00:00',
      '09:00:00',
      '10:00:00',
      '11:00:00',
      '12:00:00',
      '13:00:00',
      '14:00:00',
      '15:00:00',
    ];
    // Buscar reservas activas del médico en ese día (UTC)
    const inicioDia = new Date(`${fecha}T00:00:00.000Z`);
    const finDia = new Date(`${fecha}T23:59:59.999Z`);

    const reservasOcupadas = await this.reservaRepository.find({
      where: {
        id_medico,
        fecha_hora: Between(inicioDia, finDia),
        estado: EstadoReserva.ACTIVO,
      },
    });

    // Extraer horas ocupadas en formato HH:mm:ss UTC
    const horasOcupadas = reservasOcupadas.map((r) => {
      const h = String(r.fecha_hora.getUTCHours()).padStart(2, '0');
      const m = String(r.fecha_hora.getUTCMinutes()).padStart(2, '0');
      const s = String(r.fecha_hora.getUTCSeconds()).padStart(2, '0');
      return `${h}:${m}:${s}`;
    });

    // Retornar solo los horarios libres
    return slotsHorarios.filter((slot) => !horasOcupadas.includes(slot));
  }
async listarPorMedicoYFecha(
  dto: ConsultarReservasMedicoDto,
  usuario: Usuario,
): Promise<ReservaResponseDto[]> {
  let idMedico: number;

  if (usuario.rol === RolUsuario.MEDICO) {
    const medico = await this.medicoRepository.findOne({
      where: { id_usuario: usuario.id },
    });

    if (!medico) {
      throw new NotFoundException('Perfil de médico no encontrado');
    }

    idMedico = medico.id;
  } else if (usuario.rol === RolUsuario.ADMINISTRADOR) {
    if (!dto.id_medico) {
      throw new BadRequestException(
        'El administrador debe indicar el id_medico',
      );
    }

    const medico = await this.medicoRepository.findOne({
      where: { id: dto.id_medico },
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    idMedico = medico.id;
  } else {
    throw new ForbiddenException(
      'Solo los médicos y administradores pueden consultar reservas por médico',
    );
  }
  const [anio, mes, dia] = dto.fecha.split('-').map(Number);

  const fechaValidada = new Date(Date.UTC(anio, mes - 1, dia));

  const fechaValida =
    Number.isInteger(anio) &&
    Number.isInteger(mes) &&
    Number.isInteger(dia) &&
    fechaValidada.getUTCFullYear() === anio &&
    fechaValidada.getUTCMonth() === mes - 1 &&
    fechaValidada.getUTCDate() === dia;

    if (!fechaValida) {
    throw new BadRequestException('La fecha indicada no es válida');
  }
  const inicioDia = new Date(`${dto.fecha}T00:00:00.000Z`);
  const finDia = new Date(`${dto.fecha}T23:59:59.999Z`);

  const reservas = await this.reservaRepository.find({
    where: {
      id_medico: idMedico,
      fecha_hora: Between(inicioDia, finDia),
    },
    relations: {
      medico: { usuario: true },
      paciente: true,
    },
    order: {
      fecha_hora: 'ASC',
    },
  });

  return reservas.map((r) => ({
    id: r.id,
    fecha_hora: r.fecha_hora,
    estado: r.estado,
    valor_consulta: r.valor_consulta,
    medico: r.medico
      ? {
          id: r.medico.id,
          matricula: r.medico.matricula,
          apellidos: r.medico.usuario.apellidos,
          nombres: r.medico.usuario.nombres,
        }
      : undefined,
    paciente: r.paciente
      ? {
          id: r.paciente.id,
          documento: r.paciente.documento,
          apellidos: r.paciente.apellidos,
          nombres: r.paciente.nombres,
          email: r.paciente.email,
        }
      : undefined,
  }));
}
async cambiarEstado(
  idReserva: number,
  dto: CambiarEstadoReservaDto,
  usuario: Usuario,
): Promise<ReservaResponseDto> {
  if (usuario.rol !== RolUsuario.MEDICO) {
    throw new ForbiddenException(
      'Solo los médicos pueden cambiar el estado de un turno',
    );
  }

  const medico = await this.medicoRepository.findOne({
    where: { id_usuario: usuario.id },
  });

  if (!medico) {
    throw new NotFoundException('Perfil de médico no encontrado');
  }

  const reserva = await this.reservaRepository.findOne({
    where: { id: idReserva },
    relations: {
      medico: { usuario: true },
      paciente: true,
    },
  });

  if (!reserva) {
    throw new NotFoundException('Reserva no encontrada');
  }

  if (reserva.id_medico !== medico.id) {
    throw new ForbiddenException(
      'No puedes modificar turnos asignados a otro médico',
    );
  }

  if (reserva.estado !== EstadoReserva.ACTIVO) {
    throw new BadRequestException(
      `No se puede cambiar el estado de una reserva en estado ${reserva.estado}`,
    );
  }

  reserva.estado = dto.estado;

  const actualizada = await this.reservaRepository.save(reserva);

  return {
    id: actualizada.id,
    fecha_hora: actualizada.fecha_hora,
    estado: actualizada.estado,
    valor_consulta: actualizada.valor_consulta,
    medico: actualizada.medico
      ? {
          id: actualizada.medico.id,
          matricula: actualizada.medico.matricula,
          apellidos: actualizada.medico.usuario.apellidos,
          nombres: actualizada.medico.usuario.nombres,
        }
      : undefined,
    paciente: actualizada.paciente
      ? {
          id: actualizada.paciente.id,
          documento: actualizada.paciente.documento,
          apellidos: actualizada.paciente.apellidos,
          nombres: actualizada.paciente.nombres,
          email: actualizada.paciente.email,
        }
      : undefined,
  };
}
}