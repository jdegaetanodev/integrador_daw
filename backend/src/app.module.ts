import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importación de entidades
import { Usuario } from './entities/usuario.entity';
import { Medico } from './entities/medico.entity';
import { Reserva } from './entities/reserva.entity';

// Módulos de negocio
import { ReservasModule } from './reservas/reservas.module';
import { MedicosModule } from './medicos/medicos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<number>('DB_PORT', 5432)),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: String(configService.get<string>('DB_PASSWORD') || ''),
        database: configService.get<string>('DB_DATABASE', 'clinica_db'),
        entities: [Usuario, Medico, Reserva], // Entidades 
        synchronize: true, // Sincroniza y crea tablas/enums automáticamente
      }),
    }),
    ReservasModule,
    MedicosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}