import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoReserva } from '../../common/enums/roles-estados.enum';

export class MedicoReservaResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 45892 })
  matricula: number;

  @ApiProperty({ example: 'Pérez' })
  apellidos: string;

  @ApiProperty({ example: 'Juan' })
  nombres: string;
}

export class PacienteReservaResponseDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: '33333333' })
  documento: string;

  @ApiProperty({ example: 'López' })
  apellidos: string;

  @ApiProperty({ example: 'Ana' })
  nombres: string;

  @ApiProperty({ example: 'paciente@clinica.com' })
  email: string;
}

export class ReservaResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2026-10-15T10:00:00.000Z' })
  fecha_hora: Date;

  @ApiProperty({ enum: EstadoReserva, example: EstadoReserva.ACTIVO })
  estado: EstadoReserva;

  @ApiProperty({ example: 15000, description: 'Tarifa congelada al momento de la reserva' })
  valor_consulta: number;

  @ApiPropertyOptional({ type: () => MedicoReservaResponseDto })
  medico?: MedicoReservaResponseDto;

  @ApiPropertyOptional({ type: () => PacienteReservaResponseDto })
  paciente?: PacienteReservaResponseDto;
}