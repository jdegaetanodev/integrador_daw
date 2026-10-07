import { ApiProperty } from '@nestjs/swagger';
import {
  RolUsuario,
  EstadoUsuario,
} from '../../common/enums/roles-estados.enum';

export class UsuarioPayloadDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '12345678' })
  documento: string;

  @ApiProperty({ example: 'Pérez' })
  apellidos: string;

  @ApiProperty({ example: 'Juan' })
  nombres: string;

  @ApiProperty({ example: 'juan@clinica.com' })
  email: string;

  @ApiProperty({ enum: RolUsuario, example: RolUsuario.PACIENTE })
  rol: RolUsuario;

  @ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
  estado: EstadoUsuario;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT utilizado para autenticar las solicitudes',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({ type: () => UsuarioPayloadDto })
  usuario: UsuarioPayloadDto;
}