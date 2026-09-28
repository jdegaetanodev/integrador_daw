import { ApiProperty } from '@nestjs/swagger';
import { Medico } from '../../entities/medico.entity';

export class MedicoResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 3 })
  id_usuario: number;

  @ApiProperty({ example: 12345 })
  matricula: number;

  @ApiProperty({ example: 18000 })
  valor_consulta: number;

  static fromEntity(medico: Medico): MedicoResponseDto {
    const dto = new MedicoResponseDto();
    dto.id = medico.id;
    dto.id_usuario = medico.id_usuario;
    dto.matricula = medico.matricula;
    dto.valor_consulta = medico.valor_consulta;
    return dto;
  }
}
