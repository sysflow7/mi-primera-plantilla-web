# SIDeN — Arquitectura Maestra V1.5 (modelo independiente)

**Estado:** documento operativo para la rama de certificación `prueba-aislamiento-contenido-v1.5`.  
**Fecha de consolidación:** 17 de octubre de 2026.  
**Producción:** no modificada por esta auditoría.

> **Regla de vigencia:** este documento describe el modelo independiente vigente. No seguir instrucciones heredadas que mencionen `sites/<instanceId>/config.json`, `sites/registry.json`, resolución de instancias mediante host/registro central, ni el parámetro `?site=<instanceId>`. Esos elementos pertenecen al modelo anterior y no forman parte de esta arquitectura.

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
- Las imágenes reales no se validaron porque el proyecto de prueba no contiene imágenes disponibles.
- No se ha validado toda combinación de familia, módulo y configuración; la prueba visual de la familia comercial está en curso y el usuario confirmó que las FAQ ya aparecen con el módulo habilitado.
- La validación de rutas multipágina es defensiva y básica; no verifica todos los campos de contenido ni sustituye pruebas de aceptación.
- La certificación funcional base de V1.5 está cerrada para los escenarios expresamente probados; cada proyecto real debe validarse en su propio Preview antes de publicarse.
- La reconciliación documental con el modelo independiente está recogida en esta guía, el procedimiento V1.1 y el índice de documentación; los documentos históricos deben tratarse como referencia, no como instrucciones operativas actuales.
- La rama de certificación no implica publicación en producción.


## 13. Registro Maestro de instancias y análisis de impacto

Antes de modificar archivos compartidos de la plantilla, identificar los proyectos que consumen la capacidad afectada y revisar sus configuraciones reales. Una ficha ausente o incompleta no demuestra que una instancia no será afectada.

1. Resolver primero si el cambio puede realizarse con `config.json`.
2. Para personalizaciones visuales exclusivas, preferir una solución aislada del proyecto en lugar de modificar lógica global.
3. Si se requiere una capacidad nueva, implementarla de forma genérica y configurable.
4. Registrar los proyectos/familias que podrían verse afectados y definir las pruebas de regresión correspondientes.
5. No fusionar ni desplegar cambios en producción sin autorización explícita.
6. Actualizar la documentación después de validar los resultados en Preview.

El archivo de Registro Maestro de instancias se debe reconciliar con la rama y el commit que se estén certificando antes de tratarlo como evidencia vigente. Los datos no verificados deben identificarse como pendientes.

## 14. Funcionalidades heredadas no asumidas por el modelo independiente

Las siguientes instrucciones del documento histórico no deben tratarse como funcionalidades disponibles en el modelo independiente hasta implementarlas y probarlas expresamente en esta rama:

- Configuración de instancias bajo `sites/<instanceId>/`.
- Resolución central mediante `sites/registry.json` o parámetros `?site=`.
- Carga de `custom.css` desde una carpeta por instancia.
- Selección automática de `/mini/index.html` dentro del mismo Worker.
- Garantías de propagación de cambios entre proyectos mediante archivos compartidos.

Si se desea recuperar alguna de estas capacidades, debe diseñarse como un requisito nuevo, evaluarse el impacto y probarse sin asumir que el código histórico continúa vigente.

## 15. Historial de certificación y cambios recientes

- Validación defensiva de rutas multipágina: commit `1f0a6902223e37f03f806c3ce4760436b709498c`.
- Sitemap compatible con `indexable: false`: commit `12b29dfd055fb000deca4fe09a19e09d3a48bd38`.
- Restricción del Worker a solicitudes `GET`, con HTTP 405 para otros métodos: commit `517b4fcd4149bb8859f4adef15fbc8abdb564771`.
- Registro de prueba HTTP POST en la auditoría: commit `db524bbb12d10002204b23a063e7225cb0f49828`.
- Actualización del registro de certificación: commit `dca980a2e3d759cf7921c8c85933fa1b9318d12c`.

## 16. Criterio de certificación

La arquitectura no se considera certificada únicamente por esta documentación. La certificación requiere código revisado, pruebas funcionales en Preview, regresión de los comportamientos afectados, documentación consistente y revisión de una instancia de cliente representativa.

**Estado actualizado al 20-10-2026:** las pruebas funcionales base registradas en `ARQUITECTURA_INDEPENDIENTE_V1.5.md` están cerradas en Preview. No repetir navegación multipágina, 404, sitemap/robots, POST 405, enlaces externos, JSON-LD, módulos ya confirmados, producto sin imagen, marcadores visuales ni favicon, salvo que una modificación posterior afecte expresamente ese comportamiento. El aislamiento comercial del corporativo de cliente está confirmado. En la comprobación visual de la familia comercial, el usuario confirmó que las FAQ aparecen tras habilitar el módulo `faq`; falta confirmar si también se muestran las secciones comerciales y los planes SIDeN. Las pruebas con imágenes reales y GA4 con ID válido quedan fuera del alcance funcional básico. Producción no se ha modificado ni desplegado.


### Hallazgo adicional — aislamiento de GA4 en Preview

La revisión estática detectó que la lógica anterior solo desactivaba GA4 cuando existía el parámetro heredado `?site=`. En el modelo independiente, el Preview usa un host `*.workers.dev`, por lo que esa condición sola no era suficiente para evitar contaminar la analítica de producción si se configuraba un Measurement ID real.

**Corrección aplicada y comprobada en Preview:** `js/script.js` considera como Preview los hosts `*.workers.dev`, `*.pages.dev`, `localhost` y `127.0.0.1`, además del parámetro `?site=`. Commit: `4d845202005dcd0df0a4bee9513332c856fb7502`. Durante la sesión revisada no se observaron solicitudes `gtag.js` ni `collect?v=2`. No se modificó producción.


## Cierre del alcance de certificación funcional V1.5 — 20-10-2026

Se actualiza el estado anterior «certificación en curso»: las comprobaciones funcionales acordadas en Preview han sido completadas con confirmación del usuario. Incluyen navegación multipágina y rutas, 404, rechazo de POST con 405, sitemap/robots, protección de GA4 en la sesión revisada, validación de enlaces externos y enlace de catálogo de prueba. Se corrigió y verificó visualmente la tarjeta de producto sin imagen (commit `98a87f3df6ea3e440455c94b2bf06e3b13ca0b3a`). Resultados registrados en `ARQUITECTURA_INDEPENDIENTE_V1.5.md` (commit `4d9eb41ad769419c1cd478fe75e8c0c153d4cc6c`).

El cierre aplica solo al alcance funcional acordado en Preview. No representa una auditoría de seguridad integral ni certifica toda combinación de configuración/dispositivo. No se ha modificado ni autorizado el despliegue en producción.
