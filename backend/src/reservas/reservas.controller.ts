import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ReservasService } from './reservas.service';
import { CrearReservaDto } from './dto/crear-reserva.dto';
import { ConsultaDisponibilidadDto } from './dto/consulta-disponibilidad.dto';
import { ReservaResponseDto } from './dto/reserva-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Usuario } from '../entities/usuario.entity';
import { RolUsuario } from '../common/enums/roles-estados.enum';

@ApiTags('Reservas')
@ApiBearerAuth()
@Controller('reservas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Get('disponibilidad')
  @ApiOperation({
    summary: 'Consultar horarios disponibles de un médico en una fecha específica',
    description: 'Devuelve los slots de 1 hora entre las 8:00 y las 16:00 que se encuentran libres.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de horarios libres en formato HH:mm:ss',
    type: [String],
    example: ['08:00:00', '09:00:00', '11:00:00', '12:00:00'],
  })
  @ApiResponse({ status: 400, description: 'Formato de fecha inválido' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado' })
  consultarDisponibilidad(
    @Query() consultaDto: ConsultaDisponibilidadDto,
  ): Promise<string[]> {
    return this.reservasService.consultarDisponibilidad(consultaDto);
  }

  @Post()
  @Roles(RolUsuario.PACIENTE, RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Crear una reserva de turno',
    description: 'Permite a un paciente o administrador reservar un turno. Congela el valor de la consulta y valida horario y solapamiento.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada con éxito',
    type: ReservaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Reglas de negocio infringidas (horario, anticipación, minutos)' })
  @ApiResponse({ status: 404, description: 'Médico o paciente no encontrado' })
  @ApiResponse({ status: 409, description: 'El médico ya posee un turno en ese horario' })
  crear(
    @Body() crearReservaDto: CrearReservaDto,
    @CurrentUser() usuario: Usuario,
  ): Promise<ReservaResponseDto> {
    return this.reservasService.crear(crearReservaDto, usuario);
  }

  @Patch(':id/cancelar')
  @Roles(RolUsuario.PACIENTE, RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Cancelar un turno reservado',
    description: 'El paciente puede cancelar hasta las 23:59 del día anterior. El administrador hasta el momento del inicio.',
  })
  @ApiParam({ name: 'id', description: 'ID de la reserva a cancelar', example: 1 })
  @ApiResponse({ status: 200, description: 'Turno cancelado exitosamente' })
  @ApiResponse({ status: 400, description: 'Fuera del plazo límite o estado inválido' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes para cancelar esta reserva' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  cancelar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() usuario: Usuario,
  ): Promise<{ mensaje: string }> {
    return this.reservasService.cancelar(id, usuario);
  }

  @Get()
  @Roles(RolUsuario.PACIENTE, RolUsuario.ADMINISTRADOR, RolUsuario.MEDICO)
  @ApiOperation({
    summary: 'Listar turnos según rol del usuario autenticado',
    description: 'Pacientes ven sus turnos, médicos los asignados a ellos y administradores todos los del sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de turnos recuperada',
    type: [ReservaResponseDto],
  })
  listarTurnos(@CurrentUser() usuario: Usuario): Promise<ReservaResponseDto[]> {
    return this.reservasService.listarTurnos(usuario);
  }
}