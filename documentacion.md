# Documentación Técnica - Servicios de Infraestructura para Bavaria

**Proyecto:** Infraestructura de TI - Bavaria (contexto académico)  
**Servidor:** Ubuntu Server 24.04 LTS  
**Entorno:** Máquina virtual  
**Dirección IP utilizada en el laboratorio:** `192.168.18.87`

---

## 1. Contexto de la implementación

En este proyecto académico se configuraron servicios básicos de infraestructura sobre Ubuntu Server 24.04 LTS, tomando a Bavaria como contexto organizacional. Las actividades se realizaron en un entorno de laboratorio y comprenden la sincronización horaria con Chrony, la administración de impresión con CUPS y la generación de documentos mediante la impresora virtual CUPS-PDF.

La documentación describe los comandos y las verificaciones realizadas. Las direcciones IP indicadas pertenecen al laboratorio y no representan información de la red productiva de Bavaria.

## 2. Servicio NTP mediante Chrony

**Objetivo:** mantener sincronizado el reloj del servidor y permitir que los equipos autorizados de la red de laboratorio consulten la hora.

### 2.1. Instalación

Se actualizaron los repositorios y se instaló Chrony:

```bash
sudo apt update
sudo apt install chrony -y
```

### 2.2. Configuración

Se editó el archivo principal de configuración:

```bash
sudo nano /etc/chrony/chrony.conf
```

En la configuración se autorizó la subred local utilizada en el laboratorio:

```conf
allow 192.168.18.0/24
```

> La directiva `allow` autoriza a los clientes de esa subred a consultar el servicio NTP. Debe comprobarse que la subred coincida con la red real antes de reutilizar esta configuración.

### 2.3. Reinicio y habilitación

Para aplicar los cambios y habilitar el inicio automático del servicio:

```bash
sudo systemctl restart chrony
sudo systemctl enable chrony
```

### 2.4. Verificación

Se puede revisar el estado del servicio y las fuentes de sincronización con:

```bash
sudo systemctl status chrony
chronyc sources
chronyc tracking
```

**Resultado esperado:** el servicio debe aparecer activo y las consultas de Chrony deben permitir revisar las fuentes y el estado de sincronización. Las capturas correspondientes se encuentran en `capturas/ntp/`.

---

## 3. Servicio de impresión CUPS

**Objetivo:** centralizar la administración de trabajos de impresión y habilitar el acceso desde los equipos autorizados de la red de laboratorio.

### 3.1. Instalación y permisos de administración

Se instaló CUPS y se agregó el usuario administrador al grupo `lpadmin`:

```bash
sudo apt update
sudo apt install cups -y
sudo usermod -aG lpadmin "$USER"
```

Para que el cambio de grupo se refleje en la sesión, se debe cerrar sesión y volver a ingresar, o reiniciar el equipo.

### 3.2. Configuración del servicio

Se realizó una copia de seguridad del archivo de configuración y se abrió el archivo principal:

```bash
sudo cp /etc/cups/cupsd.conf /etc/cups/cupsd.conf.bak
sudo nano /etc/cups/cupsd.conf
```

Se configuró el servicio para escuchar en el puerto `631` desde las interfaces de red. En el archivo utilizado durante las pruebas se empleó:

```conf
Port 631
```

También se agregaron reglas de acceso para la red local en los bloques de ubicación correspondientes. La regla de red utilizada fue:

```conf
Allow from 192.168.18.0/24
```

Se aplicaron las reglas dentro de las secciones de acceso necesarias (`<Location />`, `<Location /admin>` y las secciones administrativas correspondientes), conservando los requisitos de autenticación de CUPS para las operaciones administrativas.

> **Importante:** no se debe eliminar `Require user @SYSTEM` de las secciones administrativas para permitir el acceso remoto. La autorización de red y la autenticación de usuario cumplen funciones distintas.

### 3.3. Reinicio y verificación

Se reinició el servicio:

