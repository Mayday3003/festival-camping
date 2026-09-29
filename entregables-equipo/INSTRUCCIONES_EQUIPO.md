# Distribución Equitativa y Guía de Commits (4 Integrantes) — Nota 5.0 (100 Pts)

Para que ningún integrante se quede con solo configuración y el profesor vea una **distribución técnica 100% equilibrada en las 4 capas**, el trabajo se divide por **responsabilidad vertical completa** (cada uno toca Dominio, Caso de Uso, Repositorio y Rutas/Controlador):

| Integrante | Rol y Feature | Qué implementa en el backend |
|---|---|---|
| **Integrante 1** | **Base + Listado Paginado** | Setup base + Modelos Dominio + Método `listar` en Repo + Caso de uso `ListarReservasCampingUseCase` + Endpoint `GET /api/reservas-camping` (con filtros `?zona_id=` y `?asistente_id=`). |
| **Integrante 2** | **Detalle y Ocupación** | Métodos `obtenerPorId` y `contarReservasActivasPorZona` en Repo + Casos de uso `ObtenerReservaCampingUseCase` y `ObtenerOcupacionZonaUseCase` + Endpoints `GET /:id` y `GET /zona/:zonaId/ocupacion`. |
| **Integrante 3** | **Creación y Reglas de Negocio** | Método `crear` en Repo + Caso de uso `CrearReservaCampingUseCase` con las 3 reglas de negocio (409: mayoría de edad al 19-nov, reserva activa única, límite aforo) + Endpoint `POST /api/reservas-camping`. |
| **Integrante 4** | **Edición, Borrado Lógico y Tests** | Métodos `actualizar` y `borradoLogico` en Repo + Casos de uso `ActualizarReservaCampingUseCase` y `EliminarReservaCampingUseCase` + Endpoints `PATCH /:id` y `DELETE /:id` + Suite de tests y README. |

---

## 👤 Integrante 1 — Base y Listado Paginado con Filtros

**Rama:** `feature/setup-and-paginated-listing`

### Tareas y código:
- Setup inicial del proyecto (`package.json`, `tsconfig.json`, `.gitignore`, `.env.example`).
- Esquema de Prisma (`prisma/schema.prisma`) y cliente `src/infrastructure/database/prisma.ts`.
- Entidades base `src/domain/entities/ReservaCamping.ts` e interfaz de repositorio `IReservaCampingRepository.ts`.
- Caso de uso: `src/application/use-cases/ListarReservasCampingUseCase.ts`.
- Implementación en repositorio de `listar`: `src/infrastructure/database/PrismaReservaCampingRepository.ts`.
- Servidor base `src/app.ts` y controlador `listar` en `src/interface/http/controllers/ReservaCampingController.ts` y ruta en `reservaCampingRoutes.ts`.

### Sus 3 commits recomendados:
1. `git commit -m "chore: setup project environment, prisma schema and domain entities"`
2. `git commit -m "feat(use-cases): implement paginated listing with query filters"`
3. `git commit -m "feat(api): expose GET /api/reservas-camping with pagination and status checks"`

*Abre **Pull Request #1** a `main` y se aprueba.*

---

## 👤 Integrante 2 — Consultas de Detalle y Ocupación de Zona

**Rama:** `feature/get-by-id-and-occupancy`

### Tareas y código:
- Caso de uso para obtener por id: `src/application/use-cases/ObtenerReservaCampingUseCase.ts` (manejo de 404 si no existe o si fue borrado lógicamente).
- Caso de uso de ocupación: `src/application/use-cases/ObtenerOcupacionZonaUseCase.ts` (cálculo de capacidad, ocupadas y disponibles, validación zona tipo CAMPING).
- Implementación de `obtenerPorId` y `contarReservasActivasPorZona` en `PrismaReservaCampingRepository.ts`.
- Métodos `obtenerPorId` y `obtenerOcupacion` en `ReservaCampingController.ts` y sus rutas correspondientes.

### Sus 3 commits recomendados:
1. `git commit -m "feat(repo): add single reservation lookup and zone capacity count"`
2. `git commit -m "feat(use-cases): implement get by id and zone occupancy calculation"`
3. `git commit -m "feat(api): bind GET /:id and GET /zona/:zonaId/ocupacion endpoints"`

*Abre **Pull Request #2** a `main` y se aprueba.*

---

## 👤 Integrante 3 — Creación y Reglas de Negocio (409)

**Rama:** `feature/reservation-creation-and-rules`

### Tareas y código:
- Caso de uso: `src/application/use-cases/CrearReservaCampingUseCase.ts`.
- Implementación de las 3 reglas de negocio del festival:
  1. *Mayoría de edad (18 años cumplidos al 19 de noviembre de 2026).*
  2. *Máximo una reserva activa por asistente.*
  3. *Control de capacidad máxima de la zona de camping.*
- Implementación de `crear` y consultas de validación en `PrismaReservaCampingRepository.ts`.
- Método `crear` en `ReservaCampingController.ts` y ruta `POST /api/reservas-camping`.

### Sus 3 commits recomendados:
1. `git commit -m "feat(use-cases): implement reservation creation with schema validation"`
2. `git commit -m "feat(rules): implement 18+ age verification and zone capacity checks"`
3. `git commit -m "feat(api): expose POST /api/reservas-camping with 409 business conflict handling"`

*Abre **Pull Request #3** a `main` y se aprueba.*

---

## 👤 Integrante 4 — Edición (PATCH), Borrado Lógico (DELETE), Tests y README

**Rama:** `feature/patch-delete-and-docs`

### Tareas y código:
- Caso de uso: `src/application/use-cases/ActualizarReservaCampingUseCase.ts` (validación de campos editables, fechas y precedencia de errores).
- Caso de uso: `src/application/use-cases/EliminarReservaCampingUseCase.ts` (borrado lógico cambiando `state = 'REMOVED'`).
- Métodos `actualizar` y `borradoLogico` en `PrismaReservaCampingRepository.ts`.
- Métodos `actualizar` y `eliminar` en `ReservaCampingController.ts`.
- Suite de pruebas de casos borde `tests/suite-completa.mjs` y configuración de despliegue `vercel.json`.
- [README.md](README.md) completo con la explicación de la regla de negocio y lista de integrantes.

### Sus 3 commits recomendados:
1. `git commit -m "feat(use-cases): implement PATCH and soft delete with error precedence"`
2. `git commit -m "feat(api): wire PATCH and DELETE endpoints with 404/400 validation"`
3. `git commit -m "docs: write project README with architecture breakdown and edge test suite"`

*Abre **Pull Request #4** a `main` y se aprueba.*

---

## 🎯 Resultado de Esta Distribución:
- **Cero desbalance:** Cada integrante escribe lógica de negocio, accede a datos y expone endpoints.
- **Historial perfecto:** 4 Pull Requests integrados, al menos 12 commits limpios.
- **Cumplimiento total de la rúbrica:** Ningún estudiante tendrá nota máxima de 2.5; todos aspiran al **5.0**.
