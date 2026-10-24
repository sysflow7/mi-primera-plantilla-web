# Registro de auditoría de certificación — SIDeN

**Fecha de actualización:** 2026-10-23  
**Rama de trabajo de auditoría:** `audit/certificacion-produccion-2026-10`  
**Worker aislado:** `siden-auditoria`  
**URL de pruebas:** `https://siden-auditoria.darvincanal2025.workers.dev`  
**Estado:** pruebas funcionales realizadas; cierre documental pendiente. **No certificada todavía.** No se ha autorizado ni realizado despliegue a producción.

## 1. Alcance y separación de entornos

La validación se ejecutó sobre el Worker de auditoría, separado del sitio de producción `sidenred.com`. Las pruebas descritas en este registro son comprobaciones manuales realizadas por el usuario en el navegador, junto con inspección del código fuente y validación externa del JSON-LD. No equivalen a una auditoría de penetración ni a una garantía de indexación o posicionamiento en buscadores.

## 2. Matriz de pruebas realizadas

| Área | Prueba / evidencia | Resultado |
|---|---|---|
| Rutas multipágina | Inicio, Servicios y Contacto abren; recarga directa en rutas confirmada previamente | Aprobada |\n| Modo de una sola página (`modoSitio: single`) | Página, secciones, menú y botones de contacto verificados manualmente por el usuario tras finalizar el despliegue | Aprobada |
| Navegación | Logo, menú entre páginas y botón Atrás | Aprobada |
| Acciones de contacto | WhatsApp, Guardar contacto y Compartir negocio | Aprobada |
| Responsive | Vista de dispositivo móvil; contenido, menú, textos, imágenes/botones y ausencia de desplazamiento horizontal | Aprobada según verificación manual |
| Protección de archivos | `/worker.js` y `/docs/ARQUITECTURA_SIDEN_V2.0.md` responden “No encontrado” | Aprobada para las rutas probadas |
| `robots.txt` | `User-agent: *`, `Allow: /` y referencia a sitemap | Observado; coherente con permitir rastreo |
| Sitemap con `indexable:false` | `sitemap.xml` devuelve un `urlset` vacío | Aprobada para configuración no indexable |
| Directiva robots HTML | `<meta name="robots" content="noindex, nofollow">` | Aprobada |
| Exclusión de GA4 | En Network, filtro `google-analytics.com`: no se observaron solicitudes en la recarga probada | Aprobada para esa comprobación; no descarta otros dominios o formas de analítica |
| Consola | Recarga sin errores rojos visibles | Aprobada para esa sesión |
| Imágenes | La página de auditoría no tiene imágenes configuradas; pestaña Img sin solicitudes | No aplicable a esta instancia; no certifica carga de imágenes en un sitio con imágenes |
| CSS | `style.css`, `redesign-v2.css`, `redesign-v3.css` y `hero-speed.css` respondieron 304 | Aprobada; 304 indica recurso no modificado y reutilización de caché |
| JavaScript | Tres archivos JS respondieron 304 | Aprobada; 304 indica recurso no modificado y reutilización de caché |
| Ruta inexistente | `/esta-pagina-no-existe` mostró HTTP 404 del navegador | Respuesta 404 observada; no se probó una página 404 personalizada SIDeN |
| Canonical de Servicios | URL canónica termina en `/servicios` | Aprobada |
| SEO de Servicios | Título `Servicios | SIDeN Auditoría` y descripción específica de prueba | Aprobada para la generación de metadatos |
| Datos estructurados de Servicios | JSON-LD `LocalBusiness`; `@id` usa la identidad del negocio y `url` apunta a `/servicios` | Aprobada en inspección |
| Validador Schema.org | 0 errores y 0 advertencias para el JSON-LD probado | Aprobada para el bloque validado |
| Datos estructurados de Contacto | `@type: LocalBusiness`; mismo `@id` del negocio y `url` apunta a `/contacto` | Aprobada en inspección |

## 3. Observaciones y límites

1. **Indexación:** la combinación actual es `Allow: /`, meta robots `noindex, nofollow` y sitemap vacío cuando `indexable:false`. La prueba confirma la salida generada; no garantiza por sí sola cómo cada buscador procesa o muestra el sitio.
2. **Schema.org:** el bloque JSON-LD se valida sin errores ni advertencias, pero eso no garantiza resultados enriquecidos ni mejor posicionamiento. Debe revisarse si `LocalBusiness` es el tipo más adecuado para cada tipo de cliente. En esta instancia, teléfono y datos de dirección están vacíos porque son datos de prueba.
3. **Imágenes:** no había imágenes configuradas en la instancia; la carga de imágenes reales sigue sin validarse.
4. **404:** se observó un HTTP 404 para una ruta inexistente; no se evaluó una página 404 personalizada.
5. **Seguridad:** las rutas internas probadas no expusieron sus contenidos. Esto no es una auditoría de penetración ni cubre todos los escenarios posibles.
6. **Evidencia:** varios resultados proceden de observación manual del usuario y capturas compartidas; no hay una ejecución automatizada completa ni pruebas de todos los navegadores/dispositivos.

## 4. Antecedentes de revisión estática

La revisión estática inicial confirmó que el Worker limita métodos a GET, valida la estructura básica de `paginas[]` en modo multipágina, genera metadatos SEO y JSON-LD por ruta, genera `robots.txt` y `sitemap.xml`, distingue familias comerciales/corporativas y contiene exclusiones para GA4 en entornos de prueba. Estas observaciones confirman presencia de lógica en el código; las pruebas de la sección 2 añaden verificaciones manuales de comportamiento.

## 5. Preparación del Worker de auditoría — 2026-10-24

- Worker aislado en Cloudflare: `siden-auditoria`.
- Rama configurada para el entorno de auditoría: `audit/certificacion-produccion-2026-10`.
- Se actualizó `wrangler.jsonc` en esta rama para que `name` sea `siden-auditoria`; commit registrado: `e07bae631237402339e109536d5c441525e5d9b6`.
- No asociar dominios personalizados ni modificar el Worker de producción `hola` / `sidenred.com`.

## 6. Prueba del modo de una sola página — 2026-10-24\n\nEl usuario confirmó que, tras completarse el despliegue, el modo `single` muestra correctamente la página, todas sus secciones y el menú; los botones de contacto y sus funcionalidades operan correctamente. Se registra como aprobada según comprobación manual.\n\n## 7. Criterio de cierre y estado

La matriz de pruebas manuales descrita arriba está completada para el alcance indicado, incluidos los modos multipágina y de una sola página. Antes de declarar la certificación final, queda revisar si las observaciones de la sección 3 requieren cambios de código o solo deben permanecer registradas como límites de esta prueba, y consolidar el resultado en la documentación de cierre.

**Estado actual: pruebas ejecutadas; certificación final aún no emitida.** No se autoriza ni se realiza despliegue, fusión de rama ni modificación de producción como parte de este registro.
