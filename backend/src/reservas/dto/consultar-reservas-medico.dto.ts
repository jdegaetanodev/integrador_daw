import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches } from 'class-validator';

export class ConsultarReservasMedicoDto {
  @ApiProperty({
    description: 'Fecha a consultar (YYYY-MM-DD)',
    example: '2026-10-15',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fecha debe tener el formato YYYY-MM-DD',
  })
  fecha: string;

  @ApiPropertyOptional({
    description:
      'Id del médico. Obligatorio para ADMINISTRADOR; se ignora para MEDICO (usa su propio id).',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_medico?: number;
}
