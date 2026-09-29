import { IReservaCampingRepository } from '../../domain/repositories/IReservaCampingRepository.js';
import { ReservaCamping } from '../../domain/entities/ReservaCamping.js';

export interface CrearReservaCampingDTO {
  asistente_id: any;
  zona_id: any;
  fecha_entrada: any;
  fecha_salida: any;
  personas: any;
}

const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;

export class CrearReservaCampingUseCase {
  constructor(private repository: IReservaCampingRepository) {}

  async ejecutar(dto: CrearReservaCampingDTO): Promise<ReservaCamping> {
    // 1. Validaciones 400 (Campos, tipos, formatos, rangos)
    if (
      dto.asistente_id === undefined ||
      dto.zona_id === undefined ||
      dto.fecha_entrada === undefined ||
      dto.fecha_salida === undefined ||
      dto.personas === undefined
    ) {
      const err: any = new Error('Faltan campos obligatorios');
      err.status = 400;
      throw err;
    }

    if (
      typeof dto.asistente_id !== 'number' ||
      !Number.isInteger(dto.asistente_id) ||
      dto.asistente_id <= 0 ||
      typeof dto.zona_id !== 'number' ||
      !Number.isInteger(dto.zona_id) ||
      dto.zona_id <= 0
    ) {
      const err: any = new Error('asistente_id y zona_id deben ser enteros positivos');
      err.status = 400;
      throw err;
    }

    if (typeof dto.fecha_entrada !== 'string' || !REGEX_FECHA.test(dto.fecha_entrada) ||
        typeof dto.fecha_salida !== 'string' || !REGEX_FECHA.test(dto.fecha_salida)) {
      const err: any = new Error('Las fechas deben tener el formato YYYY-MM-DD');
      err.status = 400;
      throw err;
    }

    if (dto.fecha_salida <= dto.fecha_entrada) {
      const err: any = new Error('fecha_salida debe ser posterior a fecha_entrada');
      err.status = 400;
      throw err;
    }

    if (
      dto.fecha_entrada < '2026-11-19' || dto.fecha_entrada > '2026-11-23' ||
      dto.fecha_salida < '2026-11-19' || dto.fecha_salida > '2026-11-23'
    ) {
      const err: any = new Error('Las fechas deben estar entre el 2026-11-19 y el 2026-11-23');
      err.status = 400;
      throw err;
    }

    if (
      typeof dto.personas !== 'number' ||
      !Number.isInteger(dto.personas) ||
      dto.personas < 1 ||
      dto.personas > 6
    ) {
      const err: any = new Error('personas debe ser un entero entre 1 y 6');
      err.status = 400;
      throw err;
    }

    // 2. Validaciones 404 (Existencia)
    const asistente = await this.repository.obtenerAsistentePorId(dto.asistente_id);
    if (!asistente) {
      const err: any = new Error(`El asistente con id ${dto.asistente_id} no existe`);
      err.status = 404;
      throw err;
    }

    const zona = await this.repository.obtenerZonaPorId(dto.zona_id);
    if (!zona) {
      const err: any = new Error(`La zona con id ${dto.zona_id} no existe`);
      err.status = 404;
      throw err;
    }

    // 3. Validaciones 400 (Tipo de recurso compatible)
    if (zona.tipo !== 'CAMPING') {
      const err: any = new Error('La zona debe ser de tipo CAMPING');
      err.status = 400;
      throw err;
    }

    // 4. Reglas de negocio 409
    // Regla 1: Mayoría de edad al 19 de noviembre de 2026
    // Cumple 18 si nació el 2008-11-19 o antes
    if (asistente.fecha_nacimiento > '2008-11-19') {
      const err: any = new Error('El asistente debe ser mayor de edad (18 años cumplidos al 19 de noviembre de 2026)');
      err.status = 409;
      throw err;
    }

    // Regla 2: Máximo una reserva activa por asistente
    const tieneActiva = await this.repository.tieneReservaActiva(dto.asistente_id);
    if (tieneActiva) {
      const err: any = new Error('El asistente ya tiene una reserva de camping activa');
      err.status = 409;
      throw err;
    }

    // Regla 3: Capacidad de la zona
    const reservasOcupadas = await this.repository.contarReservasActivasPorZona(dto.zona_id);
    if (reservasOcupadas >= zona.capacidad) {
      const err: any = new Error('La zona de camping ha alcanzado su capacidad máxima');
      err.status = 409;
      throw err;
    }

    return await this.repository.crear({
      asistente_id: dto.asistente_id,
      zona_id: dto.zona_id,
      fecha_entrada: dto.fecha_entrada,
      fecha_salida: dto.fecha_salida,
      personas: dto.personas,
    });
  }
}
