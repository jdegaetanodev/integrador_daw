import { IsInt, IsNotEmpty, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultaDisponibilidadDto {
  @ApiProperty({
    description: 'ID del médico a consultar',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'El id_medico debe ser un número entero' })
  @IsNotEmpty({ message: 'El id_medico es requerido' })
  id_medico: number;

  @ApiProperty({
    description: 'Fecha en formato YYYY-MM-DD',
    example: '2026-10-15',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener formato YYYY-MM-DD (ej: 2026-10-15)',
  })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  fecha: string;
}