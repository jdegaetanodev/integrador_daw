import {
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario } from '../common/enums/roles-estados.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReservaResponseDto } from './dto/reserva-response.dto';
import { ReservasService } from './reservas.service';

// TODO: agregar el guard JWT del módulo de auth: @UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Administración')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR)
@Controller('admin/reservas')
export class ReservasAdminController {
  constructor(private readonly reservasService: ReservasService) {}

  @Patch(':id/cancelar')
  @ApiOperation({
    summary: 'Cancelar un turno (admin)',
    description: 'Permitido hasta el momento exacto en que inicia la consulta.',
  })
  @ApiOkResponse({ type: ReservaResponseDto })
  @ApiBadRequestResponse({ description: 'Turno no activo o consulta ya iniciada' })
  @ApiNotFoundResponse({ description: 'Reserva inexistente' })
  cancelar(@Param('id', ParseIntPipe) id: number): Promise<ReservaResponseDto> {
    return this.reservasService.cancelarComoAdmin(id);
  }
}
