# SIDeN — Procedimiento de creación de proyectos V2.0

**Rama de referencia:** `siden-template-candidate-2026-10`  
**Commit consultado:** `592528ebae9fd7ad658e5b6d96ae43380fefd19e`  
**Regla:** usar una versión aprobada y registrar el commit exacto. Si la aprobación formal está pendiente, no declarar el proyecto certificado.

## 1. Requisitos previos

Registrar cliente, responsable, objetivo, plan contratado, alcance, familia (`corporate`/`commercial`), estado (`demo`/`cliente`), modalidad (`single`/`multi`), páginas, contenido aprobado, imágenes autorizadas, contacto, redes, ubicación, dominio, indexación y GA4 si corresponde.

## 2. Crear el proyecto aislado

1. Confirmar la versión aprobada de la plantilla y anotar rama/commit.
2. Crear repositorio/proyecto independiente.
3. Configurar `config.json` con datos propios del cliente.
4. Revisar `index.html`, `worker.js`, `wrangler.jsonc`, `css/`, `js/`, `images/` y `.assetsignore`.
5. Configurar un Worker exclusivo y verificar qué repositorio y rama despliega.
6. Configurar dominio, DNS y TLS para ese proyecto.
7. Mantener `indexable: false` durante construcción y pruebas.

No usar un Worker compartido entre clientes ni reutilizar el Worker productivo de otro sitio.

## 3. Configuración

- Definir `siden.instanceId`, `siden.templateFamily`, `siden.architecture`, `estadoComercial` y `modoSitio`.
- En modo `multi`, declarar rutas internas únicas e incluir `/`; asignar módulos explícitamente a cada página.
- En sitio corporate de cliente, excluir planes y contenido promocional de SIDeN.
- Configurar FAQ propias; comprobar `faq.activo`, preguntas/respuestas válidas y módulo `faq` en la página.
- Validar destinos externos y no incluir secretos ni datos de otros clientes.

## 4. Regla obligatoria antes de Preview

1. Crear rama temporal desde la plantilla maestra vigente.
2. Si el Preview corporate requiere `corporatePreviewAliases`, añadir el nombre exacto de la rama al Worker de prueba correspondiente.
3. Generar Preview y confirmar repositorio, rama, commit y Worker.
4. Mantener `indexable: false`; evitar eventos de Preview en GA4 real.
5. Ejecutar pruebas y guardar evidencias.
6. Integrar solo tras aprobación y según el flujo autorizado.
7. Retirar aliases temporales que no deban permanecer.

## 5. Revisión de cambios compartidos

Antes de editar `index.html`, `worker.js`, `js/` o `css/`, comprobar si el requisito se resuelve mediante configuración. Identificar familias, páginas, módulos y proyectos afectados. Aislar necesidades exclusivas en configuración o variante separada. Si puede afectar otros sitios, advertir al propietario y acordar una solución antes de editar.

## 6. Lista de validación de Preview

- Inicio, menú, navegación y diseño adaptable.
- Cada ruta multipágina mediante acceso directo y recarga; probar 404 para rutas inexistentes.
- Módulos presentes solo en páginas configuradas.
- Logo, imágenes, video y recursos opcionales sin roturas ni espacios vacíos.
- WhatsApp, teléfono, redes, catálogo, ubicación y botones con destinos válidos.
- Corporate cliente sin planes ni marketing SIDeN.
- FAQ y textos propios del cliente.
- SEO: título, descripción, canonical, datos estructurados, robots, sitemap e indexable.
- GA4 propio cuando corresponda; excluir Preview de analítica real.
- Consola, solicitudes fallidas y log de despliegue revisados.
- Aprobación del responsable.

## 7. Publicación

1. Registrar aprobación y fijar commit exacto.
2. Verificar dominio, TLS, Worker, repositorio y rama de producción correctos.
3. Activar `indexable: true` solo tras aprobar contenido y dominio.
4. Revisar robots, sitemap, canonical, metadatos y ausencia de `noindex` contradictorio.
5. Publicar únicamente en el Worker del proyecto y con autorización expresa.
6. Probar el dominio real y guardar evidencias.

Registrar repositorio, rama, commits, Worker, dominio, familia, modalidad, módulos, indexación, GA4, fecha, pruebas y autorizaciones. Preview aprobado no equivale a publicación ni garantiza indexación.
