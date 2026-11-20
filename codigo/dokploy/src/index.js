const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const app = express();
const PORT = process.env.PORT || 3000;
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// Servir los archivos de la página web
app.use(express.static(path.join(__dirname, '../public')));

// Ruta de verificación del servidor
app.get('/health', (req, res) => {
  res.json({
    estado: 'saludable',
    aplicacion: 'Hospital San Juan de Dios de Armenia',
    version: '1.0.0'
  });
});
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT DATABASE() AS base_datos, VERSION() AS version_mysql'
    );

    res.json({
      estado: 'conexion exitosa',
      ...rows[0]
    });
  } catch (error) {
    console.error('Error de conexion a MySQL:', error.message);
    res.status(500).json({
      estado: 'error de conexion'
    });
  }
});
// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor del hospital iniciado en puerto ${PORT}`);
});
