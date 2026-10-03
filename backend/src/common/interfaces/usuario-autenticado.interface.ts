import { RolUsuario } from '../enums/roles-estados.enum';
export interface UsuarioAutenticado {
  id: number;
  rol: RolUsuario;
}
