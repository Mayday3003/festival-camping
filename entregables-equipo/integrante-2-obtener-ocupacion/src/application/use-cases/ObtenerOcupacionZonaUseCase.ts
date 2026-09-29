import { IReservaCampingRepository } from '../../domain/repositories/IReservaCampingRepository.js';
import { OcupacionZona } from '../../domain/entities/ReservaCamping.js';

export class ObtenerOcupacionZonaUseCase {
  constructor(private repository: IReservaCampingRepository) {}

  async ejecutar(zonaId: number): Promise<OcupacionZona> {
    const zona = await this.repository.obtenerZonaPorId(zonaId);
    if (!zona) {
      const err: any = new Error(`La zona con id ${zonaId} no existe`);
      err.status = 404;
      throw err;
    }

    if (zona.tipo !== 'CAMPING') {
      const err: any = new Error('La zona debe ser de tipo CAMPING');
      err.status = 400;
      throw err;
    }

    const ocupadas = await this.repository.contarReservasActivasPorZona(zonaId);
    const disponibles = Math.max(0, zona.capacidad - ocupadas);

    return {
      zona_id: zonaId,
      capacidad: zona.capacidad,
      ocupadas,
      disponibles,
    };
  }
}
