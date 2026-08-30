# SIDEN — Plantilla Maestra v1.1

Esta es la plantilla maestra de SIDEN para crear sitios web de pequeños negocios.

## Arquitectura

- Esta rama (`siden-master-v1.1`) es la referencia maestra de SIDEN v1.1.
- Los datos reales, imágenes y configuraciones de cada cliente deben vivir en una instancia independiente.
- No colocar datos reales de clientes en esta rama.

## Identidad de instancia

Cada instancia puede identificarse mediante `config.json`:

- `siden.instanceId`: identificador único del cliente.
- `siden.template`: versión de la plantilla SIDEN utilizada.
- `siden.version`: versión de la configuración/motor.

## Datos de contacto

La configuración contempla:

- WhatsApp
- Teléfono
- Correo electrónico
- Facebook
- Instagram
- Ubicación / Google Maps

El correo electrónico se almacena en `config.json` mediante el campo `email` y se muestra como enlace de correo cuando está configurado.

## Tipos soportados

- Comercio
- Profesional
- Restaurante

## Modos soportados

- Sitio de una página (`single`)
- Sitio multipágina (`multi`)

## Regla de operación

SIDEN es el sitio/servicio corporativo. La plantilla maestra es el motor reutilizable. Cada cliente se publica como una instancia independiente, inicialmente bajo `cliente.sidenred.com`; un dominio propio del cliente puede conectarse posteriormente sin reconstruir el sitio.
