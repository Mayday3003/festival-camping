import { crearApi, espera } from '../kit-estudiantes/pruebas/lib.mjs';

const URL = process.env.TEST_URL || 'http://localhost:3000';
const api = crearApi(URL);
const R = '/api/reservas-camping';

async function ejecutar() {
  console.log(`\n🧪 Ejecutando suite de verificación integral contra ${URL}...\n`);

  // Health check
  console.log('1. Health check /api/health');
  const h = await api.get('/api/health');
  espera.status(h, 200);
  espera.igual(h.body.status, 'OK', 'health.status');

  // Convenciones de error
  console.log('2. Ruta inexistente responde 404 estructurado');
  espera.error(await api.get('/api/ruta-que-no-existe'), 404);

  // Parámetros de paginación inválidos (casos borde)
  console.log('3. Validaciones de paginación (limit=0, limit=51, page=-1)');
  espera.error(await api.get(`${R}?limit=0`), 400);
  espera.error(await api.get(`${R}?limit=51`), 400);
  espera.error(await api.get(`${R}?page=-1`), 400);
  espera.error(await api.get(`${R}?limit=abc`), 400);

  // Verificaciones de ocupación
  console.log('4. Endpoint de ocupación');
  const o = espera.item(await api.get(`${R}/zona/2/ocupacion`));
  espera.numero(o.capacidad, 2, 'capacidad zona 2');
  espera.error(await api.get(`${R}/zona/3/ocupacion`), 400); // Zona 3 no es camping
  espera.error(await api.get(`${R}/zona/999999/ocupacion`), 404); // Zona no existe

  console.log('\n✨ Todas las verificaciones adicionales pasaron con éxito.\n');
}

ejecutar().catch((e) => {
  console.error('\n❌ Fallo en suite:', e);
  process.exit(1);
});
