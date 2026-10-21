# SIDeN — Arquitectura Independiente V1.0

**Estado:** documento base de arquitectura para el modelo de proyectos independientes.  
**Implementación de referencia:** plantilla SIDeN V1.5 en la rama de certificación.  
**Ámbito:** diseño, componentes, aislamiento, reglas de cambio y publicación.  
**Importante:** V1.0 identifica la primera versión de este documento arquitectónico; no significa que el código de plantilla sea V1.0.

## 1. Objetivo

Establecer una arquitectura reproducible para que cada cliente SIDeN tenga un proyecto, configuración y despliegue independientes, evitando que una personalización de un cliente afecte a otros sitios.

## 2. Principios obligatorios

1. Cada cliente debe tener su propio repositorio/proyecto y su propio Worker o despliegue.
2. No se debe introducir un registro central de múltiples sitios ni depender de rutas heredadas como `/sites/<instanceId>` para servir proyectos independientes.
3. La configuración pública del sitio se encuentra en `config.json` en la raíz. No guardar contraseñas, tokens privados ni secretos en este archivo.
4. Los cambios se desarrollan en ramas de trabajo y se validan en Preview antes de autorizar cualquier despliegue de producción.
5. Ningún cambio a producción se considera autorizado por el solo hecho de estar documentado o probado en Preview.

## 3. Estructura de alto nivel

- `index.html`: estructura semántica y puntos de montaje de los módulos.
- `css/`: estilos compartidos de la plantilla.
- `js/script.js`: lógica principal de configuración, renderizado, navegación y módulos.
- `js/seo-local.js` y módulos auxiliares: funciones especializadas que deben revisarse junto con el script principal.
- `config.json`: contenido y opciones específicas de la instancia.
- `worker.js`: entrada del Worker, control de métodos, rutas, archivos públicos y respuestas HTTP.
- `wrangler.jsonc`: nombre, fecha de compatibilidad, punto de entrada y binding de assets.
- `.assetsignore`: exclusiones del paquete publicado.
- `docs/`: arquitectura, procedimientos, pruebas y registro de cambios.

La estructura exacta debe confirmarse contra la rama de referencia antes de copiarla a un proyecto nuevo.

## 4. Flujo de una solicitud

1. El navegador solicita una ruta al Worker.
2. El Worker rechaza métodos no admitidos y rutas reservadas o inválidas.
3. En rutas válidas, el Worker resuelve la página y sirve el HTML/asset correspondiente.
4. El navegador carga CSS y JavaScript.
5. El JavaScript lee la configuración pública, identifica la ruta actual y activa únicamente los módulos declarados para esa página.
6. Las funciones SEO construyen los metadatos correspondientes, respetando el estado de indexación configurado.

## 5. Aislamiento por cliente

- Cada cliente debe desplegarse desde su propio proyecto y configuración.
- No editar archivos de otro cliente para conseguir una personalización local.
- No usar una instancia real como banco de pruebas.
- Los valores de `config.json` deben ser propios de la instancia y revisarse antes de publicar.
- Los alias temporales de Preview no deben quedar en la configuración final.
- El host de Preview debe impedir el envío de eventos GA4, según la protección implementada; la ausencia de solicitudes se ha observado en la sesión de prueba registrada, sin que ello constituya garantía universal.

## 6. Regla obligatoria para modificar objetos compartidos

**Antes de modificar un elemento, identificar si lo consumen otros módulos, páginas o instancias.**

Se consideran compartidos, entre otros:
- componentes de `index.html`;
- selectores, IDs y clases CSS;
- funciones y eventos en `js/script.js`;
- validadores, helpers de URL y funciones SEO;
- reglas del Worker y manejo de rutas;
- configuración por defecto y lógica de módulos;
- archivos incluidos por `.assetsignore` y bindings de despliegue.

