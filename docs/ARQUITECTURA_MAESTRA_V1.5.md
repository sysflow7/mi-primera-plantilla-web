# SIDeN — Arquitectura Maestra v1.5

## Objetivo

Evitar que los cambios específicos de un cliente modifiquen o reemplacen accidentalmente la plantilla maestra o el contenido de otros clientes.

## Principio

**Motor compartido + instancias aisladas.**

El motor compartido define estructura, módulos, comportamiento y estilos base. Cada instancia mantiene sus datos, imágenes y personalizaciones visuales dentro de `sites/<instanceId>/`.

## Archivos compartidos

- `index.html`
- `worker.js`
- `js/`
- `css/`
- `wrangler.jsonc`

Estos archivos solo se modifican cuando la mejora es general para toda la plataforma.

## Archivos por instancia

Cada cliente debe disponer de:

    sites/<instanceId>/
    ├── config.json
    ├── custom.css        (opcional)
    └── images/

`config.json` controla contenido, módulos, SEO, contacto, ubicación, galería, servicios y demás datos del negocio.

`custom.css` permite resolver diferencias visuales particulares sin modificar el CSS compartido.

### Orden configurable de secciones

La plantilla maestra admite opcionalmente la propiedad `ordenSecciones` en el `config.json` de una instancia.

Ejemplo:

    "ordenSecciones": [
      "nosotros",
      "beneficios",
      "servicios",
      "galeria",
      "ubicacion",
      "soluciones",
      "faq",
      "contacto"
    ]

Cuando una instancia define esta propiedad, el motor reorganiza las secciones existentes de `main` según ese arreglo. Si la propiedad no existe, la plantilla conserva su orden normal.

Esta capacidad es genérica y no contiene condiciones específicas de ningún cliente. Una instancia puede utilizarla cuando necesite una secuencia distinta sin modificar nuevamente `index.html` ni introducir lógica del tipo "si es cliente X".

### Imagen visual del Hero

La plantilla incluye un espacio visual opcional para mostrar una imagen de negocio en el Hero. La instancia debe activar explícitamente `mostrarHeroImagen: true` junto con `heroImagen` en su `config.json`. Si la propiedad no existe o es `false`, el espacio visual permanece oculto y la plantilla conserva su comportamiento normal.

## Instancia corporativa

SIDeN corporativo también se comporta como una instancia:

    sidenred.com
       ↓
    instanceId = corporativo
       ↓
    /sites/corporativo/config.json

Esto elimina la excepción anterior del `config.json` raíz.

## Configuración raíz

`/config.json` queda únicamente como configuración de demostración de la plantilla maestra. Está marcada como `indexable: false` y no representa a un cliente real.

## Resolución del Worker

El Worker determina el `instanceId` a partir del host y carga exclusivamente:

    /sites/<instanceId>/config.json

Las imágenes solicitadas mediante `/images/*` se resuelven internamente contra la misma instancia.

Las hojas `custom.css` se sirven mediante `/custom.css` y el Worker las resuelve contra la instancia activa.

Las rutas internas `/sites/*` no se sirven directamente al navegador.

## Regla de desarrollo

Si un cliente solicita un cambio:

1. Resolverlo primero mediante `config.json`.
2. Si es visual, utilizar `custom.css`.
3. Si necesita imágenes, agregarlas a `sites/<instanceId>/images/`.
4. Si la capacidad no existe, agregarla al motor compartido de forma genérica y configurable.
5. Nunca copiar el HTML/CSS/JS de un cliente sobre los archivos raíz.

### Validación previa a producción

Toda instancia nueva o reincorporada debe validarse visualmente en el Preview de su rama antes de realizar el merge hacia la rama de producción. La configuración de producción no debe modificarse para realizar esta prueba.

## Resultado

Un cambio de Benítez Gutiérrez, FerreHogar o cualquier cliente futuro no debe alterar el motor ni el contenido de otra instancia.

Esta separación permite que la plantilla maestra evolucione sin perder las personalizaciones de los clientes ya publicados.


## Google Analytics 4

GA4 se incorpora como capacidad transversal, opcional y configurable por instancia. El ID de medición no se incrusta en `index.html`, `worker.js` ni en lógica específica del cliente.

La configuración reside en cada `sites/<instanceId>/config.json` mediante:

    "analytics": {
      "ga4": {
        "enabled": false,
        "measurementId": ""
      }
    }

Cuando `enabled` es verdadero y `measurementId` tiene un formato válido, el motor compartido carga la etiqueta de Google y habilita la medición. Si no existe configuración válida, la instancia continúa funcionando sin Analytics.

Cada cliente debe utilizar su propio measurementId cuando se requiera aislamiento de estadísticas por cliente. Las páginas SIDeN MINI utilizan el mismo principio y el mismo esquema de configuración.

### Eventos SIDeN

- `whatsapp_click`: clic en un enlace de WhatsApp.
- `phone_click`: clic en un enlace telefónico.
- `contact_save`: Guardar contacto en SIDeN WEB.
- `share`: Compartir negocio.
- `directions_click`: Cómo llegar.

GA4 también puede recopilar `page_view` y otras mediciones automáticas/mejoradas configuradas en el flujo web.

### Regla de Preview

Cuando el sitio se prueba mediante Cloudflare Preview con `?site=<instanceId>`, GA4 no debe enviar datos a la propiedad de producción. Esta condición es obligatoria para evitar contaminar las estadísticas reales.

### Seguridad y privacidad

Los eventos solo deben transportar parámetros técnicos necesarios, como `instance_id`, `template_family` y `button_id/content_type`. No se debe enviar información personal identificable mediante GA4.

La integración de GA4 debe mantenerse genérica, configurable, retrocompatible y sometida al mismo proceso de Preview, validación y PR que cualquier cambio del motor compartido.
