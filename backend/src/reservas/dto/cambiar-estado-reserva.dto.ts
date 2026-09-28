import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { EstadoReserva } from '../../common/enums/roles-estados.enum';

export class CambiarEstadoReservaDto {
  @ApiProperty({
    description: 'Nuevo estado del turno (solo ATENDIDO o AUSENTE)',
    enum: [EstadoReserva.ATENDIDO, EstadoReserva.AUSENTE],
    example: EstadoReserva.ATENDIDO,
  })
  @IsIn([EstadoReserva.ATENDIDO, EstadoReserva.AUSENTE], {
    message: 'estado debe ser ATENDIDO o AUSENTE',
  })
  estado: EstadoReserva.ATENDIDO | EstadoReserva.AUSENTE;
}
