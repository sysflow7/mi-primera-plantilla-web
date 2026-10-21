# SIDeN — Procedimiento operativo para crear proyectos independientes V1.1

**Estado:** vigente para preparación y pruebas; no autoriza publicación en producción.  
**Base técnica:** arquitectura independiente SIDeN V1.5, en rama de certificación. La designación de una rama oficial para nuevos proyectos es una decisión pendiente y no se resuelve por este procedimiento.  
**Aplica a:** sitios SIDeN WEB de una página o multipágina. SIDeN MINI debe seguir además su documento de alcance específico.

## 1. Regla principal

Cada cliente debe tener su propio repositorio/proyecto, configuración, Worker y dominio. No crear un cliente dentro de la configuración o el Worker de otro cliente. No usar el Worker de producción de SIDeN para pruebas. No modificar ni desplegar `sidenred.com` sin autorización expresa.

La arquitectura independiente sirve un proyecto desde su propio `config.json` y sus recursos; no depende del antiguo registro central ni de rutas `/sites/{instanceId}/` para seleccionar la instancia.

## 2. Antes de crear el proyecto

Confirmar y registrar:
- Cliente, responsable y nombre del proyecto.
- Plan contratado y alcance comercial confirmado.
- Familia de plantilla (`corporate` o `commercial`) y estado (`demo` o `cliente`).
- Modalidad (`modoSitio: "single"` o `"multi"`).
- Objetivo del sitio, público, servicios/productos y llamadas a la acción.
- Textos, teléfono/WhatsApp, enlaces, ubicación, fotografías, logotipo y permisos de uso.
- Dominio previsto, indexación y GA4 propio si corresponde.
- Rama y commit de la plantilla aprobada que se usará como origen.

No inventar datos. Los valores desconocidos se dejan pendientes o se identifican claramente como datos ficticios de demostración.

## 3. Crear el proyecto aislado

1. Verificar cuál es la rama aprobada para nuevos proyectos. Al 21-10-2026, `prueba-aislamiento-contenido-v1.5` es una rama de certificación, no una base oficial aprobada. No usarla como plantilla maestra por defecto hasta completar la reconciliación documental y recibir autorización explícita para designar la rama base.
2. Crear un repositorio independiente desde esa base aprobada.
3. Registrar el commit de origen y crear una rama de trabajo para la instancia.
4. Confirmar la estructura del proyecto: `index.html`, `config.json`, `worker.js`, `wrangler.jsonc`, `css/`, `js/`, recursos y exclusiones.
5. Crear/configurar un Worker exclusivo para el proyecto de prueba.
6. Verificar que el Worker apunta al repositorio y rama correctos, y que no coincide con el Worker de producción ni con el de otro cliente.

## 4. Configurar `config.json`

- Definir identidad, contenido, `templateFamily`, `estadoComercial`, `modoSitio`, SEO, analítica y módulos necesarios.
- En modo multipágina, declarar cada ruta una sola vez, usando rutas internas válidas; incluir la raíz `/` y los módulos de cada página.
- Configurar contenido por página sin asumir que un módulo global se mostrará automáticamente en todas las rutas.
- En sitios corporativos de clientes, no activar planes promocionales ni contenido comercial de SIDeN.
- Las FAQ del cliente deben ser propias, estar habilitadas y tener preguntas válidas; en multipágina, la página debe incluir el módulo `faq`.
- Aceptar solo URLs HTTPS absolutas para enlaces externos configurables.
- Mantener `indexable: false` durante construcción y validación.
- No incluir contraseñas, tokens ni secretos en `config.json`; este archivo es público.
- No reutilizar textos, datos personales ni imágenes de otro cliente.

Consultar `CATALOGO_MODULOS_CONFIGURACION_V1.5.md` para el comportamiento de los módulos.

## 5. Regla obligatoria antes de generar Preview

Si se crea una rama nueva para probar una instancia corporativa en Cloudflare Preview:

