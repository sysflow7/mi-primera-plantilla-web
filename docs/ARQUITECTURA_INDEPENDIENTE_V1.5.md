# SIDeN — Arquitectura de Proyecto Independiente V1.5

**Estado:** documento operativo para la rama de certificación `prueba-aislamiento-contenido-v1.5`.  
**Fecha de revisión:** 16 de octubre de 2026.  
**Producción:** no modificada por esta auditoría.

## 1. Modelo vigente

SIDeN V1.5 en modo independiente utiliza **un proyecto/repo y un Worker por sitio de cliente**. Cada proyecto contiene su propia configuración en la raíz. No utiliza el registro central de instancias ni resuelve el contenido del cliente desde `sites/<instanceId>/config.json`.

Estructura principal del proyecto:

```text
/
├── config.json
├── index.html
├── worker.js
├── wrangler.jsonc
├── .assetsignore
├── css/
├── js/
└── images/
```

Los archivos compartidos dentro de ese proyecto constituyen el motor de esa instancia desplegada. Las mejoras generales de la plantilla deben probarse antes de propagarlas a proyectos de clientes.

## 2. Responsabilidades de los componentes

- **`config.json`:** identidad, contenido, módulos, navegación, configuración SEO, contacto, ubicación, analítica y opciones visuales del sitio.
- **`index.html`:** estructura HTML compartida de la instancia; contiene marcadores que el Worker completa antes de entregar la página.
- **`js/script.js`:** comportamiento configurable del cliente, módulos, navegación, banda informativa, FAQ y eventos analíticos.
- **`worker.js`:** carga la configuración raíz, gestiona las rutas multipágina declaradas, inyecta metadatos y configuración runtime, aplica aislamiento de contenido y sirve endpoints técnicos.
- **`wrangler.jsonc`:** identifica el Worker y el directorio de assets que se publica.
- **`.assetsignore`:** excluye archivos internos y contenido heredado que no debe publicarse.

## 3. Aislamiento y publicación de recursos

1. Cada cliente debe desplegarse en su propio proyecto y Worker.
2. Las imágenes de esta arquitectura se sirven desde `/images/*` y deben pertenecer al proyecto actual.
3. No copiar contenido, imágenes, configuraciones o código de otros clientes al proyecto sin autorización y revisión.
4. No publicar `worker.js`, `wrangler.jsonc`, documentación Markdown, `docs/**`, `sites/**` ni `mini/**` como recursos del sitio.
5. El Worker rechaza determinadas rutas internas, incluidas `/sites/*`, `/mini/*`, `/docs/*`, `/.git/*`, `/.wrangler/*`, archivos Markdown y archivos internos seleccionados.
6. La exclusión de assets y el filtro de rutas son controles defensivos; no equivalen a una auditoría de penetración.
7. No almacenar secretos en `config.json`: el endpoint `/config.json` es público y el motor necesita que el navegador pueda leer la configuración.

## 4. Familias y estado comercial

- `siden.templateFamily` identifica la familia funcional/visual, por ejemplo `commercial` o `corporate`.
- `estadoComercial` diferencia una demo de un sitio de cliente.
- `modoSitio` controla si el sitio es `single` o `multi`; es independiente de la familia.
- La familia `mini` tiene archivos y esquema propios. No asumir que las opciones corporativas se aplican automáticamente a MINI.
- Los clientes corporativos no deben mostrar planes promocionales de SIDeN. Las FAQ del cliente solo deben mostrarse cuando estén habilitadas, tengan preguntas válidas y, en multipágina, el módulo `faq` esté incluido en la página actual.

## 5. Sitio multipágina

La modalidad multipágina se habilita con `modoSitio: "multi"` y un arreglo `paginas` en `config.json`. Cada ruta debe ser interna, única y explícita.

El Worker valida antes de resolver las rutas que `paginas` sea un arreglo no vacío, que cada elemento tenga una ruta de texto local, que exista la raíz `/`, que las rutas no contengan segmentos `.` o `..`, espacios, query/hash ni barras invertidas, y que no haya rutas duplicadas después de normalizarlas. Si la configuración multipágina falla estas validaciones, devuelve HTTP 500 con `Configuración multipágina inválida.`. Esta validación básica no sustituye una revisión completa del contenido de cada página.

El Worker debe:
- Entregar el HTML de la página raíz y de las rutas declaradas.
- Seleccionar título, descripción, H1 y canonical según la página cuando existan valores específicos.
- Generar sitemap sin rutas duplicadas.
- Devolver 404 para rutas no declaradas.
- Mantener recursos y configuración dentro del proyecto activo.

