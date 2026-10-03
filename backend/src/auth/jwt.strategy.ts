import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { EstadoUsuario } from '../common/enums/roles-estados.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super_secreto_clinica_2026'),
    });
  }

  async validate(payload: { sub: number; documento: string; rol: string }) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: payload.sub },
      relations: {
        medico: true, // Sintaxis fuertemente tipada de TypeORM
      },
    });

    if (!usuario || usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new UnauthorizedException('Token inválido o usuario dado de baja');
    }

    return usuario;
  }
}