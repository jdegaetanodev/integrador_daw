
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario } from '../common/enums/roles-estados.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { MedicoListadoResponseDto } from './dto/medico-listado-response.dto';
import { MedicosService } from './medicos.service';

@ApiTags('Médicos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.PACIENTE, RolUsuario.ADMINISTRADOR)
@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar médicos y sus valores de consulta' })
  @ApiOkResponse({ type: MedicoListadoResponseDto, isArray: true })
  listarMedicos(): Promise<MedicoListadoResponseDto[]> {
    return this.medicosService.listarMedicos();
  }
}