```bash
sudo systemctl restart cups
sudo systemctl enable cups
sudo systemctl status cups
```

Se verificó que el puerto estuviera escuchando:

```bash
sudo ss -ltnp | grep ':631'
```

La interfaz web se consultó desde un equipo de la red de laboratorio mediante:

```text
http://192.168.18.87:631
```

Durante las pruebas el navegador también mostró la advertencia habitual de certificado al acceder por HTTPS con un certificado no reconocido. La advertencia no equivale por sí sola a un fallo del servicio.

### 3.4. Acceso administrativo

Para administrar impresoras se ingresó a la pestaña **Administración** de la interfaz web de CUPS. El acceso a las funciones administrativas requiere un usuario autorizado del sistema y los permisos correspondientes.

Las evidencias de instalación, configuración, acceso y administración se encuentran en `capturas/cups/`.

---

## 4. Servicio CUPS-PDF

**Objetivo:** probar el procesamiento de trabajos de impresión y generar archivos PDF sin conectar una impresora física.

### 4.1. Instalación

Se actualizó el sistema e instaló el controlador de impresión PDF:

```bash
sudo apt update
sudo apt install printer-driver-cups-pdf -y
```

### 4.2. Verificación de la cola

Se consultó el estado de las impresoras y colas:

```bash
lpstat -t
```

En la salida se identificó la cola virtual `PDF` asociada al dispositivo `cups-pdf:/`.

### 4.3. Generación de un trabajo de prueba

Se creó un archivo de texto y se envió a la cola PDF:

```bash
printf 'Prueba de impresion CUPS\nServidor: servidontpcups\nServicio: CUPS-PDF\n' > ~/prueba-cups.txt
lp -d PDF ~/prueba-cups.txt
```

El comando devolvió un identificador de trabajo, lo que confirmó que CUPS recibió la solicitud.

### 4.4. Comprobación del resultado

Se consultaron los trabajos completados y el estado de la cola:

```bash
lpstat -W completed -o
lpstat -p PDF -l
```

También se revisó el directorio de salida:

```bash
ls -lh ~/PDF/
```

Durante la prueba se generó el archivo:

```text
prueba-cups-job_1.pdf
```

**Resultado:** el trabajo fue procesado por la cola virtual PDF y se generó un archivo PDF en el directorio de salida. Esta prueba valida el flujo de impresión virtual; no demuestra la impresión física en un dispositivo.

---

## 5. Parámetros técnicos

| Servicio | Dirección / recurso | Puerto | Protocolo | Uso |
|---|---|---:|---|---|
| Chrony / NTP | `192.168.18.87` | 123 | UDP | Sincronización horaria. |
| CUPS | `192.168.18.87` | 631 | TCP | Interfaz web y trabajos de impresión. |
| CUPS-PDF | Cola `PDF` | — | CUPS | Conversión de trabajos a archivos PDF. |

## 6. Resultados

La implementación permitió configurar en el servidor de laboratorio los servicios Chrony y CUPS. Chrony quedó preparado para ofrecer sincronización horaria a los equipos autorizados de la subred utilizada. CUPS permitió acceder a la interfaz web y administrar el servicio de impresión. Finalmente, CUPS-PDF permitió enviar un documento de prueba a la cola virtual y comprobar la generación de un archivo PDF.

Estos resultados corresponden al entorno académico configurado. Una eventual instalación en Bavaria requeriría validar previamente sus necesidades, políticas, direccionamiento y controles de seguridad.

## 7. Archivos y evidencias del repositorio

- `codigo/chrony.conf`: configuración de Chrony utilizada como referencia del proyecto.
- `codigo/cupsd.conf`: configuración de CUPS documentada para el laboratorio.
- `codigo/cups-pdf.conf`: archivo relacionado con la configuración de CUPS-PDF, si se conserva en el repositorio.
- `capturas/ntp/`: evidencias de configuración y verificación de Chrony.
- `capturas/cups/`: evidencias de instalación, acceso y pruebas de CUPS.