La configuración por página puede personalizar `nombre`, `ruta`, `h1`, `slogan`, `descripcion`, `tituloSEO`, `descripcionSEO`, `modulos`, `etiquetas` y `textos`.

## 6. Métodos HTTP y endpoints públicos

El Worker es de solo lectura y acepta únicamente solicitudes `GET`. Cualquier otro método, incluida una solicitud `HEAD`, devuelve HTTP 405, con `Allow: GET` y `Cache-Control: no-store`. Esta regla aplica antes de procesar la configuración, las rutas del sitio y los endpoints técnicos.

`/config.json` es un recurso público de lectura: no debe contener claves, contraseñas, tokens ni otros secretos. Los endpoints `/robots.txt` y `/sitemap.xml` también son públicos y deben responder únicamente a métodos de lectura.

## 7. SEO e indexación

- `indexable: false` produce `noindex, nofollow` en los metadatos entregados por el Worker y un sitemap válido sin URLs.
- `indexable: true` o la ausencia del campo conserva el sitemap con la raíz y las rutas multipágina declaradas.
- `robots.txt` incluye una referencia al sitemap. `Allow: /` permite rastreo, pero no obliga a indexar una página; la directiva `noindex` y el sitemap vacío son los controles pertinentes en este caso.
- Para publicar un cliente real, comprobar títulos, descripción, canonical, datos estructurados, sitemap y el valor de `indexable` en Preview.

## 8. Google Analytics 4

GA4 es opcional y se configura por instancia mediante `analytics.ga4.enabled` y `analytics.ga4.measurementId`. Cada cliente debe usar su propio Measurement ID cuando sus métricas deban permanecer separadas. El motor no debe enviar eventos de medición durante una sesión de Cloudflare Preview.

## 9. Regla de cambios compartidos

Antes de editar `index.html`, `worker.js`, `js/` o `css/`:

1. Determinar si la solicitud puede resolverse en `config.json`.
2. Si es exclusivamente visual, evaluar una personalización específica del proyecto.
3. Si requiere una capacidad nueva, diseñarla como opción genérica y configurable, no como condición codificada para un cliente.
4. Evaluar qué familias y sitios pueden verse afectados.
5. Probar en una rama/Worker de Preview separado de producción.
6. Ejecutar pruebas de regresión de rutas, módulos, SEO y vistas afectadas.
7. Actualizar la documentación después de validar los resultados.
8. No fusionar ni desplegar a producción sin autorización explícita.

## 10. Flujo de creación y certificación de una instancia

1. Crear el proyecto desde la plantilla aprobada.
2. Crear una rama de trabajo y un Worker de prueba.
3. Configurar la instancia en `config.json`.
4. Revisar que `.assetsignore` y `wrangler.jsonc` correspondan al proyecto.
5. Desplegar a Preview y probar las rutas y los recursos.
6. Validar contenido comercial, módulos, banda informativa, FAQ y enlaces de contacto.
7. Revisar SEO: metadatos, canonical, robots y sitemap.
8. Probar escritorio y móvil, además de la consola y las solicitudes fallidas.
9. Documentar los resultados y pendientes.
10. Publicar solo después de la aprobación del cliente y autorización del responsable.

## 11. Pruebas verificadas en la rama de certificación

Pruebas reportadas por el usuario en el Worker de Preview:

| Prueba | Resultado |
|---|---|
| Navegación entre `/`, `/perfil-profesional`, `/servicios` y `/contacto` | Correcta |
| Recarga de rutas declaradas | Correcta |
| Selección de módulos y ausencia de FAQ cuando la página no incluye `faq` | Correcta |
| Ruta no declarada `/esta-pagina-no-existe` | 404 |
| `robots.txt` | Contiene reglas y referencia al sitemap del host |
| `sitemap.xml` con `indexable: false` | XML válido, sin URLs |
| Solicitud HTTP `POST` a `/` | HTTP 405 confirmado por el usuario desde DevTools |
| ID duplicados en `index.html` | No detectados en la inspección estática |

## 12. Límites y pendientes

