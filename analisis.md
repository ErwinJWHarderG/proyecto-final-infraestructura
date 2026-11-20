# Análisis de Necesidades y Diseño - Bavaria

## 1. Contexto de la organización

Bavaria se toma como contexto organizacional para el desarrollo de este proyecto académico de infraestructura de TI. Por tratarse de una organización del sector de bebidas, el funcionamiento coordinado de sus áreas administrativas y operativas puede apoyarse en servicios tecnológicos que faciliten la comunicación entre equipos, la disponibilidad de recursos y la administración de los sistemas.

El proyecto no interviene ni describe la infraestructura productiva interna de Bavaria. En su lugar, plantea y prueba, en un entorno de laboratorio, algunos servicios básicos que podrían formar parte de una infraestructura institucional: sincronización horaria, administración centralizada de impresión, compartición de archivos en red mediante NFS y Samba, y consulta centralizada de usuarios mediante NIS.

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

### D. Compartición de archivos mediante NFS (Network File System)

**Necesidad considerada:** En el entorno industrial de Bavaria, las plantas cerveceras (e.g. Tocancipá, Valle), los laboratorios de control de calidad y las oficinas de supervisión requieren compartir reportes de lotes, auditorías técnicas y registros de producción de manera ágil y centralizada, evitando la dispersión de datos y el uso de medios extraíbles.

**Justificación:** NFS proporciona un protocolo nativo de red en entornos Unix/Linux de alto rendimiento que permite a las estaciones clientes montar directorios remotos del servidor como si fuesen volúmenes locales. En el laboratorio se configuró la compartición del recurso `/srv/nfs/empresa` con permisos de lectura y escritura (`rw`) y sincronización inmediata (`sync`), garantizando persistencia y trabajo colaborativo entre los nodos de red de la empresa.

### E. Autenticación centralizada mediante NIS

**Necesidad considerada:** Administrar usuarios y grupos de forma independiente en cada equipo puede generar inconsistencias y trabajo duplicado. Una red con varios equipos Linux requiere que las cuentas autorizadas puedan consultarse de manera centralizada.

**Justificación:** NIS permite que los clientes consulten las cuentas y grupos publicados por un servidor maestro. En el laboratorio se configuraron `nis-server` (`192.168.1.54`) y `nis-client` (`192.168.1.55`) en el dominio `bavaria.local`; se verificó la resolución de usuarios, el inicio de sesión local y remoto y la propagación de una cuenta nueva. NIS no cifra sus consultas, por lo que su uso se restringe a las pruebas en una red confiable; para producción deben evaluarse alternativas más seguras.

### F. Compartición de archivos mediante Samba

**Necesidad considerada:** En una organización con equipos de diferentes sistemas operativos, es necesario contar con un mecanismo que permita compartir archivos y carpetas entre usuarios sin depender de que todos utilicen la misma plataforma.

**Justificación:** Samba permite compartir archivos mediante el protocolo SMB, facilitando el acceso desde equipos Windows y macOS a directorios alojados en un servidor Linux. En el laboratorio se configuró el recurso compartido `Compartido`, ubicado en `/srv/samba/compartido`, en un servidor Ubuntu 24.04.5 LTS con dirección IP `192.168.252.3`. Se estableció el acceso mediante usuario y contraseña y se realizaron pruebas desde macOS utilizando Finder, comprobando la conexión, la creación de carpetas y la transferencia de archivos entre el cliente y el servidor.

## 3. Requisitos técnicos considerados

| Servicio | Dirección del servidor | Puerto | Protocolo | Función |
|---|---|---:|---|---|
| Chrony / NTP | `192.168.18.87` | 123 | UDP | Sincronización horaria. |
| CUPS | `192.168.18.87` | 631 | TCP | Administración y recepción de trabajos de impresión. |
| CUPS-PDF | Servidor local | Cola `PDF` | CUPS | Generación de archivos PDF como salida de impresión virtual. |
| NFS Server | Red interna de pruebas | 2049 / 111 | TCP / UDP | Compartición centralizada de archivos para clientes Linux. |
| NIS | `192.168.1.54` (servidor) / `192.168.1.55` (cliente) | 111 y puertos RPC dinámicos | TCP / UDP | Consulta centralizada de usuarios y grupos. |
| Samba / SMB | `192.168.252.3` | 445 | TCP | Compartición de archivos entre Ubuntu y equipos clientes macOS. |

Las direcciones IP corresponden a los servidores y clientes de los laboratorios descritos. No deben interpretarse como direcciones pertenecientes a la red real de Bavaria; las máquinas NIS y Samba utilizan un direccionamiento distinto al de los demás servicios.

## 4. Diseño de la arquitectura

La solución se ejecuta sobre máquinas virtuales con Ubuntu Server. El servidor principal concentra los servicios de infraestructura Chrony, CUPS y NFS. Los equipos de la red de laboratorio pueden consultar el servicio de impresión mediante la interfaz web de CUPS, sincronizar la hora con Chrony y montar el almacenamiento compartido corporativo `/srv/nfs/empresa` a través del protocolo NFS.

NIS se probó en máquinas virtuales independientes con Ubuntu Server 26.04.1 LTS, usando un servidor maestro y un cliente. Por otra parte, Samba se configuró en un servidor Ubuntu 24.04.5 LTS, desde el cual se compartió el directorio `/srv/samba/compartido` para permitir el acceso desde equipos macOS mediante Finder.

Chrony utiliza el puerto UDP `123` para las funciones de sincronización horaria. CUPS utiliza el puerto TCP `631` para la administración y recepción de trabajos. La cola virtual `PDF` procesa los trabajos de impresión y genera archivos PDF en el servidor. NFS opera en el puerto TCP/UDP `2049`; NFS y NIS utilizan `rpcbind` en el puerto `111` y servicios RPC. El servidor NIS publica mapas de usuarios y grupos que consulta el cliente del dominio `bavaria.local`.

Samba utiliza el puerto TCP `445` para permitir las conexiones mediante SMB. El acceso al recurso compartido se realiza mediante autenticación de usuario y contraseña, permitiendo consultar y modificar archivos desde el equipo cliente.

El diagrama de arquitectura se encuentra en `diagrama.mmd`.

## 5. Alcance y limitaciones

- La implementación documentada comprende los servicios Chrony, CUPS, CUPS-PDF, NFS, NIS y Samba en el contexto del laboratorio.
- Las pruebas se realizaron en un entorno académico de laboratorio, no en la red productiva de Bavaria.
- La impresora PDF es virtual; no se documenta la conexión de una impresora física.
- El servicio NFS fue validado en comunicación cliente-servidor real para lectura, escritura y concurrencia.
- NIS fue validado en una red de laboratorio aislada mediante consultas de usuarios y pruebas de inicio de sesión local y por SSH. Al transmitir información sin cifrar, no se recomienda para redes no confiables ni para producción sin controles adicionales; deben evaluarse alternativas con cifrado, como LDAP o FreeIPA.
- Samba fue probado mediante la conexión desde un equipo macOS al recurso compartido del servidor Ubuntu, verificando la autenticación y la creación de archivos y carpetas.
- No se afirma que Bavaria utilice actualmente esta arquitectura ni que sus redes tengan el direccionamiento usado en las pruebas.
- Para una implementación real sería necesario levantar requisitos con la organización, validar la topología de red y definir controles de seguridad y disponibilidad.