# Registro de auditoría de certificación — SIDeN

**Fecha:** 2026-10-23  
**Rama auditada:** `siden-template-candidate-2026-10`  
**Rama de trabajo de auditoría:** `audit/certificacion-produccion-2026-10`  
**Alcance de esta primera revisión:** lectura estática de `worker.js`, `config.json`, `index.html`, `js/script.js`, `wrangler.jsonc`, `.assetsignore` y documentos operativos V2.0.  
**Estado:** auditoría iniciada; no certificada. No se ha modificado código funcional ni producción.

## 1. Verificaciones estáticas confirmadas

- El Worker limita los métodos a GET y responde 405 a otros métodos.
- El Worker valida la estructura básica de `paginas[]` cuando `modoSitio` es `multi`, exige rutas únicas y la ruta raíz `/`.
- El Worker genera título, descripción, canonical y datos estructurados por ruta.
- El Worker genera `robots.txt` y `sitemap.xml`; el sitemap omite rutas cuando `indexable: false`.
- La configuración predeterminada tiene `indexable: false`, `modoSitio: "single"`, familia `corporate` y estado `cliente`.
- El código distingue `commercial`, demo corporativa y cliente corporativo para planes/FAQ.
- GA4 es opcional y el código intenta excluir hosts `workers.dev`, `pages.dev`, localhost y URLs con parámetro `?site=`.
- `.assetsignore` excluye archivos internos y directorios de documentación/otros proyectos; el Worker añade filtros de rutas.

Estas observaciones confirman la presencia de código, no el comportamiento real en un navegador o en Cloudflare.

## 2. Puntos de riesgo para validar

1. **Rutas y recursos en multipágina:** confirmar en Preview que cada ruta declarada abre y recarga correctamente, que los recursos relativos cargan y que las rutas inexistentes no muestran contenido incorrecto.
2. **Navegación multipágina:** el HTML contiene enlaces iniciales de una sola página y el JavaScript los transforma; validar menú, logo y navegación entre páginas en móvil y escritorio.
3. **Aislamiento commercial/corporate:** comprobar visualmente planes, marcas SIDeN y FAQ en comercial, demo corporativa y cliente corporativo.
4. **Indexación:** `robots.txt` responde con `Allow: /` incluso cuando `indexable: false`; el HTML agrega `noindex, nofollow` y el sitemap queda vacío. Confirmar si esta combinación es la política deseada para Preview y revisar la documentación.
5. **Analítica en Preview:** la exclusión de GA4 se basa en host y parámetro `?site=`; comprobar la URL exacta que genera el entorno de Preview usado por el equipo antes de afirmar que no envía eventos.
6. **Accesibilidad y responsive:** comprobar menú móvil, imágenes opcionales, botones y secciones vacías en tamaños reales.
7. **Seguridad:** los filtros de rutas son defensivos. Esta revisión estática no es una auditoría de penetración ni confirma todos los escenarios de codificación/decodificación de URL.

## 3. Pruebas no ejecutadas en esta fase

No se ha abierto una instancia Preview real ni ejecutado el sitio en un navegador. Por tanto, quedan sin confirmar: renderizado, navegación, consola, solicitudes de red, comportamiento responsive, enlaces, eventos GA4 y registros del Worker. Se debe detener el avance funcional cuando una prueba requiera interacción real que no pueda ejecutarse desde esta auditoría.

## 4. Criterio de cierre

La certificación requerirá una matriz de pruebas con resultado, evidencia, commit exacto, defectos corregidos y aprobación explícita. No se autoriza ni se realiza despliegue a producción como parte de esta auditoría.
