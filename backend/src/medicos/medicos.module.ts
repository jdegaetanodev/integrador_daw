import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from '../entities/medico.entity';
import { MedicosAdminController } from './medicos-admin.controller';
import { MedicosService } from './medicos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  controllers: [MedicosAdminController],
  providers: [MedicosService],
  exports: [MedicosService],
})
export class MedicosModule {}
