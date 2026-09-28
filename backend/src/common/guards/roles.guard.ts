import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolUsuario } from '../enums/roles-estados.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!rolesPermitidos || rolesPermitidos.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException('Usuario no autenticado');
    if (!rolesPermitidos.includes(user.rol)) {
      throw new ForbiddenException('No tenés permisos para esta operación');
    }
    return true;
  }
}
