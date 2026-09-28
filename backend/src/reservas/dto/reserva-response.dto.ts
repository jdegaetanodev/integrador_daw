import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoReserva } from '../../common/enums/roles-estados.enum';
import { Reserva } from '../../entities/reserva.entity';

export class PacienteResumenDto {
  @ApiProperty({ example: 7 })
  id: number;

  @ApiProperty({ example: '30123456' })
  documento: string;

  @ApiProperty({ example: 'Pérez' })
  apellidos: string;

  @ApiProperty({ example: 'Juan' })
  nombres: string;
}

export class ReservaResponseDto {
  @ApiProperty({ example: 42 })
  id: number;

  @ApiProperty({ example: 1 })
  id_medico: number;

  @ApiProperty({ example: 7 })
  id_paciente: number;

  @ApiProperty({ example: '2026-10-15T10:00:00.000Z' })
  fecha_hora: Date;

  @ApiProperty({ enum: EstadoReserva, example: EstadoReserva.ACTIVO })
  estado: EstadoReserva;

  @ApiProperty({
    description: 'Valor de la consulta congelado al momento de la reserva',
    example: 15000,
  })
  valor_consulta: number;

  @ApiPropertyOptional({ type: () => PacienteResumenDto })
  paciente?: PacienteResumenDto;

  static fromEntity(reserva: Reserva): ReservaResponseDto {
    const dto = new ReservaResponseDto();
    dto.id = reserva.id;
    dto.id_medico = reserva.id_medico;
    dto.id_paciente = reserva.id_paciente;
    dto.fecha_hora = reserva.fecha_hora;
    dto.estado = reserva.estado;
    dto.valor_consulta = reserva.valor_consulta;
    if (reserva.paciente) {
      // Solo datos básicos: nunca exponer email ni clave
      dto.paciente = {
        id: reserva.paciente.id,
        documento: reserva.paciente.documento,
        apellidos: reserva.paciente.apellidos,
        nombres: reserva.paciente.nombres,
      };
    }
    return dto;
  }
}
