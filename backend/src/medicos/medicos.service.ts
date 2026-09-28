import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from '../entities/medico.entity';
import { ActualizarValorConsultaDto } from './dto/actualizar-valor-consulta.dto';
import { MedicoResponseDto } from './dto/medico-response.dto';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicosRepo: Repository<Medico>,
  ) {}

  /**Solo modifica el valor vigente del médico. Las reservas ya hechas conservan su propio valor_consulta (se congela al reservar).*/
  async actualizarValorConsulta(
    id: number,
    dto: ActualizarValorConsultaDto,
  ): Promise<MedicoResponseDto> {
    const medico = await this.medicosRepo.findOne({ where: { id } });
    if (!medico) throw new NotFoundException(`No existe el médico ${id}`);

    medico.valor_consulta = dto.valor_consulta;
    return MedicoResponseDto.fromEntity(await this.medicosRepo.save(medico));
  }
}
