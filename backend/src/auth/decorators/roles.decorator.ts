import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../common/enums/roles-estados.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);