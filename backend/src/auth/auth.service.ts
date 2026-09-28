import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { EstadoUsuario } from '../common/enums/roles-estados.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { documento, clave } = loginDto;

    // 1. Buscar usuario por documento
    const usuario = await this.usuarioRepository.findOne({
      where: { documento },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Verificar que el usuario se encuentre ACTIVO
    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new ForbiddenException(
        'El usuario no se encuentra activo en el sistema',
      );
    }

    // 3. Comparar la clave enviada con el hash guardado en BD
    const passwordValida = await bcrypt.compare(clave, usuario.clave);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 4. Armar el payload del JWT
    const payload = {
      sub: usuario.id,
      documento: usuario.documento,
      rol: usuario.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        documento: usuario.documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    };
  }
}