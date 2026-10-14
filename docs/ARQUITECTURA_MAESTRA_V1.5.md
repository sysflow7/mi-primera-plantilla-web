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

### Regla de aislamiento de instancias

1. Resolver primero cualquier cambio en el `config.json` de la instancia.
2. Las imágenes y los recursos de una instancia deben residir en `sites/<instanceId>/images/`; el Worker los resuelve a través de `/images/*` para la instancia activa.
3. El CSS específico debe residir en la carpeta de la instancia y exponerse mediante `/custom.css`; el Worker valida la ruta y evita segmentos `..`.
4. No editar `index.html`, `js/` o `css/` compartidos para satisfacer una solicitud exclusiva de un cliente. Si hace falta una capacidad nueva, implementarla de forma genérica y configurable, con revisión de impacto y pruebas de regresión.
5. Las rutas directas `/sites/*` no se exponen al navegador. El Worker carga la configuración usando el `instanceId` resuelto desde el host/registro.
6. Una rama de prueba debe usar Preview y sus alias temporales deben permanecer fuera de la rama de producción. Antes de fusionar, probar la instancia afectada y las familias/instancias que consumen el motor compartido.

El aislamiento de recursos está respaldado por la resolución del Worker y la estructura de archivos. La ausencia de impacto visual en todas las instancias no se considera certificada solo por inspeccionar el código: requiere pruebas de regresión representativas después de cada cambio compartido.

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

La plantilla distingue dos usos de imagen en el Hero:

- `heroImagenFondo`: archivo utilizado como imagen de fondo del Hero. Si no se define, el motor puede recurrir a `heroImagen` como valor alternativo de fondo.
- `heroImagenVisual`: archivo que se muestra como imagen visual del negocio dentro del Hero.

Para mostrar la imagen visual, la instancia debe configurar `mostrarHeroImagen: true` y definir `heroImagenVisual` en su `config.json`. Si `mostrarHeroImagen` no existe o es `false`, la imagen visual debe permanecer oculta, aunque haya un archivo configurado. Las reglas CSS de la familia corporativa deben respetar el atributo HTML `hidden` y no forzar la visualización de ese elemento.

La corrección propuesta para este caso usa el selector `#hero-imagen-negocio:not([hidden])` en la regla CSS corporativa. La validación manual en Preview confirmó ambos estados en la instancia de prueba: imagen visible con la opción activada y oculta con la opción desactivada. La corrección está en el PR #53 y no se considera publicada hasta que se apruebe, fusione y despliegue.

## Familias de plantilla

La propiedad `siden.templateFamily` identifica el comportamiento de la plantilla. No debe confundirse con `estadoComercial`, que distingue una demo de un sitio de cliente.

### `commercial`

- Usa el motor compartido `index.html`, `js/script.js` y los estilos compartidos.
- Puede mostrar los planes SIDeN y las preguntas frecuentes de SIDeN según la configuración.
- Es la familia usada por la instancia principal `corporativo` en `sidenred.com`.

### `corporate`

- Usa el motor compartido, con presentación y estilos corporativos.
- Una instancia con `estadoComercial: "demo"` puede mostrar los planes SIDeN y las FAQ de demostración.
- Un sitio de cliente no debe mostrar los planes SIDeN; sus FAQ solo deben mostrarse cuando estén activadas y tengan preguntas/respuestas válidas.
- La familia puede recibir `custom.css` de la instancia, sin cambiar los estilos de las demás.

### `mini`

- Usa una implementación separada: `/mini/index.html`, `/mini/script.js` y `/mini/style.css`.
- Su esquema de configuración tiene estructura propia (por ejemplo, `hero`, `productosServicios`, `contacto`, `apariencia` e `identidad`). No se debe asumir que todas las propiedades del esquema corporativo aplican a MINI.
- El Worker selecciona `/mini/index.html` cuando `templateFamily === "mini"`.

### Reglas de separación

- `templateFamily` determina la familia funcional/visual.
- `estadoComercial` determina el estado de demostración comercial; no sustituye a `templateFamily`.
- `modoSitio` (`single` o `multi`) determina si la instancia funciona como página única o multipágina; es independiente de la familia.
- Las correcciones a un archivo compartido deben probar al menos la familia directamente afectada y las otras familias que comparten ese archivo. MINI debe probarse con sus archivos propios cuando el cambio le afecte.
- La inspección del código confirma que estas condiciones están implementadas; la certificación visual completa de todas las combinaciones requiere ejecutar las pruebas de regresión descritas en el informe de auditoría.

