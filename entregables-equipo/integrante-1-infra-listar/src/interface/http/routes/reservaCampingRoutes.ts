import { Router } from 'express';
import { PrismaReservaCampingRepository } from '../../../infrastructure/database/PrismaReservaCampingRepository.js';
import { ListarReservasCampingUseCase } from '../../../application/use-cases/ListarReservasCampingUseCase.js';
import { ObtenerReservaCampingUseCase } from '../../../application/use-cases/ObtenerReservaCampingUseCase.js';
import { CrearReservaCampingUseCase } from '../../../application/use-cases/CrearReservaCampingUseCase.js';
import { ActualizarReservaCampingUseCase } from '../../../application/use-cases/ActualizarReservaCampingUseCase.js';
import { EliminarReservaCampingUseCase } from '../../../application/use-cases/EliminarReservaCampingUseCase.js';
import { ObtenerOcupacionZonaUseCase } from '../../../application/use-cases/ObtenerOcupacionZonaUseCase.js';
import { ReservaCampingController } from '../controllers/ReservaCampingController.js';

const router = Router();

// Inyección de dependencias
const repository = new PrismaReservaCampingRepository();
const listarUseCase = new ListarReservasCampingUseCase(repository);
const obtenerUseCase = new ObtenerReservaCampingUseCase(repository);
const crearUseCase = new CrearReservaCampingUseCase(repository);
const actualizarUseCase = new ActualizarReservaCampingUseCase(repository);
const eliminarUseCase = new EliminarReservaCampingUseCase(repository);
const ocupacionUseCase = new ObtenerOcupacionZonaUseCase(repository);

const controller = new ReservaCampingController(
  listarUseCase,
  obtenerUseCase,
  crearUseCase,
  actualizarUseCase,
  eliminarUseCase,
  ocupacionUseCase
);

// Rutas según contrato
router.get('/zona/:zonaId/ocupacion', controller.obtenerOcupacion);
router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.patch('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

export default router;
