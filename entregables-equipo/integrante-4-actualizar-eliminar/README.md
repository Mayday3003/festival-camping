# Módulo 08 — Camping (Festival Picnic 2026)

Backend para la gestión de reservas de carpas en las zonas de camping del **Festival Picnic 2026**.

## Integrantes y Aportes
- **Integrante 1**: Configuración inicial, conexión de base de datos con Prisma (`npm run sync`), DTOs e interfaces de dominio.
- **Integrante 2**: Casos de uso de consulta (`GET` paginado con filtros `?zona_id=` y `?asistente_id=`, `GET /:id` y `GET /zona/:zonaId/ocupacion`).
- **Integrante 3**: Caso de uso de creación (`POST`) e implementación de reglas de negocio (mayoría de edad, reserva activa única, capacidad).
- **Integrante 4**: Casos de uso de modificación (`PATCH`), borrado lógico (`DELETE`), controladores HTTP y pruebas oficiales.

---

## Arquitectura (4 Capas)
El proyecto implementa la arquitectura limpia en 4 capas exigida por la rúbrica:
1. **Domain (`src/domain/`)**: Entidades (`ReservaCamping`, `Asistente`, `Zona`) e interfaces de repositorio (`IReservaCampingRepository`). Totalmente desacoplada de la base de datos o frameworks.
2. **Application (`src/application/`)**: Casos de uso con la lógica del negocio (`CrearReservaCampingUseCase`, `ListarReservasCampingUseCase`, etc.).
3. **Infrastructure (`src/infrastructure/`)**: Implementación técnica del repositorio (`PrismaReservaCampingRepository`) usando Prisma Client.
4. **Interface (`src/interface/`)**: Controladores HTTP delegadores y definición de rutas de Express.

---

## Cómo instalar y correr

### Requisitos
- Node.js 18+
- npm

### 1. Clonar e instalar dependencias
```bash
git clone <url-del-repo>
cd festival-camping
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```env
DATABASE_URL="postgresql://usuario:contraseña@servidor:puerto/database?sslmode=no-verify"
PORT=3000
```
> ⚠️ **Importante:** Nunca compartas ni subas tu `.env` a GitHub.

### 3. Sincronizar Prisma
```bash
npm run sync
```

### 4. Iniciar en desarrollo
```bash
npm run dev
```

---

## Regla de Negocio Explicada: Mayoría de Edad (18 años cumplidos al 19 de Noviembre de 2026)

- **Qué valida:**
  De acuerdo con el contrato oficial del módulo 08, únicamente los asistentes mayores de edad pueden tener reservas en las zonas de camping. Para poder acampar, el asistente debió haber nacido el **19 de noviembre de 2008 o antes**. Si el asistente nació después de esa fecha (menor de 18 años cumplidos al inicio del festival), la API rechaza la solicitud retornando el código HTTP `409 Conflict`.
- **En qué archivo está implementada:**
  [`src/application/use-cases/CrearReservaCampingUseCase.ts`](src/application/use-cases/CrearReservaCampingUseCase.ts)
  ```typescript
  // Validación de mayoría de edad al 19 de noviembre de 2026
  if (asistente.fecha_nacimiento > '2008-11-19') {
    const err: any = new Error('El asistente debe ser mayor de edad (18 años cumplidos al 19 de noviembre de 2026)');
    err.status = 409;
    throw err;
  }
  ```
- **Cómo la probamos:**
  Se probó mediante la suite de pruebas oficial del festival (`pruebas/publicas/camping.mjs`):
  El asistente con id `19` es menor de edad en los datos precargados. Al intentar crear una reserva para este asistente:
  ```http
  POST /api/reservas-camping
  {
    "asistente_id": 19,
    "zona_id": 1,
    "fecha_entrada": "2026-11-20",
    "fecha_salida": "2026-11-21",
    "personas": 1
  }
  ```
  La API responde exitosamente `409` con el mensaje descriptivo en `{ "error": "..." }`.
