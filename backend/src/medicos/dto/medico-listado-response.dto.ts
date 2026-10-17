
import { ApiProperty } from '@nestjs/swagger';

export class MedicoListadoResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombres: string;

  @ApiProperty()
  apellidos: string;

  @ApiProperty()
  valor_consulta: number;
}
