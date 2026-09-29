import { IReservaCampingRepository } from '../../domain/repositories/IReservaCampingRepository.js';
import { ReservaCamping } from '../../domain/entities/ReservaCamping.js';

export class ObtenerReservaCampingUseCase {
  constructor(private repository: IReservaCampingRepository) {}

  async ejecutar(id: number): Promise<ReservaCamping> {
    const reserva = await this.repository.obtenerPorId(id);
    if (!reserva || reserva.state === 'REMOVED') {
      const error: any = new Error('Reserva no encontrada');
      error.status = 404;
      throw error;
    }
    return reserva;
  }
}
