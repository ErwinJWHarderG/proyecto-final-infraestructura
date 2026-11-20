-- Base de datos de demostración para el portal de infraestructura TI Bavaria.
-- Ejecutar una sola vez en la base de datos configurada en Dokploy.

CREATE TABLE IF NOT EXISTS servicios_infraestructura (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    protocolo VARCHAR(30) NOT NULL,
    puerto VARCHAR(30) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'Configurado en laboratorio',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO servicios_infraestructura
    (nombre, descripcion, protocolo, puerto, estado)
VALUES
    ('Chrony / NTP', 'Sincronización del reloj del servidor y consulta de hora desde equipos autorizados de la red de laboratorio.', 'NTP / UDP', '123/UDP', 'Implementado en laboratorio'),
    ('CUPS', 'Administración centralizada de impresoras y recepción de trabajos de impresión desde la red.', 'HTTP / IPP', '631/TCP', 'Implementado en laboratorio'),
    ('CUPS-PDF', 'Cola de impresión virtual utilizada para procesar trabajos y generar documentos PDF sin impresora física.', 'IPP', '631/TCP', 'Prueba de impresión virtual'),
    ('NFS', 'Compartición de directorios entre sistemas Linux para consultar y transferir archivos en red.', 'NFS', '2049/TCP-UDP', 'Implementado en laboratorio'),
    ('NIS', 'Consulta centralizada de usuarios y grupos para equipos Linux dentro del dominio de laboratorio bavaria.local.', 'RPC / NIS', '111/TCP-UDP + RPC', 'Implementado en laboratorio'),
    ('Samba', 'Compartición autenticada de archivos mediante SMB para permitir el acceso desde equipos cliente, incluido macOS.', 'SMB', '445/TCP', 'Implementado en laboratorio')
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion),
    protocolo = VALUES(protocolo),
    puerto = VALUES(puerto),
    estado = VALUES(estado);
