# Registro de implementación — SIDeN SEO + GEO V1
Fecha: 14 de noviembre de 2026

## Referencia
- Repositorio: sysflow7/mi-primera-plantilla-web
- Rama de trabajo: feature/seo-geo-v1-2026-11-14
- Rama base: siden-template-candidate-2026-10
- Archivos modificados: worker.js, css/style.css y css/redesign-v2.css
- Alcance: cambios compartidos en plantilla maestra; no incluye despliegue, fusión ni cambios a proyectos de clientes.

## Cambios implementados

### 1. Política explícita de rastreadores
El endpoint robots.txt declara:
- OAI-SearchBot: Allow: /
- ChatGPT-User: Allow: /
- GPTBot: Disallow: /
- User-agent: *: Allow: /
- Sitemap dinámico del dominio.

La política permite rastreo orientado a búsqueda y acceso iniciado por usuarios, y bloquea GPTBot como opción conservadora respecto al uso del contenido para entrenamiento. Esta directiva es una instrucción para rastreadores compatibles; no es un control de acceso ni una garantía de indexación.

### 2. Contenido esencial disponible en HTML inicial
El Worker renderiza inicialmente, desde config.json y la configuración de la página actual:
- Presentación y descripción.
- Perfil profesional.
- Identidad y filosofía.
- Servicios, beneficios y proceso.
- Productos y menú (texto y precio cuando existen).
- Preguntas frecuentes configuradas.
- Encabezado y descripción de rutas internas multipágina.

El contenido se escapa antes de insertarse en HTML. Las secciones no asignadas a la página se entregan ocultas. El JavaScript existente conserva su responsabilidad de inicialización, interactividad y renderizado final; no se eliminó ni sustituyó.

No se incorporó renderizado inicial de imágenes, reseñas ni componentes interactivos. Esos elementos conservan el comportamiento existente.

### 3. Datos estructurados
- sameAs toma los perfiles disponibles de redesSociales: Facebook, LinkedIn, Instagram, YouTube, TikTok y X/Twitter.
- Se conserva compatibilidad con los campos históricos facebook e instagram.
- Se validan las URLs HTTPS y se eliminan duplicados.
- La entidad del negocio mantiene una URL raíz estable entre rutas; mainEntityOfPage identifica la ruta actual.
- La descripción de la entidad prioriza la descripción SEO general del negocio, sin cambiar la meta description específica de cada página.

No se añadió FAQPage ni marcado de reseñas AggregateRating.

### Ajustes visuales asociados a la validación
- css/style.css conserva el estilo del título Hero en rutas internas después de separar el contenedor visual del H1 semántico.
- css/redesign-v2.css mantiene visible el encabezado configurable de Servicios en páginas internas y adapta las tarjetas sin imagen configurada a la altura de su contenido.
- No se modifica css/redesign-v3.css; la hoja utilizada por index.html para esta presentación es redesign-v2.css.

## Validaciones realizadas

Pruebas estáticas/funcionales ejecutadas sobre el Worker mediante un entorno simulado de Assets y una configuración de prueba:

| Prueba | Resultado |
|---|---|
| Sintaxis y carga del Worker | Aprobado |
| robots.txt: OAI-SearchBot permitido | Aprobado |
| robots.txt: ChatGPT-User permitido | Aprobado |
| robots.txt: GPTBot bloqueado | Aprobado |
| Presentación disponible sin JavaScript | Aprobado |
| Servicios y beneficios disponibles sin JavaScript | Aprobado |
| Productos disponibles sin JavaScript | Aprobado |
| H1 y descripción de ruta multipágina | Aprobado |
| FAQ disponible sin JavaScript | Aprobado |
| JSON-LD parseable como JSON | Aprobado |
| Perfil LinkedIn incluido en sameAs | Aprobado |
| Meta robots noindex,nofollow preservada en Preview | Aprobado |
| FAQ oculto cuando no corresponde a la página | Aprobado |

## Pendiente para cerrar la versión
1. Desplegar esta rama únicamente en el Worker/Preview de desarrollo previsto por la Arquitectura SIDeN.
2. Confirmar el Worker, rama y commit exactos utilizados en Preview.
3. Verificar visualmente una página single y una multipágina en escritorio y móvil; confirmar que JavaScript no duplique contenido y que los módulos sigan funcionando.
4. Inspeccionar el HTML recibido y robots.txt desde el Preview real.
5. Validar JSON-LD con Schema.org Validator.
6. Registrar evidencia y resultados reales de Preview.

## Restricciones de integración
- No fusionar a siden-template-candidate-2026-10 sin revisión y autorización expresa.
- No modificar sidenred-comercial-PROD, el Worker hola ni producción de clientes.
- No desplegar a producción como consecuencia automática de estas pruebas.
- Mantener indexable:false en Preview.
