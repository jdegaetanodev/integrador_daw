import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from '../entities/medico.entity';
import { Reserva } from '../entities/reserva.entity';
import { ReservasAdminController } from './reservas-admin.controller';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Medico])],
  controllers: [ReservasController, ReservasAdminController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}
