import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator';
import { RolUsuario } from '../common/enums/roles-estados.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import type { UsuarioAutenticado } from '../common/interfaces/usuario-autenticado.interface';
import { CambiarEstadoReservaDto } from './dto/cambiar-estado-reserva.dto';
import { ConsultarReservasMedicoDto } from './dto/consultar-reservas-medico.dto';
import { ReservaResponseDto } from './dto/reserva-response.dto';
import { ReservasService } from './reservas.service';

// TODO: agregar el guard JWT del módulo de auth: @UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Reservas')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Get('medico')
  @Roles(RolUsuario.MEDICO, RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Turnos de un médico en una fecha',
    description:
      'El MEDICO ve sus propios turnos. El ADMINISTRADOR debe indicar id_medico.',
  })
  @ApiOkResponse({ type: ReservaResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Médico inexistente' })
  listarPorMedicoYFecha(
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Query() query: ConsultarReservasMedicoDto,
  ): Promise<ReservaResponseDto[]> {
    return this.reservasService.listarPorMedicoYFecha(usuario, query);
  }

  @Patch(':id/estado')
  @Roles(RolUsuario.MEDICO)
  @ApiOperation({ summary: 'Marcar un turno como ATENDIDO o AUSENTE' })
  @ApiOkResponse({ type: ReservaResponseDto })
  @ApiForbiddenResponse({ description: 'El turno es de otro médico' })
  @ApiNotFoundResponse({ description: 'Reserva inexistente' })
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoReservaDto,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ): Promise<ReservaResponseDto> {
    return this.reservasService.cambiarEstado(id, dto, usuario);
  }
}
