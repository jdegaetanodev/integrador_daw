import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from '../entities/medico.entity';
import { MedicosAdminController } from './medicos-admin.controller';
import { MedicosService } from './medicos.service';
import { MedicosController } from './medicos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  controllers: [MedicosAdminController, MedicosController],
  providers: [MedicosService],
  exports: [MedicosService],
})
export class MedicosModule {}
