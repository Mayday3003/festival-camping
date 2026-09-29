import { Request, Response } from 'express';
import { ListarReservasCampingUseCase } from '../../../application/use-cases/ListarReservasCampingUseCase.js';
import { ObtenerReservaCampingUseCase } from '../../../application/use-cases/ObtenerReservaCampingUseCase.js';
import { CrearReservaCampingUseCase } from '../../../application/use-cases/CrearReservaCampingUseCase.js';
import { ActualizarReservaCampingUseCase } from '../../../application/use-cases/ActualizarReservaCampingUseCase.js';
import { EliminarReservaCampingUseCase } from '../../../application/use-cases/EliminarReservaCampingUseCase.js';
import { ObtenerOcupacionZonaUseCase } from '../../../application/use-cases/ObtenerOcupacionZonaUseCase.js';

export class ReservaCampingController {
  constructor(
    private listarUseCase: ListarReservasCampingUseCase,
    private obtenerUseCase: ObtenerReservaCampingUseCase,
    private crearUseCase: CrearReservaCampingUseCase,
    private actualizarUseCase: ActualizarReservaCampingUseCase,
    private eliminarUseCase: EliminarReservaCampingUseCase,
    private ocupacionUseCase: ObtenerOcupacionZonaUseCase
  ) {}

  listar = async (req: Request, res: Response) => {
    try {
      const pageQuery = req.query.page;
      const limitQuery = req.query.limit;
      const zonaIdQuery = req.query.zona_id;
      const asistenteIdQuery = req.query.asistente_id;

      let page = 1;
      let limit = 10;

      if (pageQuery !== undefined) {
        const pageStr = String(pageQuery);
        if (!/^\d+$/.test(pageStr) || parseInt(pageStr, 10) <= 0) {
          return res.status(400).json({ error: 'page debe ser un entero positivo' });
        }
        page = parseInt(pageStr, 10);
      }

      if (limitQuery !== undefined) {
        const limitStr = String(limitQuery);
        if (!/^\d+$/.test(limitStr) || parseInt(limitStr, 10) <= 0) {
          return res.status(400).json({ error: 'limit debe ser un entero positivo' });
        }
        limit = parseInt(limitStr, 10);
        if (limit > 50) {
          return res.status(400).json({ error: 'limit no puede ser mayor a 50' });
        }
      }

      let zona_id: number | undefined = undefined;
      if (zonaIdQuery !== undefined) {
        const zonaIdStr = String(zonaIdQuery);
        if (!/^\d+$/.test(zonaIdStr) || parseInt(zonaIdStr, 10) <= 0) {
          return res.status(400).json({ error: 'zona_id debe ser un número entero positivo' });
        }
        zona_id = parseInt(zonaIdStr, 10);
      }

      let asistente_id: number | undefined = undefined;
      if (asistenteIdQuery !== undefined) {
        const asistenteIdStr = String(asistenteIdQuery);
        if (!/^\d+$/.test(asistenteIdStr) || parseInt(asistenteIdStr, 10) <= 0) {
          return res.status(400).json({ error: 'asistente_id debe ser un número entero positivo' });
        }
        asistente_id = parseInt(asistenteIdStr, 10);
      }

      const resultado = await this.listarUseCase.ejecutar({
        page,
        limit,
        zona_id,
        asistente_id,
      });

      return res.status(200).json(resultado);
    } catch (err: any) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.message || 'Error interno del servidor' });
    }
  };

  obtenerPorId = async (req: Request, res: Response) => {
    try {
      const idParam = String(req.params.id || '');
      if (!/^\d+$/.test(idParam) || parseInt(idParam, 10) <= 0) {
        return res.status(400).json({ error: 'El id debe ser un entero positivo' });
      }
      const id = parseInt(idParam, 10);
      const reserva = await this.obtenerUseCase.ejecutar(id);
      return res.status(200).json({ data: reserva });
    } catch (err: any) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.message || 'Error interno del servidor' });
    }
  };

  crear = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const creada = await this.crearUseCase.ejecutar(body);
      return res.status(201).json({ data: creada });
    } catch (err: any) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.message || 'Error interno del servidor' });
    }
  };

  actualizar = async (req: Request, res: Response) => {
    try {
      const idParam = String(req.params.id || '');
      if (!/^\d+$/.test(idParam) || parseInt(idParam, 10) <= 0) {
        return res.status(400).json({ error: 'El id debe ser un entero positivo' });
      }
      const id = parseInt(idParam, 10);
      const actualizada = await this.actualizarUseCase.ejecutar(id, req.body);
      return res.status(200).json({ data: actualizada });
    } catch (err: any) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.message || 'Error interno del servidor' });
    }
  };

  eliminar = async (req: Request, res: Response) => {
    try {
      const idParam = String(req.params.id || '');
      if (!/^\d+$/.test(idParam) || parseInt(idParam, 10) <= 0) {
        return res.status(400).json({ error: 'El id debe ser un entero positivo' });
      }
      const id = parseInt(idParam, 10);
      await this.eliminarUseCase.ejecutar(id);
      return res.status(200).json({ message: 'Reserva eliminada con éxito' });
    } catch (err: any) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.message || 'Error interno del servidor' });
    }
  };

  obtenerOcupacion = async (req: Request, res: Response) => {
    try {
      const zonaIdParam = String(req.params.zonaId || '');
      if (!/^\d+$/.test(zonaIdParam) || parseInt(zonaIdParam, 10) <= 0) {
        return res.status(400).json({ error: 'El zonaId debe ser un entero positivo' });
      }
      const zonaId = parseInt(zonaIdParam, 10);
      const ocupacion = await this.ocupacionUseCase.ejecutar(zonaId);
      return res.status(200).json({ data: ocupacion });
    } catch (err: any) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.message || 'Error interno del servidor' });
    }
  };
}
