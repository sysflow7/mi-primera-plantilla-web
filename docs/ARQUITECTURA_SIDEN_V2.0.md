# SIDeN — Arquitectura V2.0

**Estado:** documento operativo actualizado contra la rama `siden-template-candidate-2026-10`.  
**Commit de referencia revisado:** `592528ebae9fd7ad658e5b6d96ae43380fefd19e`.  
**Repositorio:** `sysflow7/mi-primera-plantilla-web`.  
**Producción comercial independiente:** rama `sidenred-comercial-PROD`, Worker `hola`, dominio `sidenred.com`.

> La rama candidata es la referencia técnica actual del trabajo de plantilla, pero no debe llamarse certificada hasta completar los controles pendientes y registrar aprobación explícita. La producción comercial no se utiliza para desarrollar ni probar.

## 1. Objetivo y modelo

SIDeN mantiene una plantilla maestra reutilizable y despliega cada sitio como proyecto independiente. Cada cliente debe tener su propio repositorio/proyecto, `config.json`, Worker y configuración de dominio. El contenido, imágenes, analítica y despliegues de clientes no se comparten entre proyectos.

Las mejoras de la plantilla no se propagan automáticamente a sitios ya creados. Cada actualización se evalúa, adapta, prueba y aprueba por separado.

## 2. Ramas y entornos

- **Plantilla maestra de referencia:** `siden-template-candidate-2026-10`.
- **Producción comercial SIDeN:** `sidenred-comercial-PROD`; Worker `hola`; dominio `sidenred.com`.
- **Ramas `feature/*`, `fix/*`, `test/*` o similares:** temporales; deben crearse desde la rama maestra vigente, salvo autorización expresa.
- La rama de producción no es un entorno de pruebas. No fusionar ni desplegar en producción sin autorización explícita.

Al crear una instancia, registrar rama y commit exactos de origen.

## 3. Estructura técnica

```text
/
├── config.json
├── index.html
├── worker.js
├── wrangler.jsonc
├── .assetsignore
├── css/
├── js/
├── images/
└── docs/
```

- `config.json`: identidad, contenido, módulos, navegación, SEO, contacto, ubicación, analítica y opciones. Es público; nunca guardar secretos.
- `index.html`: estructura HTML y puntos de montaje de las secciones.
- `css/`: estilos compartidos dentro del proyecto.
- `js/script.js` y auxiliares: renderizado de módulos, navegación y comportamiento.
- `worker.js`: carga la configuración raíz, resuelve rutas declaradas, prepara metadatos y sirve recursos/endpoints técnicos.
- `wrangler.jsonc`: configuración del Worker y assets.
- `.assetsignore`: excluye archivos internos de publicación.
- `images/`: recursos propios del proyecto.
- `docs/`: documentación técnica.

## 4. Configuración y familias

- `siden.instanceId`: identificador de la instancia.
- `siden.templateFamily`: `corporate` o `commercial`.
- `siden.architecture`: identifica el modelo de proyecto independiente.
- `estadoComercial`: distingue `demo` y `cliente`.
- `modoSitio`: `single` o `multi`.
- `indexable`: mantener `false` en desarrollo/Preview y activar solo tras aprobación.
- `paginas[]`: rutas y configuración de cada página cuando `modoSitio: "multi"`.

Los sitios corporativos de clientes no deben mostrar planes ni marketing de SIDeN. Las FAQ propias de un cliente requieren preguntas válidas, `faq.activo: true` y módulo `faq` incluido en la página correspondiente. La familia y el estado comercial deben revisarse juntos.

## 5. Sitio multipágina

En modo `multi`, `paginas[]` debe ser un arreglo no vacío, incluir la ruta raíz `/`, usar rutas internas únicas y evitar rutas inválidas. El Worker de la rama de referencia valida la configuración y responde con error HTTP 500 si la configuración multipágina no supera las validaciones. Probar acceso directo y recarga de cada ruta, así como rutas no declaradas.

