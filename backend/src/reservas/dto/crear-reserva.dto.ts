import { IsInt, IsNotEmpty, IsISO8601, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearReservaDto {
  @ApiProperty({
    description: 'Identificador único del médico',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty({ message: 'El id_medico es requerido' })
  id_medico: number;

  @ApiProperty({
    description: 'Fecha y hora en formato ISO8601 UTC (de 08:00 a 15:00 en punto)',
    example: '2026-10-15T10:00:00.000Z',
  })
  @IsISO8601({}, { message: 'fecha_hora debe tener un formato ISO8601 válido' })
  @IsNotEmpty({ message: 'La fecha y hora son requeridas' })
  fecha_hora: string;

  @ApiPropertyOptional({
    description: 'Identificador del paciente (solo requerido si reserva un Administrador)',
    example: 3,
  })
  @IsInt()
  @IsOptional()
  id_paciente?: number;
}