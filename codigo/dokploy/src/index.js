'use strict';

const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// El pool se crea con variables de entorno configuradas en Dokploy.
// No se almacenan credenciales dentro del repositorio.
const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'bavaria_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bavaria_infraestructura',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 10000
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    estado: 'saludable',
    aplicacion: 'Portal de infraestructura TI - Bavaria',
    version: '1.0.0'
  });
});

// Comprueba la conexión y devuelve información básica de MySQL.
app.get('/db-test', async (_req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT DATABASE() AS base_datos, VERSION() AS version_mysql'
    );
    res.json({ estado: 'conexion exitosa', ...rows[0] });
  } catch (error) {
    console.error('Error en /db-test:', error.message);
    res.status(503).json({ estado: 'sin conexion a la base de datos' });
  }
});

// La página consulta este endpoint para mostrar los servicios definidos en SQL.
app.get('/api/servicios', async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, nombre, descripcion, protocolo, puerto, estado
       FROM servicios_infraestructura
       ORDER BY id ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error en /api/servicios:', error.message);
    res.status(503).json({
      error: 'No fue posible consultar los servicios. Verifique la base de datos y su tabla.'
    });
  }
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error('Error no controlado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portal Bavaria disponible en el puerto ${PORT}`);
});

async function shutdown() {
  console.log('Cerrando aplicación...');
  server.close(async () => {
    await db.end();
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
