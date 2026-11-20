# Proyecto de Infraestructura de TI - Bavaria

## 1. Descripción del Proyecto

Este proyecto académico aborda la configuración de servicios de infraestructura de TI tomando como contexto organizacional a **Bavaria**, empresa del sector de bebidas. El propósito es documentar una solución de laboratorio basada en Ubuntu Server 24.04 LTS que permita centralizar servicios de red y apoyar tareas de administración tecnológica.

La implementación documentada comprende la sincronización de tiempo mediante Chrony, la gestión de impresión mediante CUPS (incluyendo CUPS-PDF para pruebas de impresión simulada), el almacenamiento compartido en red mediante NFS y Samba, y la autenticación centralizada de usuarios mediante NIS.

> **Alcance:** La configuración se realizó en un entorno de laboratorio. Este repositorio no afirma que los servicios estén desplegados en la infraestructura productiva de Bavaria.

## 2. Información del servidor

| Parámetro | Descripción |
| :--- | :--- |
| **Sistema operativo** | Ubuntu Server 24.04 LTS |
| **Entorno** | Máquina virtual |
| **Dirección IP utilizada en las pruebas** | `192.168.18.87` |
| **Red local considerada** | `192.168.18.0/24` |

## 3. Servicios implementados

### A. Servicio NTP con Chrony

Chrony permite sincronizar el reloj del servidor con fuentes de tiempo y habilitar la consulta de hora desde equipos autorizados de la red local. La sincronización consistente facilita la correlación de registros, la revisión de eventos y la coordinación de tareas entre sistemas.

### B. Servicio de impresión CUPS

CUPS centraliza la administración de impresoras y trabajos de impresión desde un servidor Linux. Se habilitó el acceso a su interfaz web por el puerto TCP `631` y se configuraron reglas para permitir el acceso desde la red local utilizada en las pruebas.

### C. Impresión virtual con CUPS-PDF

Se instaló el controlador `printer-driver-cups-pdf` y se utilizó la cola virtual `PDF` para comprobar el envío y procesamiento de trabajos de impresión sin requerir una impresora física. La prueba generó un archivo PDF en el directorio de salida del servicio.

### D. Servicio de almacenamiento compartido NFS

NFS (Network File System) permite centralizar y compartir directorios en red para el acceso concurrente de estaciones y servidores Linux de Bavaria. Se configuró el recurso institucional `/srv/nfs/empresa` con permisos de lectura y escritura (`rw`), sincronización inmediata (`sync`) y montaje verificado en cliente Linux en `/mnt/empresa`, facilitando el intercambio de reportes de planta, auditorías de calidad y respaldos.

### E. Autenticación centralizada con NIS

NIS (Network Information Service) centraliza la consulta de usuarios y grupos para equipos Linux. En el laboratorio se configuró el servidor maestro `nis-server` (`192.168.1.54`) y el cliente `nis-client` (`192.168.1.55`) en el dominio `bavaria.local`; se verificó la autenticación local y por SSH, así como la propagación de usuarios nuevos. NIS transmite información sin cifrar y se documenta únicamente para el entorno académico de pruebas.

### F. Compartición de archivos mediante Samba

Samba permite compartir archivos y carpetas entre equipos con diferentes sistemas operativos. En el laboratorio se configuró un recurso compartido llamado `Compartido` en el servidor Ubuntu 24.04.5 LTS, utilizando la dirección IP `192.168.252.3`. Se configuró el acceso mediante usuario y contraseña, y se realizaron pruebas de conexión desde macOS utilizando Finder, verificando la creación y transferencia de archivos entre el cliente y el servidor.

## 4. Estructura del repositorio

| Archivo o directorio | Descripción |
| :--- | :--- |
| `README.md` | Presentación general, alcance y estructura del proyecto. |
| `analisis.md` | Contexto, necesidades consideradas, justificación y arquitectura de los servicios. |
| `documentacion.md` | Procedimientos de instalación, configuración y verificación. |
| `diagrama.mmd` | Diagrama de arquitectura de la solución. |
| `capturas/` | Evidencias gráficas de los procedimientos y pruebas. |
| `capturas/samba/` | Evidencias de instalación, configuración y pruebas de acceso al recurso compartido Samba. |
| `codigo/` | Archivos de configuración y scripts relacionados con los servicios. |
| `codigo/samba/` | Archivo de configuración del recurso compartido de Samba. |

## 5. Puertos y protocolos

| Servicio | Puerto | Protocolo | Función |
| :--- | :---: | :--- | :--- |
| Chrony / NTP | 123 | UDP | Sincronización y consulta de hora. |
| CUPS | 631 | TCP | Administración y recepción de trabajos de impresión. |
| NFS | 2049 | TCP / UDP | Compartición de archivos en red para clientes Linux. |
| NIS | 111 y puertos RPC dinámicos | TCP / UDP | Consulta centralizada de usuarios y grupos en clientes Linux. |
| RPCbind | 111 | TCP / UDP | Mapeo y resolución de puertos para llamadas RPC de NFS y NIS. |
| Samba / SMB | 445 | TCP | Compartición de archivos entre el servidor y los equipos clientes. |

## 6. Consideraciones

- La dirección IP y la subred corresponden al entorno de laboratorio utilizado durante las pruebas.
- NIS se probó en máquinas virtuales con direccionamiento distinto al de los demás servicios. No debe exponerse a redes no confiables, ya que sus consultas no están cifradas.
- La cola `PDF` es una impresora virtual; no representa la instalación de una impresora física en Bavaria.
- Samba se probó desde un equipo macOS mediante Finder, utilizando autenticación de usuario para acceder a la carpeta compartida.
- La dirección IP `192.168.252.3` corresponde específicamente al servidor utilizado para las pruebas de Samba.
- Las evidencias del repositorio respaldan los procedimientos realizados en el laboratorio.
- Antes de trasladar esta configuración a un entorno productivo, se deben validar el direccionamiento, las políticas de acceso, la seguridad y los requerimientos reales de la organización.