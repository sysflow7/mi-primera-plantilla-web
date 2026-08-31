# SIDEN — Plantilla Maestra v1.2 SEO Local

Esta rama es la versión de trabajo de la plantilla maestra de SIDEN para sitios web de pequeños negocios con base técnica para SEO local.

## Qué incluye v1.2

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
- Configuración `indexable` activada por defecto para una instancia publicable.

## Regla de operación

La plantilla maestra contiene el motor reutilizable. Los datos reales, imágenes y configuración de cada cliente viven en una instancia independiente.

## Configuración de atención local

`modeloAtencion` acepta conceptualmente:

- `local`: negocio con ubicación física.
- `areaServicio`: negocio que presta servicios en zonas determinadas y no publica dirección física.
- `ambos`: tiene ubicación física y además atiende una zona de servicio.

`areasServicio` puede contener nombres de zonas, por ejemplo:

```json
["San Salvador", "Santa Tecla", "Antiguo Cuscatlán"]
```

## Importante

La plantilla proporciona la base técnica del sitio web para SEO local. La optimización de Google Business Profile, Search Console, indexación, contenido específico del cliente, reseñas y seguimiento de resultados forman parte del procedimiento de servicio de SIDEN y no se automatizan dentro de esta plantilla.
