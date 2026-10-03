import { RolUsuario, EstadoUsuario } from '../../common/enums/roles-estados.enum';

export class UsuarioPayloadDto {
  id: number;
  documento: string;
  apellidos: string;
  nombres: string;
  email: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
}

export class LoginResponseDto {
  access_token: string;
  usuario: UsuarioPayloadDto;
}