Cada página puede definir, según la implementación, `ruta`, `nombre`, `h1`, `slogan`, `descripcion`, `tituloSEO`, `descripcionSEO`, `modulos`, `etiquetas` y `textos`.

## 6. Recursos, endpoints y seguridad

- Las imágenes del proyecto se sirven desde `/images/*`.
- El Worker de referencia solo acepta solicitudes `GET`; los demás métodos reciben HTTP 405.
- `/config.json` es público. No incluir contraseñas, tokens ni claves privadas.
- El Worker filtra determinadas rutas internas, entre ellas `/sites/*`, `/mini/*`, `/docs/*`, `/.git/*`, `/.wrangler/*`, archivos Markdown y archivos internos seleccionados.
- `.assetsignore` y los filtros de ruta son controles defensivos, no una auditoría de penetración.
- No copiar contenido, imágenes o datos de otro cliente sin autorización.

## 7. Regla obligatoria de normalización de datos en español

Los valores de configuración destinados a personas usuarias pueden venir en español y con distintas combinaciones de mayúsculas, minúsculas o acentos. El código no debe asumir que esos valores coinciden literalmente con claves internas en inglés.

- Para los días de atención, aceptar los nombres en español: lunes, martes, miércoles/miercoles, jueves, viernes, sábado/sabado y domingo.
- Normalizar espacios y mayúsculas/minúsculas antes de comparar; contemplar las variantes con y sin tilde cuando corresponda.
- Convertir los nombres visibles/configurados a claves internas estables antes de ordenar, agrupar o procesar los datos.
- Mantener la compatibilidad con configuraciones antiguas y con las claves internas en inglés cuando ya estén soportadas.
- Al incorporar campos que contienen nombres, categorías o valores localizados, revisar explícitamente diferencias de idioma, acentos y capitalización.
- Incluir al menos una prueba con datos reales en español en Preview; no dar por válida la función solo porque compile.

Esta regla es obligatoria para evitar que datos correctamente configurados en español desaparezcan durante el renderizado por una comparación literal con claves en inglés.

## 8. Regla obligatoria para cambios compartidos

1. Identificar archivos, funciones, selectores, módulos, rutas y familias que pueden verse afectados.
2. Determinar si el requisito se resuelve mediante configuración.
3. Para requisitos exclusivos de un cliente, preferir configuración o variante aislada.
4. Si un cambio puede afectar otros sitios, detenerse y advertir al propietario antes de editar; proponer alternativa configurable o plantilla separada.
5. Desarrollar en rama temporal desde la plantilla maestra vigente y usar un Worker/Preview de prueba.
6. Ejecutar pruebas y regresiones pertinentes.
7. Documentar los resultados después de probar.
8. No fusionar ni desplegar producción sin autorización explícita.

## 9. Preview de Cloudflare

1. Crear rama desde `siden-template-candidate-2026-10`, salvo autorización expresa.
2. Si el Preview corporate requiere `corporatePreviewAliases`, agregar el nombre exacto de la rama al Worker de prueba antes de generar Preview.
3. Verificar repositorio, rama, commit y Worker.
4. Mantener `indexable: false` y evitar que Preview envíe eventos a GA4 real.
5. Registrar pruebas y evidencias.
6. Tras aprobar, integrar conforme al flujo autorizado y retirar aliases temporales que ya no se necesiten.

## 10. SEO, GA4 y publicación

Revisar título, descripción, canonical, datos estructurados, `robots.txt`, `sitemap.xml` y ausencia de `noindex` contradictorio. `indexable: true` no garantiza que Google indexe el sitio. Cada cliente debe usar su propio Measurement ID de GA4 cuando corresponda y Preview no debe contaminar analítica real.

Publicar únicamente en el Worker y dominio del proyecto aprobado, tras autorización expresa. Registrar commit publicado, dominio, Worker y pruebas posteriores.

## 11. Estado

Esta arquitectura está alineada con el código de la rama y commit indicados; no equivale a certificación integral de todas las funciones ni a aprobación de producción. Las pruebas específicas pendientes deben permanecer identificadas como tales.
