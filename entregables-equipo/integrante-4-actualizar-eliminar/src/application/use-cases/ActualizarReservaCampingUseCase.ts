import { IReservaCampingRepository } from '../../domain/repositories/IReservaCampingRepository.js';
import { ReservaCamping } from '../../domain/entities/ReservaCamping.js';

const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const CAMPOS_PERMITIDOS = ['zona_id', 'fecha_entrada', 'fecha_salida', 'personas'];

export class ActualizarReservaCampingUseCase {
  constructor(private repository: IReservaCampingRepository) {}

  async ejecutar(id: number, body: any): Promise<ReservaCamping> {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      const err: any = new Error('El cuerpo debe ser un objeto JSON');
      err.status = 400;
      throw err;
    }

    // 1. Validar que solo vengan campos editables (400)
    const llaves = Object.keys(body);
    for (const llave of llaves) {
      if (!CAMPOS_PERMITIDOS.includes(llave)) {
        const err: any = new Error(`El campo '${llave}' no es editable`);
        err.status = 400;
        throw err;
      }
    }

    // Validaciones 400 individuales de formato/tipo si los campos vienen
    if (body.zona_id !== undefined) {
      if (typeof body.zona_id !== 'number' || !Number.isInteger(body.zona_id) || body.zona_id <= 0) {
        const err: any = new Error('zona_id debe ser un entero positivo');
        err.status = 400;
        throw err;
      }
    }

    if (body.fecha_entrada !== undefined) {
      if (typeof body.fecha_entrada !== 'string' || !REGEX_FECHA.test(body.fecha_entrada)) {
        const err: any = new Error('fecha_entrada debe tener el formato YYYY-MM-DD');
        err.status = 400;
        throw err;
      }
    }

    if (body.fecha_salida !== undefined) {
      if (typeof body.fecha_salida !== 'string' || !REGEX_FECHA.test(body.fecha_salida)) {
        const err: any = new Error('fecha_salida debe tener el formato YYYY-MM-DD');
        err.status = 400;
        throw err;
      }
    }

    if (body.personas !== undefined) {
      if (typeof body.personas !== 'number' || !Number.isInteger(body.personas) || body.personas < 1 || body.personas > 6) {
        const err: any = new Error('personas debe ser un entero entre 1 y 6');
        err.status = 400;
        throw err;
      }
    }

    // 2. Verificar existencia de la reserva (404)
    const reservaActual = await this.repository.obtenerPorId(id);
    if (!reservaActual || reservaActual.state === 'REMOVED') {
      const err: any = new Error('Reserva no encontrada');
      err.status = 404;
      throw err;
    }

    // Combinar datos
    const nuevaZonaId = body.zona_id !== undefined ? body.zona_id : reservaActual.zona_id;
    const nuevaFechaEntrada = body.fecha_entrada !== undefined ? body.fecha_entrada : reservaActual.fecha_entrada;
    const nuevaFechaSalida = body.fecha_salida !== undefined ? body.fecha_salida : reservaActual.fecha_salida;

    // Validar combinación de fechas (400)
    if (nuevaFechaSalida <= nuevaFechaEntrada) {
      const err: any = new Error('fecha_salida debe ser posterior a fecha_entrada');
      err.status = 400;
      throw err;
    }

    if (
      nuevaFechaEntrada < '2026-11-19' || nuevaFechaEntrada > '2026-11-23' ||
      nuevaFechaSalida < '2026-11-19' || nuevaFechaSalida > '2026-11-23'
    ) {
      const err: any = new Error('Las fechas deben estar entre el 2026-11-19 y el 2026-11-23');
      err.status = 400;
      throw err;
    }

    // 3. Verificar existencia de la zona (404)
    const zona = await this.repository.obtenerZonaPorId(nuevaZonaId);
    if (!zona) {
      const err: any = new Error(`La zona con id ${nuevaZonaId} no existe`);
      err.status = 404;
      throw err;
    }

    // 4. Tipo de zona compatible (400)
    if (zona.tipo !== 'CAMPING') {
      const err: any = new Error('La zona debe ser de tipo CAMPING');
      err.status = 400;
      throw err;
    }

    // 5. Regla de negocio: capacidad máxima si cambia de zona (409)
    if (body.zona_id !== undefined && body.zona_id !== reservaActual.zona_id) {
      const ocupadas = await this.repository.contarReservasActivasPorZona(nuevaZonaId);
      if (ocupadas >= zona.capacidad) {
        const err: any = new Error('La nueva zona de camping ha alcanzado su capacidad máxima');
        err.status = 409;
        throw err;
      }
    }

    return await this.repository.actualizar(id, {
      zona_id: body.zona_id,
      fecha_entrada: body.fecha_entrada,
      fecha_salida: body.fecha_salida,
      personas: body.personas,
    });
  }
}
