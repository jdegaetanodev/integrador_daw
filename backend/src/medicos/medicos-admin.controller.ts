import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario } from '../common/enums/roles-estados.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ActualizarValorConsultaDto } from './dto/actualizar-valor-consulta.dto';
import { MedicoResponseDto } from './dto/medico-response.dto';
import { MedicosService } from './medicos.service';

// TODO: agregar el guard JWT del módulo de auth: @UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Administración')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR)
@Controller('admin/medicos')
export class MedicosAdminController {
  constructor(private readonly medicosService: MedicosService) {}

  @Patch(':id/valor-consulta')
  @ApiOperation({
    summary: 'Modificar el valor de consulta de un médico',
    description: 'No afecta a las reservas ya realizadas (valor congelado).',
  })
  @ApiOkResponse({ type: MedicoResponseDto })
  @ApiNotFoundResponse({ description: 'Médico inexistente' })
  actualizarValorConsulta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarValorConsultaDto,
  ): Promise<MedicoResponseDto> {
    return this.medicosService.actualizarValorConsulta(id, dto);
  }
}
