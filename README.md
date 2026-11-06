# Proyecto de Infraestructura de TI - Bavaria

## 1. Descripción del Proyecto

Este proyecto académico aborda la configuración de servicios de infraestructura de TI tomando como contexto organizacional a **Bavaria**, empresa del sector de bebidas. El propósito es documentar una solución de laboratorio basada en Ubuntu Server 24.04 LTS que permita centralizar servicios de red y apoyar tareas de administración tecnológica.

La implementación documentada comprende la sincronización de tiempo mediante Chrony y la gestión de impresión mediante CUPS, incluyendo CUPS-PDF para realizar pruebas de impresión simulada en formato PDF.

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

## 4. Estructura del repositorio

| Archivo o directorio | Descripción |
| :--- | :--- |
| `README.md` | Presentación general, alcance y estructura del proyecto. |
| `analisis.md` | Contexto, necesidades consideradas, justificación y arquitectura de los servicios. |
| `documentacion.md` | Procedimientos de instalación, configuración y verificación. |
| `diagrama.mmd` | Diagrama de arquitectura de la solución. |
| `capturas/` | Evidencias gráficas de los procedimientos y pruebas. |
| `codigo/` | Archivos de configuración y scripts relacionados con los servicios. |

## 5. Puertos y protocolos

| Servicio | Puerto | Protocolo | Función |
| :--- | :---: | :--- | :--- |
| Chrony / NTP | 123 | UDP | Sincronización y consulta de hora. |
| CUPS | 631 | TCP | Administración y recepción de trabajos de impresión. |

## 6. Consideraciones

- La dirección IP y la subred corresponden al entorno de laboratorio utilizado durante las pruebas.
- La cola `PDF` es una impresora virtual; no representa la instalación de una impresora física en Bavaria.
- Las evidencias del repositorio respaldan los procedimientos realizados en el laboratorio.
- Antes de trasladar esta configuración a un entorno productivo, se deben validar el direccionamiento, las políticas de acceso, la seguridad y los requerimientos reales de la organización.
