# SIDeN — Plantilla Maestra para Proyectos Independientes

Esta rama implementa la base de la **arquitectura híbrida de SIDeN**. La plantilla es un punto de partida para crear un proyecto independiente por cliente. Después de crear el proyecto, su HTML, CSS, JavaScript, configuración, imágenes y Worker pueden evolucionar sin modificar el código que ejecutan otros clientes.

## Principio de arquitectura

- **Un repositorio/proyecto y un despliegue por cliente.**
- **Un Worker por sitio**, con sus propios archivos y configuración.
- La plantilla maestra sirve como base para nuevos proyectos; no es una dependencia de ejecución de los sitios ya publicados.
- Las mejoras generales se incorporan a la plantilla y se trasladan selectivamente a los proyectos que las necesiten.
- El DNS y la zona `sidenred.com` pueden seguir bajo la administración central de SIDeN.
- El sitio corporativo `sidenred.com` y el Worker de producción existente no se modifican como parte de la creación de un cliente nuevo.

## Estructura de un proyecto independiente

```text
/
├── config.json       # configuración exclusiva del cliente
├── index.html        # HTML exclusivo del cliente
├── worker.js         # lógica exclusiva del despliegue
├── wrangler.jsonc    # nombre/configuración del Worker del cliente
├── css/              # estilos propios
├── js/               # comportamiento propio
└── images/           # imágenes propias
```

No se deben usar rutas `/sites/{instanceId}/` ni depender de `registry.json` o de un KV central para resolver el sitio. El Worker sirve los recursos de este proyecto y lee su `/config.json`.

## Crear un proyecto de cliente

1. Crear un repositorio nuevo a partir de esta plantilla, no una rama de producción compartida.
2. Asignar un nombre de repositorio y un nombre único al Worker en `wrangler.jsonc`.
3. Cambiar `siden.instanceId`, `siden.template`, los datos de negocio y el contenido de `config.json`.
4. Incorporar los archivos y las imágenes del cliente en `images/`.
5. Personalizar libremente `index.html`, `css/`, `js/` y `worker.js` sin modificar los sitios existentes.
6. Mantener `indexable: false` durante la preparación y las pruebas.
7. Desplegar primero en el dominio de prueba `workers.dev` del proyecto y validar navegación, recursos, SEO, formularios/botones, móvil y modo multipágina.
8. Asociar el hostname definitivo en Cloudflare después de validar el despliegue.
9. Para un sitio aprobado, revisar canonical, `robots.txt`, `sitemap.xml`, Schema y Google Analytics 4; cambiar `indexable` a `true` solo cuando corresponda.
10. Documentar la versión base de la plantilla y las personalizaciones exclusivas.

## Dominios

### Subdominio administrado por SIDeN

Ejemplo: `clienteA.sidenred.com`.

El cliente no necesita comprar un dominio. SIDeN conserva la administración de la zona DNS y configura el hostname para que apunte al Worker independiente de ese cliente. La asignación del dominio en Cloudflare es una operación de despliegue separada; crear el repositorio no la configura automáticamente.

### Dominio propio del cliente

Ejemplo: `www.cliente.com`.

El dominio puede asociarse al Worker independiente del cliente cuando se cuente con acceso y configuración DNS necesarios. Esto no requiere que el sitio comparta el Worker de otros clientes.

## Reglas de aislamiento

- No cambiar el Worker, HTML, CSS, JS ni configuración de otro cliente para resolver una necesidad exclusiva.
- No copiar datos reales a la plantilla maestra.
- No publicar un proyecto nuevo sobre el Worker corporativo existente.
- No activar indexación antes de revisar el dominio final y el contenido.
- No considerar un despliegue terminado hasta probar el hostname real, los recursos, las rutas y los encabezados SEO.
- Las mejoras reutilizables se evalúan primero en la plantilla; su incorporación a cada cliente es selectiva y controlada.

## Qué cambia respecto de la arquitectura anterior

La arquitectura anterior resolvía varios sitios mediante un Worker central, un registro de hosts y configuraciones bajo `sites/`, mientras compartían el mismo HTML/CSS/JS en tiempo de ejecución. En esta arquitectura, cada sitio tiene su propia copia de esos archivos y su propio despliegue. Por eso, una modificación exclusiva deja de afectar automáticamente a los demás clientes.

## Alcance y validación pendiente

Esta rama prepara la plantilla para proyectos independientes. Antes de usarla con un cliente real, hay que validar en Cloudflare un despliegue de prueba completo: ejecución del Worker, archivos estáticos, navegación multipágina, subdominio SIDeN y dominio personalizado. La zona DNS central puede conservarse, pero la asociación de cada hostname debe probarse con la configuración real de la cuenta Cloudflare.

## Versión

- Base de partida: `siden-template-v1.4`.
- Arquitectura propuesta: `independent-project`.
- Rama de trabajo: `arquitectura-hibrida-independiente-v1.0-2026-10-15`.
