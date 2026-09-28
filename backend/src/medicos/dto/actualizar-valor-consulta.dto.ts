import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ActualizarValorConsultaDto {
  @ApiProperty({
    description: 'Nuevo valor de la consulta (entero positivo)',
    example: 18000,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  valor_consulta: number;
}
