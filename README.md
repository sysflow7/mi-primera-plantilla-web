# SIDEN — Plantilla Maestra v1.2 SEO Local

Esta es la plantilla maestra de SIDEN para crear sitios web de pequeños negocios, con base técnica preparada para SEO local.

## Arquitectura

- Esta rama (`siden-template-v1.2-seo-local`) es la versión de trabajo de la plantilla maestra de SIDEN v1.2.
- Los datos reales, imágenes y configuraciones de cada cliente deben vivir en una instancia independiente.
- No colocar datos reales de clientes en esta rama.
- SIDEN es el sitio/servicio corporativo. La plantilla maestra es el motor reutilizable.
- Cada cliente se publica como una instancia independiente; inicialmente bajo `cliente.sidenred.com`. Un dominio propio del cliente puede conectarse posteriormente sin reconstruir el sitio.

## SEO local incluido

- Title y meta description configurables por negocio/página.
- Canonical dinámico.
- robots.txt dinámico.
- sitemap.xml dinámico.
- JSON-LD para LocalBusiness y subtipos soportados.
- Nombre, teléfono, correo, dirección, ciudad, país, mapa y redes sociales en los datos estructurados cuando corresponda.
- Coordenadas geográficas para negocios con ubicación física.
- Horarios estructurados.
- Soporte para negocio con ubicación física, área de servicio o ambos mediante `modeloAtencion` y `areasServicio`.
- Contenido SEO esencial renderizado desde el Worker: H1, descripción, ciudad, dirección y teléfono.
- ALT personalizados opcionales para la galería mediante `galeriaAlt`.

## Indexación — regla obligatoria para clientes

La **plantilla maestra siempre debe permanecer con `indexable: false`**. Esto evita que la plantilla, que contiene datos ficticios como “Mi Negocio”, pueda ser indexada accidentalmente por Google.

Cuando se crea una nueva instancia para un cliente, este campo debe revisarse y cambiarse a:

```json
"indexable": true
```

Esto debe hacerse **después de sustituir los datos ficticios por los datos reales del cliente y antes de poner el sitio en producción/indexación**.

### Checklist de cada nueva instancia

1. Copiar/crear la instancia a partir de la plantilla maestra.
2. Cambiar `instanceId` por el identificador del cliente.
3. Sustituir todos los datos ficticios por los datos reales del cliente.
4. Configurar las imágenes reales del cliente.
5. Revisar `modeloAtencion`, `areasServicio`, horarios y demás configuración SEO.
6. Verificar que `indexable` esté en `true` para la instancia del cliente.
7. Probar `robots.txt`, `sitemap.xml`, canonical, meta robots y JSON-LD antes de publicar.

**Importante:** no se debe cambiar `indexable` a `true` en la plantilla maestra. El cambio a `true` se realiza únicamente en la instancia independiente del cliente.

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

El correo electrónico se almacena en `config.json` mediante el campo `email` y se muestra como enlace cuando está configurado.

## Tipos y modos soportados

Tipos comerciales soportados por el motor:

- Comercio
- HardwareStore
- Profesional
- Abogado
- Médico
- Contador
- Arquitecto
- Electricista
- Fotógrafo
- Consultor
- Psicólogo
- Dentista
- Restaurante

Modos de sitio:

- Sitio de una página (`single`)
- Sitio multipágina (`multi`)

## Atención local

`modeloAtencion` acepta:

- `local`: negocio con ubicación física.
- `areaServicio`: negocio que presta servicios en zonas determinadas y no publica dirección física.
- `ambos`: tiene ubicación física y además atiende una zona de servicio.

`areasServicio` puede contener nombres de zonas, por ejemplo:

```json
["San Salvador", "Santa Tecla", "Antiguo Cuscatlán"]
```

## Galería y ALT

La galería conserva su formato de archivos y permite definir textos ALT opcionales por posición:

```json
"galeriaAlt": [
  "Fachada del negocio en San Salvador",
  "Área de atención al cliente",
  "Productos destacados del negocio"
]
```

Si no se proporcionan ALT personalizados, el motor conserva un ALT genérico basado en el nombre del negocio.

## Regla de operación

La plantilla maestra contiene el motor reutilizable. Los datos reales, imágenes y configuración de cada cliente viven en una instancia independiente.

## Importante

La plantilla proporciona la base técnica del sitio web para SEO local. La optimización de Google Business Profile, Search Console, indexación, contenido específico del cliente, reseñas y seguimiento de resultados forman parte del procedimiento del servicio SIDEN y no se automatizan dentro de esta plantilla.
