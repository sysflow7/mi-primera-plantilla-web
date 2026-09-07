# SIDEN — Plantilla Maestra v1.4 Multi-Sitio + SEO Local

Esta es la plantilla maestra reutilizable de SIDeN para producir sitios independientes de pequeños negocios, preparada para una arquitectura multi-sitio sobre un mismo Worker de Cloudflare.

## Arquitectura

- `sidenred.com` → sitio corporativo SIDeN.
- `cliente1.sidenred.com` → instancia independiente del Cliente 1.
- `cliente2.sidenred.com` → instancia independiente del Cliente 2.
- Un dominio propio (`www.cliente.com`) podrá asociarse posteriormente mediante el registro de dominios/instancias.
- Cada instancia tiene su propio `instanceId`, contenido, SEO, sitemap, robots.txt, canonical, Schema, WhatsApp e identidad.
- El Worker identifica la instancia por el `Host`; no se debe depender de configuración manual para cada página.

## Estructura de instancias

La plantilla mantiene el sitio corporativo en la raíz y las instancias de clientes bajo:

```text
/
├── config.json                  # SIDeN corporativo
├── index.html                   # plantilla compartida
├── worker.js                    # router multi-sitio
├── js/
├── css/
└── sites/
    ├── cliente-demo/
    │   └── config.json
    ├── cliente1/
    │   ├── config.json
    │   └── images/
    └── cliente2/
        ├── config.json
        └── images/
```

Las imágenes de una instancia se resuelven mediante el Worker en `/sites/{instanceId}/images/`, evitando que un sitio utilice accidentalmente recursos de otra instancia.

## Flujo de creación de un cliente

```text
Cliente
  ↓
Crear instancia
  ↓
Asignar instanceId / subdominio
  ↓
Crear sites/{instanceId}/config.json
  ↓
Agregar imágenes de la instancia
  ↓
Configurar SEO y contenido
  ↓
indexable: true
  ↓
Publicar
```

No se deben colocar datos reales de clientes en la configuración corporativa ni en la plantilla maestra.

## Identidad de instancia

Cada configuración debe contener:

- `siden.instanceId`: identificador único y estable.
- `siden.template`: versión de la plantilla utilizada.
- `siden.version`: versión de la configuración/motor.
- `siden.architecture`: `multisite`.
- `siden.domainMode`: modalidad de publicación.

El Worker añade en tiempo de ejecución `host`, `canonicalOrigin` y `assetPrefix` para que el navegador conozca únicamente el contexto de la instancia actual.

## Dominios y resolución

### Subdominio SIDeN

Un host como `cliente1.sidenred.com` se resuelve automáticamente a:

```text
instanceId = cliente1
config     = /sites/cliente1/config.json
images     = /sites/cliente1/images/*
```

No requiere una entrada manual por cliente en el Worker.

### Dominio propio

El Worker contempla un binding opcional `SIDEN_REGISTRY` (KV). Cuando se configure, una clave con el hostname del cliente puede devolver su `instanceId`:

```text
www.cliente.com → cliente1
```

Esto permite conectar posteriormente dominios propios sin reconstruir el sitio ni modificar la plantilla.

## SEO por instancia

Cada host genera dinámicamente:

- `<title>` propio.
- Meta description propia.
- Meta robots propia.
- Canonical propio usando el host actual.
- `robots.txt` propio.
- `sitemap.xml` propio.
- JSON-LD / Schema propio.
- H1 propio.
- `areaServed` / ubicación propia cuando corresponda.
- URL de imágenes propia de la instancia.

Nunca se debe generar para un cliente:

```text
canonical → https://sidenred.com/...
sitemap   → https://sidenred.com/sitemap.xml
Schema    → entidad corporativa de SIDeN
```

El sitio debe verse ante los motores de búsqueda como la entidad correspondiente al host solicitado.

## Search Console

La plantilla no automatiza la creación ni verificación de propiedades de Google Search Console. La arquitectura deja preparado el aislamiento por URL para que cada cliente pueda utilizar su propia propiedad de prefijo de URL, mientras SIDeN conserva la administración de su ecosistema cuando corresponda.

## SEO local incluido

- Title y meta description configurables por negocio/página.
- Canonical dinámico.
- robots.txt dinámico.
- sitemap.xml dinámico.
- JSON-LD para LocalBusiness y subtipos soportados.
- Nombre, teléfono, correo, dirección, ciudad, país, mapa y redes sociales cuando corresponda.
- Coordenadas geográficas para negocios con ubicación física.
- Horarios estructurados.
- Soporte para `local`, `areaServicio` y `ambos` mediante `modeloAtencion` y `areasServicio`.
- Contenido SEO esencial renderizado desde el Worker.
- ALT personalizados opcionales para la galería mediante `galeriaAlt`.

## Indexación — regla obligatoria

La **plantilla maestra y la instancia de demostración permanecen con `indexable: false`**.

Cuando se crea una instancia real para un cliente:

1. Cambiar `instanceId`.
2. Sustituir datos ficticios por datos reales.
3. Agregar imágenes reales.
4. Revisar SEO local, horarios, ubicación y áreas de servicio.
5. Verificar canonical, robots, sitemap y Schema en el host del cliente.
6. Cambiar `indexable` a `true` antes de solicitar/indexar el sitio.

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

- Sitio de una página (`single`).
- Sitio multipágina (`multi`).

## Regla de operación

La plantilla maestra es el motor reutilizable. Cada cliente debe ser una instancia aislada por `instanceId`, con su propia configuración y recursos. El contenido corporativo y los datos de clientes no deben mezclarse.

## Importante

La plantilla proporciona la base técnica para publicar sitios multi-sitio con SEO local. La configuración de DNS/Cloudflare, Google Business Profile, Search Console, indexación, contenido específico, reseñas y seguimiento de resultados forman parte del procedimiento operativo de SIDeN y no se consideran automatizados por esta plantilla.