1. Crear la rama.
2. Añadir inmediatamente el nombre exacto de la rama a `corporatePreviewAliases` del Worker correspondiente.
3. Generar el Preview.
4. Probar la instancia.
5. Tras aprobación, fusionar según el flujo autorizado.
6. No dejar alias temporales en la arquitectura final si ya no se necesitan.

Antes del despliegue, verificar otra vez repositorio, rama, Worker y proyecto. No cambiar la rama de producción de SIDeN para hacer pruebas.

## 6. Cambios de plantilla y componentes compartidos

Antes de modificar `index.html`, `worker.js`, `js/` o `css/`:

1. Determinar si el cambio puede resolverse en `config.json`.
2. Identificar las páginas, familias y proyectos que usan el componente.
3. Si el cambio es específico del cliente, preferir configuración o una variante aislada.
4. Si afecta un elemento compartido y puede alterar otros sitios, no aplicar el cambio sin avisar: explicar el impacto y proponer una variante/plantilla separada o una mejora genérica configurable.
5. Probar en rama y Worker de Preview independientes.
6. Repetir solo las pruebas afectadas y las regresiones relevantes.
7. Actualizar la documentación después de validar.
8. No fusionar ni desplegar producción sin autorización explícita.

## 7. Validación en Preview

Revisar el alcance real del proyecto:
- Inicio, menú, diseño adaptable y navegación.
- Cada ruta multipágina abierta directamente y después de recargar.
- Ruta inexistente con respuesta 404.
- Módulos presentes solo en las páginas donde están configurados.
- Logo, imágenes, vídeo y demás recursos opcionales; si no hay recurso, no debe quedar imagen rota ni marcador visible.
- WhatsApp, teléfono, redes, catálogo y ubicación con destinos reales y válidos.
- Formularios y botones; ocultar los que no estén configurados.
- Ausencia de planes/FAQ de SIDeN en un sitio de cliente corporativo.
- SEO: título, descripción, canonical, datos estructurados, `robots.txt`, sitemap e `indexable`.
- GA4: Measurement ID propio cuando aplique y ausencia de tráfico de Preview en analítica.
- Consola del navegador, solicitudes fallidas y log de despliegue.
- Aprobación de contenido y presentación por la persona responsable.

La evidencia de la certificación general de la plantilla V1.5 no sustituye la aceptación del sitio concreto del cliente. Ejecutar pruebas relacionadas con el cambio realizado; no repetir sin motivo pruebas ya documentadas y sin cambios asociados.

## 8. Producción y entrega

La aprobación de Preview no publica automáticamente el sitio. Antes de producción:

1. Registrar aprobación interna y del cliente cuando corresponda.
2. Fijar el commit exacto aprobado.
3. Confirmar dominio, TLS, Worker y rama de producción del cliente.
4. Activar indexación solo cuando el contenido esté aprobado y el sitio esté listo para publicarse.
5. Publicar únicamente en el Worker del proyecto correspondiente, con autorización expresa.
6. Hacer una comprobación posterior al despliegue y registrar resultado.

En la ficha de entrega guardar repositorio, rama, commit, Worker, dominio, familia, modalidad, módulos, indexación, GA4, fecha y alcance contratado. Los cambios posteriores deben pasar por revisión de impacto y Preview.

## 9. Límites

Este procedimiento no reemplaza el contrato, el formulario de alta, la matriz comercial vigente ni una auditoría de seguridad. No garantiza que todas las combinaciones de configuración hayan sido probadas. Las capacidades y exclusiones comerciales deben confirmarse en la ficha vigente del plan antes de ofrecerlas al cliente.


## 10. Control de transición a la plantilla oficial

La certificación visual de las familias `corporate` y `commercial` quedó confirmada en Preview el 21-10-2026. Antes de designar una rama como base oficial, verificar que contiene los commits documentados de la arquitectura independiente, reconciliar el índice y los documentos normativos, comprobar que el fixture de prueba está restaurado a corporativo/cliente y registrar la autorización de transición. No cambiar la rama predeterminada del repositorio, la rama de producción de Cloudflare ni ningún Worker de producción como parte de esta preparación sin autorización expresa.
