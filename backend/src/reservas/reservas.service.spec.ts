import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { EstadoReserva, RolUsuario } from '../common/enums/roles-estados.enum';
import { Usuario } from '../entities/usuario.entity';
import { ReservasService } from './reservas.service';

const crearService = (reserva: any, medico: any = { id: 1 }) => {
  const reservasRepo: any = {
    findOne: vi.fn().mockResolvedValue(reserva),
    save: vi.fn().mockImplementation(async (r) => r),
    find: vi.fn().mockResolvedValue([]),
  };

  const medicosRepo: any = {
    findOne: vi.fn().mockResolvedValue(medico),
    existsBy: vi.fn().mockResolvedValue(true),
  };

  const usuariosRepo: any = {
    findOne: vi.fn().mockResolvedValue(null),
  };

  return {
    service: new ReservasService(
      reservasRepo,
      medicosRepo,
      usuariosRepo,
    ),
    reservasRepo,
  };
};

describe('ReservasService', () => {
  it('admin cancela un turno futuro', async () => {
    const { service } = crearService({
      id: 1,
      id_medico: 1,
      id_paciente: 2,
      valor_consulta: 100,
      estado: EstadoReserva.ACTIVO,
      fecha_hora: new Date(Date.now() + 60_000),
    });

    const res = await service.cancelarComoAdmin(1);
    expect(res.estado).toBe(EstadoReserva.CANCELADO);
  });

  it('admin no puede cancelar una consulta que ya inició', async () => {
    const { service } = crearService({
      id: 1,
      estado: EstadoReserva.ACTIVO,
      fecha_hora: new Date(Date.now() - 1000),
    });

    await expect(
      service.cancelarComoAdmin(1),
    ).rejects.toThrow(BadRequestException);
  });

  it('no se cancela un turno ya atendido', async () => {
    const { service } = crearService({
      id: 1,
      estado: EstadoReserva.ATENDIDO,
      fecha_hora: new Date(Date.now() + 60_000),
    });

    await expect(
      service.cancelarComoAdmin(1),
    ).rejects.toThrow(BadRequestException);
  });

  it('médico marca su turno como AUSENTE', async () => {
    const { service } = crearService({
      id: 5,
      id_medico: 1,
      estado: EstadoReserva.ACTIVO,
      fecha_hora: new Date(),
    });

    const res = await service.cambiarEstado(
      5,
      { estado: EstadoReserva.AUSENTE },
      { id: 10, rol: RolUsuario.MEDICO } as Usuario,
    );

    expect(res.estado).toBe(EstadoReserva.AUSENTE);
  });

  it('médico no puede tocar turnos de otro médico', async () => {
    const { service } = crearService({
      id: 5,
      id_medico: 99,
      estado: EstadoReserva.ACTIVO,
      fecha_hora: new Date(),
    });

    await expect(
      service.cambiarEstado(
        5,
        { estado: EstadoReserva.ATENDIDO },
        { id: 10, rol: RolUsuario.MEDICO } as Usuario,
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('admin debe indicar id_medico y se rechaza fecha inexistente', async () => {
    const { service } = crearService(null);

    const admin = {
      id: 1,
      rol: RolUsuario.ADMINISTRADOR,
    } as Usuario;

    await expect(
      service.listarPorMedicoYFecha(
        { fecha: '2026-10-15' },
        admin,
      ),
    ).rejects.toThrow(BadRequestException);

    await expect(
      service.listarPorMedicoYFecha(
        { fecha: '2026-02-31', id_medico: 1 },
        admin,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});