## SIDeN WEB multipágina

La modalidad multipágina se configura por instancia con `modoSitio: "multi"` y un arreglo `paginas`. El modo `single` conserva el comportamiento de página única.

Cada objeto de `paginas` debe declarar como mínimo una ruta interna absoluta, única y válida, además del nombre/contenido correspondiente. Se pueden configurar campos de página como `nombre`, `ruta`, `h1`, `slogan`, `descripcion`, `tituloSEO` y `descripcionSEO`. Las propiedades de página complementan/sobrescriben los datos generales para esa ruta; las etiquetas y textos se combinan con los valores globales.

### Comportamiento implementado

- El Worker acepta la ruta raíz y las rutas declaradas en `paginas`; para las rutas no declaradas no genera una página multipágina.
- Se validan rutas internas para impedir rutas vacías, rutas que empiezan por `//`, barras invertidas, saltos de línea y destinos con origen distinto.
- La navegación multipágina se construye a partir del arreglo `paginas`; el enlace del logotipo lleva a la raíz del sitio.
- En una página interna se oculta el Hero principal y se presenta una cabecera interna con nombre y descripción de la página.
- El Worker selecciona metadatos SEO por página cuando están definidos y genera un canonical para la ruta actual.
- El sitemap incluye la raíz y las rutas multipágina válidas sin duplicados.
- En Preview, los enlaces de navegación y los recursos compartidos propagan el parámetro `site` para que las solicitudes sigan resolviendo la instancia de prueba.
- Las imágenes y el CSS personalizado siguen resolviéndose dentro de la instancia; la modalidad multipágina no debe mezclar recursos de clientes.

### Condiciones de aceptación antes de producción

Para certificar una nueva instancia multipágina, probar en Preview, al menos:

1. La raíz carga correctamente y el menú contiene las páginas declaradas.
2. Cada enlace lleva a su ruta y presenta el contenido de esa página, no el de otra.
3. El logotipo regresa a la raíz.
4. Una ruta no declarada no muestra accidentalmente una página válida.
5. Títulos, descripción, H1 y canonical cambian según la página.
6. `sitemap.xml` contiene la raíz y las rutas declaradas; `robots.txt` respeta `indexable`.
7. Las imágenes, enlaces de WhatsApp y CSS personalizado funcionan en todas las páginas.
8. En Preview, la navegación no pierde el contexto `?site=<instanceId>`.
9. Probar escritorio y móvil, y revisar consola/solicitudes fallidas.

La inspección de la implementación confirma que el soporte multipágina existe en el Worker y en `js/script.js`. En la revisión actual, las configuraciones de las instancias consultadas (SIDeN corporativo, FISIOKINESV y Dr. Carlos Leopoldo Reyes) están en `modoSitio: "single"`; por tanto, la auditoría de código no equivale a una prueba de extremo a extremo con una instancia multipágina real. Antes de certificar el plan Profesional de Dr. Carlos Reyes, esta lista deberá ejecutarse en su Preview multipágina.

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

## Registro Maestro y análisis de impacto de instancias (regla obligatoria)

Antes de modificar cualquier dependencia compartida, consultar el **Registro Maestro de Instancias SIDeN** y seguir el procedimiento definido en `docs/arquitectura/REGLA_OBLIGATORIA_FICHAS_INSTANCIAS.md`.

El Registro Maestro resume instancias, dependencias e historial de cambios. Se consultan únicamente las fichas detalladas pertinentes según el análisis de impacto, pero siempre se buscan consumidores en el código real y se ejecutan pruebas de regresión. Un campo vacío o una ficha ausente nunca prueba que una instancia no será afectada.

Las instancias con personalización Nivel 2 o Nivel 3 requieren ficha detallada antes de aprobar/publicar. Al cerrar cada cambio se actualizan el Registro Maestro, las dependencias y las fichas afectadas. Los datos no verificados deben permanecer marcados como pendientes.

**Estado del registro:** el archivo Excel de trabajo inicial se ha entregado por separado y requiere revisión/reconciliación con la rama y el commit que se auditen. No tratar el borrador como certificación runtime ni asumir que está versionado en este repositorio hasta que se incorpore formalmente.
