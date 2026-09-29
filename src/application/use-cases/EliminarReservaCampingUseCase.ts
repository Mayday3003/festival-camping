import { IReservaCampingRepository } from '../../domain/repositories/IReservaCampingRepository.js';

export class EliminarReservaCampingUseCase {
  constructor(private repository: IReservaCampingRepository) {}

  async ejecutar(id: number): Promise<void> {
    const reserva = await this.repository.obtenerPorId(id);
    if (!reserva || reserva.state === 'REMOVED') {
      const err: any = new Error('Reserva no encontrada');
      err.status = 404;
      throw err;
    }
    await this.repository.borradoLogico(id);
  }
}