Procedimiento obligatorio:
1. Identificar el archivo y el componente.
2. Buscar referencias y consumidores.
3. Determinar el alcance: solo una instancia, una familia (WEB/MINI) o toda la plantilla.
4. Si el cambio es específico de un cliente, preferir configuración por instancia o un módulo aislado.
5. Si el cambio altera un componente compartido y puede afectar páginas existentes, **no realizarlo directamente**: informar del impacto y proponer una variante controlada, un nuevo módulo o una versión de plantilla.
6. Implementar en rama de trabajo.
7. Ejecutar pruebas de la función modificada y regresión de rutas/componentes afectados.
8. Documentar la decisión, resultado y commit.
9. Publicar en producción solo con autorización explícita.

No asumir que una modificación es local por haber cambiado un solo archivo.

## 7. Familias y modalidades

- `templateFamily: "corporate"`: sitios profesionales/corporativos, con módulos habilitados según configuración.
- `templateFamily: "commercial"`: sitios comerciales con módulos apropiados a su oferta.
- SIDeN MINI: modalidad de alcance reducido definida por su propia documentación. No debe implementarse eliminando componentes manualmente de una instancia compartida sin control de variante.
- El uso de `templateFamily` no sustituye el aislamiento por proyecto ni autoriza cambios globales.

## 8. Seguridad y contenido

- Solo aceptar URLs externas con HTTPS en los campos sometidos al validador de enlaces.
- Rechazar esquemas inseguros, especialmente `javascript:`, y no generar enlaces activos para valores inválidos.
- Los enlaces externos que abren otra pestaña deben usar `rel="noopener noreferrer"`.
- Renderizar contenido de configuración escapando texto antes de insertarlo en HTML.
- No incluir secretos en `config.json`, HTML ni archivos estáticos públicos.
- Mantener el Worker en solo lectura mediante GET, salvo que una función futura requiera otro método y tenga diseño de seguridad explícito.

## 9. SEO, indexación y analítica

- `indexable: false` debe impedir la indexación y producir un sitemap coherente con esa configuración.
- `robots.txt` y `sitemap.xml` deben reflejar el host del despliegue y sus rutas reales.
- GA4 debe configurarse por cliente cuando corresponda y no debe enviar mediciones desde hosts de Preview.
- No activar indexación de un sitio de prueba ni publicar datos ficticios en buscadores.

## 10. Publicación

Antes de desplegar:
- verificar rama y Worker objetivo;
- confirmar que el repositorio está conectado a la rama prevista;
- revisar configuración, assets y exclusiones;
- revisar el log del despliegue;
- comprobar la URL del entorno correspondiente.

Producción y Preview son entornos distintos. No cambiar la rama de producción para probar si existe una alternativa segura de Preview; si el panel obliga a cambiarla, verificar cuidadosamente el Worker y restaurar el ajuste tras la prueba, sin desplegar en el Worker real.

## 11. Estado de referencia y limitaciones

Las pruebas funcionales acordadas de la arquitectura independiente V1.5 se registraron como completadas en Preview el 20-10-2026. Se verificaron navegación multipágina, rutas, 404, POST 405, sitemap/robots, ausencia de solicitudes GA4 coincidentes con los filtros probados, rechazo de URLs inseguras, enlace de catálogo de prueba y producto sin imagen.

Este registro no es una auditoría de seguridad exhaustiva ni certifica todas las configuraciones, dispositivos o casos de uso. La implementación de referencia sigue siendo la plantilla V1.5; cualquier nueva versión requiere su propio control de cambios y pruebas.

## 12. Documentos relacionados

- `ARQUITECTURA_MAESTRA_V1.5.md`: reglas generales y modelo de plantilla.
- `ARQUITECTURA_INDEPENDIENTE_V1.5.md`: guía operativa de la implementación de referencia.
- `PROCEDIMIENTO_CREACION_PROYECTO_CLIENTE_V1.0.md`: alta de proyectos nuevos.
- `SIDEN_MINI_ARQUITECTURA_Y_ALCANCE_V1.0.md`: límites y componentes de SIDeN MINI.
- `INDICE_DOCUMENTACION_SIDEN_V1.0.md`: mapa de documentos y control de versiones.
