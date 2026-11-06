# Análisis de Necesidades y Diseño - Bavaria

## 1. Contexto de la organización

Bavaria se toma como contexto organizacional para el desarrollo de este proyecto académico de infraestructura de TI. Por tratarse de una organización del sector de bebidas, el funcionamiento coordinado de sus áreas administrativas y operativas puede apoyarse en servicios tecnológicos que faciliten la comunicación entre equipos, la disponibilidad de recursos y la administración de los sistemas.

El proyecto no interviene ni describe la infraestructura productiva interna de Bavaria. En su lugar, plantea y prueba, en un entorno de laboratorio, algunos servicios básicos que podrían formar parte de una infraestructura institucional: sincronización horaria y administración centralizada de impresión.

## 2. Necesidades consideradas y justificación de los servicios

### A. Sincronización de tiempo mediante Chrony

**Necesidad considerada:** Los equipos y servicios informáticos requieren mantener una referencia horaria consistente. Las diferencias de hora entre dispositivos pueden dificultar la interpretación de registros, la revisión de incidentes y la correlación de actividades.

**Justificación:** Chrony permite sincronizar el reloj del servidor con fuentes de tiempo y configurar el servicio para atender solicitudes de equipos autorizados de la red local. En el laboratorio se configuró la subred `192.168.18.0/24` como red de referencia para las pruebas.

### B. Administración de impresión mediante CUPS

**Necesidad considerada:** En una organización con diferentes áreas de trabajo, la impresión de documentos puede requerir administración centralizada, control de los trabajos y disponibilidad del servicio para los equipos autorizados.

**Justificación:** CUPS permite administrar colas y dispositivos de impresión desde un servidor Linux. En el laboratorio se habilitó el servicio en el puerto TCP `631` y se configuró el acceso desde la red local. La interfaz web permitió comprobar el acceso a las funciones de administración y el flujo para agregar una impresora.

### C. Impresión simulada mediante CUPS-PDF

**Necesidad considerada:** Para validar el funcionamiento de la cola de impresión sin depender de un dispositivo físico, se requiere un mecanismo que permita procesar trabajos y obtener una salida verificable.

**Justificación:** CUPS-PDF proporciona una impresora virtual que convierte los trabajos enviados a la cola `PDF` en archivos PDF. En las pruebas se envió un documento de texto a dicha cola y se verificó la creación del archivo `prueba-cups-job_1.pdf` en el directorio de salida del servicio.

## 3. Requisitos técnicos considerados

| Servicio | Dirección del servidor | Puerto | Protocolo | Función |
|---|---|---:|---|---|
| Chrony / NTP | `192.168.18.87` | 123 | UDP | Sincronización horaria. |
| CUPS | `192.168.18.87` | 631 | TCP | Administración y recepción de trabajos de impresión. |
| CUPS-PDF | Servidor local | Cola `PDF` | CUPS | Generación de archivos PDF como salida de impresión virtual. |

La dirección IP corresponde al servidor del laboratorio. No debe interpretarse como una dirección perteneciente a la red real de Bavaria.

## 4. Diseño de la arquitectura

La solución se ejecuta en una máquina virtual con Ubuntu Server 24.04 LTS. El servidor concentra los servicios Chrony y CUPS. Los equipos de la red de laboratorio pueden consultar el servicio de impresión mediante la interfaz web de CUPS, de acuerdo con las reglas de acceso configuradas.

Chrony utiliza el puerto UDP `123` para las funciones de sincronización horaria. CUPS utiliza el puerto TCP `631` para la administración y recepción de trabajos. La cola virtual `PDF` procesa los trabajos de impresión y genera archivos PDF en el servidor.

El diagrama de arquitectura se encuentra en `diagrama.mmd`.

## 5. Alcance y limitaciones

- La implementación se limita a los servicios Chrony, CUPS y CUPS-PDF documentados en el repositorio.
- Las pruebas se realizaron en un entorno académico de laboratorio, no en la red productiva de Bavaria.
- La impresora PDF es virtual; no se documenta la conexión de una impresora física.
- No se afirma que Bavaria utilice actualmente esta arquitectura ni que sus redes tengan el direccionamiento usado en las pruebas.
- Para una implementación real sería necesario levantar requisitos con la organización, validar la topología de red y definir controles de seguridad y disponibilidad.