- La revisión es estática más las pruebas manuales indicadas; no es una auditoría de seguridad externa.
- La carga de imágenes de contenido real no se certifica en este proyecto porque no contiene archivos de imagen de cliente. Se verificó el comportamiento de productos sin imagen y se corrigieron los marcadores vacíos de logo, fondo y mapa.
- No se ha validado visualmente toda combinación de familia, módulo y configuración.
- La validación de rutas multipágina es defensiva y básica; no verifica todos los campos de contenido ni sustituye pruebas de aceptación.
- La certificación funcional base de V1.5 está cerrada para los escenarios expresamente probados. Cada proyecto real debe validarse en su propio Preview antes de publicarse.
- La reconciliación documental con el modelo independiente está recogida en esta guía, la arquitectura maestra y el procedimiento operativo V1.1. Los documentos históricos no deben tratarse como instrucciones operativas actuales.
- La rama de certificación no implica publicación en producción.


### Protección de GA4 en Preview (revisión estática 17-10-2026)

La lógica de `js/script.js` debe evitar el envío de eventos cuando la página se sirve desde una URL de prueba. Además del parámetro heredado `?site=`, la detección ahora considera los hosts `*.workers.dev`, `*.pages.dev`, `localhost` y `127.0.0.1`. Esto previene que un Worker de Preview con GA4 habilitado contamine las métricas del sitio de producción. La modificación está en el commit `4d845202005dcd0df0a4bee9513332c856fb7502` y requiere comprobarse en Preview antes de considerarla validada funcionalmente.


### Revisión estática complementaria — 17-10-2026

- Se revisaron las asignaciones `innerHTML` de `js/script.js`. Las tarjetas dinámicas inspeccionadas escapan los valores de contenido antes de interpolarlos en HTML; la lista de preguntas frecuentes usa `textContent`. Esta inspección no sustituye una prueba de seguridad completa.
- Los enlaces externos que usan `target="_blank"` en las zonas inspeccionadas incluyen `rel="noopener noreferrer"`.
- La política HTTP GET se aplica al inicio del Worker, antes de resolver configuración, páginas o endpoints técnicos. Los recursos estáticos se siguen delegando a `ASSETS` mediante las rutas normales.
- Se identificó y corrigió la detección insuficiente de Preview para GA4. La nueva condición cubre `workers.dev`, `pages.dev`, `localhost`, `127.0.0.1` y el parámetro heredado `?site=`. Commit de código: `4d845202005dcd0df0a4bee9513332c856fb7502`.
- La protección de GA4 se comprobó en Preview mediante DevTools Network: en la prueba con GA4 no configurado no se observaron solicitudes `gtag.js` ni `collect?v=2`. La comprobación de eventos reales con un Measurement ID válido queda pendiente de una instancia configurada para analítica.

### Validación de enlaces externos configurables — 17-10-2026

Se actualizó `js/script.js` para validar las URLs configurables de Facebook, Instagram, ubicación y catálogo: solo se aceptan URLs absolutas con protocolo HTTPS y host válido. Cuando el valor no cumple la validación, el enlace se oculta y se establece `#` como destino de reserva. Los enlaces externos visibles se configuran con `target="_blank"` y `rel="noopener noreferrer"`. Cambio guardado en el commit `d54be281002a718d040df0f31cb5886a39ea1b36`. La validación es estática; requiere comprobación funcional en Preview.


## Incidencia de prueba: producto sin imagen configurada

En la comprobación visual del 20-10-2026, el producto ficticio sin imagen mostraba un elemento de imagen roto y dejaba un espacio vacío. La causa confirmada en `js/script.js` era que se generaba una etiqueta `<img>` incluso cuando `producto.imagen` estaba vacío. Se corrigió para generar la etiqueta de imagen solo cuando existe una ruta configurada. Commit: `98a87f3df6ea3e440455c94b2bf06e3b13ca0b3a`. Confirmado por el usuario en Preview: la tarjeta ya no muestra una imagen rota.


## Resultado de comprobación funcional en Preview — 20-10-2026

El usuario confirmó en el Worker de pruebas `siden-prueba-cliente-multipagina-v15` que el botón «Ver catálogo completo» abre `https://example.com/`. El destino es ficticio y se usa únicamente para la prueba. También confirmó visualmente que el menú multipágina aparece, Facebook se muestra como enlace activo, Instagram con URL `javascript:` y ubicación con URL `http:` no se muestran como enlaces activos, y que la tarjeta de producto sin imagen ya no presenta una imagen rota tras el cambio de `js/script.js` (commit `98a87f3df6ea3e440455c94b2bf06e3b13ca0b3a`). El navegador mostró que GA4 no hizo solicitudes coincidentes con `gtag/js` ni `collect?v=2` durante la sesión de prueba. Estos resultados son comprobaciones funcionales puntuales en Preview; no constituyen una auditoría de seguridad exhaustiva ni certifican todos los dispositivos, contenidos o escenarios posibles. Producción no fue modificada.


