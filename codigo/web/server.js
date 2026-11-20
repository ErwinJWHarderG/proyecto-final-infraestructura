const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS servicios (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL
    )
  `);
  const { rows } = await pool.query('SELECT COUNT(*) FROM servicios');
  if (rows[0].count === '0') {
    await pool.query(`
      INSERT INTO servicios (nombre, descripcion) VALUES
      ('Gestión de Plantas Cerveceras', 'Monitoreo operativo en tiempo real de las cervecerías de Tocancipá, Barranquilla, Bucaramanga, Yumbo, Tibasosa y Medellín.'),
      ('Logística y Distribución Nacional', 'Control centralizado de flota, centros de distribución y cadena de abastecimiento para más de 300.000 puntos de venta en Colombia.'),
      ('Control de Calidad y Laboratorio', 'Trazabilidad digital de materias primas, fermentación y envasado bajo estándares internacionales de AB InBev.'),
      ('Infraestructura TI y Soporte Corporativo', 'Administración centralizada de identidades (NIS), almacenamiento compartido (NFS/Samba), impresión (CUPS) y sincronización horaria (NTP).')
    `);
  }
}

app.use(express.static('public'));

app.get('/api/servicios', async (req, res) => {
  try {
    await init();
    const r = await pool.query('SELECT * FROM servicios ORDER BY id');
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Portal Bavaria escuchando en puerto 3000');
  init().catch(err => console.error('Esperando DB:', err.message));
});
