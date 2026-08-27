# SIDEN Template v1.1

Plantilla maestra de SIDEN para crear sitios web de pequeños negocios.

## Principio de uso

Esta rama contiene el motor y estructura base de SIDEN. La información, imágenes y datos reales de cada negocio deben vivir en una instancia independiente del cliente.

## Identidad de instancia

Cada instancia puede identificarse mediante `config.json`:

- `siden.instanceId`: identificador único del cliente.
- `siden.template`: versión de la plantilla SIDEN utilizada.
- `siden.version`: versión de la configuración/motor.

## Datos de contacto

La configuración contempla los principales canales de contacto del negocio:

- WhatsApp
- Teléfono
- Correo electrónico
- Facebook
- Instagram
- Ubicación / Google Maps

El correo electrónico se almacena en `config.json` mediante el campo `email` y se muestra como enlace de correo en la sección de contacto cuando está configurado.

## Tipos soportados

- Comercio
- Profesional
- Restaurante

## Modos soportados

- Sitio de una página (`single`)
- Sitio multipágina (`multi`)

## Regla

No colocar datos reales de clientes en esta plantilla maestra.
