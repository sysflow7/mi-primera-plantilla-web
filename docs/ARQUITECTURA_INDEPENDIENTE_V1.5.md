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
| ID duplicados en `index.html` | No detectados en la inspección estática |

## 12. Límites y pendientes

- La revisión es estática más las pruebas manuales indicadas; no es una auditoría de seguridad externa.
- No se ha validado visualmente toda combinación de familia, módulo y configuración.
- La validación de rutas multipágina es defensiva y básica; no verifica todos los campos de contenido ni sustituye pruebas de aceptación.
- La certificación de una instancia multipágina de cliente debe repetirse en el Preview de esa instancia.
- Antes de utilizar esta arquitectura como estándar definitivo, completar la reconciliación de documentos históricos y verificar que las instrucciones operativas apuntan a este modelo independiente.
- La rama de certificación no implica publicación en producción.
