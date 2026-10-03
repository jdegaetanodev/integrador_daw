import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../enums/roles-estados.enum';

export const ROLES_KEY = 'roles';

/** Restringe un endpoint a uno o más roles. Usar junto con RolesGuard. */
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