## Estado actualizado de certificación — 20-10-2026

Las comprobaciones funcionales acordadas en Preview se consideran completadas según evidencia reportada por el usuario: navegación multipágina, recarga de rutas y 404, GET-only/POST 405, sitemap y robots, ausencia de solicitudes `gtag/js` y `collect?v=2` en la sesión revisada, rechazo de enlaces externos con `javascript:` y `http:`, enlace HTTPS de catálogo funcional con destino de prueba `example.com`, y tarjeta de producto sin fotografía sin imagen rota. La corrección de producto sin imagen fue publicada y verificada visualmente por el usuario. Código: `98a87f3df6ea3e440455c94b2bf06e3b13ca0b3a`. Registro funcional: `4d9eb41ad769419c1cd478fe75e8c0c153d4cc6c`.

**Estado de esta etapa:** comprobaciones funcionales acordadas cerradas en Preview. Esto no equivale a una auditoría de seguridad exhaustiva, pruebas automatizadas completas, ni validación en todos los dispositivos. La certificación documental V1.5 puede cerrarse para este alcance. Producción sigue sin cambios y no queda autorizada por este registro.

## 11. Revisión de módulos y aislamiento de contenido — 20 de octubre de 2026

Se identificaron y corrigieron en esta rama dos comportamientos de la plantilla:

1. **Módulos `proceso` e `identidad`:** ahora se consideran en la activación por `modulos`, se generan sus contenidos desde `config.json` y cuentan con destino/etiqueta de navegación. `proceso` requiere al menos un paso; `identidad` requiere texto o descripción.
2. **Secciones comerciales `proyectos`, `problema` y `solucion`:** ahora se ocultan explícitamente en `templateFamily: corporate` y se conservan en `templateFamily: commercial`. La ocultación establece tanto `hidden` como `display:none` para evitar que reglas de estilo puedan anular el atributo.

Se agregó el catálogo de referencia en `docs/CATALOGO_MODULOS_CONFIGURACION_V1.5.md`.

**Estado:** las pruebas funcionales acordadas en Preview están confirmadas por el usuario: rutas multipágina, 404, sitemap no indexable, método POST rechazado, enlaces externos inválidos, módulos `proceso`/`identidad`/`filosofia`, JSON-LD y favicon. El aislamiento comercial del sitio corporativo de cliente también está confirmado: los planes no aparecieron y la búsqueda del HTML no encontró las secciones comerciales. En la prueba de la familia `commercial`, el usuario confirmó que las FAQ aparecen tras incluir `faq` en los módulos generales y de inicio; falta que confirme la presentación visual de las secciones comerciales y los planes. Producción no se ha modificado ni desplegado.


## 12. Criterio editorial para módulos profesionales — 20 de octubre de 2026

Se establece la siguiente distinción para evitar secciones redundantes en webs de profesionales de salud, abogados y otros servicios:

- **Presentación (`presentacion`):** módulo principal para «Quién soy» o «Quiénes somos». Presenta al profesional, la organización, la especialidad y/o trayectoria.
- **Proceso (`proceso`):** módulo opcional que explica etapas reales de atención o prestación del servicio. El título debe adaptarse al sector (por ejemplo, «Etapas de tu tratamiento»). Si no añade valor, no se activa.
- **Filosofía (`filosofia`):** nuevo módulo opcional para valores, enfoque de atención o principios profesionales. Debe aportar contenido distinto de la presentación y solo se muestra si existe texto.
- **Identidad (`identidad`):** módulo existente conservado por compatibilidad. Su título y propósito pueden solaparse con la presentación, por lo que no se recomienda para nuevos sitios como segundo «Quiénes somos». Las configuraciones antiguas no se eliminan automáticamente.

La implementación de `filosofia` se añadió en `index.html` y `js/script.js` en esta rama de certificación. El usuario confirmó visualmente su aparición con el contenido de prueba en Preview. Producción no fue modificada.


## 13. Validación de URLs en datos estructurados — 20 de octubre de 2026

Durante la revisión estática se detectó que el JSON-LD aceptaba cualquier valor de `maps`, `facebook` e `instagram` que comenzara con `http`. Eso permitía incluir URLs HTTP o esquemas no seguros en los datos estructurados aunque la interfaz rechazara esos enlaces.

Se corrigió `worker.js` en la rama de certificación: los campos `hasMap` y `sameAs` solo incluyen URLs absolutas HTTPS con hostname válido; los valores inválidos se omiten. Commit: `c247d9618ddf0e8ff12285a5b91cb13d1848a3b6`.

**Estado:** confirmado por el usuario en Preview: `hasMap` omite la URL HTTP de ejemplo y `sameAs` solo contiene la URL HTTPS válida de Facebook; Instagram con `javascript:` queda excluido. No se ha modificado producción.


## 14. Limpieza de recursos visuales no configurados — 20 de octubre de 2026

En la captura de DevTools compartida durante la validación SEO se observaron solicitudes 404 a los marcadores `LOGO_IMAGE_URL` y `HERO_BACKGROUND_URL`. La configuración de prueba no incluye logo ni imagen de fondo; el HTML estaba entregando marcadores de plantilla como si fueran rutas reales.

Se corrigió en la rama de certificación:
- `worker.js` elimina los atributos `src` que contienen marcadores de logo cuando no existe logo configurado.
- `worker.js` elimina el estilo de fondo con marcador si no hay imagen configurada y deja que `script.js` configure el mapa solo cuando `mapEmbedUrl` pasa su validación.
- `js/script.js` oculta el logo del Hero cuando no está configurado y limpia los estilos de imagen de fondo cuando no hay archivo o cuando la carga falla.

Commits principales: `edfabbcea49e3877e96e64fb1111666ffcb91ab4`, `38091f0dde12d898889053631e17853f3cccc082`, `944081dd9e06da54e3548ec3915c5a6acdf458c7`, `574d75c050736c00e470c2841ca138d8e6aca4c9`.

**Estado:** confirmado por el usuario en Preview: desaparecieron los errores 404 de los marcadores de logo y fondo. La sintaxis de `worker.js`, `js/script.js`, `js/modules-v1.4.js` y JSON de configuración pasó la validación estática. Producción no fue modificada.


## 15. Favicon predeterminado cuando no hay logotipo — 20 de octubre de 2026

Se detectó en Preview que, al retirar el favicon basado en logotipo cuando no existe logo configurado, Chrome intentaba solicitar automáticamente `/favicon.ico` y recibía 404.

Se corrigió en la rama de certificación mediante un favicon SVG de respaldo integrado como URI de datos en el HTML entregado por `worker.js`. Cuando el cliente configura un logotipo, se conserva la URL de ese recurso como favicon; cuando no, se utiliza el icono predeterminado y se evita depender de un archivo `favicon.ico` inexistente.

Commit: `970994051a4db6f72770925ffab1fd766d70af42`.

**Estado:** confirmado por el usuario en Preview: desapareció el error `/favicon.ico 404`. La sintaxis de `worker.js` pasó la validación estática. Producción no fue modificada.


## 16. Estado consolidado de las comprobaciones — 20 de octubre de 2026

Pruebas confirmadas por el usuario en Preview:
- Navegación multipágina, carga directa y refresco de rutas; ruta inexistente devuelve 404.
- Sitemap XML vacío cuando `indexable:false`; `robots.txt` disponible.
- Solicitudes POST rechazadas con 405.
- Enlaces externos inválidos de Instagram y mapas ocultos; enlaces HTTPS válidos conservados.
- JSON-LD omite URL HTTP de mapa y esquema `javascript:`; solo se incluye Facebook HTTPS válido.
- Módulos `proceso`, `identidad` y `filosofia` aparecen con la configuración de prueba.
- Producto sin imagen no genera imagen rota.
- No se observan errores 404 para marcadores de logo/fondo ni para `favicon.ico` tras las correcciones.

Pendientes reales y acotados:
1. Si se desea certificar visualmente ambas familias, comprobar una sola vez la presentación de `templateFamily: commercial`; la lógica ya está revisada estáticamente.
2. Probar imágenes reales y eventos GA4 con un Measurement ID válido solo si esos escenarios se incluyen en el alcance de certificación.
3. No fusionar ni desplegar producción sin autorización expresa.

La reconciliación documental con el modelo independiente ya está recogida en esta guía y en `ARQUITECTURA_MAESTRA_V1.5.md`; las referencias históricas que sobreviven se identifican expresamente como documentación histórica, no como instrucciones operativas.

La prueba de URLs inválidas se completó con éxito y después se limpiaron esos valores en `config.json`: Instagram y mapas quedaron vacíos para evitar que el fixture de certificación conserve datos deliberadamente inválidos.
